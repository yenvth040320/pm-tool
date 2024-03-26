<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.apiInfo') }}
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
              :label="$t('module.apiInfo.project_id')"
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
              :label="$t('module.apiInfo.api_id')"
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
              :label="$t('module.apiInfo.schemes')"
              prop="schemes"
            >
              <a-input
                v-model="filters.schemes"
                :placeholder="$t('module.apiInfo.schemes')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.host')"
              prop="host"
            >
              <a-input
                v-model="filters.host"
                :placeholder="$t('module.apiInfo.host')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.base_path')"
              prop="base_path"
            >
              <a-input
                v-model="filters.base_path"
                :placeholder="$t('module.apiInfo.base_path')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.paths')"
              prop="paths"
            >
              <a-input
                v-model="filters.paths"
                :placeholder="$t('module.apiInfo.paths')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.operation')"
              prop="operation"
            >
              <a-input
                v-model="filters.operation"
                :placeholder="$t('module.apiInfo.operation')"
              />
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
          slot="use_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            title="Chỉnh sửa"
            size="small"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.apiInfo') }}
      </template>

      <a-spin :spinning="loading">
        <apiInfo-form
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
import ApiInfoForm from '~/components/templates/apiInfo/ApiInfoForm'
import { USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    ApiInfoForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'apiInfo',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || undefined,
        api_id: this.$route.query.api_id || undefined,
        version_code: this.$route.query.version_code || undefined,
        schemes: this.$route.query.schemes || '',
        host: this.$route.query.host || '',
        base_path: this.$route.query.base_path || '',
        paths: this.$route.query.paths || '',
        operation: this.$route.query.operation || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      apis: [],
      USE_FLG,
      USE_FLG_VALUE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.apiInfo.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.api_id'),
          dataIndex: 'api_id',
          scopedSlots: { customRender: 'api_id' },
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.schemes'),
          dataIndex: 'schemes',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.host'),
          dataIndex: 'host',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.base_path'),
          dataIndex: 'base_path',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.paths'),
          dataIndex: 'paths',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.operation'),
          dataIndex: 'operation',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.use_flg'),
          dataIndex: 'use_flg',
          scopedSlots: { customRender: 'use_flg' },
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
        schemes: '',
        host: '',
        base_path: '',
        paths: '',
        operation: ''
      }
      this.search()
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
