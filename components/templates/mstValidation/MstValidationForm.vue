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
              :label="$t('module.mstValidation.mst_item_type_id')"
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
              :label="$t('module.mstValidation.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="model.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemPropertys"
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
              :label="$t('module.mstValidation.format_content_check')"
              prop="format_content_check"
            >
              <a-textarea
                v-model="model.format_content_check"
                :placeholder="$t('module.mstValidation.format_content_check')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_content_check_jp')"
              prop="format_content_check_jp"
            >
              <a-textarea
                v-model="model.format_content_check_jp"
                :placeholder="$t('module.mstValidation.format_content_check_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_expect_result')"
              prop="format_expect_result"
            >
              <a-textarea
                v-model="model.format_expect_result"
                :placeholder="$t('module.mstValidation.format_expect_result')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_expect_result_jp')"
              prop="format_expect_result_jp"
            >
              <a-textarea
                v-model="model.format_expect_result_jp"
                :placeholder="$t('module.mstValidation.format_expect_result_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemProperty.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.mstItemType.use_flg')"
              >
                <a-select-option
                  v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
                  :key="index"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstValidation.order')"
              />
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
import { USE_FLG, USE_FLG_VALUE } from '~/constants'

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
    resource: 'mstValidation',
    mstItemPropertys: [],
    mstItemTypes: [],
    projects: [],
    USE_FLG
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        format_content_check: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstValidation.format_content_check') }),
            trigger: ['change', 'blur']
          }
        ],
        format_expect_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstValidation.format_expect_result') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_item_type_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstValidation.mst_item_type_id') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstValidation.project_id') }),
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
    this.getMstItemPropertys()
    this.getMstItemTypes()
    this.getProjects()
  },

  /**
   * List of methods.
   */
  methods: {
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
          use_flg: USE_FLG_VALUE.yes
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
     * List MstItemProperty
     */
    async getMstItemPropertys() {
      const { data: { result: { data } } } = await this.$api.mstItemProperty.list()
      this.mstItemPropertys = data
    },

    /**
     * List MstItemType
     */
    async getMstItemTypes() {
      const { data: { result: { data } } } = await this.$api.mstItemType.list()
      this.mstItemTypes = data
    },

    /**
     * List Project
     */
    async getProjects() {
      const params = {
        id: this.$store.state.project.id,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        format_content_check: this.model.format_content_check,
        format_content_check_jp: this.model.format_content_check_jp,
        format_expect_result: this.model.format_expect_result,
        format_expect_result_jp: this.model.format_expect_result_jp,
        id: this.model.id,
        mst_item_property_id: this.model.mst_item_property_id,
        mst_item_type_id: this.model.mst_item_type_id,
        order: this.model.order,
        project_id: this.model.project_id,
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
}
.ant-row-flex {
  flex-flow: column;
  align-items: center;
}
</style>
