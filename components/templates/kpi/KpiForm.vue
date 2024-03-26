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
              :label="$t('module.kpi.user_id')"
              prop="user_id"
            >
              <a-select
                v-model="model.user_id"
                :placeholder="$t('module.user')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in users"
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
              :label="$t('module.kpi.kpi_per_hour')"
              prop="kpi_per_hour"
            >
              <a-input-number
                v-model="model.kpi_per_hour"
                :placeholder="$t('module.kpi.kpi_per_hour')"
                @keypress.native="preventAlphabetCharacterInput($event)"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.kpi.start_date')"
              prop="start_date"
            >
              <a-date-picker
                v-model="model.start_date"
                :placeholder="$t('module.kpi.start_date')"
                format="YYYY/MM/DD"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            v-if="id && originalModel.end_date"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.kpi.end_date')"
              prop="end_date"
            >
              <a-date-picker
                v-model="model.end_date"
                :disabled-date="disableStartDate"
                :placeholder="$t('module.kpi.end_date')"
                format="YYYY/MM/DD"
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
import moment from 'moment-timezone'
import { ERROR_CODE, SORT } from '~/constants'
import DataForm from '~/mixins/data-form'

export default {
  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  props: {
    kpis: {
      type: [Array],
      default: () => []
    }
  },
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
    resource: 'kpi',
    users: [],
    originalModel: {},
    disableStartDates: [],
    ERROR_CODE,
    SORT
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        user_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.kpi.user_id') }),
            trigger: ['change', 'blur']
          }
        ],
        kpi_per_hour: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.kpi.kpi_per_hour') }),
            trigger: ['change', 'blur']
          }
        ],
        start_date: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.kpi.start_date') }),
            trigger: ['change', 'blur']
          }
        ],
        end_date: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.kpi.end_date') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  watch: {
    kpis: {
      immediate: true,
      handler() {
        this.updateDisableStartDates()
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getUsers()
    const disableDates = this.kpis.filter(item => item.end_date === null).map(item => item.start_date)
    this.disableStartDates = disableDates
  },

  /**
   * List of methods.
   */
  methods: {
    updateDisableStartDates() {
      const disableDates = this.kpis.filter(item => item.end_date === null).map(item => item.start_date)
      this.disableStartDates = disableDates
    },
    disableStartDate(date) {
      return this.disableStartDates.some(disableDate =>
        moment(disableDate).isSameOrBefore(date, 'day')
      )
    },
    /**
     * List User
     */
    async getUsers() {
      const params = {
        not_limit: true,
        order_by: 'id',
        order_type: SORT.asc
      }
      const { data: { result: { data } } } = await this.$api.user.list({ params })
      this.users = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        user_id: this.model.user_id,
        kpi_per_hour: this.model.kpi_per_hour,
        start_date: this.model.start_date,
        end_date: this.model.end_date,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },
    preventAlphabetCharacterInput(event) {
      const code = event.which ? event.which : event.keyCode
      if (
        (code >= 48 && code <= 57) || // 0 -> 9
          code === 8 || //  Backspace
          code === 46 || //  (.)
          code === 45 || //  (-)
          (code >= 37 && code <= 40) // arrow keys
      ) {
        return
      }
      event.preventDefault()
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
        let model = {}
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
          this.originalModel = { ...model }
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
     * Filter search option
     *
     * @param input
     * @param option
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.start_date = this.model.start_date ? moment(this.model.start_date).format('YYYY-MM-DD') : null
            data.end_date = this.model.end_date ? moment(this.model.end_date).format('YYYY-MM-DD') : null
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
          } catch (_) {
            if (_.response.data.code && _.response.data.code === ERROR_CODE.END_DATE_INVALID) {
              this.$notification.error({
                message: this.$t('text.end_date_invalid')
              })
            } else {
              this.$notification.error({
                message: this.$t('text.something_wrong')
              })
            }
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
  textarea {
    resize: none;
  }
  .ant-input-number,
  .ant-calendar-picker {
    width: 100%;
  }
}
</style>
