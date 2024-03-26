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
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.schemes')"
              prop="schemes"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.schemes"
                :placeholder="$t('module.apiInfo.schemes')"
              />
              <span v-else>{{ model.schemes }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.host')"
              prop="host"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.host"
                :placeholder="$t('module.apiInfo.host')"
              />
              <span v-else>{{ model.host }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.base_path')"
              prop="base_path"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.base_path"
                :placeholder="$t('module.apiInfo.base_path')"
              />
              <span v-else>{{ model.base_path }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.paths')"
              prop="paths"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.paths"
                :placeholder="$t('module.apiInfo.paths')"
              />
              <span v-else>{{ model.paths }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.operation')"
              prop="operation"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.operation"
                :placeholder="$t('module.apiInfo.operation')"
              />
              <span v-else>{{ model.operation }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.description')"
              prop="description"
            >
              <a-textarea
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.description"
                :placeholder="$t('module.apiInfo.description')"
              />
              <span v-else>{{ model.description }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
            :xxl="18"
          >
            <a-form-model-item
              :label="$t('module.apiInfo.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.description_jp"
                :placeholder="$t('module.apiInfo.description_jp')"
              />
              <span v-else>{{ model.description_jp }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          v-if="version.lock_flg === LOCK_FLG_VALUE.no"
          html-type="submit"
          type="primary"
          :title="model.id ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ model.id ? $t('common.update') : $t('common.create') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import { mapState } from 'vuex'
import { USE_FLG, USE_FLG_VALUE, LOCK_FLG_VALUE } from '~/constants'

export default {

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'apiInfo',
    projects: [],
    apis: [],
    USE_FLG,
    USE_FLG_VALUE,
    LOCK_FLG_VALUE,
    model: {}
  }),

  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        schemes: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiInfo.schemes') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiInfo.schemes'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        host: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiInfo.host') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiInfo.host'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        base_path: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiInfo.base_path') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiInfo.base_path'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        paths: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiInfo.paths') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiInfo.paths'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        operation: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiInfo.operation'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    ...mapState({
      loading: 'loading'
    }),

    repository() {
      return this.$api[this.resource]
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
    async getDetail() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        let model = {}
        const params = {
          project_id: this.$store.state.project.id,
          api_id: this.version.api_id,
          version_code: this.version.version_code,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.repository.list({ params })
        if (data.length > 0) {
          model = data[0]
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
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
      this.model.api_id = this.version.api_id
      this.model.version_code = this.version.version_code
      if (!this.model.id) {
        this.model.use_flg = USE_FLG_VALUE.yes
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
        api_id: this.model.api_id,
        version_code: this.model.version_code,
        api_info_pk: this.model.api_info_pk,
        schemes: this.model.schemes,
        host: this.model.host,
        base_path: this.model.base_path,
        paths: this.model.paths,
        operation: this.model.operation,
        description: this.model.description,
        description_jp: this.model.description_jp,
        order: this.model.order,
        use_flg: this.model.use_flg,
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
