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
              :label="$t('module.mstTestcaseValidation.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.mstTestcaseValidation.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="model.mst_item_type_id"
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
              :label="$t('module.mstTestcaseValidation.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="model.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemProperties"
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
              :label="$t('module.mstTestcaseValidation.format_content_check')"
              prop="format_content_check"
            >
              <a-textarea
                v-model="model.format_content_check"
                :placeholder="$t('module.mstTestcaseValidation.format_content_check')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.format_content_check_jp')"
              prop="format_content_check_jp"
            >
              <a-textarea
                v-model="model.format_content_check_jp"
                :placeholder="$t('module.mstTestcaseValidation.format_content_check_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.format_expect_result')"
              prop="format_expect_result"
            >
              <a-textarea
                v-model="model.format_expect_result"
                :placeholder="$t('module.mstTestcaseValidation.format_expect_result')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.format_expect_result_jp')"
              prop="format_expect_result_jp"
            >
              <a-textarea
                v-model="model.format_expect_result_jp"
                :placeholder="$t('module.mstTestcaseValidation.format_expect_result_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstTestcaseValidation.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.status')"
              prop="status"
            >
              <a-select
                v-model="model.status"
                :placeholder="$t('module.mstTestcaseValidation.status')"
              >
                <a-select-option
                  v-for="(item, index) in MST_TEST_CASE_VALIDATION_STATUS[$nuxt.$i18n.locale]"
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
import { MST_TEST_CASE_VALIDATION_STATUS, MST_TEST_CASE_VALIDATION_STATUS_VALUE, SORT, USE_FLG_VALUE } from '~/constants'

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
    resource: 'mstTestcaseValidation',
    projects: [],
    mstItemTypes: [],
    mstItemProperties: [],
    MST_TEST_CASE_VALIDATION_STATUS,
    MST_TEST_CASE_VALIDATION_STATUS_VALUE,
    SORT
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
            message: this.$t('validation.required', { field: this.$t('module.mstTestcaseValidation.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstTestcaseValidation.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        format_content_check: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestcaseValidation.format_content_check') }),
            trigger: ['change', 'blur']
          }
        ],
        format_expect_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestcaseValidation.format_expect_result') }),
            trigger: ['change', 'blur']
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstTestcaseValidation.status') }),
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
    this.getMstItemTypes()
    this.getMstItemPropertys()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List MstItemType
     */
    async getMstItemTypes() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          use_flg: USE_FLG_VALUE.yes,
          order_type: SORT.asc,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstItemType.list({ params })
        this.mstItemTypes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstItemProperty
     */
    async getMstItemPropertys() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_type: SORT.asc,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstItemProperty.list({ params })
        this.mstItemProperties = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
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
        let model = {
          status: MST_TEST_CASE_VALIDATION_STATUS_VALUE.use
        }
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
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
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        name: this.model.name,
        mst_item_type_id: this.model.mst_item_type_id,
        mst_item_property_id: this.model.mst_item_property_id,
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
