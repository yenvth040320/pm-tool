<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.apiParameterDatasource') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
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
              :label="$t('module.apiParameterDatasource.project_id')"
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
              :label="$t('module.apiParameterDatasource.api_id')"
              prop="api_id"
            >
              <a-select
                v-model="filters.api_id"
                :placeholder="$t('module.api')"
              >
                <a-select-option
                  v-for="(item, index) in apis"
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
              :label="$t('module.apiParameterDatasource.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.apiParameterDatasource.version_code')"
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
              :label="$t('module.apiParameterDatasource.api_parameter_datasource_pk')"
              prop="api_parameter_datasource_pk"
            >
              <a-input
                v-model="filters.api_parameter_datasource_pk"
                :placeholder="$t('module.apiParameterDatasource.api_parameter_datasource_pk')"
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
              :label="$t('module.apiParameterDatasource.api_parameter_pk')"
              prop="api_parameter_pk"
            >
              <a-input
                v-model="filters.api_parameter_pk"
                :placeholder="$t('module.apiParameterDatasource.api_parameter_pk')"
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
              :label="$t('module.apiParameterDatasource.db_table_id')"
              prop="db_table_id"
            >
              <a-select
                v-model="filters.db_table_id"
                :placeholder="$t('module.dbTable')"
              >
                <a-select-option
                  v-for="(item, index) in dbTables"
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
              :label="$t('module.apiParameterDatasource.db_table_column_pk')"
              prop="db_table_column_pk"
            >
              <a-input
                v-model="filters.db_table_column_pk"
                :placeholder="$t('module.apiParameterDatasource.db_table_column_pk')"
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
              :label="$t('module.apiParameterDatasource.description')"
              prop="description"
            >
              <a-input
                v-model="filters.description"
                :placeholder="$t('module.apiParameterDatasource.description')"
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
              :label="$t('module.apiParameterDatasource.description_jp')"
              prop="description_jp"
            >
              <a-input
                v-model="filters.description_jp"
                :placeholder="$t('module.apiParameterDatasource.description_jp')"
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
              :label="$t('module.apiParameterDatasource.type_action')"
              prop="type_action"
            >
              <a-input
                v-model="filters.type_action"
                :placeholder="$t('module.apiParameterDatasource.type_action')"
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
              :label="$t('module.apiParameterDatasource.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.apiParameterDatasource.order')"
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
              :label="$t('module.apiParameterDatasource.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.apiParameterDatasource.use_flg')"
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
              title="Tìm kiếm"
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
              title="Xoá điều kiện tìm kiếm"
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
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
          </div>
        </template>
        <template
          slot="api_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.api.name }}
          </div>
        </template>
        <template
          slot="db_table_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.dbTable.name }}
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
            title="Chỉnh sửa"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Chi tiết"
            :disabled="loading"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            title="Xoá"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.apiParameterDatasource') }}
      </template>

      <a-spin :spinning="loading">
        <apiParameterDatasource-form
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
import ApiParameterDatasourceForm from '~/components/templates/apiParameterDatasource/ApiParameterDatasourceForm'

export default {
  /**
   * Declare components.
   */
  components: {
    ApiParameterDatasourceForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'apiParameterDatasource',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        api_id: this.$route.query.api_id || '',
        version_code: this.$route.query.version_code || '',
        api_parameter_datasource_pk: this.$route.query.api_parameter_datasource_pk || '',
        api_parameter_pk: this.$route.query.api_parameter_pk || '',
        db_table_id: this.$route.query.db_table_id || '',
        db_table_column_pk: this.$route.query.db_table_column_pk || '',
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        type_action: this.$route.query.type_action || '',
        order: this.$route.query.order || '',
        use_flg: this.$route.query.use_flg || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      apis: [],
      dbTables: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.apiParameterDatasource.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.api_id'),
          dataIndex: 'api_id',
          scopedSlots: { customRender: 'api_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.api_parameter_datasource_pk'),
          dataIndex: 'api_parameter_datasource_pk',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.api_parameter_pk'),
          dataIndex: 'api_parameter_pk',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.db_table_id'),
          dataIndex: 'db_table_id',
          scopedSlots: { customRender: 'db_table_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.db_table_column_pk'),
          dataIndex: 'db_table_column_pk',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.description'),
          dataIndex: 'description',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.description_jp'),
          dataIndex: 'description_jp',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.type_action'),
          dataIndex: 'type_action',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.apiParameterDatasource.use_flg'),
          dataIndex: 'use_flg',
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
    this.getProjects()
    this.getApis()
    this.getDbTables()
  },

  methods: {
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
     * List Api.
     */
    async getApis() {
      const { data: { result: { data } } } = await this.$api.api.list()
      this.apis = data
    },

    /**
     * List DbTable.
     */
    async getDbTables() {
      const { data: { result: { data } } } = await this.$api.dbTable.list()
      this.dbTables = data
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
        project_id: '',
        api_id: '',
        version_code: '',
        api_parameter_datasource_pk: '',
        api_parameter_pk: '',
        db_table_id: '',
        db_table_column_pk: '',
        description: '',
        description_jp: '',
        type_action: '',
        order: '',
        use_flg: ''
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
