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
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.sourceCode.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.sourceCode.name')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.sourceCode.code_id')"
              prop="code_id"
            >
              <a-input
                v-model="model.code_id"
                :disabled="id !== 0"
                :placeholder="$t('module.sourceCode.code_id')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.sourceCode.url_web')"
              prop="url_web"
            >
              <a-input
                v-model="model.url_web"
                :placeholder="$t('module.sourceCode.url_web')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.sourceCode.language_project')"
              prop="language"
            >
              <a-select
                v-model="model.language"
                :placeholder="$t('module.sourceCode.language_project')"
              >
                <a-select-option
                  v-for="(item, i) in LANGUAGE_PROJECT"
                  :key="i"
                  :value="item.id"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.sourceCode.root_type')"
              prop="type_id"
            >
              <a-radio-group v-model="model.type_id">
                <a-radio
                  v-for="(item, index) in LIST_ROOT_TYPE"
                  :key="index"
                  :style="radioStyle"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
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
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { LANGUAGE_PROJECT, LIST_ROOT_TYPE } from '~/constants'
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
    resource: 'sourceCode',
    LANGUAGE_PROJECT,
    LIST_ROOT_TYPE,
    radioStyle: {
      display: 'inline',
      height: '30px',
      lineHeight: '30px'
    }
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
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.name') }),
            trigger: ['change', 'blur']
          }
        ],
        code_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.code_id') }),
            trigger: ['change', 'blur']
          }
        ],
        root_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.root_type') }),
            trigger: ['change', 'blur']
          }
        ],
        language: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.language_project') }),
            trigger: ['change', 'blur']
          }
        ],
        url_web: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.url_web') }),
            trigger: ['change', 'blur']
          }
        ],
        type_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sourceCode.root_type') }),
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
    /**
       *Submit form
       */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true)
            const params = this.model
            params.project_id = this.$store.state.project.id

            params.parent_id = 0
            if (this.model.id) {
              await this.repository.update(this.model.id, params)
            } else {
              await this.repository.create(params)
            }
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
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
  }
  </style>
