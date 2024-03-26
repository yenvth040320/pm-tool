<template>
  <a-table
    :columns="caseTestColumns"
    :row-key="record => record.id"
    :data-source="caseTests"
    :pagination="false"
    :custom-row="customRowCaseTest"
    :row-class-name="rowClassName"
    :scroll="{ y: 700 }"
  >
    <template slot="case_test" slot-scope="text, record">
      <span>{{ getCaseTest(record) }}</span>
    </template>
  </a-table>
</template>
<script>

export default {
  props: {
    caseTests: {
      type: Array,
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      project_id: this.$store.state.project.id
    }
  },

  /**
   * Computed event.
   */
  computed: {
    caseTestColumns() {
      return [
        {
          title: this.$t('module.caseTest.list'),
          scopedSlots: { customRender: 'case_test' }
        }
      ]
    }
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * Get conent case test
     * @param {Object} record
     */
    getCaseTest(record) {
      return `${record.test_case_input?.test_object}(${record.test_case_input?.test_case}) - ${record.test_case_output?.test_content}(${record.test_case_output?.expected_result})`
    },

    /**
     * Custom row event of table case test
     */
    customRowCaseTest(record) {
      return {
        on: {
          click: () => {
            this.caseTests.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            record.isSelected = true
            this.$emit('chooseCaseTest', record)
          }
        }
      }
    },

    /**
     * Custom css class for row
     */
    rowClassName(record) {
      if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
    background: transparent;
  }
  .ant-table-tbody {
    .selected {
      background-color: rgb(1, 247, 1) !important;
    }
    > tr {
      cursor: pointer;
    }
  }
  .anticon-plus > svg,
  .anticon-edit > svg,
  .anticon-copy > svg,
  .anticon-delete > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 16px 5px;
  }
}
</style>
