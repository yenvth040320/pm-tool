<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 7 }"
    :wrapper-col="{ sm: 17 }"
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
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.version_code')"
              prop="version_code"
            >
              <span>{{ model.version_code }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.name')"
              prop="name"
            >
              <a-input
                v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                v-model="model.name"
                :placeholder="$t('module.versionFunction.name')"
              />
              <span v-else>{{ model.name }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                v-model="model.name_jp"
                :placeholder="$t('module.versionFunction.name_jp')"
              />
              <span v-else>{{ model.name_jp }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.versionFunction.description')"
              prop="description"
            >
              <a-textarea
                v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                v-model="model.description"
                :placeholder="$t('module.versionFunction.description')"
                :rows="5"
              />
              <span v-else>{{ model.description }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item

              :label="$t('module.versionFunction.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                v-model="model.description_jp"
                :placeholder="$t('module.versionFunction.description_jp')"
                :rows="5"
              />
              <span v-else>{{ model.description_jp }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          title="Cập nhật"
          class="min-w-100"
        >
          {{ $t('common.update') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'

export default {
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
    resource: 'versionFunction',
    LOCK_FLG_VALUE,
    USE_FLG_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.versionFunction.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.versionFunction.name_jp'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.version_code') }),
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
    this.getDetail()
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
        created_at: this.model.created_at,
        description: this.model.description,
        description_jp: this.model.description_jp,
        function_id: this.model.function_id,
        id: this.model.id,
        design_lock_flg: this.version.design_lock_flg,
        name: this.model.name,
        name_jp: this.model.name_jp,
        project_id: this.model.project_id,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code
      }

      return model
    },
    /**
     * Get item detail
     *
     */
    getDetail() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        let model = {}

        model = this.version

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
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.getDetail()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },
    /**
     * cancel update
     *
     */
    cancel() {
      this.getDetail()
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
