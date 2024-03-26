<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.versionFunction') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          title="Tạo mới"
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
              :label="$t('module.versionFunction.function_id')"
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
                  allow-clear
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
              :label="$t('module.versionFunction.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.versionFunction.version_code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.versionFunction.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.versionFunction.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.lock_flg')"
              prop="lock_flg"
            >
              <a-select
                v-model="filters.lock_flg"
                :placeholder="$t('module.versionFunction.lock_flg')"
              >
                <a-select-option
                  v-for="(item) in LOCL_FLG[$nuxt.$i18n.locale]"
                  :key="item.value"
                  allow-clear
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
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
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.name }}
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
          slot="lock_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in LOCL_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.lock_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            v-if="record.lock_flg === LOCK_FLG_VALUE.no"
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
            v-if="record.lock_flg === LOCK_FLG_VALUE.no"
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
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { LOCL_FLG, LOCK_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {

  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'versionFunction',
      visible: false,
      currentId: 0,
      filters: {
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        function_id: this.$route.query.function_id || undefined,
        lock_flg: this.$route.query.lock_flg || undefined,
        name: this.$route.query.name || '',
        name_jp: this.$route.query.name_jp || '',
        project_id: this.$route.query.project_id || '',
        version_code: this.$route.query.version_code || ''
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      projects: [],
      LOCL_FLG,
      LOCK_FLG_VALUE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.versionFunction.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.versionFunction.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },

        {
          title: this.$t('module.versionFunction.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.versionFunction.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.versionFunction.name_jp'),
          dataIndex: 'name_jp',
          sorter: true
        },
        {
          title: this.$t('module.versionFunction.lock_flg'),
          dataIndex: 'lock_flg',
          scopedSlots: { customRender: 'lock_flg' },
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
        description: '',
        description_jp: '',
        function_id: '',
        lock_flg: '',
        name: '',
        name_jp: '',
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
