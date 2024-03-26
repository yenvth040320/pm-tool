<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.apiParameter') }}
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
              :label="$t('module.apiParameter.project_id')"
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
              :label="$t('module.apiParameter.api_id')"
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
              :label="$t('module.apiParameter.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.apiParameter.version_code')"
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
              :label="$t('module.apiParameter.api_parameter_pk')"
              prop="api_parameter_pk"
            >
              <a-input
                v-model="filters.api_parameter_pk"
                :placeholder="$t('module.apiParameter.api_parameter_pk')"
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
              :label="$t('module.apiParameter.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.apiParameter.name')"
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
              :label="$t('module.apiParameter.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.apiParameter.name_jp')"
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
              :label="$t('module.apiParameter.parent_api_parameter_pk')"
              prop="parent_api_parameter_pk"
            >
              <a-input
                v-model="filters.parent_api_parameter_pk"
                :placeholder="$t('module.apiParameter.parent_api_parameter_pk')"
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
              :label="$t('module.apiParameter.description')"
              prop="description"
            >
              <a-input
                v-model="filters.description"
                :placeholder="$t('module.apiParameter.description')"
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
              :label="$t('module.apiParameter.description_jp')"
              prop="description_jp"
            >
              <a-input
                v-model="filters.description_jp"
                :placeholder="$t('module.apiParameter.description_jp')"
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
              :label="$t('module.apiParameter.data_type')"
              prop="data_type"
            >
              <a-input
                v-model="filters.data_type"
                :placeholder="$t('module.apiParameter.data_type')"
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
              :label="$t('module.apiParameter.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.apiParameter.order')"
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
              :label="$t('module.apiParameter.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.apiParameter.use_flg')"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.apiParameter') }}
      </template>

      <a-spin :spinning="loading">
        <apiParameter-form
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
import ApiParameterForm from '~/components/templates/apiParameter/ApiParameterForm'

export default {
  /**
   * Declare components.
   */
  components: {
    ApiParameterForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'apiParameter',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        api_id: this.$route.query.api_id || '',
        version_code: this.$route.query.version_code || '',
        api_parameter_pk: this.$route.query.api_parameter_pk || '',
        name: this.$route.query.name || '',
        name_jp: this.$route.query.name_jp || '',
        parent_api_parameter_pk: this.$route.query.parent_api_parameter_pk || '',
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        data_type: this.$route.query.data_type || '',
        order: this.$route.query.order || '',
        use_flg: this.$route.query.use_flg || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
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
          title: this.$t('module.apiParameter.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.api_id'),
          dataIndex: 'api_id',
          scopedSlots: { customRender: 'api_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.api_parameter_pk'),
          dataIndex: 'api_parameter_pk',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.name_jp'),
          dataIndex: 'name_jp',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.parent_api_parameter_pk'),
          dataIndex: 'parent_api_parameter_pk',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.description'),
          dataIndex: 'description',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.description_jp'),
          dataIndex: 'description_jp',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.data_type'),
          dataIndex: 'data_type',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.apiParameter.use_flg'),
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
        api_parameter_pk: '',
        name: '',
        name_jp: '',
        parent_api_parameter_pk: '',
        description: '',
        description_jp: '',
        data_type: '',
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
