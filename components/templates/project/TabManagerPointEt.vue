<template>
  <div class="content">
    <a-card class="mb-4 no-border">
      <template slot="title">
        {{ $t('module.lifeCycle.history_edit_point') }}
        <div class="mt-2 total-point">
          <div v-for="(result, key) in totalPoint.resultPointData" :key="key">
            <span>
              {{ result.label }}: {{ result.count }} {{ key !== '0' && !isNaN(result.percentage) && result.percentage !== 0 ? '(' + result.percentage + '%)' : '' }}
            </span>
          </div>
          <p class="total-all">
            {{ $t('module.project.total_point') }}: {{ totalPoint.total }}
          </p>
        </div>
      </template>
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100 mt-4"
          title="Tạo mới"
          @click="handleAdd"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionItemValidation.create') }}
        </a-button>
      </template>
      <a-form-model
        ref="form"
      >
        <a-table
          ref="tabValidationTable"
          :columns="columns"
          :row-key="getRowKey"
          :data-source="project.projectEtPoints"
          :pagination="false"
          :loading="loading"
          :scroll="{ x: 900 }"
          @change="handleTableChange"
        >
          <template
            slot="index"
            slot-scope="text, record"
          >
            <span v-if="!record.id" class="no-wrap">+</span>
          </template>

          <template
            slot="updated_at"
            slot-scope="text, record"
          >
            <span class="no-wrap">{{ record.updated_at ? moment(record.updated_at).format('DD-MM-YYYY') : '' }}</span>
          </template>

          <template
            slot="user_update"
            slot-scope="text, record"
          >
            <span class="no-wrap">{{ record?.updatedUser?.name }}</span>
          </template>

          <template
            slot="total_standard_point_et"
            slot-scope="text, record"
          >
            <span v-if="record.id">
              {{ formatNumber(record.total_standard_point_et) }}

            </span>
            <a-form-model-item
              v-else
              :key="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_standard_point_et`"
              :prop="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_standard_point_et`"
              class=""
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredStandardPoint(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.project.standard_point_et') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-input-number
                v-model="record.total_standard_point_et"
                :placeholder="$t('module.project.standard_point_et')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="total_pm_point_et"
            slot-scope="text, record"
          >
            <span v-if="record.id">
              {{ formatNumber(record.total_pm_point_et) }}

            </span>
            <a-form-model-item
              v-else
              :key="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_pm_point_et`"
              :prop="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_pm_point_et`"
              class=""
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredPmPoint(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.project.pm_point_et') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-input-number
                v-model="record.total_pm_point_et"
                :placeholder="$t('module.project.pm_point_et')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="total_com_point_et"
            slot-scope="text, record"
          >
            <span v-if="record.id">
              {{ formatNumber(record.total_com_point_et) }}

            </span>
            <a-form-model-item
              v-else
              :key="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_com_point_et`"
              :prop="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_com_point_et`"
              class=""
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredComPoint(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.project.com_point_et') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-input-number
                v-model="record.total_com_point_et"
                :placeholder="$t('module.project.com_point_et')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="total_dev_point_et"
            slot-scope="text, record"
          >
            <span v-if="record.id">
              {{ formatNumber(record.total_dev_point_et) }}

            </span>
            <a-form-model-item
              v-else
              :key="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_dev_point_et`"
              :prop="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.total_dev_point_et`"
              class=""
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredDevPoint(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.project.dev_point_et') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-input-number
                v-model="record.total_dev_point_et"
                :placeholder="$t('module.project.dev_point_et')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="note"
            slot-scope="text, record"
          >
            <span v-if="record.id" class="content">
              {{ record.note }}

            </span>
            <a-form-model-item
              v-else
              :key="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.note`"
              :prop="`project.projectEtPoints.` + project.projectEtPoints.indexOf(record) + `.note`"
              class=""
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredNote(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.project.note') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-textarea
                v-model="record.note"
                :placeholder="$t('module.project.note')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="action"
            slot-scope="text, record"
          >
            <a-button
              v-if="!record.id"
              html-type="button"
              type="primary"
              size="small"
              title="Lưu"
              :disabled="loading"
              @click="saveNewPointEt(record)"
            >
              <a-icon type="save" />
            </a-button>
          </template>
        </a-table>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'

export default {
  components: {
  },
  mixins: [
    DataTable
  ],
  props: {
    project: {
      type: [Object],
      default: () => {}
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

  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      resource: 'projectEtPoint',
      moment
    }
  },
  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 30
        },
        {
          title: this.$t('module.project.date_update'),
          dataIndex: 'updated_at',
          scopedSlots: { customRender: 'updated_at' },
          width: 120
        },
        {
          title: this.$t('module.project.user_update'),
          dataIndex: 'user_update',
          scopedSlots: { customRender: 'user_update' }
        },
        {
          title: this.$t('module.project.standard_point_et'),
          dataIndex: 'total_standard_point_et',
          scopedSlots: { customRender: 'total_standard_point_et' }
        },
        {
          title: this.$t('module.project.pm_point_et'),
          dataIndex: 'total_pm_point_et',
          scopedSlots: { customRender: 'total_pm_point_et' }
        },
        {
          title: this.$t('module.project.com_point_et'),
          dataIndex: 'total_com_point_et',
          scopedSlots: { customRender: 'total_com_point_et' }
        },
        {
          title: this.$t('module.project.dev_point_et'),
          dataIndex: 'total_dev_point_et',
          scopedSlots: { customRender: 'total_dev_point_et' }
        },
        {
          title: this.$t('module.project.note'),
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' }
        },
        {
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    },

    totalPoint() {
      if (this.project && this.project.projectEtPoints && Array.isArray(this.project.projectEtPoints)) {
        const calculateTotal = key => this.project.projectEtPoints.reduce((total, etPoint) => {
          const value = etPoint[key]
          return typeof value === 'number' && !isNaN(value) ? total + value : total
        }, 0)
        const totalStandardPointEt = calculateTotal('total_standard_point_et')
        const totalPmPointEt = calculateTotal('total_pm_point_et')
        const totalComPointEt = calculateTotal('total_com_point_et')
        const totalDevPointEt = calculateTotal('total_dev_point_et')
        const totalAllPoints = totalPmPointEt + totalComPointEt + totalDevPointEt
        const total = parseFloat(totalAllPoints).toFixed(2)

        const resultPointData = {
          0: {
            count: parseFloat(totalStandardPointEt.toFixed(2)),
            label: 'Point tiêu chuẩn'
          },
          1: {
            count: parseFloat(totalPmPointEt.toFixed(2)),
            percentage: parseFloat((totalPmPointEt / totalAllPoints * 100).toFixed(2)),
            label: 'Point quản lý'
          },
          2: {
            count: parseFloat(totalComPointEt.toFixed(2)),
            percentage: parseFloat((totalComPointEt / totalAllPoints * 100).toFixed(2)),
            label: 'Point 10% com'
          },
          3: {
            count: parseFloat(totalDevPointEt.toFixed(2)),
            percentage: parseFloat((totalDevPointEt / totalAllPoints * 100).toFixed(2)),
            label: 'Point dành cho phát triển'
          }
        }

        return {
          resultPointData,
          total
        }
      } else {
        return {
          resultPointData: {},
          total: 0
        }
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    /**
     * Add row
     */
    handleAdd() {
      const newData = {
        project_id: this.project.id,
        total_standard_point_et: null,
        total_pm_point_et: null,
        total_com_point_et: null,
        total_dev_point_et: null,
        updatedUser: {
          id: this.$auth.user.id,
          name: this.$auth.user.name
        },
        updated_at: moment(),
        note: ''
      }
      this.project.projectEtPoints = [...this.project.projectEtPoints, newData]
    },

    formatNumber(number) {
      if (number && !isNaN(number)) {
        return parseFloat(number).toFixed(2)
      }
      return ''
    },
    /**
     * Validate required content check
     */
    checkRequiredStandardPoint(rule, value, callback, item) {
      if (item.total_standard_point_et === 0) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.total_standard_point_et)
      } else {
        callback()
      }
    },

    /**
     * Validate required content check
     */
    checkRequiredPmPoint(rule, value, callback, item) {
      if (item.total_pm_point_et === 0) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.total_pm_point_et)
      } else {
        callback()
      }
    },

    /**
     * Validate required total com point et
     */
    checkRequiredComPoint(rule, value, callback, item) {
      if (item.total_com_point_et === 0) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.total_com_point_et)
      } else {
        callback()
      }
    },

    /**
     * Validate required content check
     */
    checkRequiredDevPoint(rule, value, callback, item) {
      if (item.total_dev_point_et === 0) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.total_dev_point_et)
      } else {
        callback()
      }
    },

    /**
       * Validate required content check
       */
    checkRequiredNote(rule, value, callback, item) {
      if (item.note === '') {
        this.$antdvalidate.checkRequired(rule, value, callback, item.note)
      } else {
        callback()
      }
    },

    /**
       * Add point et
       */
    async saveNewPointEt(record) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.isRecordValid(record)) {
          await this.repository.create(record)
          this.$notification.success({
            message: this.$t('text.successfully')

          })
          await this.$emit('save', record.project_id)
        } else {
          this.$notification.error({
            message: this.$t('text.validate_point_et')
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get row key
     */
    getRowKey(record, index) {
      if (record.key) {
        return record.key
      }
      if (record.id) {
        return record.id
      }
      return `temp-row-key-${index}`
    },

    /**
       * Check data insert
       */
    isRecordValid(data) {
      const requiredFields = [
        'total_standard_point_et',
        'total_pm_point_et',
        'total_com_point_et',
        'total_dev_point_et'
      ]

      let hasAtLeastOnePoint = false

      for (const field of requiredFields) {
        if (data[field] && data[field] !== 0) {
          hasAtLeastOnePoint = true
          break
        }
      }

      return hasAtLeastOnePoint && data.note !== undefined && data.note !== ''
    }
  }
}
</script>
  <style lang="scss" scoped>
  :deep() {
    .ant-form-item-label {
      padding-right: 20px;
    }
    .ant-form-item:not(.default) {
      margin-bottom: 0px;
    }
    .content {
      white-space: pre-line;
    }
    .no-wrap {
      white-space: nowrap;
    }
    .total-point {
      font-weight: 400;
    }
    .total-all {
      font-weight: 700;
    }
  }
  </style>
