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
              :label="$t('module.apiCategory.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.apiCategory.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.apiCategory.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.apiCategory.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.apiCategory.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.apiCategory.description')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.apiCategory.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.apiCategory.description_jp')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.apiCategory.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.apiCategory.use_flg')"
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
    resource: 'apiCategory',
    USE_FLG,
    USE_FLG_VALUE
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
            message: this.$t('validation.required', { field: this.$t('module.apiCategory.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiCategory.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiCategory.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  /**
   * List of methods.
   */
  methods: {
    /**
     * Set model
     *
     * @param {Object} data
     */
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
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        name: this.model.name,
        name_jp: this.model.name_jp,
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
