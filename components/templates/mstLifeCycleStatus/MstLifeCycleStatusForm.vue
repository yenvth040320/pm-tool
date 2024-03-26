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
              :label="$t('module.mstLifeCycleStatus.project_id')"
              prop="project_id"
            >
              <a-select
                v-model="model.project_id"
                :placeholder="$t('module.project')"
              >
                <a-select-option
                  v-for="(item, index) in projects"
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
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.mst_life_cycle_id')"
              prop="mst_life_cycle_id"
            >
              <a-select
                v-model="model.mst_life_cycle_id"
                :placeholder="$t('module.mstLifeCycle')"
              >
                <a-select-option
                  v-for="(item, index) in mstLifeCycles"
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
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.mstLifeCycleStatus.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.mstLifeCycleStatus.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.closed')"
              prop="closed"
            >
              <a-select
                v-model="model.closed"
                :placeholder="$t('module.mstLifeCycleStatus.closed')"
              >
                <a-select-option
                  v-for="(item, index) in LIFE_CYCLE_STATUS_CLOSED"
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
              :label="$t('module.mstLifeCycleStatus.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.mstLifeCycleStatus.use_flg')"
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
              :label="$t('module.mstLifeCycleStatus.default')"
              prop="default"
            >
              <a-select
                v-model="model.default"
                :placeholder="$t('module.mstLifeCycleStatus.default')"
              >
                <a-select-option
                  v-for="(item, index) in LIFE_CYCLE_STATUS_DEFAULT"
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
              :label="$t('module.mstLifeCycleStatus.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.mstLifeCycleStatus.description')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.mstLifeCycleStatus.description_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.mstLifeCycleStatus.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.color')"
              prop="color"
            >
              <a-input
                v-model="model.color"
                :placeholder="$t('module.mstLifeCycleStatus.color')"
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
import {
  LIFE_CYCLE_STATUS_CLOSED,
  LIFE_CYCLE_STATUS_CLOSED_VALUE,
  LIFE_CYCLE_STATUS_DEFAULT,
  LIFE_CYCLE_STATUS_DEFAULT_VALUE,
  USE_FLG,
  USE_FLG_VALUE
} from '~/constants'

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
    resource: 'mstLifeCycleStatus',
    projects: [],
    mstLifeCycles: [],
    LIFE_CYCLE_STATUS_CLOSED,
    LIFE_CYCLE_STATUS_CLOSED_VALUE,
    LIFE_CYCLE_STATUS_DEFAULT,
    LIFE_CYCLE_STATUS_DEFAULT_VALUE,
    USE_FLG
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
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_life_cycle_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.mst_life_cycle_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstLifeCycleStatus.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstLifeCycleStatus.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        closed: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.closed') }),
            trigger: ['change', 'blur']
          }
        ],
        color: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstLifeCycleStatus.color'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        default: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstLifeCycleStatus.default') }),
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
    this.getProjects()
    this.getMstLifeCycles()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Project
     */
    async getProjects() {
      try {
        const params = {
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.project.list({ params })
        this.projects = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstLifeCycle
     */
    async getMstLifeCycles() {
      try {
        const params = {
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
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
        id: this.model.id,
        project_id: this.model.project_id,
        mst_life_cycle_id: this.model.mst_life_cycle_id,
        name: this.model.name,
        name_jp: this.model.name_jp,
        description: this.model.description,
        description_jp: this.model.description_jp,
        closed: this.model.closed,
        order: this.model.order,
        color: this.model.color,
        use_flg: this.model.use_flg,
        default: this.model.default,
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
