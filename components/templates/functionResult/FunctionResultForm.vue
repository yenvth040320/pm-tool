<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="model.function_id"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.function')"
                @change="handleFunctionChange"
              >
                <a-select-option
                  v-for="(item, index) in functions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.code }}: {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.version_code')"
              prop="version_code"
            >
              <a-select
                v-model="model.version_code"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.functionResult.version_code')"
              >
                <a-select-option
                  v-for="(item, index) in filteredVersions"
                  :key="index"
                  :value="item.version_code"
                >
                  {{ item.version_code }}: {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.mst_evn_test_case_id')"
              prop="mst_evn_test_case_id"
            >
              <a-select
                v-model="model.mst_evn_test_case_id"
                :placeholder="$t('module.mstEvnTestCase')"
              >
                <a-select-option
                  v-for="(item, index) in mstEvnTestCases"
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
              :label="$t('module.functionResult.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.functionResult.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.branch')"
              prop="branch"
            >
              <a-input
                v-model="model.branch"
                :placeholder="$t('module.functionResult.branch')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.browser')"
              prop="browser"
            >
              <a-input
                v-model="model.browser"
                :placeholder="$t('module.functionResult.browser')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.description')"
              prop="description"
            >
              <a-input
                v-model="model.description"
                :placeholder="$t('module.functionResult.description')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.link_test')"
              prop="link_test"
            >
              <a-input
                v-model="model.link_test"
                :placeholder="$t('module.functionResult.link_test')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.os_version')"
              prop="os_version"
            >
              <a-input
                v-model="model.os_version"
                :placeholder="$t('module.functionResult.os_version')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.functionResult.use_flg')"
              >
                <a-select-option
                  v-for="(item) in USE_FLG[$nuxt.$i18n.locale]"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          :title="id ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          title="Huỷ bỏ"
          class="min-w-100"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { SORT, USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  mixins: [DataForm],

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
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
  data: () => ({
    resource: 'functionResult',
    functions: [],
    mstEvnTestCases: [],
    projects: [],
    USE_FLG,
    USE_FLG_VALUE,
    filteredVersions: [],
    versions: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.name') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_evn_test_case_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.mst_evn_test_case_id') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResult.version_code') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  created() {
    this.getFunctions()
    this.getMstEvnTestCases()
    this.getVersions()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get version follow function
     */
    handleFunctionChange() {
      this.filteredVersions = this.versions.filter(version => version.function_id === this.model.function_id && version.project_id === this.model.project_id)
      if (this.filteredVersions.length > 0) {
        this.$set(this.model, 'version_code', this.filteredVersions[0].version_code)
      }
    },
    /**
     * List Function
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionList({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List version
     */
    async getVersions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_by: 'id',
          order_type: SORT.desc
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionVersionList({ params })
        this.versions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstEvnTestCase
     */
    async getMstEvnTestCases() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstEvnTestCase.list({ params })
        this.mstEvnTestCases = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
      if (!this.model.id) {
        this.$set(this.model, 'use_flg', USE_FLG_VALUE.yes)
      }
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        branch: this.model.branch,
        browser: this.model.browser,
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        name: this.model.name,
        description: this.model.description,
        function_id: this.model.function_id,
        id: this.model.id,
        link_test: this.model.link_test,
        mst_evn_test_case_id: this.model.mst_evn_test_case_id,
        order: this.model.order,
        os_version: this.model.os_version,
        project_id: this.model.project_id,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code ? this.model.version_code : undefined
      }

      return model
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
}
</style>
