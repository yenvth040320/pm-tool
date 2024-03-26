<template>
  <div>
    <div>
      <p class="summary-test-case">
        {{ $t('module.functionResultDetail.summary') }}
      </p>
      <div v-for="(result, key) in totalResultFlg" :key="key">
        <p>{{ result.label }}: {{ result.count }} ({{ !isNaN(result.percentage) ? result.percentage : 0 }}%)</p>
      </div>
    </div>
    <a-card class="mb-4 no-border">
      <a-table
        :columns="columns"
        :row-key="getRowKey"
        :data-source="functionResultDetailData"
        :pagination="false"
        :row-class-name="rowClassName"
        :loading="loading"
        :scroll="{ x: 1280 }"
        @change="handleTableChange"
      >
        <template slot="content_check" slot-scope="text, record">
          <div class="content">
            {{ record?.functionTestCase?.content_check }}
          </div>
        </template>

        <template slot="expect_result" slot-scope="text, record">
          <div class="content">
            {{ record?.functionTestCase?.expect_result }}
          </div>
        </template>

        <template slot="action" slot-scope="text, record">
          <a-button
            html-type="button"
            type="default"
            size="small"
            title="Chưa test"
            :disabled="loading"
            @click="updateResult(record.id, RESULT_FLG.unchecked)"
          >
            {{ $t('module.functionResultDetail.unchecked') }}
          </a-button>
          <a-button
            html-type="button"
            type="default"
            title="N/A (Không đánh giá được)"
            size="small"
            :disabled="loading"
            class="button-warning"
            @click="updateResult(record.id, RESULT_FLG.na)"
          >
            {{ $t('module.functionResultDetail.na') }}
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Pass"
            :disabled="loading"
            @click="updateResult(record.id, RESULT_FLG.pass)"
          >
            {{ $t('module.functionResultDetail.pass') }}
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            title="Not pass"
            :disabled="loading"
            @click="updateResult(record.id, RESULT_FLG.not_pass)"
          >
            {{ $t('module.functionResultDetail.not_pass') }}
          </a-button>
          <a-button
            v-if="record.result_flg === RESULT_FLG.na || record.result_flg === RESULT_FLG.not_pass"
            html-type="button"
            type="default"
            size="small"
            title="Chú ý"
            :disabled="loading"
            @click="updateNote(record)"
          >
            {{ $t('module.functionResultDetail.note') }}
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
    <ModalAddNote
      ref="addNote"
      @save="$emit('save')"
    />
  </div>
</template>
<script>
import ModalAddNote from './ModalAddNote.vue'
import DataTable from '~/mixins/data-table'
import { LOCK_FLG_VALUE, USE_FLG_VALUE, RESULT_FLG } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: { ModalAddNote },

  mixins: [DataTable],
  fetch() {
    this.$store.dispatch('setLoading', true)

    try {
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    mstItemProperty: {
      type: [Array],
      default: () => []
    },
    functionResultDetails: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      visible: false,
      resource: 'functionTestCase',
      currentId: 0,
      defaultParams: {
        not_admin: 1
      },
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      RESULT_FLG,
      functionResultDetailData: this.functionResultDetails
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.functionTestCase.content_check'),
          scopedSlots: { customRender: 'content_check' }
        },
        {
          title: this.$t('module.functionTestCase.expect_result'),
          scopedSlots: { customRender: 'expect_result' }
        },
        {
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 350
        }
      ]
    },
    totalResultFlg() {
      const resultFlgData = {
        0: { count: 0, percentage: 0, label: 'Unchecked' },
        1: { count: 0, percentage: 0, label: 'N/A' },
        2: { count: 0, percentage: 0, label: 'Pass' },
        3: { count: 0, percentage: 0, label: 'Not Pass' }
      }

      const totalCount = this.functionResultDetailData.length

      this.functionResultDetailData.forEach(record => {
        resultFlgData[record.result_flg.toString()].count++
      })

      for (const key in resultFlgData) {
        resultFlgData[key].percentage = ((resultFlgData[key].count / totalCount) * 100).toFixed(1)
      }

      return resultFlgData
    }
  },
  watch: {
    functionResultDetails: {
      immediate: true,
      handler(newVal) {
        this.updateFunctionResultDetailData(newVal)
        this.$nextTick(() => {
        })
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  methods: {
    /**
     * Get list test case validation
     */
    updateFunctionResultDetailData(newVal) {
      this.functionResultDetailData = newVal.filter(
        record => record.functionTestCase.mst_testcase_common_id !== null
      )
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

    save() {
      this.visible = false
      this.$emit('save')
    },

    /**
     * Set table class
     *
     * @param {array} record
     */
    rowClassName(record) {
      if (record.result_flg === RESULT_FLG.na) {
        return 'na-row'
      } else if (record.result_flg === RESULT_FLG.pass) {
        return 'pass-row'
      } else if (record.result_flg === RESULT_FLG.not_pass) {
        return 'notpass-row'
      } else {
        return null
      }
    },
    updateNote(record) {
      this.$refs.addNote.openModal(record)
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async updateResult(id, result) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataResult = [...this.functionResultDetailData]
        const data = dataResult.find(item => item.id === id)
        if (data) {
          data.result_flg = result
          if (result === RESULT_FLG.na || result === RESULT_FLG.not_pass) {
            this.$refs.addNote.openModal(data)
          } else {
            data.note = null
            await this.$api.functionResultDetail.update(id, data)
            this.$emit('save')
            this.$notification.success({
              message: this.$t('text.successfully')
            })
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editable-cell {
  position: relative;
}

:deep() {
  .ant-table-tbody {
    .pass-row {
      background-color: #1890ff;
      color: #ffffff;
    }
    .notpass-row {
      background-color: #ff7875;
      color: #ffffff;
    }
    .na-row {
      background-color: #ffc107;
      color: #000000;
    }
  }
  .ant-form-item {
    margin-bottom: 10px;
  }
  .ant-form-explain {
    position: absolute;
  }
  .ant-form-item-children {
    position: relative;
  }
}
.button-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #000000;
  &:hover {
    opacity: 0.7;
    color: #000000;
  }
}
.content {
  white-space: pre-line;
}
.summary-test-case {
  font-weight: 700;
  font-size: 16px;
}
</style>
