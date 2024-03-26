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
            v-if="model.id"
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.autoTestResult.auto_test_result_id')"
              prop="auto_test_result_id"
            >
              {{ model.auto_test_result_id }}
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.autoTestResult.test_result')"
              prop="test_result"
            >
              <a-input
                v-model="model.test_result"
                :placeholder="$t('module.autoTestResult.test_result')"
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
    resource: 'autoTestResult',
    project: {}
  }),

  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
        test_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.autoTestResult.test_result') }),
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
  },

  /**
     * List of methods.
     */
  methods: {
    /**
       * Get model
       *
       * @returns {Object}
       */
    getModel() {
      const model = {
        project_id: this.$store.state.project.id,
        auto_test_result_id: this.model.auto_test_result_id,
        test_result: this.model.test_result
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
    textarea {
      resize: none;
    }
  }

  </style>
