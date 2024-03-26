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
              :label="$t('module.answer.answer')"
              prop="answer"
            >
              <a-input
                v-model="model.answer"
                :placeholder="$t('module.answer.answer')"
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
              :label="$t('module.answer.is_deleted')"
              prop="is_deleted"
            >
              <a-input
                v-model="model.is_deleted"
                :placeholder="$t('module.answer.is_deleted')"
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
              :label="$t('module.answer.project_id')"
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
              :label="$t('module.answer.question_id')"
              prop="question_id"
            >
              <a-select
                v-model="model.question_id"
                :placeholder="$t('module.question')"
              >
                <a-select-option
                  v-for="(item, index) in questions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
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
    resource: 'answer',
    projects: [],
    questions: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        answer: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.answer.answer') }),
            trigger: ['change', 'blur']
          }
        ],
        is_deleted: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.answer.is_deleted') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.answer.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        question_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.answer.question_id') }),
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
    this.getQuestions()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Project
     */
    async getProjects() {
      const { data: { result: { data } } } = await this.$api.project.list()
      this.projects = data
    },

    /**
     * List Question
     */
    async getQuestions() {
      const { data: { result: { data } } } = await this.$api.question.list()
      this.questions = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        answer: this.model.answer,
        created_at: this.model.created_at,
        id: this.model.id,
        is_deleted: this.model.is_deleted,
        project_id: this.model.project_id,
        question_id: this.model.question_id,
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
</style>
