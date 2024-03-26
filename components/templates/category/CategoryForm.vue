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
              :label="$t('module.category.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.category.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.category.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.category.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.category.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :rows="5"
                :placeholder="$t('module.category.description')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.category.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :rows="5"
                :placeholder="$t('module.category.description_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.category.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.category.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.category.use_flg')"
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
import { USE_FLG, USE_FLG_VALUE } from '~/constants'

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
    resource: 'category',
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
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.category.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.category.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.category.name_jp'), max: 150 }),
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
    this.getDetailProject()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Project detail.
     */
    async getDetailProject() {
      try {
        if (this.$store.state.project.id !== 0) {
          const { data: { result: { data } } } = await this.$api.project.show(this.$store.state.project.id)
          this.project = data
        }
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
      if (!this.model.id) {
        this.model.use_flg = USE_FLG_VALUE.yes
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
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        description: this.model.description,
        description_jp: this.model.description_jp,
        id: this.model.id,
        name: this.model.name,
        name_jp: this.model.name_jp,
        order: this.model.order,
        project_id: this.$store.state.project.id,
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
  textarea {
    resize: none;
  }
}

</style>
