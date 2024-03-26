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
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.code')"
              prop="code"
            >
              <a-input
                v-model="model.code"
                :placeholder="$t('module.function.code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.category_id')"
              prop="category_id"
            >
              <a-select
                v-model="model.category_id"
                :placeholder="$t('module.category')"
              >
                <a-select-option
                  v-for="(item, index) in categories"
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
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.short_name')"
              prop="short_name"
            >
              <a-input
                v-model="model.short_name"
                :placeholder="$t('module.function.short_name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.function.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.function.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :rows="5"
                :placeholder="$t('module.function.description')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :rows="5"
                :placeholder="$t('module.function.description_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.figma_link')"
              prop="figma_link"
            >
              <a-input
                v-model="model.figma_link"
                :placeholder="$t('module.function.figma_link')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.function.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.function.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.category.use_flg')"
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
    resource: 'function',
    categories: [],
    project: {},
    USE_FLG,
    USE_FLG_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.function.code') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.function.code'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        figma_link: [
          {
            max: 500,
            message: this.$t('validation.max', { field: this.$t('module.function.figma_link'), max: 500 }),
            trigger: ['change', 'blur']
          }
        ],
        category_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.function.category_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.function.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.function.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.function.name_jp'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        short_name: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.function.short_name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  created() {
    this.getCategories()
  },

  mounted() {},

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get categories
     */
    async getCategories() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.category.list({ params })
        this.categories = data
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
          use_flg: USE_FLG_VALUE.yes,
          category_id: this.$store.state.category.id !== 0 ? this.$store.state.category.id : undefined
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
        category_id: this.model.category_id,
        code: this.model.code,
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        description: this.model.description,
        description_jp: this.model.description_jp,
        figma_link: this.model.figma_link,
        id: this.model.id,
        latest_version: this.model.latest_version,
        name: this.model.name,
        name_jp: this.model.name_jp,
        short_name: this.model.short_name,
        order: this.model.order,
        project_id: this.$store.state.project.id,
        updated_at: this.model.updated_at
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
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
          } catch (_) {
            if (_.response.data.errors && _.response.data.errors.code) {
              this.$notification.error({
                message: this.$t('validation.code_unique')
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
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  textarea {
    resize: none;
  }
}
</style>
