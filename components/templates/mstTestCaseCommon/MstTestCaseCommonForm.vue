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
              :label="$t('module.mstTestCaseCommon.mst_category_testcase_common_id')"
              prop="mst_category_testcase_common_id"
            >
              <a-select
                v-model="model.mst_category_testcase_common_id"
                :placeholder="$t('module.mstTestCaseCommon.mst_category_testcase_common_id')"
              >
                <a-select-option
                  v-for="(item, index) in mstCategoryTestcaseCommons"
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
              :label="$t('module.mstTestCaseCommon.format_content_check')"
              prop="format_content_check"
            >
              <a-textarea
                v-model="model.format_content_check"
                :placeholder="$t('module.mstTestCaseCommon.format_content_check')"
                :rows="4"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestCaseCommon.format_content_check_jp')"
              prop="format_content_check_jp"
            >
              <a-textarea
                v-model="model.format_content_check_jp"
                :placeholder="$t('module.mstTestCaseCommon.format_content_check_jp')"
                :rows="4"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestCaseCommon.format_expect_result')"
              prop="format_expect_result"
            >
              <a-textarea
                v-model="model.format_expect_result"
                :placeholder="$t('module.mstTestCaseCommon.format_expect_result')"
                :rows="4"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestCaseCommon.format_expect_result_jp')"
              prop="format_expect_result_jp"
            >
              <a-textarea
                v-model="model.format_expect_result_jp"
                :placeholder="$t('module.mstTestCaseCommon.format_expect_result_jp')"
                :rows="4"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestCaseCommon.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstTestCaseCommon.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestCaseCommon.status')"
              prop="status"
            >
              <a-select
                v-model="model.status"
                :placeholder="$t('module.mstTestCaseCommon.status')"
              >
                <a-select-option
                  v-for="(item, index) in TEST_CASE_STATUS[$nuxt.$i18n.locale]"
                  :key="index"
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
          class="min-w-100"
          title="Huỷ bỏ"
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
import { TEST_CASE_STATUS, TEST_CASE_STATUS_VALUE, SORT } from '~/constants'

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
    resource: 'mstTestCaseCommon',
    projects: [],
    mstCategoryTestcaseCommons: [],
    TEST_CASE_STATUS,
    TEST_CASE_STATUS_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestCaseCommon.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_category_testcase_common_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestCaseCommon.mst_category_testcase_common_id') }),
            trigger: ['change', 'blur']
          }
        ],
        format_content_check: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestCaseCommon.format_content_check') }),
            trigger: ['change', 'blur']
          }
        ],
        format_expect_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestCaseCommon.format_expect_result') }),
            trigger: ['change', 'blur']
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestCaseCommon.status') }),
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
    this.getMstCategoryTestcaseCommons()
  },

  /**
   * List of methods.
   */
  methods: {
    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
      if (!this.model.id) {
        this.model.status = TEST_CASE_STATUS_VALUE.use
      }
    },

    /**
     * List MstCategoryTestcaseCommon
     */
    async getMstCategoryTestcaseCommons() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_type: SORT.asc,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstCategoryTestCaseCommon.list({ params })
        this.mstCategoryTestcaseCommons = data
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
        id: this.model.id,
        project_id: this.model.project_id,
        mst_category_testcase_common_id: this.model.mst_category_testcase_common_id,
        format_content_check: this.model.format_content_check,
        format_content_check_jp: this.model.format_content_check_jp,
        format_expect_result: this.model.format_expect_result,
        format_expect_result_jp: this.model.format_expect_result_jp,
        order: this.model.order,
        status: this.model.status,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
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
