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
                  />
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
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE } from '~/constants'

export default {
  components: {},

  mixins: [
  ],

  props: {
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
    }
    </style>
