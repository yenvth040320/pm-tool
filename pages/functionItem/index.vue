<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.functionItem') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.functionItem.use_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_id"
                :placeholder="$t('module.function')"
              >
                <a-select-option
                  v-for="(item, index) in functions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.item_num')"
              prop="item_num"
            >
              <a-input
                v-model="filters.item_num"
                :placeholder="$t('module.functionItem.item_num')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="filters.item_pk"
                :placeholder="$t('module.functionItem.item_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="filters.mst_item_type_id"
                :placeholder="$t('module.mstItemType')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemTypes"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.functionItem.order')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.parent_item_pk')"
              prop="parent_item_pk"
            >
              <a-input
                v-model="filters.parent_item_pk"
                :placeholder="$t('module.functionItem.parent_item_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.project_id')"
              prop="project_id"
            >
              <a-select
                v-model="filters.project_id"
                :placeholder="$t('module.project')"
              >
                <a-select-option
                  v-for="(item, index) in projects"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionItem.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.functionItem.version_code')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.name }}
          </div>
        </template>
        <template
          slot="mst_item_type_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemType.name }}
          </div>
        </template>
        <template
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionItem') }}
      </template>

      <a-spin :spinning="loading">
        <functionItem-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import FunctionItemForm from '~/components/templates/functionItem/FunctionItemForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionItemForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionItem',
      visible: false,
      currentId: 0,
      filters: {
        use_flg: this.$route.query.use_flg || '',
        function_id: this.$route.query.function_id || '',
        item_num: this.$route.query.item_num || '',
        item_pk: this.$route.query.item_pk || '',
        mst_item_type_id: this.$route.query.mst_item_type_id || '',
        order: this.$route.query.order || '',
        parent_item_pk: this.$route.query.parent_item_pk || '',
        project_id: this.$route.query.project_id || '',
        version_code: this.$route.query.version_code || ''
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      mstItemTypes: [],
      projects: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.functionItem.use_flg'),
          dataIndex: 'use_flg',
          sorter: true
        },
        {
          title: this.$t('module.functionItem.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItem.item_num'),
          dataIndex: 'item_num',
          sorter: true
        },
        {
          title: this.$t('module.functionItem.item_pk'),
          dataIndex: 'item_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItem.mst_item_type_id'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItem.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.functionItem.parent_item_pk'),
          dataIndex: 'parent_item_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItem.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItem.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getFunctions()
    this.getMstItemTypes()
    this.getProjects()
  },

  methods: {
    /**
     * List Function.
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

    /**
     * List MstItemType.
     */
    async getMstItemTypes() {
      const { data: { result: { data } } } = await this.$api.mstItemType.list()
      this.mstItemTypes = data
    },

    /**
     * List Project.
     */
    async getProjects() {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
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

    /**
     * Close dialog.
     *
     * @param {boolean} fetch - fetch status.
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        use_flg: '',
        function_id: '',
        item_num: '',
        item_pk: '',
        mst_item_type_id: '',
        order: '',
        parent_item_pk: '',
        project_id: '',
        version_code: ''
      }
    },

    /**
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
    }
  }
}
</script>
