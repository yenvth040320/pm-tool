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
              :label="$t('module.mstLifeCycle.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.mstLifeCycle.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycle.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.mstLifeCycle.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycle.et_percent')"
              prop="et_percent"
            >
              <a-input-number
                v-model="model.et_percent"
                :min="0"
                :max="100"
                :step="0.1"
                :placeholder="$t('module.mstLifeCycle.et_percent')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycle.wbs')"
              prop="wbs"
            >
              <a-input-number
                v-model="model.wbs"
                :min="0"
                :max="100"
                :step="1"
                :placeholder="$t('module.mstLifeCycle.wbs')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycle.type')"
              prop="type"
            >
              <a-select
                v-model="model.type"
                :placeholder="$t('module.mstLifeCycle.type')"
              >
                <a-select-option
                  v-for="(item) in MST_LIFECYCLE_TYPE"
                  :key="item.value"
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
              :label="$t('module.mstLifeCycle.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.mstLifeCycle.use_flg')"
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
import { USE_FLG, USE_FLG_VALUE, MST_LIFECYCLE_TYPE } from '~/constants'

export default {
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'mstLifeCycle',
    projects: [],
    USE_FLG,
    USE_FLG_VALUE,
    MST_LIFECYCLE_TYPE
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
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstLifeCycle.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstLifeCycle.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        et_percent: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.et_percent') }),
            trigger: ['change', 'blur']
          }
        ],
        wbs: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.wbs') }),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.type') }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycle.use_flg') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
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
        name: this.model.name,
        name_jp: this.model.name_jp,
        et_percent: this.model.et_percent,
        order: this.model.order,
        use_flg: this.model.use_flg,
        wbs: this.model.wbs,
        type: this.model.type,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
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
          project_id: this.$store.state.project.id
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
