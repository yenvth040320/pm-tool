<template>
  <div>
    <a-spin :spinning="spin">
      <div class="pb-2 total-testcase">
        {{ $t('module.testcaseList.testcase_number') }}: {{ calculateTotalTestCase() }}
      </div>
      <div class="main-container">
        <a-table
          ref="dataTable"
          :columns="columns"
          :row-key="getRowKey"
          :data-source="dataTestcaseResult"
          :pagination="false"
          :loading="loading"
          :scroll="{ x: 900 }"
        >
          <template slot="group_name" slot-scope="text, record">
            <div>
              {{ record?.testcaseGroup?.name }}
            </div>
          </template>
          <template slot="matrix_name" slot-scope="text, record, indexRecord">
            <div
              class="test-item"
              @click="showDetailMatrix(record, indexRecord)"
            >
              {{ record.functionItem ? '[' + record.functionItem.item_num + ']' + ' ' + record.name : record.name }}
            </div>
          </template>
          <template slot="number_case" slot-scope="text, record">
            <div>
              {{ getTotalTestCase(record.testcaseNumbers) }}
            </div>
          </template>

          <template slot="result" slot-scope="text, record">
            <div>
              <a-tag color="#34A853">
                {{ getResultTest(record).totalPass }} pass
              </a-tag>
              <a-tag color="#EA4335">
                {{ getResultTest(record).totalFail }} fail
              </a-tag>
              <a-tag color="#8C8C8C">
                {{ getResultTest(record).totalPending }} pending
              </a-tag>
              <a-tag color="#FBBC05">
                {{ getResultTest(record).totalOther }} other
              </a-tag>
              <a-tag color="#911489">
                {{ getResultTest(record).totalNew }} new
              </a-tag>
            </div>
          </template>
          <template
            slot="action"
            slot-scope="text, record, index"
          >
            <a-button
              html-type="button"
              type="primary"
              size="small"
              title="Chỉnh sửa"
              :disabled="loading"
              @click="showDetailMatrix(record, index)"
            >
              <font-awesome-icon icon="pencil-alt" />
            </a-button>
          </template>
        </a-table>
      </div>
    </a-spin>
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import { OUTPUT_DETAIL_TYPE_VALUE } from '~/constants'

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
    spin: {
      type: Boolean,
      default: false
    },
    dataTestcaseResult: {
      type: Array,
      default: () => []
    },

    index: {
      type: [Number, String],
      default: 0
    }
  },

  data() {
    return {
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code,
      currentGroupType: null,
      displayedGroups: [],
      selectedMatrixIndex: -1,
      OUTPUT_DETAIL_TYPE_VALUE
    }
  },

  computed: {
    header() {
      return [
        {
          title: 'STT',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$t('module.test_case_matrix.group'),
          dataIndex: 'group_name',
          scopedSlots: { customRender: 'group_name' }
        },
        {
          title: this.$t('module.test_case_matrix.item'),
          dataIndex: 'matrix_name',
          scopedSlots: { customRender: 'matrix_name' }
        },
        {
          title: this.$t('module.test_case_matrix.number_case'),
          dataIndex: 'number_case',
          scopedSlots: { customRender: 'number_case' },
          width: 120
        },
        {
          title: this.$t('module.test_case_matrix.result'),
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' }
        },
        {
          title: this.$t('module.test_case_matrix.action'),
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    }
  },

  mounted() {
    this.scrollToIndex(this.index)
  },
  methods: {
    /**
     * Scroll to row
     *
     * @param index
     */
    scrollToIndex(index) {
      if (index !== -1) {
        this.$nextTick(() => {
          const tableElement = this.$refs.dataTable.$el
          const rowElements = tableElement.querySelectorAll('.ant-table-row')
          rowElements.forEach((element, currentIndex) => {
            if (currentIndex === index) {
              element.classList.add('hover-effect')
            } else {
              element.classList.remove('hover-effect')
            }
          })

          if (rowElements && rowElements[index]) {
            const scrollToElement = rowElements[index]
            scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    },

    /**
     * Count all testcase
     *
     * @returns {number}
     */
    calculateTotalTestCase() {
      let totalTestCase = 0

      this.dataTestcaseResult.forEach(record => {
        totalTestCase += this.getTotalTestCase(record.testcaseNumbers)
      })

      return totalTestCase
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
     * Change to tab detail matrix testcase
     *
     * @param matrix
     * @param index
     */
    showDetailMatrix(matrix, index) {
      this.$emit('change-tab', matrix, index)
    },

    /**
     * Count total testcase of one row
     *
     * @param testCaseNumbers
     * @returns {number|*}
     */
    getTotalTestCase(testCaseNumbers) {
      if (testCaseNumbers) {
        return testCaseNumbers.length
      }

      return 0
    },

    /**
     * Show result test
     *
     * @param matrix
     *
     * @returns Object
     */
    getResultTest(matrix) {
      const totalTestCase = matrix.testcaseNumbers.length

      const judgement = matrix.formatDetail.filter(item => item.type === OUTPUT_DETAIL_TYPE_VALUE.judgement)
      let totalPass = 0
      let totalFail = 0
      let totalPending = 0
      let totalOther = 0
      judgement.forEach(item => {
        item.testcase_output_result_details.forEach(detail => {
          switch (detail.judgement) {
            case 1:
              totalPass++
              break
            case 2:
              totalFail++
              break
            case 3:
              totalPending++
              break
            case 4:
              totalOther++
              break
            default:
              break
          }
        })
      })

      // Tính totalNew
      const totalNew = totalTestCase - totalPass - totalFail - totalPending - totalOther
      return {
        totalPass,
        totalFail,
        totalPending,
        totalOther,
        totalNew
      }
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ {
  .ant-table-tbody {
    .disabled-row {
      pointer-events: none;
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
  .icon {
    cursor: pointer;
    font-size: 20px;
  }
  .icon-plus {
    color: rgb(34, 182, 227);
  }
  .icon-minus {
    color: red;
  }
  .icon-copy {
    color: #8C4EED;
  }
  .icon-paste {
    color: #197c19;
  }
  .hover-effect {
    background-color: #effafa;
  }

  .total-testcase {
    font-size: 16px;
    font-weight: 700;
    float: right;
  }
  .ant-tag {
    margin-right: 0;
  }
}
.test-item {
  color: $primary-color;
  cursor: pointer;
}
</style>
