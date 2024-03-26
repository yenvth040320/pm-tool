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
            class="mt-3"
            @submit.prevent="handleSubmit"
          >
            <a-row>
              <a-col
                :span="24"
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
                    @change="changeMember(model)"
                  >
                    <a-select-option
                      v-for="member in members"
                      :key="member.id"
                      :value="member.id"
                    >
                      {{ member.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.task.duration')"
                  prop="duration"
                >
                  <a-input-number
                    v-model="model.duration"
                    :step="0.01"
                    @keypress.native="preventAlphabetCharacterInput($event)"
                    @change="changeDuration(model)"
                  />
                </a-form-model-item>
              </a-col>

              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.task.start_datetime')"
                  prop="start_datetime"
                >
                  <a-date-picker
                    v-model="model.start_datetime"
                    :disabled-date="date => disabledStartDate(date, model) || isWeekend(date)"
                    :disabled-time="disabledDateTimes"
                    disabled-seconds
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY/MM/DD HH:mm"
                    style="width:100%"
                    @change="changeStartDateTime(model)"
                  />
                </a-form-model-item>
              </a-col>

              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.task.end_datetime')"
                  prop="end_datetime"
                >
                  <a-date-picker
                    v-model="model.end_datetime"
                    :disabled-date="date => disabledEndDate(date, model) || isWeekend(date)"
                    :disabled-time="disabledDateTimes"
                    disabled-seconds
                    :show-time="{ format: 'HH:mm' }"
                    format="YYYY/MM/DD HH:mm"
                    style="width:100%;"
                    @change="changeEndDateTime(model)"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                class="text-center pt-3"
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
                  {{ $t('common.ok') }}
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
import WorkingHours from '~/mixins/working-hours'
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE, DEFAULT_KPI, TASK_STATUS_VALUE, ERROR_CODE, SORT, TASK_STATUS_OPTION, TASK_TYPE_VALUE } from '~/constants'

export default {
  components: {},

  mixins: [WorkingHours],

  props: {
    members: {
      type: [Array],
      default: () => []
    },
    kpis: {
      type: [Array],
      default: () => []
    },
    data: {
      type: [Object],
      default: () => {}
    }
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      ERROR_CODE,
      TASK_STATUS_VALUE,
      TASK_STATUS_OPTION,
      TASK_TYPE_VALUE,
      SORT,
      DEFAULT_KPI,
      visible: false,
      model: {},
      disabledDateTimes: disableHours => { },
      stepHours: 1,
      stepMinutes: 15
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
    this.disableHours = [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24]
    this.disabledDateTimes = () => {
      return {
        disabledHours: () => this.disableHours,
        hourStep: this.stepHours,
        minuteStep: this.stepMinutes
      }
    }
  },
  methods: {
    open(data) {
      this.model = cloneDeep(data)
      this.openModal = true
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    close() {
      this.openModal = false
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
       * Disable start date
       */
    disabledStartDate(startValue, record) {
      const endValue = this.findRow(record).end_datetime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    /**
     * Disable end date
     */
    disabledEndDate(endValue, record) {
      const startValue = this.findRow(record).start_datetime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },

    isWeekend(date) {
      const day = date.days()
      return day === 0 || day === 6
    },

    /**
       * Decode record key to find record's function_id, mst_life_cycle_id, task_id
       */
    decodeKey(key) {
      const parts = key.split('.')
      return {
        function_id: Number(parts[3]),
        mst_life_cycle_id: Number(parts[5]),
        task_id: Number(parts[7])
      }
    },

    /**
       * Find children row from record
       */
    findRow(record) {
      return this.data.data[this.data.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children[this.data.data[this.data.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children.findIndex(y => y.id === this.decodeKey(record.key).mst_life_cycle_id)].children[this.data.data[this.data.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children[this.data.data[this.data.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children.findIndex(y => y.id === this.decodeKey(record.key).mst_life_cycle_id)].children.findIndex(z => z.id === this.decodeKey(record.key).task_id)]
    },

    /**
     * On change task assignee member
     */
    async changeMember(record) {
      // find kpi of member
      const memberKpi = this.findMemberKpi(record)
      if (memberKpi) {
        // set task duration by task's et_point
        await this.setTaskDurationByKpi(record, memberKpi)
      } else {
        await this.setTaskDurationByKpi(record, DEFAULT_KPI)
      }
      await this.changeDuration(record)
    },

    /**
     * Find Member Kpi
     */
    findMemberKpi(record) {
      return this.kpis.find(i => i.user_id === record.member_id)?.kpi_per_hour
    },

    /**
     * Set task duration
     */
    setTaskDurationByKpi(record, kpi) {
      if (record.et_point !== null && kpi !== 0) {
        if (kpi < 1) {
          const duration = this.roundPoint(Number(record.et_point) * 0.5)
          this.$set(record, 'duration', duration)
        } else {
          const duration = this.roundPoint((Number(record.et_point) * 0.5) / kpi)
          this.$set(record, 'duration', duration)
        }
      }
    },

    roundPoint(number) {
      return Math.round(number * 4) / 4
    },

    changeDuration(record) {
      if (record.start_datetime) {
        this.setEndDateTime(record)
        this.foundId = []
      }
    },

    /**
     * On change task start date time
     */
    async changeStartDateTime(record) {
      await this.setEndDateTime(record)
      this.foundId = []
    },

    /**
     * Set end_datetime by start_datetime and duration
     */
    setEndDateTime(record) {
      if (record.start_datetime && record.duration) {
        this.$set(record, 'end_datetime', this.calculateEndTime(moment(record.start_datetime), record.duration))
      }
    },

    /**
     * On change end date time
     */
    changeEndDateTime(record) {
      if (record.start_datetime) {
        this.$set(record, 'duration', this.calculateDuration(moment(record.start_datetime).seconds(0), moment(record.end_datetime).seconds(0)))
      }
      this.foundId = []
    },

    handleSubmit() {
      this.loadModal = true
      try {
        this.$emit('save', this.model)
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
    .ant-input-number {
        width: 100% !important;
    }
}
</style>
