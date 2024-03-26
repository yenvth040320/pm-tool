<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4 card-container">
        <div class="add-source-code">
          <a-button
            html-type="button"
            type="primary"
            ghost
            @click="gotoNew"
          >
            {{ $t('common.new_tree') }}
          </a-button>
        </div>

        <a-table
          ref="formSourceCode"
          bordered
          :columns="columns"
          :row-key="record => record.id"
          :data-source="data"
          :pagination="pagination"
          :custom-row="customRow"
          :row-class-name="rowClassName"
          @change="handleTableChange"
        >
          <template
            slot="language"
            slot-scope="text, record"
          >
            {{ getLanguage(record.language) }}
          </template>

          <template
            slot="type_project"
            slot-scope="text, record"
          >
            {{ getTypeProject(record.type_id) }}
          </template>

          <template
            slot="action"
            slot-scope="text, record"
          >
            <a-button
              html-type="button"
              type="primary"
              :disabled="startAnalyticsData[record.id] === true || startSyncData[record.id] === true"
              @click="syncBranch(record.id)"
            >
              {{ $t('common.resourceCode.sync_branch') }}
            </a-button>
            <a-button
              html-type="button"
              type="primary"
              :disabled="startAnalyticsData[record.id] === true || startSyncData[record.id] === true"
              @click="showDetail(record.id)"
            >
              {{ $t('common.update') }}
            </a-button>

            <a-button
              html-type="button"
              type="danger"
              :disabled="startAnalyticsData[record.id] === true || startSyncData[record.id] === true"
              @click="confirmToDelete(record.id)"
            >
              {{ $t('common.delete') }}
            </a-button>
          </template>
        </a-table>

        <!-- List -branch  -->
        <div v-if="rowResourceSelected !== 0">
          <a-row
            type="flex"
            :gutter="30"
          >
            <a-col
              :span="24"
              :md="2"
            >
              <p style="padding-top: 5px">
                {{ $t('text.select_branch') }}
              </p>
            </a-col>
            <a-col
              :span="24"
              :md="12"
            >
              <a-select
                v-model="branch_id"
                :placeholder="$t('module.sourceCode.branch')"
                show-search
                :filter-option="filterOption"
                @change="getListTree()"
              >
                <a-select-option
                  v-for="(item, i) in listBranches"
                  :key="i"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col
              :span="24"
              :md="10"
            >
              <a-button
                v-if="branch_id"
                html-type="button"
                type="primary"
                :disabled="startAnalyticsBranch[branch_id] === true || startSyncBranch[branch_id] === true"
                @click="syncData"
              >
                {{ $t('common.resourceCode_sync_data') }}
              </a-button>
              <a-button
                v-if="branch_id"
                :disabled="treeData.length === 0 || startAnalyticsBranch[branch_id] === true || startSyncBranch[branch_id] === true"
                html-type="button"
                type="primary"
                @click="analyticsData"
              >
                {{ $t('common.resourceCode_analytics_data') }}
              </a-button>
              <a-button
                v-if="branch_id"
                :disabled="startAnalyticsBranch[branch_id] === true || startSyncBranch[branch_id] === true"
                html-type="button"
                type="primary"
                @click="clearCacheBranch"
              >
                {{ $t('common.clear_cache_sync_data') }}
              </a-button>
            </a-col>
            <a-col
              v-if="startAnalyticsBranch[branch_id] === true"
              :span="24"
              :offset="2"
              :md="12"
            >
              <a-progress :percent="partProcess" status="active" />
            </a-col>

            <a-col
              v-if="startSyncBranch[branch_id] === true"
              :span="24"
              :offset="2"
              :md="12"
            >
              <a-progress :percent="percentProcess" status="active" />
            </a-col>
          </a-row>
        </div>
        <!-- Trees Project -->
        <a-spin :spinning="branch_id && loadinging[branch_id] !== undefined && loadinging[branch_id]">
          <a-tree
            :key="treeKey"
            v-model="checkedKeys"
            draggable
            :expanded-keys.sync="expandedKeys"
            :load-data="onLoadData"
            :tree-data="treeData"
          >
            <template slot="title" slot-scope="{ name, id, type, property_type }">
              <div class="title-tree" :style="{ backgroundColor: selectedItemId === id ? 'lightblue' : 'transparent' }" @click="showDiagram(id, type, property_type)">
                <div class="title">
                  {{ name }}
                </div>
              </div>
            </template>
          </a-tree>
        </a-spin>
      </a-card>
    </a-spin>

    <!-- Modal create folder root -->
    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.tree') }}
      </template>

      <SourceCodeForm
        :id="currentId"
        @save="save"
        @cancel="closeDialog(false)"
      />
    </a-modal>
    <!-- End modal create folder root -->

    <!-- Modal change name -->
    <a-modal
      ref="detail"
      :visible="visibleChangeName"
      :width="900"
      :footer="null"
      @cancel="closeModalChangeName()"
    >
      <template slot="title">
        {{ $t('common.update') }}
      </template>
      <a-form-model
        ref="formChangeName"
        :model="modelChangeName"
        :rules="formRulesChangeName"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        @submit.prevent="handleSubmitChangeName"
      >
        <a-spin :spinning="loading">
          <div class="p-4">
            <a-row
              type="flex"
              :gutter="30"
            >
              <a-col
                :span="24"
                :md="20"
              >
                <a-form-model-item
                  :label="$t('module.tree.name_tree')"
                  prop="name"
                >
                  <a-input
                    v-model="modelChangeName.name"
                    :placeholder="$t('module.tree.name')"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>

          <div class="text-center p-3">
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              {{ $t('common.create') }}
            </a-button>
          </div>
        </a-spin>
      </a-form-model>
    </a-modal>

    <!-- Modal create folder/class -->
    <a-modal
      ref="detail"
      :visible="visibleFolderClass"
      :width="900"
      :footer="null"
      @cancel="closeModalFolderClass()"
    >
      <template slot="title">
        {{ $t('common.create') }} {{ openFolder == true ? $t('module.folder') : $t('module.class') }}
      </template>
      <div v-if="openFolder == true">
        <a-form-model
          ref="formChildren"
          :model="modelChildren"
          :rules="formRulesFolderClass"
          :label-col="{ sm: 6 }"
          :wrapper-col="{ sm: 18 }"
          @submit.prevent="handleSubmitFolder"
        >
          <a-spin :spinning="loading">
            <div class="p-4">
              <a-row
                type="flex"
                :gutter="30"
              >
                <a-col
                  :span="24"
                  :md="20"
                >
                  <a-form-model-item
                    :label="$t('module.tree.name_tree')"
                    prop="name"
                  >
                    <a-input
                      v-model="modelChildren.name"
                      :placeholder="$t('module.tree.name')"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>

            <div class="text-center p-3">
              <a-button
                html-type="submit"
                type="primary"
                class="min-w-100"
              >
                {{ $t('common.create') }}
              </a-button>
            </div>
          </a-spin>
        </a-form-model>
      </div>
      <div v-else>
        <a-form-model
          ref="formChildren"
          :model="modelChildren"
          :rules="formRulesFolderClass"
          :label-col="{ sm: 6 }"
          :wrapper-col="{ sm: 18 }"
          @submit.prevent="handleSubmitClass"
        >
          <a-spin :spinning="loading">
            <div class="p-4">
              <a-row
                type="flex"
                :gutter="30"
              >
                <a-col
                  :span="24"
                  :md="20"
                >
                  <a-form-model-item
                    :label="$t('module.tree.name_tree')"
                    prop="name"
                  >
                    <a-input
                      v-model="modelChildren.name"
                      :placeholder="$t('module.tree.name')"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>

            <div class="text-center p-3">
              <a-button
                html-type="submit"
                type="primary"
                class="min-w-100"
              >
                {{ $t('common.create') }}
              </a-button>
            </div>
          </a-spin>
        </a-form-model>
      </div>
    </a-modal>
    <!--End modal create folder/class -->

    <!-- Modal create properties -->
    <a-modal
      ref="detail"
      :visible="visibleCreateProperties"
      :width="900"
      :footer="null"
      @cancel="closeModalCreateProperties"
    >
      <template slot="title">
        {{ $t('common.create') }} {{ $t('module.properties') }}
      </template>
      <a-form-model
        ref="formProperties"
        :model="modelProperties"
        :rules="formRulesProperties"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        @submit.prevent="handleSubmitProperties"
      >
        <a-spin :spinning="loading">
          <div class="p-4">
            <a-row
              type="flex"
              :gutter="30"
            >
              <a-col
                :span="24"
                :md="20"
              >
                <a-form-model-item
                  :label="$t('module.tree.name_tree')"
                  prop="name"
                >
                  <a-input
                    v-model="modelProperties.name"
                    :placeholder="$t('module.tree.name')"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="20"
              >
                <a-form-model-item
                  :label="$t('module.tree.root_type')"
                  prop="root_type"
                >
                  <a-radio-group v-model="modelProperties.property_type">
                    <a-radio
                      v-for="(item, index) in LIST_PROPERTIES_TYPE"
                      :key="index"
                      :style="radioStyle"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>

          <div class="text-center p-3">
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              {{ $t('common.create') }}
            </a-button>
          </div>
        </a-spin>
      </a-form-model>
    </a-modal>
    <!-- End modal create properties root -->
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import { db, deleteDoc, doc, collection, query, where, onSnapshot } from '~/plugins/firebase'
import { LANGUAGE_PROJECT, LIST_ROOT_TYPE, LIST_PROPERTIES_TYPE, CHANGE_FOLDER, CHANGE_CLASS, CHANGE_FUNCTION_PROPERTIES, PROPERTY_TYPE_VALUE, ERROR_CODE } from '~/constants'
import SourceCodeForm from '~/components/templates/sequenceDiagram/SourceCodeForm.vue'
export default {
  /**
     * Declare components.
     */
  components: {
    SourceCodeForm
  },

  /**
     * Declare mixins.
     */
  mixins: [
    DataTable
  ],

  /**
     * Init data for component.
     */
  data() {
    return {
      resource: 'sourceCode',
      visible: false,
      visibleFolderClass: false,
      openFolder: false,
      model: {},
      startAnalyticsData: {},
      startSyncData: {},
      startSyncBranch: {},
      startAnalyticsBranch: {},
      progressSyncData: false,
      modelChangeName: {},
      expandedKeys: [],
      partProcess: 0,
      percentProcess: 0,
      selectedItemId: 0,
      records: null,
      modelChildren: {},
      treeData: [],
      project_id: this.$store.state.project.id,
      checkedKeys: [],
      selectedKeys: [],
      currentId: 0,
      LIST_ROOT_TYPE,
      LIST_PROPERTIES_TYPE,
      rowResourceSelected: 0,
      radioStyle: {
        display: 'inline',
        height: '30px',
        lineHeight: '30px'
      },
      branch_id: null,
      source_code_id: null,
      LANGUAGE_PROJECT,
      visibleChangeName: false,
      visibleCreateProperties: false,
      listBranches: [],
      modelProperties: {},
      PROPERTY_TYPE_VALUE,
      loadinging: {},
      ERROR_CODE,
      defaultParams: {
        project_id: this.$store.state.project.id ?? undefined
      },
      treeKey: 1
    }
  },

  /**
     * Computed event.
     */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.sourceCode.name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('module.sourceCode.code_id'),
          dataIndex: 'code_id'
        },
        {
          title: this.$t('module.sourceCode.url_web'),
          dataIndex: 'url_web'
        },
        {
          title: this.$t('module.sourceCode.language_project'),
          scopedSlots: { customRender: 'language' }
        },
        {
          title: this.$t('module.sourceCode.root_type'),
          scopedSlots: { customRender: 'type_project' }
        },
        {
          title: this.$t('module.action'),
          scopedSlots: { customRender: 'action' }
        }
      ]
    },

    formRulesFolderClass() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('class.name') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    formRulesChangeName() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('class.name') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    formRulesProperties() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('class_properties.name') }),
            trigger: ['change', 'blur']
          }
        ],
        property_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('class_properties.name') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  created() {
  },

  /**
     * Methods.
     */
  methods: {
    async syncData() {
      this.percentProcess = 0
      this.loadinging[this.branch_id] = true
      const params = {
        branch_id: this.branch_id,
        source_code_id: this.source_code_id
      }
      try {
        this.startSyncData = { ...this.startSyncData, [this.source_code_id]: true }
        this.startSyncBranch = { ...this.startSyncBranch, [this.branch_id]: true }
        await this.$api.tree.syncTree({ params }).then(() => {
          this.getListTree(this.branch_id)
        })
        this.checkProcessSyncTree()
      } catch (_) {
        this.loadinging = { ...this.loadinging, [this.branch_id]: false }
        this.startSyncData = { ...this.startSyncData, [this.source_code_id]: false }
        this.startSyncBranch = { ...this.startSyncBranch, [this.branch_id]: false }
        if (_.response.data.code && _.response.data.code === ERROR_CODE.TREE_IS_BEING_SYNCHRONIZED) {
          this.$notification.error({
            message: this.$t('text.wrong_tree_is_being_synchronized')
          })
        } else if (_.response.data.code && _.response.data.code === ERROR_CODE.YOU_ARE_SYNCING) {
          this.$notification.error({
            message: this.$t('text.you_are_syncing')
          })
        } else {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } finally {
        // this.$store.dispatch('setLoading', false)
      }
    },

    /**
       *Analystic data
      */
    async analyticsData() {
      this.loadinging[this.branch_id] = true
      // this.$store.dispatch('setLoading', true)
      const params = {
        branch_id: this.branch_id,
        source_code_id: this.source_code_id
      }
      try {
        this.startAnalyticsData = { ...this.startAnalyticsData, [this.source_code_id]: true }
        this.startAnalyticsBranch = { ...this.startAnalyticsBranch, [this.branch_id]: true }
        // this.$store.dispatch('setLoading', true)
        await this.$api.tree.analyticsTree({ params }).then(() => {
          this.getListTree(this.branch_id)
          // this.$store.dispatch('setLoading', false)
        })
        this.checkProcessSync()
      } catch (_) {
        this.loadinging = { ...this.loadinging, [this.branch_id]: false }
        this.startAnalyticsData = { ...this.startAnalyticsData, [this.source_code_id]: false }
        this.startAnalyticsBranch = { ...this.startAnalyticsBranch, [this.branch_id]: false }
        if (_.response.data.code && _.response.data.code === ERROR_CODE.TREE_IS_BEING_SYNCHRONIZED) {
          this.$notification.error({
            message: this.$t('text.wrong_tree_is_being_synchronized')
          })
        } else if (_.response.data.code && _.response.data.code === ERROR_CODE.YOU_ARE_SYNCING) {
          this.$notification.error({
            message: this.$t('text.you_are_syncing')
          })
        } else {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } finally {
        // this.$store.dispatch('setLoading', false)
      }
    },

    /**
       *Sync list branch
       */
    async syncBranch(id) {
      try {
        const params = {
          source_code_id: id
        }
        this.$store.dispatch('setLoading', true)
        await Promise.all([
          this.$api.branch.syncBranch({ params })
        ]).then(() => {
          this.getListBranch(id)
        })
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (error) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
       *Get text languege
      */
    getLanguage(val) {
      const language = LANGUAGE_PROJECT.find(item => item.id === val)
      return language ? language.label : null
    },

    getTypeProject(val) {
      const type = LIST_ROOT_TYPE.find(item => item.value === val)
      return type ? type.label : null
    },

    /**
       * Custom row event of table column left
       */
    customRow(record) {
      return {
        on: {
          click: () => {
            if (this.rowResourceSelected !== record.id) {
              this.$store.dispatch('setLoading', true)
              this.listBranches = []
              this.branch_id = null
              this.source_code_id = record.id
              this.treeData = []
              this.rowResourceSelected = record.id
              this.getListBranch(record.id)
              this.$store.dispatch('setLoading', false)
            }
          }
        }
      }
    },

    async getListBranch(idSoureCode) {
      const params = {
        all: true,
        source_code_id: idSoureCode
      }

      try {
        const response = await this.$api.branch.list({ params })
        const data = response.data.result.data
        this.listBranches = data
        this.checkSyncTree()
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error)
      }
    },

    async getListTree() {
      this.treeKey = this.generateRandomSixDigitNumber()
      const params = {
        project_id: this.$store.state.project.id,
        branch_id: this.branch_id,
        order_by: 'sort',
        order_type: 1,
        all: true,
        parent_id: 0
      }
      const { data: { result: { data } } } = await this.$api.tree.list({ params })
      this.treeData = data
    },

    generateRandomSixDigitNumber() {
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    },

    /**
       * Custom css class for row
       */
    rowClassName(record) {
      if (record.id === this.rowResourceSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    changeName(title, id, type) {
      this.modelChangeName = {
        name: title
      }
      this.modelChangeName.idChangeName = +id.toString().match(/\d+/)[0]
      if (type === 'tree') {
        this.modelChangeName.typeChange = CHANGE_FOLDER
      } else if (type === 'class') {
        this.modelChangeName.typeChange = CHANGE_CLASS
      } else {
        this.modelChangeName.typeChange = CHANGE_FUNCTION_PROPERTIES
      }
      this.visibleChangeName = true
    },
    closeModalChangeName() {
      this.visibleChangeName = false
      this.modelChangeName = {}
    },

    closeModalFolderClass() {
      this.visibleFolderClass = false
      this.openFolder = false
      this.openClass = false
      this.modelChildren = {}
    },

    addFolder(val) {
      this.openFolder = true
      this.modelChildren.parent_id = val
      this.visibleFolderClass = true
    },

    /**
       *Update class
      */
    updateClass() {

    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    gotoNew() {
      this.currentId = 0
      this.visible = true
    },

    /**
       *Add function properties
      */
    addFunctionProperties(idClass) {
      this.modelProperties.class_id = +idClass.toString().match(/\d+/)[0]
      this.visibleCreateProperties = true
    },

    closeModalCreateProperties() {
      this.visibleCreateProperties = false
      this.modelProperties = {}
    },

    /**
       *Open modal add class
      */
    addClass(val) {
      this.visibleFolderClass = true
      this.modelChildren.tree_id = val
    },

    async onLoadData(treeNode) {
      this.treeNode = 2
      if (treeNode.dataRef.type === 'properties') {
        return
      }
      if (treeNode.dataRef.children) {
        this.treeData = [...this.treeData]
        return
      }
      if (treeNode.dataRef.tree_id) {
        const params = {
          class_id: +treeNode.dataRef.id.toString().match(/\d+/)[0],
          project_id: this.$store.state.project.id || undefined,
          order_by: 'sort',
          order_type: 1,
          all: true
        }
        const { data: { result: { data } } } = await this.$api.classProperties.list({ params })
        treeNode.dataRef.children = data
        this.treeData = [...this.treeData]
      } else {
        try {
          const params = {
            parent_id: treeNode.dataRef.id,
            project_id: this.$store.state.project.id || undefined,
            order_by: 'sort',
            order_type: 1,
            all: true
          }

          const [result1, result2] = await Promise.all([
            this.getListClass(treeNode.dataRef.id),
            await this.$api.tree.list({ params })
          ])

          const mergedResult = [...result1.data.result.data, ...result2.data.result.data]
          const data = mergedResult.sort((a, b) => a.sort - b.sort)
          treeNode.dataRef.children = data
          this.treeData = [...this.treeData]
        } catch (error) {
          console.warn(error)
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      }
    },

    showDiagram(id, type, propertyType) {
      if (type === 'properties') {
        if (propertyType === PROPERTY_TYPE_VALUE.function) {
          this.selectedItemId = this.selectedItemId === id ? null : id
          this.$emit('change-tab', id)
        }
      }
    },

    async getListClass(treeId) {
      try {
        const params = {
          tree_id: treeId,
          project_id: this.$store.state.project.id || undefined,
          order_by: 'sort',
          order_type: 1,
          all: true
        }

        return await this.$api.classes.list({ params })
      } catch (error) {

      }
    },

    /**
       * Drop action
       *
       */
    onDrop(info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

      const drag = info.dragNodesKeys.join('-').split('-')
      const nodeDrag = info.dragNodesKeys.join('-').split('-').slice(0, drag.length - 1)
      const nosDrop = info.node.pos.split('-').slice(0, nodeDrag.length)

      // Block properties move out class
      if (info.dragNode.dataRef.type === 'properties' && (nodeDrag.toString() !== nosDrop.toString())) {
        this.$notification.error({
          message: this.$t('message.wrong_move_properties_out_class')
        })
        return
      }

      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.treeData]

      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || []
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 &&
          info.node.expanded &&
          dropPosition === 1
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.treeData = data
      const params = {}
      params.idDrag = dragKey
      params.idDrop = dropKey
      params.dropPosition = dropPosition
      // await this.$api.tree.changePositionTree(params)
    },

    /**
       *Push array when check selectbox
      */
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },

    /**
       *Delete tree
       */
    async deleteTree() {
      const params = {}
      params.idsTree = this.checkedKeys
      await this.$api.tree.deleteTree(params)
    },

    /**
     *Check process sync
    */
    checkProcessSync() {
      const q = query(
        collection(db, 'Process_sync'),
        where('branch_id', '==', this.branch_id),
        where('user_id', '==', this.$auth.user.id)
      )

      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              this.partProcess = data.process
              if (this.partProcess === 100) {
                this.startAnalyticsData = { ...this.startAnalyticsData, [this.source_code_id]: false }
                this.startAnalyticsBranch = { ...this.startAnalyticsBranch, [this.branch_id]: false }
                this.source_code_id = null
                this.deleteRecordFromFirebase(doc.id, 'Process_sync', data.branch_id)
                this.partProcess = 0
                this.$notification.success({
                  message: this.$t('text.successfully')
                })
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    /**
     *Check process sync branch
    */
    checkProcessSyncTree() {
      const q = query(
        collection(db, 'Process_sync_tree'),
        where('branch_id', '==', this.branch_id),
        where('user_id', '==', this.$auth.user.id)
      )
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              this.loadinging[data.branch_id] = true
              if (data && data.process === 0) {
                this.startSyncData = { ...this.startSyncData, [this.source_code_id]: true }
                this.startSyncBranch = { ...this.startSyncBranch, [data.branch_id]: true }
              }
              this.percentProcess = data.process
              if (this.percentProcess === 100) {
                this.loadinging[data.branch_id] = false
                this.getListTree()
                this.startSyncData = { ...this.startSyncData, [this.source_code_id]: false }
                this.startSyncBranch = { ...this.startSyncBranch, [data.branch_id]: false }
                this.source_code_id = null
                this.deleteRecordFromFirebase(doc.id, 'Process_sync_tree', data.branch_id)
                this.$notification.success({
                  message: this.$t('text.successfully')
                })
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    checkSyncTree() {
      const q = query(
        collection(db, 'Process_sync_tree')
      )
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              if (data) {
                if (data.process === 100) {
                  this.startSyncData = { ...this.startSyncData, [this.source_code_id]: false }
                  this.startSyncBranch = { ...this.startSyncBranch, [data.branch_id]: false }
                  this.deleteRecordFromFirebase(doc.id, 'Process_sync_tree', data.branch_id)
                } else {
                  this.startSyncBranch = { ...this.startSyncBranch, [parseInt(data.branch_id)]: true }
                  this.startAnalyticsData = { ...this.startAnalyticsData, [parseInt(data.branch_id)]: true }
                }
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    async deleteRecordFromFirebase(id, collection, branchId) {
      try {
        this.loadinging[branchId] = false
        const docRef = doc(db, collection, id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    /**
       *Submit form
       */
    handleSubmitFolder() {
      this.$refs.formChildren.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true)
            const params = this.modelChildren
            params.project_id = this.project_id

            await this.$api.tree.create(params)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visibleFolderClass = false
            this.$fetch()
            this.expandedKeys = []
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.modelChildren = {}
            this.openFolder = false
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    /**
       *Submit form change name
       */
    handleSubmitChangeName() {
      this.$refs.formChangeName.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true)
            const params = {
              name: this.modelChangeName.name
            }
            params.project_id = this.project_id

            if (this.modelChangeName.typeChange === CHANGE_FOLDER) {
              await this.$api.tree.update(this.modelChangeName.idChangeName, params)
            } else if (this.modelChangeName.typeChange === CHANGE_CLASS) {
              await this.$api.classes.update(this.modelChangeName.idChangeName, params)
            } else {
              await this.$api.classProperties.update(this.modelChangeName.idChangeName, params)
            }
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visibleChangeName = false
            this.$fetch()
          } catch (_) {
            console.warn(_)
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.modelChangeName = {}
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    /**
       *Submit form
       */
    handleSubmitClass() {
      this.$refs.formChildren.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true)
            const params = this.modelChildren
            params.project_id = this.project_id
            await this.$api.classes.create(params)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visibleFolderClass = false
            this.$fetch()
            this.expandedKeys = []
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.modelChildren = {}
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },
    /**
       *Submit form
       */
    handleSubmitProperties() {
      this.$refs.formProperties.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true)
            const params = this.modelProperties
            params.project_id = this.project_id
            await this.$api.classProperties.create(params)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visibleCreateProperties = false
            this.$fetch()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.modelProperties = {}
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    selectItem(id) {
      this.selectedItemId = this.selectedItemId === id ? null : id
    },

    save() {
      this.visible = false
      this.$fetch()
    },

    /**
     * Clear cache branch.
     */
    clearCacheBranch() {
      this.$confirm({
        title: 'Confirm',
        content: this.$t('clear_cache_sync_data.confirm'),
        okText: this.$t('common.clear'),
        cancelText: this.$t('common.cancel'),
        onOk: async () => {
          this.$store.dispatch('setLoading', true)
          try {
            const data = {
              branch_id: this.branch_id
            }
            await this.$api.tree.clearCacheBranch(data)
          } catch (_) {
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    }
  }
}
</script>
  <style lang="scss" scoped>
  .add-source-code{
    margin-bottom: 30px;
  }
  .sync-branch{
      margin: 30px 0;
  }
  .title-tree{
   display: flex;
    align-items: center;
    min-width: 80px;
  }
  .title {
    margin-right: 30px;
  }

  :deep() {
  .ant-tree .ant-tree-treenode-switcher-close {
    margin-top: 30px;
  }
  .ant-tree-treenode-switcher-open{
      margin-top: 30px;
  }
    .ant-table-tbody {
      .selected {
        background-color: rgb(250, 215, 16) !important;
      }
      > tr {
        cursor: pointer;
      }
    }
    .ant-tree li span.ant-tree-checkbox {
      top: auto;
      top: initial;
      height: 24px;
      margin: 0 4px -8px 2px;
      padding: 4px 0;
  }
  .ant-tree-treenode-switcher-close {
    padding: 10px auto;
  }
  .ant-tree li .ant-tree-node-content-wrapper:hover {
      background-color: #fff;
  }
  }
  </style>
