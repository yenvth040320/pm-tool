<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.function.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <span>{{ '[' + version.function.code + ']' + ': ' + version.function.name }}</span>
        <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
      </span>
    </template>

    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.test_case_matrix_result.summary')">
        <SummaryTestCaseMatrixResult
          ref="listTestCase"
          :index="index"
          :spin="spin"
          :data-testcase-result="dataTestcaseResult"
          @change-tab="handleChangeTab"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.test_case_matrix_result.update')">
        <TestcaseMatrixResultComponent
          v-if="matrixResult.id && index !== -1"
          :id="matrixId"
          :matrix="matrixResult"
          :index="index"
          :spin="spin"
          :data-testcase-result="dataTestcaseResult"
          :members="members"
          @saveMatrixResult="saveMatrixResult"
          @changeSpin="$emit('changeSpin')"
          @cancel="cancel"
          @save="save"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import moment from 'moment-timezone'
import { SORT, OUTPUT_DETAIL_TYPE_VALUE } from '~/constants'
import SummaryTestCaseMatrixResult from '~/components/templates/functionResult/SummaryTestCaseMatrixResult'
import TestcaseMatrixResultComponent from '~/components/templates/functionResult/TestcaseMatrixResultComponent'

export default {
  components: {
    SummaryTestCaseMatrixResult,
    TestcaseMatrixResultComponent
  },

  data() {
    return {
      SORT,
      OUTPUT_DETAIL_TYPE_VALUE,
      project_id: this.$store.state.project.id,
      function_id: Number(this.$route.params.id),
      version_code: Number(this.$route.params.version_code),
      function_result_id: Number(this.$route.params.function_result_id),
      version: {},
      moment,
      functionTypeList: [],
      dataTestcaseResult: [],
      members: [],
      spin: false,
      filters: {
        function_type: undefined
      },
      activeKey: '1',
      matrixId: 0,
      matrixResult: {},
      index: -1
    }
  },

  computed: {
  },

  watch: {},

  created() {
    this.getVersionFunctionDetail(this.function_id, this.version_code)
    this.getFunctionTestcaseDetail()
    this.getMemberOfProject()
  },

  mounted() {},

  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_summary',
        2: 'tab_update'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = url.searchParams
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
      if (key === '1' || key === 1) {
        this.$refs.listTestCase.scrollToIndex(this.index)
      }
    },
    async getVersionFunctionDetail(functionId, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (functionId && versionCode) {
          const params = {
            function_id: functionId,
            version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.versionFunction.getDetail({ params })
          this.version = data
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
     * Select box option filter
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
     * Get function testcase matrix output details
     */
    async getFunctionTestcaseDetail() {
      this.spin = true
      try {
        const params = {
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          order_by: 'testcase_group_pk',
          order_type: SORT.asc
        }

        const { data: { result: { data } } } = await this.$api.testcaseMatrix.getFunctionTestcaseDetail({ params })
        data.forEach(itemData => {
          itemData.formatDetail = []
          // const testcaseNumberPks = itemData.testcaseNumbers.map(testcaseNumber => testcaseNumber.testcase_number_pk)
          itemData.testcaseMatrixOutputs.forEach(output => {
            const filteredTestcaseNumberPks = []
            output.testcase_output_results.forEach(result => {
              const testcaseNumber = itemData.testcaseNumbers.find(item => item.testcase_matrix_output_pk === result.testcase_matrix_output_pk)
              if (testcaseNumber && result.testcase_number_pk === testcaseNumber.testcase_number_pk && result.testcase_matrix_output_result === 1) {
                filteredTestcaseNumberPks.push(testcaseNumber.testcase_number_pk)
              }
            })

            itemData.formatDetail.push({
              type: OUTPUT_DETAIL_TYPE_VALUE.result,
              data: output,
              testcase_output_results: output.testcase_output_results
            })
            // TODO: push output details by type to format arr
            let judgement = []
            let executedDate = []
            let executor = []
            if (output.testcase_output_result_details.length > 0) {
              judgement = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.judgement && i.function_result_id === this.function_result_id)
              executedDate = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.executed_date && i.function_result_id === this.function_result_id)
              executor = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.executor && i.function_result_id === this.function_result_id)
            }
            // Push data type 2
            itemData.formatDetail.push({
              type: OUTPUT_DETAIL_TYPE_VALUE.judgement,
              data: output,
              testcase_output_result_details: judgement
            })
            // Type 3
            const resultDetailExecutedDate = executedDate.map(date => date.testcase_number_pk)
            const difference = filteredTestcaseNumberPks.filter(x => !resultDetailExecutedDate.includes(x))
            // Push default data: default executed_date = today
            if (difference.length > 0) {
              difference.forEach(i => {
                executedDate.push(
                  {
                    project_id: this.project_id,
                    function_id: this.function_id,
                    version_code: this.version_code,
                    function_result_id: this.function_result_id,
                    test_case_output_id: output.test_case_output_id,
                    testcase_matrix_output_pk: output.testcase_matrix_output_pk,
                    testcase_number_pk: i,
                    testcase_matrix_pk: output.testcase_matrix_pk,
                    evidence_classify: null,
                    type: OUTPUT_DETAIL_TYPE_VALUE.executed_date,
                    judgement: null,
                    executed_date: moment().format('YYYY-MM-DD'),
                    executor: null
                  }
                )
              })
            }
            itemData.formatDetail.push({
              type: OUTPUT_DETAIL_TYPE_VALUE.executed_date,
              data: output,
              testcase_output_result_details: executedDate
            })
            // Type 4
            const resultDetailExecutor = executor.map(date => date.testcase_number_pk)
            const differenceExecutor = filteredTestcaseNumberPks.filter(x => !resultDetailExecutor.includes(x))
            // Push default data: default executor = logging in user
            if (differenceExecutor.length > 0) {
              differenceExecutor.forEach(i => {
                executor.push(
                  {
                    project_id: this.project_id,
                    function_id: this.function_id,
                    version_code: this.version_code,
                    function_result_id: this.function_result_id,
                    test_case_output_id: output.test_case_output_id,
                    testcase_matrix_output_pk: output.testcase_matrix_output_pk,
                    testcase_number_pk: i,
                    testcase_matrix_pk: output.testcase_matrix_pk,
                    evidence_classify: null,
                    type: OUTPUT_DETAIL_TYPE_VALUE.executor,
                    judgement: null,
                    executed_date: null,
                    executor: this.$auth.user.id
                  }
                )
              })
            }
            itemData.formatDetail.push({
              type: OUTPUT_DETAIL_TYPE_VALUE.executor,
              data: output,
              testcase_output_result_details: executor
            })
            itemData.formatDetail.push({
              type: OUTPUT_DETAIL_TYPE_VALUE.bug,
              data: output,
              testcase_output_result_details: []
            })
          })
        })
        this.dataTestcaseResult = data
        this.dataTestcaseResult.sort((a, b) => {
          if (a.functionItem && b.functionItem) {
            return a.functionItem.item_num - b.functionItem.item_num
          } else {
            return 0
          }
        })
        if (this.$route.query.testcase_matrix_id && this.$route.query.testcase_matrix_id !== null) {
          this.matrixId = Number(this.$route.query.testcase_matrix_id)
          this.index = this.dataTestcaseResult.findIndex(item => item.id === this.matrixId)
          if (this.index !== -1) {
            this.matrixResult = this.dataTestcaseResult[this.index]
          } else {
            this.matrixId = 0
          }
        }
        const tabCheck = window.location.hash.substring(1)
        if (tabCheck === 'tab_summary') {
          this.activeKey = '1'
        } else if (tabCheck === 'tab_update') {
          this.activeKey = '2'
        }
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.spin = false
      }
    },

    /**
     * Get function testcase matrix
     */
    async showTestcaseMatrixResult() {
      this.spin = true
      try {
        const params = {
          id: this.matrixId,
          first: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.testcaseMatrix.getFunctionTestcaseDetail({ params })
        data.formatDetail = []
        const testcaseNumberPks = data.testcaseNumbers.map(testcaseNumber => testcaseNumber.testcase_number_pk)
        data.testcaseMatrixOutputs.forEach(output => {
          data.formatDetail.push({
            type: OUTPUT_DETAIL_TYPE_VALUE.result,
            data: output,
            testcase_output_results: output.testcase_output_results
          })
          // TODO: push output details by type to format arr
          let judgement = []
          let executedDate = []
          let executor = []
          if (output.testcase_output_result_details.length > 0) {
            judgement = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.judgement && i.function_result_id === this.function_result_id)
            executedDate = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.executed_date && i.function_result_id === this.function_result_id)
            executor = output.testcase_output_result_details.filter(i => i.type === OUTPUT_DETAIL_TYPE_VALUE.executor && i.function_result_id === this.function_result_id)
          }
          // Push data type 2
          data.formatDetail.push({
            type: OUTPUT_DETAIL_TYPE_VALUE.judgement,
            data: output,
            testcase_output_result_details: judgement
          })
          // Type 3
          const resultDetailExecutedDate = executedDate.map(date => date.testcase_number_pk)
          const difference = testcaseNumberPks.filter(x => !resultDetailExecutedDate.includes(x))
          // Push default data: default executed_date = today
          if (difference.length > 0) {
            difference.forEach(i => {
              executedDate.push(
                {
                  project_id: this.project_id,
                  function_id: this.function_id,
                  version_code: this.version_code,
                  function_result_id: this.function_result_id,
                  test_case_output_id: output.test_case_output_id,
                  testcase_matrix_output_pk: output.testcase_matrix_output_pk,
                  testcase_number_pk: i,
                  testcase_matrix_pk: output.testcase_matrix_pk,
                  evidence_classify: null,
                  type: OUTPUT_DETAIL_TYPE_VALUE.executed_date,
                  judgement: null,
                  executed_date: moment().format('YYYY-MM-DD'),
                  executor: null
                }
              )
            })
          }
          data.formatDetail.push({
            type: OUTPUT_DETAIL_TYPE_VALUE.executed_date,
            data: output,
            testcase_output_result_details: executedDate
          })
          // Type 4
          const resultDetailExecutor = executor.map(date => date.testcase_number_pk)
          const differenceExecutor = testcaseNumberPks.filter(x => !resultDetailExecutor.includes(x))
          // Push default data: default executor = logging in user
          if (differenceExecutor.length > 0) {
            differenceExecutor.forEach(i => {
              executor.push(
                {
                  project_id: this.project_id,
                  function_id: this.function_id,
                  version_code: this.version_code,
                  function_result_id: this.function_result_id,
                  test_case_output_id: output.test_case_output_id,
                  testcase_matrix_output_pk: output.testcase_matrix_output_pk,
                  testcase_number_pk: i,
                  testcase_matrix_pk: output.testcase_matrix_pk,
                  evidence_classify: null,
                  type: OUTPUT_DETAIL_TYPE_VALUE.executor,
                  judgement: null,
                  executed_date: null,
                  executor: this.$auth.user.id
                }
              )
            })
          }
          data.formatDetail.push({
            type: OUTPUT_DETAIL_TYPE_VALUE.executor,
            data: output,
            testcase_output_result_details: executor
          })
          data.formatDetail.push({
            type: OUTPUT_DETAIL_TYPE_VALUE.bug,
            data: output,
            testcase_output_result_details: []
          })
        })
        return data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.spin = false
      }
    },

    handleChangeTab(matrix, index) {
      this.matrixResult = {}
      this.matrixId = parseInt(matrix.id)
      this.index = index
      this.activeKey = '2'
      this.changeTab(2)
      this.matrixResult = matrix
    },

    /**
     * Get member in project
     *
     * @returns {Promise<void>}
     */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.user.getGroupMembers({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    changeSpin(val) {
      this.spin = val
    },

    saveMatrixResult() {
      this.getFunctionTestcaseDetail()
    },

    cancel() {
      this.activeKey = '1'
      this.changeTab(this.activeKey)
    },

    save() {
      this.matrixId = 0
      this.matrixResult = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.function-type-search-form {
  width: 500px;
}
.auto-create-button {
  margin-top: 4px;
  margin-left: 15px;
}
.note {
  margin-bottom: 0;
}
</style>
