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
              :label="$t('module.functionResultDetail.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="model.use_flg"
                :placeholder="$t('module.functionResultDetail.use_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResultDetail.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="model.function_id"
                :placeholder="$t('module.function')"
              >
                <a-select-option
                  v-for="(item, index) in functions"
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
              :label="$t('module.functionResultDetail.function_result_id')"
              prop="function_result_id"
            >
              <a-select
                v-model="model.function_result_id"
                :placeholder="$t('module.functionResult')"
              >
                <a-select-option
                  v-for="(item, index) in functionResults"
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
              :label="$t('module.functionResultDetail.note')"
              prop="note"
            >
              <a-input
                v-model="model.note"
                :placeholder="$t('module.functionResultDetail.note')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResultDetail.note_jp')"
              prop="note_jp"
            >
              <a-input
                v-model="model.note_jp"
                :placeholder="$t('module.functionResultDetail.note_jp')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResultDetail.project_id')"
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
              :label="$t('module.functionResultDetail.result_flg')"
              prop="result_flg"
            >
              <a-input
                v-model="model.result_flg"
                :placeholder="$t('module.functionResultDetail.result_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResultDetail.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.functionResultDetail.version_code')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
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
    resource: 'functionResultDetail',
    functions: [],
    functionResults: [],
    projects: []
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
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        function_result_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.function_result_id') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        result_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.result_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.version_code') }),
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
    this.getFunctions()
    this.getFunctionResults()
    this.getProjects()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Function
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

    /**
     * List FunctionResult
     */
    async getFunctionResults() {
      const { data: { result: { data } } } = await this.$api.functionResult.list()
      this.functionResults = data
    },

    /**
     * List Project
     */
    async getProjects() {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
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
        function_id: this.model.function_id,
        function_result_id: this.model.function_result_id,
        id: this.model.id,
        note: this.model.note,
        note_jp: this.model.note_jp,
        project_id: this.model.project_id,
        result_flg: this.model.result_flg,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code
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
</style>
