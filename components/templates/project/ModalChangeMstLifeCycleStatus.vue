<template>
  <a-modal
    :visible="openModal"
    :width="720"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="model"
            :label-col="{ sm: 8 }"
            :wrapper-col="{ sm: 16 }"
            @submit.prevent="handleSubmit"
          >
            <a-row>
              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.tab_schedule.mst_life_cycle_status_id')"
                  prop="mst_life_cycle_status_id"
                >
                  <a-radio-group v-model="model.mst_life_cycle_status_id">
                    <a-radio v-for="(item, index) in mstLifeCycles.find(item => item.id === model.mst_life_cycle_id)?.mstLifeCycleStatuses" :key="index" :style="radioStyle" :value="item.id">
                      <span :style="{ backgroundColor: item.color }">{{ item.name }}</span>
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                class="text-center"
              >
                <a-button
                  html-type="button"
                  type="default"
                  :disabled="loadModal"
                  title="Huỷ bỏ"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </a-button>
                <a-button
                  html-type="submit"
                  title="Save"
                  :disabled="loadModal"
                  type="primary"
                >
                  {{ $t('common.submit') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE, FORMAT_DATE_FULL, USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  components: {
  },
  mixins: [
    DataTable
  ],

  /**
   * Fetch event.
   */
  async fetch() {
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
    }
  },

  props: {
    mstLifeCycles: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      visible: false,
      resource: 'versionFunctionLifeCycle',
      model: {},
      FORMAT_DATE_FULL,
      USE_FLG,
      USE_FLG_VALUE,
      mstLifeCycleId: undefined,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },
  /**
   * Computed event.
   */
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.model = cloneDeep(data)
      this.openModal = true
    },

    close() {
      this.openModal = false
    },
    async handleSubmit() {
      this.loadModal = true
      try {
        if (this.model.start_date && this.model.end_date) {
          const start = moment(this.model.start_date)
          const end = moment(this.model.end_date)
          if (start.isSameOrAfter(end)) {
            this.$notification.error({
              message: this.$t('module.tab_schedule.validate_date_err_message')
            })
            return
          }
        }
        this.model.start_date = this.model.start_date ? moment(this.model.start_date).format(FORMAT_DATE_FULL) : null
        this.model.end_date = this.model.end_date ? moment(this.model.end_date).format(FORMAT_DATE_FULL) : null
        if (this.model.id) {
          await this.repository.update(this.model.id, this.model)
        } else {
          await this.repository.create(this.model)
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })

        this.$emit('save')
        this.openModal = false
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadModal = false
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  :deep() {
      .ant-form-item-label {
          padding-right: 20px;
      }
  }

  </style>
