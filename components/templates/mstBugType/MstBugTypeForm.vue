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
              :label="$t('module.mstBugType.name')"
              prop="name"
            >
              <a-input
                id="mstBugType_name"
                v-model="model.name"
                :placeholder="$t('module.mstBugType.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstBugType.name_jp')"
              prop="name_jp"
            >
              <a-input
                id="mstBugType_name_jp"
                v-model="model.name_jp"
                :placeholder="$t('module.mstBugType.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstBugType.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.mstBugType.description')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstBugType.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.mstBugType.description_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstBugType.status')"
              prop="status"
            >
              <a-select
                v-model="model.status"
                :placeholder="$t('module.mstBugType.status')"
              >
                <a-select-option
                  v-for="(item, index) in BUG_TYPE_STATUS[$nuxt.$i18n.locale]"
                  :key="index"
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
import { BUG_TYPE_STATUS, BUG_TYPE_STATUS_VALUE } from '~/constants'

export default {
  /**
   * Declare mixins.
   */
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
    resource: 'mstBugType',
    BUG_TYPE_STATUS,
    BUG_TYPE_STATUS_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    /**
     * Rules validate when submit form.
     */
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstBugType.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstBugType.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.mstBugType.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstBugType.status') }),
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
          status: BUG_TYPE_STATUS_VALUE.use
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
        project_id: this.model.project_id,
        name: this.model.name,
        name_jp: this.model.name_jp,
        description: this.model.description,
        description_jp: this.model.description_jp,
        status: this.model.status
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
