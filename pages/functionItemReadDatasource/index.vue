<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.functionItemReadDatasource') }}
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
              :label="$t('module.functionItemReadDatasource.project_id')"
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
              :label="$t('module.functionItemReadDatasource.function_id')"
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
              :label="$t('module.functionItemReadDatasource.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.functionItemReadDatasource.version_code')"
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
              :label="$t('module.functionItemReadDatasource.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="filters.item_pk"
                :placeholder="$t('module.functionItemReadDatasource.item_pk')"
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
              :label="$t('module.functionItemReadDatasource.function_item_read_datasource_pk')"
              prop="function_item_read_datasource_pk"
            >
              <a-input
                v-model="filters.function_item_read_datasource_pk"
                :placeholder="$t('module.functionItemReadDatasource.function_item_read_datasource_pk')"
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
              :label="$t('module.functionItemReadDatasource.api_id')"
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
              :label="$t('module.functionItemReadDatasource.api_version_code')"
              prop="api_version_code"
            >
              <a-input
                v-model="filters.api_version_code"
                :placeholder="$t('module.functionItemReadDatasource.api_version_code')"
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
              :label="$t('module.functionItemReadDatasource.api_response_pk')"
              prop="api_response_pk"
            >
              <a-input
                v-model="filters.api_response_pk"
                :placeholder="$t('module.functionItemReadDatasource.api_response_pk')"
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
              :label="$t('module.functionItemReadDatasource.api_response_datasource_pk')"
              prop="api_response_datasource_pk"
            >
              <a-input
                v-model="filters.api_response_datasource_pk"
                :placeholder="$t('module.functionItemReadDatasource.api_response_datasource_pk')"
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
              :label="$t('module.functionItemReadDatasource.description')"
              prop="description"
            >
              <a-input
                v-model="filters.description"
                :placeholder="$t('module.functionItemReadDatasource.description')"
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
              :label="$t('module.functionItemReadDatasource.description_jp')"
              prop="description_jp"
            >
              <a-input
                v-model="filters.description_jp"
                :placeholder="$t('module.functionItemReadDatasource.description_jp')"
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
              :label="$t('module.functionItemReadDatasource.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.functionItemReadDatasource.order')"
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
              :label="$t('module.functionItemReadDatasource.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.functionItemReadDatasource.use_flg')"
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
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
          </div>
        </template>
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionItemReadDatasource') }}
      </template>

      <a-spin :spinning="loading">
        <functionItemReadDatasource-form
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
import FunctionItemReadDatasourceForm from '~/components/templates/functionItemReadDatasource/FunctionItemReadDatasourceForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionItemReadDatasourceForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionItemReadDatasource',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        function_id: this.$route.query.function_id || '',
        version_code: this.$route.query.version_code || '',
        item_pk: this.$route.query.item_pk || '',
        function_item_read_datasource_pk: this.$route.query.function_item_read_datasource_pk || '',
        api_id: this.$route.query.api_id || '',
        api_version_code: this.$route.query.api_version_code || '',
        api_response_pk: this.$route.query.api_response_pk || '',
        api_response_datasource_pk: this.$route.query.api_response_datasource_pk || '',
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        order: this.$route.query.order || '',
        use_flg: this.$route.query.use_flg || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      functions: [],
      apis: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.functionItemReadDatasource.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.item_pk'),
          dataIndex: 'item_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.function_item_read_datasource_pk'),
          dataIndex: 'function_item_read_datasource_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.api_id'),
          dataIndex: 'api_id',
          scopedSlots: { customRender: 'api_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.api_version_code'),
          dataIndex: 'api_version_code',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.api_response_pk'),
          dataIndex: 'api_response_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.api_response_datasource_pk'),
          dataIndex: 'api_response_datasource_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.description'),
          dataIndex: 'description',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.description_jp'),
          dataIndex: 'description_jp',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.functionItemReadDatasource.use_flg'),
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
    this.getFunctions()
    this.getApis()
  },

  methods: {
    /**
     * List Project.
     */
    async getProjects() {
      const { data: { result: { data } } } = await this.$api.project.list()
      this.projects = data
    },

    /**
     * List Function.
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

    /**
     * List Api.
     */
    async getApis() {
      const { data: { result: { data } } } = await this.$api.api.list()
      this.apis = data
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
        function_id: '',
        version_code: '',
        item_pk: '',
        function_item_read_datasource_pk: '',
        api_id: '',
        api_version_code: '',
        api_response_pk: '',
        api_response_datasource_pk: '',
        description: '',
        description_jp: '',
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
