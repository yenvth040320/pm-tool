<template>
  <a-modal
    :visible="openModal"
    :width="1080"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-card class="mb-4 no-border">
        <template slot="title">
          {{ $t('module.lifeCycle.history_edit_point') }}
        </template>
        <a-form-model
          ref="form"
        >
          <a-table
            ref="tabValidationTable"
            :columns="columns"
            :row-key="record => record.id"
            :data-source="pointEts"
            :pagination="false"
            :loading="loading"
            :scroll="{ x: 900 }"
            @change="handleTableChange"
          >
            <template
              slot="index"
              slot-scope="text, record"
            >
              <span v-if="!record.id">+</span>
            </template>
            <template
              slot="mst_life_cycle_id"
              slot-scope="text, record"
            >
              {{ record?.mst_life_cycle?.name }}
            </template>

            <template
              slot="updated_at"
              slot-scope="text, record"
            >
              {{ getDate(record.updated_at) }}
            </template>

            <template
              slot="user_update"
              slot-scope="text, record"
            >
              {{ record?.user_update?.name }}
            </template>

            <template
              slot="point_et"
              slot-scope="text, record"
            >
              <span v-if="record.id">
                {{ record.point_et }}

              </span>
              <a-form-model-item
                v-else
                :key="`pointEts.` + pointEts.indexOf(record) + `.point_et`"
                :prop="`pointEts.` + pointEts.indexOf(record) + `.point_et`"
                class=""
                :rules="[
                  {
                    validator: (rule, value, callback) => checkRequiredPointEt(rule, value, callback, record),
                    message: $t('validation.required', { field: $t('module.tab_process.point_et') }),
                    trigger: ['change', 'blur'],
                  }
                ]"
              >
                <a-input-number
                  v-model="record.point_et"
                  :placeholder="$t('module.tab_process.point_et')"
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
                :key="`pointEts.` + pointEts.indexOf(record) + `.note`"
                :prop="`pointEts.` + pointEts.indexOf(record) + `.note`"
                class=""
                :rules="[
                  {
                    validator: (rule, value, callback) => checkRequiredNote(rule, value, callback, record),
                    message: $t('validation.required', { field: $t('module.tab_process.note') }),
                    trigger: ['change', 'blur'],
                  }
                ]"
              >
                <a-textarea
                  v-model="record.note"
                  :placeholder="$t('module.tab_process.note')"
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
  </a-modal>
</template>

<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import { LIFE_CYCLE_STATUS_CLOSED_VALUE } from '~/constants'

export default {
  components: {},

  mixins: [
    DataTable
  ],

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
    users: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      resource: 'functionEtPoint',
      model: {},
      mstLifeCycleId: undefined,
      pointEts: [],
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      LIFE_CYCLE_STATUS_CLOSED_VALUE
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
          width: 60
        },
        {
          title: this.$t('module.tab_process.status'),
          dataIndex: 'mst_life_cycle_id',
          scopedSlots: { customRender: 'mst_life_cycle_id' }
        },
        {
          title: this.$t('module.tab_process.date_update'),
          dataIndex: 'updated_at',
          scopedSlots: { customRender: 'updated_at' }
        },
        {
          title: this.$t('module.tab_process.user_update'),
          dataIndex: 'user_update',
          scopedSlots: { customRender: 'user_update' }
        },
        {
          title: this.$t('module.tab_process.point_et'),
          dataIndex: 'point_et',
          scopedSlots: { customRender: 'point_et' }
        },
        {
          title: this.$t('module.tab_process.note'),
          dataIndex: 'note',
          scopedSlots: { customRender: 'note' }
        },
        {
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.model = data
      this.getPointEts(data)
      this.openModal = true
    },

    close() {
      this.openModal = false
    },

    getPointEts(model) {
      this.pointEts = model.function_et_points
    },

    /**
       * Add row
       */
    handleAdd() {
      const newData = {
        project_id: this.model.project_id,
        function_id: this.model.function_id,
        version_code: this.model.version_code,
        mst_life_cycle_id: this.model.mst_life_cycle_id,
        point_et: null,
        user_update: {
          id: this.$auth.user.id,
          name: this.$auth.user.name
        },
        updated_at: moment()
      }
      newData.mst_life_cycle = this.model.mst_life_cycle
      this.pointEts = [...this.pointEts, newData]
    },
    /**
     * Get date
     */
    getDate(value) {
      if (value) {
        return moment(String(value)).format('DD-MM-YYYY')
      } else {
        return ''
      }
    },

    /**
       * Validate required content check
       */
    checkRequiredPointEt(rule, value, callback, item) {
      if (item.point_et === 0) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.point_et)
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
          this.$emit('save')

          this.openModal = false
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
     * Check data insert
     */
    isRecordValid(data) {
      if (data.point_et === null || data.point_et === undefined || data.point_et === '' || data.point_et === 0 || data.note === '' || data.note === undefined) {
        return false
      }
      return true
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
  }
  </style>
