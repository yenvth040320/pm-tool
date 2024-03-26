<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 7 }"
    :wrapper-col="{ sm: 17 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="18"
          >
            <a-form-model-item
              :label="$t('module.task.title')"
              prop="title"
            >
              <a-input
                v-model="model.title"
                :placeholder="$t('module.task.title')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="18"
          >
            <a-form-model-item
              :label="$t('module.task.member_id')"
              prop="member_id"
            >
              <a-select
                v-model="model.member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in members"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="18"
          >
            <a-form-model-item
              :label="$t('module.task.et_point')"
              prop="et_point"
            >
              <a-input-number
                v-model="model.et_point"
                :step="0.01"
                @keypress.native="preventAlphabetCharacterInput($event)"
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
      <NotificationProjectNotSelectedVue />
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'
import { TASK_TYPE_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    NotificationProjectNotSelectedVue
  },
  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  props: {
    members: {
      type: Array,
      default: () => []
    },
    currentBug: {
      type: Object,
      default: () => {}
    },
    fixBugMstLifeCycle: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    TASK_TYPE_VALUE
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.title') }),
            trigger: ['change', 'blur']
          }
        ],
        et_point: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.et_point') }),
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => this.$antdvalidate.checkPointTaskLimit(rule, value, callback),
            message: this.$t('validation.number.max', { field: this.$t('module.task_multi_create.et_point'), max: 4 }),
            trigger: ['change', 'blur']
          }
        ],
        member_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.member_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  methods: {
    /**
     * Filter select box
     *
     * @param input
     * @param option
     *
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Prevent the user from entering alphabetic characters in the input field.
     * @param {Event} event
     */
    preventAlphabetCharacterInput(event) {
      const code = event.which ? event.which : event.keyCode
      if (
        (code >= 48 && code <= 57) || // 0 -> 9
          code === 8 || //  Backspace
          code === 46 || //  (.)
          (code >= 37 && code <= 40) // arrow keys
      ) {
        return
      }
      event.preventDefault()
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = {
              project_id: this.$store.state.project.id,
              task_type: TASK_TYPE_VALUE.project,
              function_id: this.currentBug.function_id,
              version_code: this.currentBug.version_code,
              bug_id: this.currentBug.id,
              requirement_id: this.currentBug.requirement_id,
              mst_life_cycle_id: this.fixBugMstLifeCycle ? this.fixBugMstLifeCycle.id : undefined,
              et_point: this.model.et_point,
              status: 0,
              member_id: this.model.member_id,
              start_datetime: '',
              end_datetime: '',
              title: this.model.title
            }
            await this.$api.task.saveTask(data)
            this.model = {}

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
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  .ant-form-item:not(.default) {
    margin-bottom: 20px !important;
  }
  textarea {
    resize: none;
  }
  .ant-input-number {
    width: 100%;
  }
}
</style>
