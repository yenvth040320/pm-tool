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
              :label="$t('module.testSession.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.testSession.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.function_id')"
              prop="function_ids"
            >
              <a-select
                v-model="model.function_ids"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.function')"
                mode="multiple"
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
            v-if="testSessions.length > 0 && !model.id"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.copy_test_result')"
              prop="is_copy"
            >
              <a-radio-group v-model="model.is_copy" @change="(e) => handleIsCopyChange(e)">
                <a-radio
                  v-for="(item, index) in COPY_TEST_RESULT"
                  :key="index"
                  :style="radioStyle"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            v-if="testSessions.length > 0 && model.is_copy === COPY_TEST_RESULT_VALUE.yes && !model.id"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              prop="test_session_copy"
            >
              <template #label>
                <span v-if="model.is_copy === COPY_TEST_RESULT_VALUE.yes" class="text-required">{{ $t('module.testSession.name_copy') }}</span>
                <span v-else>{{ $t('module.testSession.name_copy') }}</span>
              </template>
              <a-select
                v-model="model.test_session_copy"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.testSession.name_copy')"
              >
                <a-select-option
                  v-for="(item, index) in testSessions"
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
              :label="$t('module.testSession.mst_evn_test_case_id')"
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
              :label="$t('module.testSession.branch')"
              prop="branch"
            >
              <a-input
                v-model="model.branch"
                :placeholder="$t('module.testSession.branch')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.browser')"
              prop="browser"
            >
              <a-input
                v-model="model.browser"
                :placeholder="$t('module.testSession.browser')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.description')"
              prop="description"
            >
              <a-input
                v-model="model.description"
                :placeholder="$t('module.testSession.description')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.link_test')"
              prop="link_test"
            >
              <a-input
                v-model="model.link_test"
                :placeholder="$t('module.testSession.link_test')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.os_version')"
              prop="os_version"
            >
              <a-input
                v-model="model.os_version"
                :placeholder="$t('module.testSession.os_version')"
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
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
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
import { COPY_TEST_RESULT, COPY_TEST_RESULT_VALUE } from '~/constants'

export default {
  /**
   * Declare mixins.
   */
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
    resource: 'testSession',
    mstEvnTestCases: [],
    functions: [],
    projects: [],
    testSessions: [],
    versions: [],
    COPY_TEST_RESULT,
    COPY_TEST_RESULT_VALUE,
    radioStyle: {
      height: '30px',
      lineHeight: '30px'
    }
  }),

  /**
   * Computed event.
   */
  computed: {
    /**
     * Rules validate when submit form.
     */
    formRules() {
      return {
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.testSession.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_evn_test_case_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.testSession.mst_evn_test_case_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.testSession.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.testSession.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        function_ids: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.testSession.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        is_copy: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.testSession.copy_test_result') }),
            trigger: ['change', 'blur']
          }
        ],
        test_session_copy: [
          {
            validator: (rule, value, callback) => {
              if (this.model.is_copy === COPY_TEST_RESULT_VALUE.yes) {
                if (!value) {
                  callback(new Error(this.$t('validation.required', { field: this.$t('module.testSession.name_copy') })))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getFunctions()
    this.getMstEvnTestCases()
    this.getTestSessions()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
    * List test session
     */
    async getTestSessions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.testSession.list({ params })
        this.testSessions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        let model = {}
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
          model.function_ids = data.functionResults.map(result => result.function_id)
        }
        this.setModel(model)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
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
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        project_id: this.model.project_id,
        function_ids: this.model.function_ids,
        mst_evn_test_case_id: this.model.mst_evn_test_case_id,
        name: this.model.name,
        description: this.model.description,
        browser: this.model.browser,
        branch: this.model.branch,
        link_test: this.model.link_test,
        os_version: this.model.os_version,
        order: this.model.order,
        use_flg: this.model.use_flg,
        is_copy: this.model.is_copy,
        test_session_copy: this.model.test_session_copy
      }

      return model
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
        this.$set(this.model, 'is_copy', COPY_TEST_RESULT_VALUE.yes)
      }
    },

    handleIsCopyChange(e) {
      console.log(e)
      if (e.target.value === COPY_TEST_RESULT_VALUE.no) {
        this.model.test_session_copy = undefined
      }
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
.text-required::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  margin-right: 5px;
  content: '*';
}
</style>
