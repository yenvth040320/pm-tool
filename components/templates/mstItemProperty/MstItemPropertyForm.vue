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
              :label="$t('module.mstItemProperty.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.mstItemProperty.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemProperty.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.mstItemProperty.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemProperty.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.mstItemProperty.description')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemProperty.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.mstItemProperty.description_jp')"
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
                  :value="item.value"
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
              :label="$t('module.mstItemProperty.required')"
              prop="required"
            >
              <a-select
                v-model="model.required"
                :placeholder="$t('module.mstItemProperty.required')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIRED[$nuxt.$i18n.locale]"
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
              :label="$t('module.mstItemProperty.type_value')"
              prop="type_value"
            >
              <a-select
                v-model="model.type_value"
                :placeholder="$t('module.mstItemProperty.type_value')"
              >
                <a-select-option
                  v-for="(item, index) in TYPE_VALUE[$nuxt.$i18n.locale]"
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
              :label="$t('module.mstItemProperty.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstItemProperty.order')"
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
import { USE_FLG, REQUIRED, TYPE_VALUE, USE_FLG_VALUE, REQUIRED_VALUE, TYPE_VALUE_SELECT_DEFAULT } from '~/constants'

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
    resource: 'mstItemProperty',
    mstItemTypes: [],
    projects: [],
    USE_FLG,
    REQUIRED,
    TYPE_VALUE,
    USE_FLG_VALUE,
    REQUIRED_VALUE,
    TYPE_VALUE_SELECT_DEFAULT
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemProperty.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemProperty.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.mstItemProperty.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.mstItemProperty.name_jp'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemProperty.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        required: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemProperty.required') }),
            trigger: ['change', 'blur']
          }
        ],
        type_value: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemProperty.type_value') }),
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
  },

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
          type_value: TYPE_VALUE_SELECT_DEFAULT,
          use_flg: USE_FLG_VALUE.yes,
          required: REQUIRED_VALUE.no
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
     * List MstItemType
     */
    async getMstItemTypes() {
      try {
        const { data: { result: { data } } } = await this.$api.mstItemType.list()
        this.mstItemTypes = data
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
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        description: this.model.description,
        description_jp: this.model.description_jp,
        id: this.model.id,
        name: this.model.name,
        name_jp: this.model.name_jp,
        order: this.model.order,
        project_id: this.model.project_id,
        required: this.model.required,
        type_value: this.model.type_value,
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
