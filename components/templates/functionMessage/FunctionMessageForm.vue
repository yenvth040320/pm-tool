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
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionMessage.message_code')"
              prop="message_code"
            >
              <a-input
                v-model="model.message_code"
                :placeholder="$t('module.functionMessage.message_code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionMessage.content_vi')"
              prop="content_vi"
            >
              <a-textarea
                v-model="model.content_vi"
                :rows="6"
                :placeholder="$t('module.functionMessage.content_vi')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionMessage.content_jp')"
              prop="content_jp"
            >
              <a-textarea
                v-model="model.content_jp"
                :rows="6"
                :placeholder="$t('module.functionMessage.content_jp')"
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

export default {
  /**
   * Declare mixins.
   */
  mixins: [DataForm],
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

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
    resource: 'functionMessage',
    projects: [],
    functions: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        content_vi: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionMessage.content_vi') }),
            trigger: ['change', 'blur']
          }
        ],
        content_jp: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionMessage.content_jp') }),
            trigger: ['change', 'blur']
          }
        ],
        message_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionMessage.message_code') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.functionMessage.message_code'), max: 255 }),
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
        id: this.model.id,
        project_id: this.model.project_id,
        function_id: this.model.function_id,
        version_code: this.model.version_code,
        message_code: this.model.message_code,
        content_vi: this.model.content_vi,
        content_jp: this.model.content_jp
      }

      return model
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            data.function_id = this.version.function_id
            data.version_code = this.version.version_code
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            if (!this.model.id) {
              this.model = {}
            }

            this.$emit('save')
          } catch (_) {
            if (_.response.data.errors && _.response.data.errors.message_code) {
              this.$notification.error({
                message: this.$t('validation.message_code_unique')
              })
            } else {
              this.$notification.error({
                message: this.$t('text.something_wrong')
              })
            }
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
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
</style>
