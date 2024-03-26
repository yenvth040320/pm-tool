<template>
  <div>
    <a-row class="main-row">
      <a-spin :spinning="loading">
        <!-- table actor -->
        <a-col :span="7" style="margin-left: 2%">
          <a-table
            :columns="actorColumns"
            :row-key="record => record.id"
            :data-source="actorData"
            :pagination="false"
            :custom-row="customRowActor"
            :row-class-name="rowClassName"
            :scroll="{ y: 700 }"
          >
            <template
              slot="actor_list"
              slot-scope="text, record, index"
            >
              <a-select v-model="record.actor_name" :placeholder="$t('module.function_usecase.actor')" @change="handleChangeActor($event, index)">
                <a-select-option v-for="item in actorList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template
              slot="action"
              slot-scope="text, record, index"
            >
              <div v-if="record.approve">
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(record.id, 'actorData')" />
              </div>
              <div v-if="!record.approve">
                <a-icon type="plus" @click="submitActor(record, index)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!-- table action parent -->
        <a-col :span="7" style="margin-left: 2%">
          <a-table
            :columns="parentColumns"
            :row-key="record => record.id"
            :data-source="actionParentData"
            :pagination="false"
            :custom-row="customRowParent"
            :row-class-name="rowClassName"
            :scroll="{ y: 700 }"
          >
            <template
              slot="action_list_parent"
              slot-scope="text, record, index"
            >
              <a-select v-model="record.action_name" :placeholder="$t('module.function_usecase.action_group')" @change="handleChangeActionParent($event, index)">
                <a-select-option v-for="item in actionParentList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template
              slot="action"
              slot-scope="text, record"
            >
              <div v-if="record.approve">
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(record.action_id, 'actionParentData')" />
              </div>
              <div v-if="!record.approve">
                <a-icon type="plus" @click="submitActionParent(record, index)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!-- table action -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="chillColumns"
            :row-key="record => record.id"
            :data-source="actionChillData"
            :custom-row="customRowChill"
            :row-class-name="rowClassName"
            :pagination="false"
            :scroll="{ y: 700 }"
          >
            <template
              slot="action_list_parent_chill"
              slot-scope="text, record, index"
            >
              <a-select v-model="record.action_name" :placeholder="$t('module.function_usecase.action')" @change="handleChangeActionChill($event, index)">
                <a-select-option v-for="item in actionChillList" :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template
              slot="action"
              slot-scope="text, record, index"
            >
              <div v-if="record.approve">
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(record.id, 'actionChillData')" />
              </div>
              <div v-if="!record.approve">
                <a-icon type="plus" @click="submitActionChill(record, index)" />
              </div>
            </template>
          </a-table>
        </a-col>
      </a-spin>
    </a-row>
    <a-row
      class="text-center p-4"
    >
      <a-col :span="24">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="confirmToSave()"
        >
          {{ $t('common.save') }}
        </a-button>
      </a-col>
    </a-row>
    <a-row v-if="dataChart.length > 0" :key="key">
      <p>{{ $t('module.function_usecase.vn_chart') }}</p>
      <usecase-chart ref="usecaseVN" :dataChart="dataChart" :type-chart="'vn'" />
      <a-divider />
      <p>{{ $t('module.function_usecase.jp_chart') }}</p>
      <usecase-chart ref="usecaseJP" :dataChart="dataChart" :type-chart="'jp'" />
    </a-row>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import { cloneDeep } from 'lodash'
import * as htmlToImage from 'html-to-image'
import DataTable from '~/mixins/data-table'
import UsecaseChart from '~/components/organisms/usecaseChart.vue'
import {
  SORT
} from '~/constants'

export default {
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },
  /**
   * Declare components.
   */
  components: { UsecaseChart },

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = {
        order_by: 'id',
        order_type: SORT.asc,
        project_id: this.project_id,
        all: true
      }

      const { data: { result: { data } } } = await this.$api.actorAction.list({ params })
      const actors = data.filter(item => item.actor !== null).map(item => item.actor)
      const actorData = actors.filter((item, index, self) =>
        index === self.findIndex(t => (
          t.id === item.id
        ))
      )
      this.actorList = actorData.map(item => {
        return { ...item, isSelected: false, approve: false }
      })

      const actions = data.filter(item => item.action !== null).map(item => item.action)
      const ActionData = actions.filter((item, index, self) =>
        index === self.findIndex(t => (
          t.id === item.id
        ))
      )

      const newData = ActionData.map(item => {
        return { ...item, isSelected: false, approve: false }
      })

      this.actionParentList = newData.filter(item => {
        return item.parent_id === 0
      })
      this.actionChillList = newData.filter(item => {
        return item.parent_id !== 0
      })
      this.getActorData()
      this.getActionData()
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionUseCase',
      SORT,
      moment,
      visible: false,
      currentId: 0,
      project_id: this.$store.state.project.id,
      version_code: this.version.version_code,
      function_id: this.version.function.id,
      actorData: [],
      actionParentData: [],
      actionChillData: [],
      actionData: [],
      dataChart: [],
      actionParentList: [],
      actionChillList: [],
      actorList: [],
      checked: false,
      key: false
    }
  },

  /**
   * Computed event.
   */
  computed: {
    actorColumns() {
      return [
        {
          title: this.$t('module.function_usecase.actor'),
          scopedSlots: { customRender: 'actor_list' },
          width: 200
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    parentColumns() {
      return [
        {
          title: this.$t('module.function_usecase.action_group'),
          scopedSlots: { customRender: 'action_list_parent' },
          width: 200
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    chillColumns() {
      return [
        {
          title: this.$t('module.function_usecase.action'),
          scopedSlots: { customRender: 'action_list_parent_chill' },
          width: 420
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ]
    }
  },

  watch: {
    dataChart: {
      deep: true,
      immediate: true,
      handler() {
        this.onLoad()
      }
    },
    'checked'() {
      this.onLoad()
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  /**
   * Methods.
   */
  methods: {
    /**
     * Loading component chart
     */
    onLoad() {
      if (this.key === false) {
        this.key = true
        setTimeout(() => {
          this.key = false
        }, 500)
      }
    },

    /**
     * handleChangeActor
     */
    handleChangeActor(id, index) {
      const data = this.actorList.find(item => item.id === id)
      this.actorData[index].actor_id = data.id
      this.actorData[index].actor_name = data.name
      this.actorData[index].actor_name_jp = data.name_jp
    },

    /**
     * handleChangeActionParent
     */
    handleChangeActionParent(id, index) {
      const data = this.actionParentList.find(item => item.id === id)
      this.actionParentData[index].action_id = data.id
      this.actionParentData[index].action_name = data.name
      this.actionParentData[index].action_name_jp = data.name_jp
    },

    /**
     * handleChangeActionChill
     */
    handleChangeActionChill(id, index) {
      const data = this.actionChillList.find(item => item.id === id)
      this.actionChillData[index].action_id = data.id
      this.actionChillData[index].action_name = data.name
      this.actionChillData[index].action_name_jp = data.name_jp
    },

    /**
     * Get actor data
     */
    async getActorData() {
      const params = {
        order_by: 'id',
        order_type: SORT.asc,
        version_code: this.version_code,
        project_id: this.project_id,
        function_id: this.function_id,
        all: true
      }

      const { data: { result: { data } } } = await this.$api.functionUsecase.list({ params })
      const actorsData = data
      const actorsDataChart = data

      this.actorData = actorsData.map(item => {
        return { ...item, isSelected: false, approve: true }
      })
      this.dataChart = actorsDataChart.map(item => {
        return { ...item, isSelected: false, approve: true, actions: [] }
      })

      this.actorData.push({
        version_code: this.version_code,
        project_id: this.project_id,
        function_id: this.function_id,
        actor_name: '',
        approve: false,
        isSelected: false
      })
    },

    /**
     * Get data action
     */
    async getActionData() {
      const params = {
        order_by: 'id',
        order_type: SORT.asc,
        version_code: this.version_code,
        project_id: this.project_id,
        function_id: this.function_id,
        all: true
      }
      const { data: { result: { data } } } = await this.$api.functionUsecaseAction.list({ params })
      const newData = data.map(item => {
        return { ...item, isSelected: false, approve: true, action_chills: [] }
      })

      this.actionData = newData
      const actionParent = newData.filter(item => {
        return item.parent_id === 0
      })

      const actionChill = newData.filter(item => {
        return item.parent_id !== 0
      })

      actionChill.forEach(action => {
        actionParent.find(item => item.action_id === action.parent_id && item.actor_id === action.actor_id).action_chills.push(action)
      })
      actionParent.forEach(action => {
        this.dataChart.find(item => item.actor_id === action.actor_id).actions.push(action)
      })
    },

    /**
     * Custom css class for row
     */
    rowClassName(record) {
      if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Custom row event of table actor
     */
    customRowActor(record) {
      return {
        on: {
          click: () => {
            this.actorData.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            this.actionParentData.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            this.actionParentData = []
            this.actionChillData = []
            record.isSelected = true
            if (record.approve) {
              this.actionParentData = this.actionData.filter(item => {
                return item.actor_id === record.actor_id && item.approve === true && item.parent_id === 0
              })
              this.actionParentData.push({
                version_code: this.version_code,
                project_id: this.project_id,
                function_id: this.function_id,
                actor_id: record.actor_id,
                action_id: record.action_id,
                action_name: '',
                approve: false,
                isSelected: false
              })
            }
          }
        }
      }
    },

    /**
     * Custom row event of table action parent
     */
    customRowParent(record) {
      return {
        on: {
          click: () => {
            this.actionParentData.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            this.actionChillData = []
            record.isSelected = true
            if (record.approve) {
              this.actionChillData = this.actionData.filter(item => {
                return item.parent_id === record.action_id && item.approve === true && item.actor_id === record.actor_id
              })
              this.actionChillData.push({
                version_code: this.version_code,
                project_id: this.project_id,
                function_id: this.function_id,
                parent_id: record.action_id,
                actor_id: record.actor_id,
                action_name: '',
                approve: false,
                isSelected: false
              })
            }
          }
        }
      }
    },

    /**
     * Custom row event of table action chill
     */
    customRowChill(record) {
      return {
        on: {
          click: () => {
            this.actionChillData.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            record.isSelected = true
          }
        }
      }
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id, rep) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id, rep)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    deleteRecord(id, rep) {
      this.$store.dispatch('setLoading', true)

      try {
        const index = this[rep].findIndex(item => item.id === id)
        if (index !== -1) {
          this[rep].splice(index, 1)
        }
        if (rep === 'actorData') {
          const index1 = this.dataChart.findIndex(item => item.id === id)
          if (index1 !== -1) {
            this.dataChart.splice(index1, 1)
          }
          const index2 = this.actionData.findIndex(item => item.actor_id === id)
          if (index2 !== -1) {
            this.actionData.splice(index2, 1)
          }
          this.actionParentData = []
          this.actionChillData = []
        }
        if (rep === 'actionParentData') {
          this.dataChart.forEach(el => {
            const index1 = el.actions.findIndex(item => item.action_id === id)
            if (index1 !== -1) {
              el.actions.splice(index1, 1)
            }
          })
          const index2 = this.actionData.findIndex(item => item.action_id === id)
          if (index2 !== -1) {
            this.actionData.splice(index2, 1)
          }
          const index3 = this.actionData.findIndex(item => item.parent_id === id)
          if (index3 !== -1) {
            this.actionData.splice(index3, 1)
          }
          const index4 = this.actionParentData.findIndex(item => item.action_id === id)
          if (index4 !== -1) {
            this.actionParentData.splice(index4, 1)
          }
          this.actionChillData = []
        }

        if (rep === 'actionChillData') {
          this.dataChart.forEach(el => {
            el.actions.forEach(el1 => {
              const index1 = el1.action_chills.findIndex(item => item.id === id)
              if (index1 !== -1) {
                el1.action_chills.splice(index1, 1)
              }
            })
          })
          const index2 = this.actionData.findIndex(item => item.id === id)
          if (index2 !== -1) {
            this.actionData.splice(index2, 1)
          }
          this.checked = !this.checked
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Go to new
     */
    gotoNew() {
      this.$router.push({ name: 'entity-new' })
    },

    /**
     * Submit actor record
     *
     * @param record
     */
    submitActor(record, index) {
      if (record.actor_name === '') {
        this.$notification.error({
          message: this.$t('module.function_usecase.required_actor.err_message')
        })
        return
      }
      if (this.dataChart.some(item => item.actor_id === record.actor_id)) {
        this.$notification.error({
          message: this.$t('module.function_usecase.exists_actor.err_message')
        })
        return
      }
      this.$store.dispatch('setLoading', true)
      try {
        if (!record.approve) {
          record.approve = true
          const data = cloneDeep(record)
          data.actions = []
          this.dataChart.push(data)
          this.actorData.push({
            version_code: this.version_code,
            project_id: this.project_id,
            function_id: this.function_id,
            actor_id: data.actor_id,
            actor_name: '',
            approve: false,
            isSelected: false
          })
          this.actionParentData.push({
            version_code: this.version_code,
            project_id: this.project_id,
            function_id: this.function_id,
            actor_id: data.actor_id,
            action_name: '',
            approve: false,
            isSelected: false
          })
        } else {
          const data = cloneDeep(record)
          if (this.dataChart.some(item => item.actor_id === record.actor_id)) {
            return
          } else {
            const index1 = this.actionData.findIndex(item => item.actor_id === this.dataChart[index].action_id)
            if (index1 !== -1) {
              this.actionData.splice(index1, 1)
            }
            data.actions = []
            this.dataChart[index] = data
          }
        }
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Submit action parent record
     *
     * @param record
     */
    submitActionParent(record, index) {
      if (record.action_name === '') {
        this.$notification.error({
          message: this.$t('module.function_usecase.required_action.err_message')
        })
        return
      }
      if (this.actionParentData.some(item => item.action_id === record.action_id && item.approve === true)) {
        this.$notification.error({
          message: this.$t('module.function_usecase.exists_action.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        if (!record.approve) {
          record.approve = true
          const data = cloneDeep(record)
          data.parent_id = 0
          this.actionData.push(data)
          data.action_chills = []
          this.dataChart.filter(item => {
            if (item.actor_id === data.actor_id) {
              item.actions.push(data)
            }
          })

          this.actionParentData.push({
            version_code: this.version_code,
            project_id: this.project_id,
            function_id: this.function_id,
            parent_id: 0,
            actor_id: record.actor_id,
            action_id: record.action_id,
            action_name: '',
            approve: false,
            isSelected: false
          })
          this.actionChillData.push({
            version_code: this.version_code,
            project_id: this.project_id,
            function_id: this.function_id,
            parent_id: record.action_id,
            actor_id: record.actor_id,
            action_name: '',
            approve: false,
            isSelected: false
          })
        } else {
          const data = cloneDeep(record)
          const index1 = this.actionData.findIndex(item => item.action_id === this.dataChart[index].action_id)
          if (index1 !== -1) {
            this.actionData.splice(index1, 1)
          }
          this.dataChart[index] = data
        }
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Submit action chill record
     *
     * @param record
     */
    submitActionChill(record) {
      if (record.action_name === '') {
        this.$notification.error({
          message: this.$t('module.function_usecase.required_action.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        record.approve = true
        const data = cloneDeep(record)
        this.actionData.push(data)
        this.dataChart.filter(actor => {
          if (actor.actor_id === data.actor_id) {
            actor.actions.filter(actionParent => {
              if (actionParent.action_id === data.parent_id) {
                actionParent.action_chills.push(data)
              }
            })
          }
        })
        this.checked = !this.checked
        this.actionChillData.push({
          version_code: this.version_code,
          project_id: this.project_id,
          function_id: this.function_id,
          parent_id: record.parent_id,
          actor_id: record.actor_id,
          action_name: '',
          approve: false
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: _.response.data.message
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Confirm save
     */
    confirmToSave() {
      this.$confirm({
        title: this.$t('text.confirm_to_save'),
        okText: this.$t('common.yes'),
        okType: 'primary',
        cancelText: this.$t('common.no'),
        onOk: () => this.save()
      })
    },

    /**
     * Save data function usecase
     */
    async save() {
      this.$store.dispatch('setLoading', true)
      try {
        let imageFileJP = ''
        let imageFileVN = ''
        const chartElementJP = this.$refs.usecaseJP.$el.querySelector('svg')
        const dataUrlJP = await htmlToImage.toPng(chartElementJP)
        imageFileJP = this.convertBase64ToFile(dataUrlJP, 'usecase-jp.png')

        const chartElementVN = this.$refs.usecaseVN.$el.querySelector('svg')
        const dataUrlVN = await htmlToImage.toPng(chartElementVN)
        imageFileVN = this.convertBase64ToFile(dataUrlVN, 'usecase-vn.png')
        const dataActor = this.actorData.filter(item => item.approve === true)

        const formData = new FormData()
        formData.append('dataActor', JSON.stringify(dataActor))
        formData.append('dataAction', JSON.stringify(this.actionData))
        formData.append('versionCode', this.version_code)
        formData.append('projectId', this.project_id)
        formData.append('functionId', this.function_id)
        formData.append('imageUrlVN', imageFileVN, 'usecase-vn.png')
        formData.append('imageUrlJP', imageFileJP, 'usecase-jp.png')

        await this.$api.functionUsecase.create(formData)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Covert base64 to file
     */
    convertBase64ToFile(dataUrl, nameImg, typeImg = 'image/png') {
      const base64ImageData = dataUrl.split(',')[1]
      const binaryImageData = atob(base64ImageData)

      const uint8Array = new Uint8Array(binaryImageData.length)
      for (let i = 0; i < binaryImageData.length; i++) {
        uint8Array[i] = binaryImageData.charCodeAt(i)
      }

      const imageBlob = new Blob([uint8Array], { type: typeImg })
      const imageFile = new File([imageBlob], nameImg, { type: typeImg })
      return imageFile
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: transparent;
  }
  .ant-table-tbody {
    .selected {
      background-color: rgb(1,247,1) !important;
    }
    > tr {
      cursor: pointer;
    }
  }
  .anticon-plus > svg ,
  .anticon-edit > svg ,
  .anticon-copy > svg ,
  .anticon-delete > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .custom-label-actor > rect {
    display: none; /* Ẩn <rect> mặc định */
  }
  .custom-label-actor .nodeLabel {
    display: flex;
    flex-direction: column;
    img {
      height: 50px;
      width: 40px;
    }
    p {
      margin-top: -5px;
      margin-bottom: 0px;
    }
  }
}
.delete-icon {
  margin-left: 10px;
}
.title {
  font-weight: 700;
}
</style>
