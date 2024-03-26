<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
    class="item-type-form"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.mstItemType.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.mstItemType.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.mstItemType.description')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.mstItemType.description_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.sample_code')"
              prop="sample_code"
            >
              <a-textarea
                v-model="model.sample_code"
                :placeholder="$t('module.mstItemType.sample_code')"
                auto-size
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.use_flg')"
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
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.default')"
              prop="default"
            >
              <a-select
                v-model="model.default"
                :placeholder="$t('module.mstItemType.default')"
              >
                <a-select-option
                  v-for="(item, index) in MST_ITEM_TYPE_DEFAULT"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.default_create_item')"
              prop="default_create_item"
            >
              <a-select
                v-model="model.default_create_item"
                :placeholder="$t('module.mstItemType.default_create_item')"
              >
                <a-select-option
                  v-for="(item, index) in MST_ITEM_TYPE_DEFAULT_CREATE_ITEM"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.default_item_name')"
              prop="default_item_name"
            >
              <a-input
                v-model="model.default_item_name"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="18"
            :xxl="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstItemType.order')"
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
import {
  USE_FLG,
  USE_FLG_VALUE,
  MST_ITEM_TYPE_DEFAULT,
  MST_ITEM_TYPE_DEFAULT_VALUE,
  MST_ITEM_TYPE_DEFAULT_CREATE_ITEM,
  MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_VALUE
} from '~/constants'

export default {
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'mstItemType',
    projects: [],
    USE_FLG,
    MST_ITEM_TYPE_DEFAULT,
    USE_FLG_VALUE,
    MST_ITEM_TYPE_DEFAULT_VALUE,
    MST_ITEM_TYPE_DEFAULT_CREATE_ITEM,
    MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        default: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemType.default') }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemType.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemType.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.mstItemType.name'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 150,
            message: this.$t('validation.max', { field: this.$t('module.mstItemType.name_jp'), max: 150 }),
            trigger: ['change', 'blur']
          }
        ],
        default_create_item: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstItemType.default_create_item') }),
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
    setModel(data) {
      this.model = data
      if (!this.model.id) {
        this.model.project_id = this.$store.state.project.id
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
          use_flg: USE_FLG_VALUE.yes,
          default: MST_ITEM_TYPE_DEFAULT_VALUE.no,
          default_create_item: MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_VALUE.no
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
        default: this.model.default,
        default_item_name: this.model.default_item_name,
        default_create_item: this.model.default_create_item,
        use_flg: this.model.use_flg,
        description: this.model.description,
        description_jp: this.model.description_jp,
        id: this.model.id,
        name: this.model.name,
        name_jp: this.model.name_jp,
        order: this.model.order,
        project_id: this.model.project_id,
        sample_code: this.model.sample_code
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
