<template>
  <div>
    <div v-for="(item, index) in testResultDetail" :key="index" class="detail-task">
      <a-card class="mb-4">
        <a-form-model
          ref="form"
          :rules="formRules"
          :label-col="{ sm: 7 }"
          :wrapper-col="{ sm: 17 }"
        >
          <div class="p-2">
            <a-row
              type="flex"
              :gutter="30"
            >
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.autoTestResult.title')"
                  prop="title"
                >
                  {{ item.test_info.title }}
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.autoTestResult.status')"
                  prop="status"
                >
                  {{ item.status }}
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row
              type="flex"
              :gutter="30"
              class="info-steps"
            >
              <a-col
                :span="24"
                :md="item.test_info.error ? 12 : 24"
                :class="item.test_info.error ? 'has-error' : 'no-error'"
              >
                <a-form-model-item
                  :label="$t('module.autoTestResult.steps')"
                  prop="status"
                >
                  <a-steps v-for="(step, index) in item.test_info.steps" :key="index" direction="vertical" size="small" :current="1">
                    <a-step :title="concatenateTitle(step)" :description="formatWallTime(step)" />
                  </a-steps>
                </a-form-model-item>
              </a-col>

              <a-col
                v-if="item.test_info.error"
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.autoTestResult.error')"
                  prop="error"
                >
                  <div v-for="(error, index) in item.test_info.errors" :key="index">
                    <pre>{{ extractLocatorFromErrorMessage(error.message) }}</pre>
                  </div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
      </a-card>
    </div>
  </div>
</template>

<script>
import DataTable from '~/mixins/data-table'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import { } from '~/constants'

export default {
  /**
         * Declare components.
         */
  components: {
  },
  /**
     * Declare mixins.
     */
  mixins: [DataTable],

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

  props: {
    testResultDetail: {
      type: Array,
      default: () => []
    }
  },

  /**
         * Init data for component.
         */
  data: () => ({
    dataTestResultDetail: []
  }),

  /**
         * Computed event.
         */
  computed: {
    formRules() {
      return {
      }
    },

    header() {
      return [
        {
          title: this.$t('module.taskChecklistResult.checklist_detail_id'),
          scopedSlots: { customRender: 'name' },
          dataIndex: 'name'
        },
        {
          title: this.$t('module.taskChecklistResult.dev_check_flg'),
          dataIndex: 'dev_check_flg',
          scopedSlots: { customRender: 'dev_check_flg' },
          width: 200
        },
        {
          title: this.$t('module.taskChecklistResult.dev_description'),
          dataIndex: 'dev_description',
          scopedSlots: { customRender: 'dev_description' }

        },
        {
          title: this.$t('module.taskChecklistResult.approve_check_flg'),
          dataIndex: 'approve_check_flg',
          scopedSlots: { customRender: 'approve_check_flg' },
          width: 200
        },
        {
          title: this.$t('module.taskChecklistResult.approve_description'),
          dataIndex: 'approve_description',
          scopedSlots: { customRender: 'approve_description' }
        }
      ]
    }
  },

  watch: {
    testResultDetail(newVal) {
      this.convertTestInfoToObject()
    }
  },

  /**
       * Mounted event.
       */
  mounted() {
    this.convertTestInfoToObject()
  },

  /**
     * List of methods.
     */
  methods: {
    convertTestInfoToObject() {
      if (this.testResultDetail && Array.isArray(this.testResultDetail)) {
        this.testResultDetail.forEach(record => {
          if (record.test_info) {
            record.test_info = JSON.parse(record.test_info)
          }
        })
      }
    },

    concatenateTitle(step) {
      if (step.params) {
        const paramsValues = Object.values(step.params)

        return `${step.title} (${paramsValues.join(' ')})`
      }

      return step.title
    },

    formatWallTime(step) {
      let formattedWallTime = ''
      let formattedEndWallTime = ''

      if (step.wallTime) {
        formattedWallTime = new Date(step.wallTime).toLocaleString()
      }

      if (step.endWallTime) {
        formattedEndWallTime = new Date(step.endWallTime).toLocaleString()
      }

      if (formattedWallTime && formattedEndWallTime) {
        const timeDifference = new Date(step.endWallTime) - new Date(step.wallTime)
        const formattedTimeDifference = ` (+${timeDifference} ms)`

        return `${formattedWallTime} - ${formattedEndWallTime}${formattedTimeDifference}`
      } else if (formattedWallTime) {
        return formattedWallTime
      } else if (formattedEndWallTime) {
        return formattedEndWallTime
      } else {
        return ''
      }
    },

    extractLocatorFromErrorMessage(originalMessage) {
      const lines = originalMessage.split('\n')

      const callLogIndex = lines.findIndex(line => line.includes('Call log:'))
      const header = lines.slice(0, callLogIndex).join('\n').trim()
      const formattedMessage = `${header}`
      return formattedMessage
    }
  }
}
</script>
  <style lang="scss" scoped>
  :deep() {
    .info-steps {
      .no-error {
        .ant-col-sm-7 {
          width: 14.3%;
        }
        .ant-col-sm-17{
            width: 85.7%;
        }
      }
    }
    .jsondiffpatch-deleted .jsondiffpatch-deleted pre, .jsondiffpatch-modified .jsondiffpatch-left-value pre, .jsondiffpatch-textdiff-deleted {
      text-decoration: unset;
    }
    .ant-form-item-label {
      text-align: left;
      font-weight: 500;
    }
    .ant-divider {
      height: 2px;
      top: 0.94em;
      background: #000000;
    }
  }
  </style>
