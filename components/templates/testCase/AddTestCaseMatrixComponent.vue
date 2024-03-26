<template>
  <div>
    <a-row
      class="main-row pt-3"
    >
      <div
        class="flex-box"
      >
        <p
          class="testcase-group-name"
        >
          <Editable :text="matrix?.testcaseGroup?.name" @change="onChangeGroupName(matrix, 'name', $event)" />
        </p>
      </div>

      <div class="flex-box">
        <p
          class="testcase-matrix-name"
        >
          ■<Editable :text="matrix.functionItem ? matrix.functionItem.item_num + ' ' + matrix.name : matrix.name" @change="onChangeMatrixName(matrix, 'name', $event)" />
          <a-icon
            v-if="!matrix.id && matrix?.testcaseGroup?.group_type === 0"
            type="setting"
            class="icon-gen-matrix"
            @click="createTestcaseResultTable(index)"
          />
          <a-icon
            v-else-if="matrix.id && matrix?.testcaseGroup?.group_type === 0 && matrix.testcaseNumbers.length === 0"
            type="setting"
            class="icon-gen-matrix"
            @click="createTestcaseResultTableForMatrix(index, matrix)"
          />
        </p>
        <div class="icon-wrap">
          <a-icon
            v-if="matrix?.testcaseGroup?.group_type !== 0 || (matrix.id && matrix?.testcaseGroup?.group_type === 0)"
            type="minus"
            class="icon icon-minus"
            @click="deleteMatix(matrix, index)"
          />
        </div>
      </div>
      <a-table
        :columns="getTestcaseId(matrix.testcaseNumbers, matrix)"
        :data-source="matrix.testcaseMatrixInputs"
        :row-key="getRowKeyInput"
        :pagination="false"
        :row-class-name="rowClassNameInput"
        :components="customWrapperInput"
        :custom-row="customRowInput"
        bordered
        class="matrix-input-table"
      >
        <template slot="index">
          {{ index + 1 }}
        </template>

        <template slot="test_object" slot-scope="text, record">
          <a-textarea
            v-model="record.test_object"
            auto-size
          />
        </template>

        <template slot="test_case" slot-scope="text, record">
          <a-textarea
            v-model="record.test_case"
            auto-size
          />
        </template>

        <template slot="note" slot-scope="text, record">
          <a-textarea
            v-model="record.note"
            auto-size
          />
        </template>

        <template slot="classify" slot-scope="text, record">
          <a-textarea
            v-model="record.classify"
            auto-size
          />
        </template>

        <template slot="action" slot-scope="text, record, inputIndex">
          <a-icon
            type="plus"
            class="icon icon-plus button-container"
            @click="addInputMatrixRow(matrix, inputIndex, record)"
          />
          <a-icon
            type="minus"
            class="icon icon-minus button-container"
            @click="deleteInputMatrixRow(matrix, inputIndex, record)"
          />
        </template>
        <template
          v-for="testcaseNumber in matrix.testcaseNumbers"
          :slot="'testcase_number_pk_' + testcaseNumber.testcase_number_pk"
          slot-scope="text, record"
        >
          <a-select
            :key="testcaseNumber.id"
            :value="convertResultInputData(record.testcase_input_results, testcaseNumber)"
            style="width: 50px"
            @change="handleInputResultChange(record, testcaseNumber, $event)"
          >
            <a-select-option
              v-for="item in CHECK_MATRIX_INPUT"
              :key="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
      </a-table>
      <a-table
        :columns="getMatrixOutputResultHeaders(matrix)"
        :data-source="matrix.testcaseMatrixOutputs"
        :row-key="getRowKeyOutput"
        :pagination="false"
        :components="customWrapperOutput"
        :custom-row="customRowOutput"
        :row-class-name="rowClassNameOutput"
        bordered
      >
        <span slot="customMatrixIndexColTitle">
          {{ index + 1 }}
        </span>

        <template slot="index">
          {{ index + 1 }}
        </template>

        <template slot="test_content" slot-scope="text, record">
          <a-textarea
            v-model="record.test_content"
            auto-size
          />
        </template>

        <template slot="expected_result" slot-scope="text, record">
          <a-textarea
            v-model="record.expected_result"
            auto-size
          />
        </template>

        <template slot="action" slot-scope="text, record, outputIndex">
          <a-icon
            type="plus"
            class="icon icon-plus button-container"
            @click="addOutputMatrixRow(matrix, outputIndex)"
          />
          <a-icon
            type="minus"
            class="icon icon-minus button-container"
            @click="deleteOutputMatrixRow(matrix, outputIndex, record)"
          />
        </template>

        <template
          v-if="matrix.id !== null"
          slot="evidence"
          slot-scope="text, record"
        >
          <a-select
            :value="convertEvidenceTypeValue(record.testcase_output_results)"
            @change="onChangeEvidenceType(record, matrix.testcaseNumbers, $event)"
          >
            <a-select-option
              v-for="item in EVIDENCE_TYPE"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template
          v-if="matrix.id !== null"
          slot="achievements"
        >
          {{ $t('module.testcase_output_result_detail.type_result') }}
        </template>
        <template
          v-for="testcaseNumber in matrix.testcaseNumbers"
          :slot="'testcase_number_pk_' + testcaseNumber.testcase_number_pk"
          slot-scope="text, record"
        >
          <a-select
            :key="testcaseNumber.testcase_number_pk"
            :value="convertResultOutputData(record.testcase_output_results, testcaseNumber)"
            style="width: 50px"
            @change="handleOutputResultChange(record, testcaseNumber, $event)"
          >
            <a-select-option
              v-for="item in CHECK_MATRIX_OUTPUT"
              :key="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </template>
      </a-table>
    </a-row>
    <div
      class="text-center p-4"
    >
      <a-button
        html-type="button"
        type="default"
        class="min-w-100"
        @click="cancel"
      >
        {{ $t('common.cancel') }}
      </a-button>
      <a-button html-type="button" type="primary" @click.prevent="saveMatrix(index)">
        {{ $t('common.save') }}
      </a-button>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import {
  GROUP_TEST_CASE,
  SORT,
  CHECK_MATRIX_OUTPUT,
  CHECK_MATRIX_INPUT,
  EVIDENCE_TYPE,
  GROUP_TEST_CASE_NAME,
  GROUP_TEST_CASE_VALUE,
  USE_FLG_VALUE
} from '~/constants'
import Editable from '~/components/templates/testCase/Editable'
import DraggableTestCaseMatrixInput from '~/components/templates/testCase/DraggableTestCaseMatrixInput'
import DraggableTestCaseMatrixOutput from '~/components/templates/testCase/DraggableTestCaseMatrixOutput'

export default {
  components: {
    Editable
  },
  provide() {
    return {
      data: {
        changePosition: this.changePosition
      },
      list: this
    }
  },
  props: {
    spin: {
      type: Boolean,
      default: false
    },
    testcaseMatrixs: {
      type: Array,
      default: () => []
    },
    matrix: {
      type: Object,
      default: () => {}
    },
    index: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      GROUP_TEST_CASE_NAME,
      GROUP_TEST_CASE,
      SORT,
      CHECK_MATRIX_OUTPUT,
      CHECK_MATRIX_INPUT,
      EVIDENCE_TYPE,
      GROUP_TEST_CASE_VALUE,
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code,
      USE_FLG_VALUE,
      currentGroupType: null,
      displayedGroups: [],
      deleteNumber: [],
      deleteInput: [],
      deleteOutput: [],
      clipboardDataInput: null,
      clipboardDataOutput: null,
      isIconPaste: false,
      dataTestcaseMatrix: this.testcaseMatrixs,
      idOrderArray: [],
      selectedRowInput: [],
      selectedRowOutput: [],
      loading: false,
      customWrapperInput: {
        body: {
          wrapper: DraggableTestCaseMatrixInput
        }
      },
      customWrapperOutput: {
        body: {
          wrapper: DraggableTestCaseMatrixOutput
        }
      }
    }
  },
  computed: {
    inputMatrixColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_object'),
          scopedSlots: { customRender: 'test_object' },
          align: 'center',
          width: 200,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-test-object'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-test-object'
            }
          }
        },
        {
          title: this.$t('module.caseTest.test_case'),
          scopedSlots: { customRender: 'test_case' },
          align: 'center',
          width: 200,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-test-case'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-test-case'
            }
          }
        },
        {
          title: this.$t('module.test_case_matrix.note'),
          scopedSlots: { customRender: 'note' },
          align: 'center',
          width: 180,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-note'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-note'
            }
          }
        },
        {
          scopedSlots: { customRender: 'action' },
          width: 100,
          customCell: () => {
            return {
              class: 'custom-action-col fixed__column-action'
            }
          },
          customHeaderCell: () => {
            return {
              class: 'custom-action-col-header fixed__column-action'
            }
          }
        }
      ]
    },

    outputMatrixColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_content'),
          scopedSlots: { customRender: 'test_content' },
          align: 'center',
          width: 200,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-test-object'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-test-object'
            }
          }
        },
        {
          title: this.$t('module.caseTest.expected_result'),
          scopedSlots: { customRender: 'expected_result' },
          align: 'center',
          width: 200,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-test-case'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-test-case'
            }
          }
        },
        {
          title: '-',
          scopedSlots: { customRender: 'note' },
          align: 'center',
          width: 180,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-note'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-note'
            }
          }
        },
        {
          scopedSlots: { customRender: 'action' },
          width: 100,
          customCell: () => {
            return {
              class: 'custom-action-col fixed__column-action'
            }
          },
          customHeaderCell: () => {
            return {
              class: 'custom-action-col-header fixed__column-action'
            }
          }
        }
      ]
    },

    shouldShowPasteButton() {
      return this.$store.state.testcase_matrix !== null
    }
  },
  watch: {
    testcaseMatrixs: {
      immediate: true,
      handler(newVal) {
        this.updateTestCaseData(newVal)
        this.dataTestcaseMatrix = newVal
      }
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('clearClipboardData')
  },
  methods: {
    /**
       * Get list test case validation
       */
    updateTestCaseData(newVal) {
      this.matrix.testcaseMatrixInputs = this.matrix.testcaseMatrixInputs.map(item => {
        return { ...item, isSelected: false }
      })
      this.matrix.testcaseMatrixOutputs = this.matrix.testcaseMatrixOutputs.map(item => {
        return { ...item, isSelected: false }
      })

      this.matrix.testcaseNumbers = this.matrix.testcaseNumbers.map(item => {
        return { ...item, isSelected: false }
      })
    },

    checkOrderValidity() {
      for (let index = 0; index < this.dataTestcaseMatrix.length; index++) {
        const matrix = this.dataTestcaseMatrix[index]
        if (matrix.id) {
          if (matrix.order !== index + 1) {
            return false
          }
        }
      }
      return true
    },

    async updateOrderForAllMatrices() {
      try {
        const isOrderValid = this.checkOrderValidity()
        if (!isOrderValid) {
          for (let i = 0; i < this.dataTestcaseMatrix.length; i++) {
            this.dataTestcaseMatrix[i].order = i + 1
          }

          let data = cloneDeep(this.dataTestcaseMatrix)
          data = data.filter(item => item.id && item.id !== null)
          data.forEach(item => {
            delete item.functionItem
            delete item.testcaseGroup
            delete item.testcaseMatrixInputs
            delete item.testcaseMatrixOutputs
            delete item.testcaseNumbers
            delete item.project
          })
          await this.$api.testcaseMatrix.updateOrder(data)
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
           * On change group name
           *
           * @param matrix
           * @param dataIndex field.
           * @param value value.
           */
    onChangeGroupName(matrix, dataIndex, value) {
      const dataSource = [...this.dataTestcaseMatrix]
      const target = dataSource.find(item => item.id === matrix.id)
      if (target) {
        target.testcaseGroup[dataIndex] = value
        this.dataTestcaseMatrix = dataSource
      }
    },

    /**
           * On change testcase matrix name
           *
           * @param matrix
           * @param dataIndex field.
           * @param value value.
           */
    onChangeMatrixName(matrix, dataIndex, value) {
      const dataSource = [...this.dataTestcaseMatrix]
      const target = dataSource.find(item => item.id === matrix.id)
      if (target) {
        target[dataIndex] = value
        this.dataTestcaseMatrix = dataSource
      }
    },

    /**
           * Add 1 row to input matrix table
           *
           * @param matrix Matrix Testcase.
           */
    addInputMatrixRow(matrix, dataIndex, record) {
      matrix.testcaseMatrixInputs.splice(dataIndex + 1, 0, {
        id: 0,
        testcase_matrix_input_pk: null,
        project_id: this.project_id,
        function_id: this.function_id,
        version_code: this.version_code,
        test_case_input_id: null,
        testcase_matrix_pk: matrix.testcase_matrix_pk,
        test_object: null,
        test_case: null,
        note: null,
        classify: null,
        testcase_input_results: []
      })
    },

    /**
           * Delete 1 row in input matrix table
           *
           * @param matrix Matrix Testcase.
           * @param index Index of item in testcaseMatrixInputs.
           * @param record Item in testcaseMatrixInputs.
           */
    deleteInputMatrixRow(matrix, index, record) {
      matrix.testcaseMatrixInputs.splice(index, 1)
      if (record.id > 0) {
        this.deleteInput.push(record)
      }
    },

    copyMatrixInput(matrix, index, record) {
      const push = cloneDeep(record)
      push.id = 0
      push.testcase_matrix_input_pk = null
      push.testcase_input_results = []
      push.test_case_input_id = null
      push.testcase_matrix_pk = null
      delete push.created_at
      delete push.updated_at
      delete push.is_deleted
      delete push.last_update_date
      delete push.testcase_input
      this.$store.dispatch('copyTestCaseMatrixInput', push)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    pasteMatrixInput(matrix, index, record) {
      const dataCopy = this.$store.state.testcase_matrix_inputs
      const data = cloneDeep(dataCopy)
      data.testcase_matrix_pk = matrix.testcase_matrix_pk
      matrix.testcaseMatrixInputs.splice(index + 1, 0, data)
    },

    /**
           * Add 1 row to output matrix table
           *
           * @param matrix Matrix Testcase.
           */
    addOutputMatrixRow(matrix, dataIndex) {
      matrix.testcaseMatrixOutputs.splice(dataIndex + 1, 0, {
        id: 0,
        testcase_matrix_output_pk: null,
        project_id: this.project_id,
        function_id: this.function_id,
        version_code: this.version_code,
        test_case_output_id: null,
        testcase_matrix_pk: matrix.testcase_matrix_pk,
        test_content: null,
        expected_result: null,
        testcase_output_results: []
      })
    },

    /**
           * Delete 1 row in output matrix table
           *
           * @param matrix Matrix Testcase.
           * @param index Index of item in testcaseMatrixOutputs.
           * @param record Item in testcaseMatrixOutputs.
           */
    deleteOutputMatrixRow(matrix, index, record) {
      matrix.testcaseMatrixOutputs.splice(index, 1)
      if (record.id > 0) {
        this.deleteOutput.push(record)
      }
    },

    copyMatrixOutput(matrix, index, record) {
      const push = cloneDeep(record)
      push.id = 0
      push.testcase_matrix_output_pk = null
      push.testcase_output_results = []
      push.test_case_output_id = null
      push.testcase_matrix_pk = null
      delete push.created_at
      delete push.updated_at
      delete push.is_deleted
      delete push.last_update_date
      delete push.testcase_output
      this.$store.dispatch('copyTestCaseMatrixOutput', push)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    pasteMatrixOutput(matrix, index, record) {
      const dataCopy = this.$store.state.testcase_matrix_outputs
      const data = cloneDeep(dataCopy)
      data.testcase_matrix_pk = matrix.testcase_matrix_pk
      matrix.testcaseMatrixOutputs.splice(index + 1, 0, data)
    },

    shouldShowDeleteMatrix() {
      const countGroupTypeThree = this.dataTestcaseMatrix.filter(
        record => record.testcaseGroup && record.testcaseGroup.group_type === 3
      ).length

      return countGroupTypeThree >= 2
    },

    /**
           * Add New Testcase Group
           */
    addNewTestcaseGroup() {
      this.dataTestcaseMatrix.push({
        id: null,
        project_id: this.project_id,
        function_id: this.function_id,
        version_code: this.version_code,
        testcase_matrix_pk: null,
        testcase_group_pk: null,
        item_pk: null,
        name: this.$t('module.test_case_matrix.default_testcase_group_name'),
        testcaseGroup: {
          id: 0,
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          name: this.$t('module.test_case_matrix.default_testcase_group_name'),
          group_type: 0,
          testcase_group_pk: null
        },
        testcaseNumbers: [],
        testcaseMatrixInputs: [
          {
            id: 0,
            testcase_matrix_input_pk: null,
            project_id: this.project_id,
            function_id: this.function_id,
            version_code: this.version_code,
            test_case_input_id: null,
            testcase_matrix_pk: null,
            test_object: null,
            test_case: null,
            note: null,
            classify: null,
            testcase_input_results: []
          }
        ],
        testcaseMatrixOutputs: [
          {
            id: 0,
            testcase_matrix_output_pk: null,
            project_id: this.project_id,
            function_id: this.function_id,
            version_code: this.version_code,
            test_case_output_id: null,
            testcase_matrix_pk: null,
            test_content: null,
            expected_result: null,
            testcase_output_results: []
          }
        ]
      })
    },

    /**
           * Delete Testcase Group
           */
    deleteTestcaseGroup(index, matrix) {
      if (matrix.id === 0) {
        this.dataTestcaseMatrix.splice(index, 1)
      }
    },

    /**
           * Get header testcase id
           */
    getTestcaseId(testcaseNumbers, matrix) {
      const hiddenHeader = {
        title: '',
        width: 120,
        customHeaderCell: () => {
          return {
            class: 'hidden-header-output'
          }
        },
        customCell: () => {
          return {
            class: 'custom-action-col'
          }
        }
      }

      const result = []
      testcaseNumbers.forEach((i, index) => {
        const isInputNull = i.testcase_input === null && i.test_case_input_id !== null
        const isOutputNull = i.testcase_output === null && i.test_case_output_id !== null
        this.selectedRowInput.forEach(selectedInputId => {
          const selectedInput = this.matrix.testcaseMatrixInputs.find(item => item.id === selectedInputId)
          let isResultExist = false
          if (selectedInput) {
            isResultExist = selectedInput.testcase_input_results.some(result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_input_result === 1)
            if (isResultExist) {
              const matchingOutputs = this.matrix.testcaseMatrixOutputs.filter(output =>
                output.testcase_output_results.some(
                  result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_output_result === 1
                )
              )
              matchingOutputs.forEach(matchingOutput => {
                if (matchingOutput && !this.selectedRowOutput.includes(matchingOutput.id)) {
                  this.selectedRowOutput.push(matchingOutput.id)
                  matchingOutput.isSelected = true
                }
              })
            }
          }
        })

        if (this.selectedRowOutput.length > 0 && this.matrix.testcaseMatrixOutputs.some(item => item.isSelected === true)) {
          this.matrix.testcaseMatrixOutputs.forEach(item => {
            if (!this.selectedRowOutput.includes(item.id) && item.isSelected === true) {
              item.isSelected = false
            }
          })
        }

        const customCellFunction = () => {
          const classes = {
            'disabled-column': isInputNull || isOutputNull,
            'testcase-evidence-output-col': !isInputNull && !isOutputNull,
            selected: this.selectedRowInput.includes(i.id) && this.selectedRowOutput.includes(i.id)
          }
          return {
            class: classes
          }
        }
        result.push({
          title: () => {
            if (matrix.testcaseGroup.group_type > 0 || matrix.id !== 0) {
              return (
                <div class="testcase-number">
                  <span class="testcase-number-number">{i.number}</span>
                  <div class="testcase-number-action-btn">
                    <a-icon type="plus" class="icon icon-plus" onClick={() => this.addTestcaseNumber(testcaseNumbers, i.testcase_matrix_pk, index)}></a-icon>
                    <a-icon type="minus" class="icon icon-minus" onClick={() => this.deleteTestcaseNumber(testcaseNumbers, index, i, matrix)}></a-icon>
                  </div>
                </div>
              )
            } else {
              return (
                <div class="testcase-number">
                  <span class="testcase-number-number">{i.number}</span>
                </div>
              )
            }
          },
          scopedSlots: { customRender: `testcase_number_pk_${i.testcase_number_pk}` },
          align: 'center',
          width: 50,
          customHeaderCell: () => {
            return {
              class: 'testcase-evidence-output-header'
            }
          },
          customCell: customCellFunction
        })
      })

      result.unshift(hiddenHeader)
      result.unshift(...this.inputMatrixColumns)
      return result
    },

    /**
           * Get Matrix Output Result Headers
           */
    getMatrixOutputResultHeaders(matrix) {
      const testcaseNumbers = matrix.testcaseNumbers
      const actionHeader =
          {
            title: this.$t('module.testcase_output_result_detail.result_title'),
            scopedSlots: { customRender: 'achievements' },
            align: 'center',
            width: 120,
            customHeaderCell: () => {
              return {
                class: 'testcase-evidence-header'
              }
            },
            customCell: () => {
              return {
                class: 'testcase-evidence-col'
              }
            }
          }

      const result = []
      testcaseNumbers.forEach(i => {
        const isInputNull = i.testcase_input === null && i.test_case_input_id !== null
        const isOutputNull = i.testcase_output === null && i.test_case_output_id !== null
        this.selectedRowOutput.forEach(selectedOutputId => {
          const selectedOutput = this.matrix.testcaseMatrixOutputs.find(item => item.id === selectedOutputId)
          let isResultExist = false
          if (selectedOutput) {
            isResultExist = selectedOutput.testcase_output_results.some(result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_output_result === 1)
            if (isResultExist) {
              const matchingInputs = this.matrix.testcaseMatrixInputs.filter(input =>
                input.testcase_input_results.some(
                  result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_input_result === 1
                )
              )
              matchingInputs.forEach(matchingInput => {
                if (matchingInput && !this.selectedRowInput.includes(matchingInput.id)) {
                  this.selectedRowInput.push(matchingInput.id)
                  matchingInput.isSelected = true
                }
              })
            }
          }
        })
        if (this.selectedRowInput.length > 0 && this.matrix.testcaseMatrixInputs.some(item => item.isSelected === true)) {
          this.matrix.testcaseMatrixInputs.forEach(item => {
            if (!this.selectedRowInput.includes(item.id) && item.isSelected === true) {
              item.isSelected = false
            }
          })
        }
        const customCellFunction = () => {
          const classes = {
            'disabled-column': isInputNull || isOutputNull,
            'testcase-evidence-output-col': !isInputNull && !isOutputNull,
            selected: this.selectedRowInput.includes(i.id) && this.selectedRowOutput.includes(i.id)
          }
          return {
            class: classes
          }
        }
        result.push({
          title: '-',
          scopedSlots: { customRender: `testcase_number_pk_${i.testcase_number_pk}` },
          align: 'center',
          width: 50,
          customHeaderCell: () => {
            return {
              class: 'testcase-evidence-output-header'
            }
          },
          customCell: customCellFunction
        })
      })
      if (matrix.id !== null) {
        result.unshift(actionHeader)
      }

      result.unshift(...this.outputMatrixColumns)
      return result
    },

    /**
           * Convert result input data and map with correct testcase number pk
           */
    convertResultInputData(testcaseInputResults, testcaseNumber) {
      if (testcaseInputResults.length > 0) {
        for (const inputResult of testcaseInputResults) {
          if (inputResult.testcase_number_pk === testcaseNumber.testcase_number_pk) {
            return inputResult.testcase_matrix_input_result
          }
        }
        return null
      } else {
        return null
      }
    },

    /**
           * Convert result output data and map with correct testcase number pk
           */
    convertResultOutputData(testcaseOutputResults, testcaseNumber) {
      if (testcaseOutputResults.length > 0) {
        for (const outputResult of testcaseOutputResults) {
          if (outputResult.testcase_number_pk === testcaseNumber.testcase_number_pk) {
            return outputResult.testcase_matrix_output_result
          }
        }
        return null
      } else {
        return null
      }
    },

    /**
           * On click input column, add new testcase number
           */
    addTestcaseNumber(testcaseNumbers, pk, index) {
      let allTestcaseNumbers = []
      this.dataTestcaseMatrix.forEach(record => {
        allTestcaseNumbers = allTestcaseNumbers.concat(record.testcaseNumbers)
      })

      const maxTestcaseNumberPk = Math.max(...allTestcaseNumbers.map(record => record.testcase_number_pk))
      const newTestcaseNumber = {
        id: 0,
        testcase_number_pk: maxTestcaseNumberPk + 1,
        temporary_pk: maxTestcaseNumberPk + 1,
        project_id: this.project_id,
        function_id: this.function_id,
        version_code: this.version_code,
        testcase_matrix_pk: pk,
        number: testcaseNumbers[index].number + 1,
        testcase_matrix_output_pk: undefined,
        testcase_matrix_input_pk: undefined
      }
      for (let i = index + 1; i < testcaseNumbers.length; i++) {
        testcaseNumbers[i].number++
      }
      testcaseNumbers.splice(index + 1, 0, newTestcaseNumber)
    },

    /**
           * Delete testcase number
           */
    deleteTestcaseNumber(testcaseNumbers, index, item, matrix) {
      const deletedTestcaseNumberPK = item.testcase_number_pk
      testcaseNumbers.splice(index, 1)
      if (item.id !== 0) {
        this.deleteNumber.push(item)
      }
      if (matrix.testcaseMatrixInputs) {
        matrix.testcaseMatrixInputs.forEach(input => {
          const indexToDelete = input.testcase_input_results.findIndex(e => e.testcase_number_pk === deletedTestcaseNumberPK)
          if (indexToDelete !== -1) {
            input.testcase_input_results.splice(indexToDelete, 1)
          }
        })
      }

      if (matrix.testcaseMatrixOutputs) {
        matrix.testcaseMatrixOutputs.forEach(output => {
          const index = output.testcase_output_results.findIndex(e => e.testcase_number_pk === deletedTestcaseNumberPK)
          if (index !== -1) {
            output.testcase_output_results.splice(index, 1)
          }
        })
      }
    },

    /**
           * On change input result select box
           *
           * @param record Matrix testcaseMatrixInputs record.
           * @param testcaseNumber Testcase Number.
           * @param event Event target value.
           */
    handleInputResultChange(record, testcaseNumber, event) {
      const index = record.testcase_input_results.findIndex(e => e.testcase_number_pk === testcaseNumber.testcase_number_pk)
      testcaseNumber.testcase_matrix_input_pk = record.testcase_matrix_input_pk ?? undefined
      if (index > -1) {
        record.testcase_input_results[index].testcase_matrix_input_result = event
      } else {
        record.testcase_input_results.push(
          {
            project_id: this.project_id,
            function_id: this.function_id,
            version_code: this.version_code,
            test_case_input_id: record.test_case_input_id,
            testcase_matrix_pk: record.testcase_matrix_pk,
            testcase_matrix_input_pk: record.testcase_matrix_input_pk,
            testcase_number_pk: testcaseNumber.testcase_number_pk,
            testcase_number_temporary_pk: testcaseNumber.temporary_pk ?? null,
            testcase_matrix_input_result: event
          }
        )
      }
    },

    /**
           * On change output result select box
           *
           * @param record Matrix testcaseMatrixOutputs record.
           * @param testcaseNumber Testcase Number.
           * @param event Event target value.
           */
    handleOutputResultChange(record, testcaseNumber, event) {
      const index = record.testcase_output_results.findIndex(e => e.testcase_number_pk === testcaseNumber.testcase_number_pk)
      testcaseNumber.testcase_matrix_output_pk = record.testcase_matrix_output_pk ?? undefined
      if (index > -1) {
        record.testcase_output_results[index].testcase_matrix_output_result = event
      } else {
        record.testcase_output_results.push(
          {
            project_id: this.project_id,
            function_id: this.function_id,
            version_code: this.version_code,
            test_case_output_id: record.test_case_output_id,
            testcase_matrix_pk: record.testcase_matrix_pk,
            testcase_matrix_output_pk: record.testcase_matrix_output_pk,
            testcase_number_pk: testcaseNumber.testcase_number_pk,
            testcase_number_temporary_pk: testcaseNumber.temporary_pk ?? null,
            testcase_matrix_output_result: event,
            evidence_classify: null
          }
        )
      }
    },

    createTestcaseResultTable(index) {
      const quantityOfTestcase = this.dataTestcaseMatrix[index].testcaseMatrixInputs.length
      const newMatrix = []
      for (let i = 1; i <= quantityOfTestcase; i++) {
        newMatrix.push({
          id: 0,
          testcase_number_pk: i,
          temporary_pk: i,
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          testcase_matrix_pk: this.dataTestcaseMatrix[index].testcase_matrix_pk,
          number: i
        })
      }
      this.dataTestcaseMatrix[index].id = 0
      this.dataTestcaseMatrix[index].testcaseNumbers = newMatrix
    },

    createTestcaseResultTableForMatrix(index, matrix) {
      const quantityOfTestcase = matrix.testcaseMatrixInputs.length
      const newNumber = []
      for (let i = 1; i <= quantityOfTestcase; i++) {
        newNumber.push({
          id: 0,
          testcase_number_pk: i,
          temporary_pk: i,
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          testcase_matrix_pk: matrix.testcase_matrix_pk,
          number: i
        })
      }
      matrix.testcaseNumbers = newNumber
    },

    onChangeEvidenceType(record, testcaseNumbers, event) {
      if (record.testcase_output_results.length === 0) {
        for (let i = 0; i < testcaseNumbers.length; i++) {
          record.testcase_output_results.push(
            {
              project_id: this.project_id,
              function_id: this.function_id,
              version_code: this.version_code,
              test_case_output_id: record.test_case_output_id,
              testcase_matrix_pk: record.testcase_matrix_pk,
              testcase_matrix_output_pk: record.testcase_matrix_output_pk,
              testcase_number_pk: testcaseNumbers[i].testcase_number_pk,
              testcase_number_temporary_pk: testcaseNumbers[i].temporary_pk ?? null,
              testcase_matrix_output_result: null,
              evidence_classify: event
            }
          )
        }
      } else {
        testcaseNumbers.forEach(testcaseNumber => {
          const find = record.testcase_output_results.find(result => result.testcase_number_pk === testcaseNumber.testcase_number_pk)
          if (find) {
            find.evidence_classify = event
          } else {
            record.testcase_output_results.push(
              {
                project_id: this.project_id,
                function_id: this.function_id,
                version_code: this.version_code,
                test_case_output_id: record.test_case_output_id,
                testcase_matrix_pk: record.testcase_matrix_pk,
                testcase_matrix_output_pk: record.testcase_matrix_output_pk,
                testcase_number_pk: testcaseNumber.testcase_number_pk,
                testcase_number_temporary_pk: testcaseNumber.temporary_pk ?? null,
                testcase_matrix_output_result: null,
                evidence_classify: event
              }
            )
          }
        })
      }
    },

    /**
           * Set table class
           *
           * @param {array} record
           */
    rowClassNameInput(record) {
      if (record.testcase_input === null && record.test_case_input_id !== null) {
        return 'disabled-row'
      } else if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
           * Set table class
           *
           * @param {array} record
           */
    rowClassNameOutput(record) {
      if (record.testcase_output === null && record.test_case_output_id !== null) {
        return 'disabled-row'
      } else if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    deleteMatix(matrix, index) {
      if (!matrix.id || matrix.id === 0) {
        this.dataTestcaseMatrix.splice(index, 1)
      } else {
        this.confirmToDelete(matrix.id)
      }
    },

    /**
         * Confirm to delete
         *
         * @param {Number} id
         */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteTestCaseMatrix(id)
      })
    },

    /**
         * Custom row event of table column left
         */
    customRowInput(record) {
      return {
        on: {
          click: () => {
          },
          dblclick: () => {
            this.selectedRowOutput = []
            this.matrix.testcaseMatrixOutputs.forEach(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            if (this.selectedRowInput.length > 0 && this.matrix.testcaseMatrixInputs.some(item => item.isSelected === true)) {
              this.matrix.testcaseMatrixInputs.filter(item => this.selectedRowInput.includes(item.id)).forEach(item => { item.isSelected = false })
            }
            this.selectedRowInput = [record.id]
            record.isSelected = true
          }
        }
      }
    },

    /**
         * Custom row event of table column left
         */
    customRowOutput(record) {
      return {
        on: {
          dblclick: () => {
            this.selectedRowInput = []
            this.matrix.testcaseMatrixInputs.forEach(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            if (this.selectedRowOutput.length > 0 && this.matrix.testcaseMatrixOutputs.some(item => item.isSelected === true)) {
              this.matrix.testcaseMatrixOutputs.filter(item => this.selectedRowOutput.includes(item.id)).forEach(item => { item.isSelected = false })
            }
            this.selectedRowOutput = [record.id]
            record.isSelected = true
          }
        }
      }
    },

    /**
         * Delete record
         *
         * @param {Number} id
         */
    async deleteTestCaseMatrix(id) {
      this.$emit('changeSpin', true)

      try {
        await this.$api.testcaseMatrix.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveMatrixResult')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    },

    async saveMatrix(index) {
      this.$emit('changeSpin', true)
      try {
        const data = {}
        data.testCaseMatrix = { ...this.matrix }
        data.deleteInput = this.deleteInput
        data.deleteOutput = this.deleteOutput
        data.deleteTestcaseNumber = this.deleteNumber
        if (data.testCaseMatrix.testcaseMatrixInputs) {
          data.testCaseMatrix.testcaseMatrixInputs = data.testCaseMatrix.testcaseMatrixInputs.map((input, index) => ({
            ...input,
            order: index + 1
          }))
        }

        if (data.testCaseMatrix.testcaseMatrixOutputs) {
          data.testCaseMatrix.testcaseMatrixOutputs = data.testCaseMatrix.testcaseMatrixOutputs.map((output, index) => ({
            ...output,
            order: index + 1
          }))
        }

        if (data.testCaseMatrix.testcaseNumbers) {
          data.testCaseMatrix.testcaseNumbers = data.testCaseMatrix.testcaseNumbers.map((output, index) => ({
            ...output,
            order: index + 1
          }))
        }
        if (!data.testCaseMatrix.order) {
          data.testCaseMatrix.order = index + 1
        }
        await this.$api.testcaseMatrix.saveTestcaseMatrix(data)
        await this.updateOrderForAllMatrices()

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$store.dispatch('clearClipboardData')
        this.$emit('saveMatrixResult')
        this.$emit('close')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    },

    cancel() {
      this.$emit('cancel')
    },

    convertEvidenceTypeValue(testcaseOutputResults) {
      if (testcaseOutputResults.length > 0) {
        return testcaseOutputResults[0].evidence_classify
      }
      return null
    },

    getRowKeyInput() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },

    getRowKeyOutput() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },

    async changePosition(newData, rep) {
      for (let i = 0; i < this.matrix[rep].length; i++) {
        this.matrix[rep][i].order = i + 1
      }
      this.$emit('changeSpin', true)
      try {
        if (rep === 'testcaseMatrixInputs') {
          const dataInput = cloneDeep(this.matrix[rep])
          dataInput.forEach(item => {
            delete item.testcase_input
            delete item.testcase_input_results
            delete item.created_at
            delete item.is_deleted
            delete item.updated_at
            delete item.isSelected
          })

          await this.$api.testcaseMatrixInput.updateOrder(dataInput)
        }
        if (rep === 'testcaseMatrixOutputs') {
          const dataOutput = cloneDeep(this.matrix[rep])
          dataOutput.forEach(item => {
            delete item.testcase_output
            delete item.testcase_output_results
            delete item.created_at
            delete item.is_deleted
            delete item.updated_at
            delete item.isSelected
          })
          await this.$api.testcaseMatrixOutput.updateOrder(dataOutput)
        }
        this.$emit('saveMatrixResult')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    }
  }
}
</script>
      <style scoped lang="scss">
      /deep/ {
        .ant-table-tbody {
          > tr {
            cursor: pointer;
          }
        }
        .ant-table-tbody {
          .disabled-row {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
            .button-container {
              pointer-events: auto;
            }
          }
        }
        .ant-select {
          max-width: 128px;
          width: 100%;
        }

        .disabled-column {
          background-color: rgba(217, 217, 217, 0.5);
          border-right: 1px solid rgb(40,42,53) !important;
          border-bottom: 1px solid rgb(40,42,53) !important;
        }
        .ant-table table {
          width: auto;
        }
        .custom-index-header {
          border-top-left-radius: 0 !important;
          color: #000000a6 !important;
          background-color: transparent !important;
          font-weight: normal;
        }
        .ant-table-thead > tr:first-child > th:last-child {
          border-top-right-radius: 0;
        }
        .ant-table-thead > tr:first-child > th:first-child {
          border-top-left-radius: 0;
        }
        .ant-table-thead > tr > th {
          background: #6a9356;
        }
        .ant-table table {
          border-top: none;
        }
        .ant-table-thead > tr > th,
        .ant-table-tbody > tr > td {
          padding: 12px 5px !important;
          height: 20px !important;
        }
        .custom-action-col-header {
          background: #fff !important;
          border-right: none !important;
          border-bottom: none !important;
        }
        .normal-header {
          background: #fff !important;
          border-right: none !important;
          border-bottom: none !important;
        }
        .testcase-evidence-col {
          background: #DEEAF6 !important;
          border-right: 1px solid rgb(40,42,53) !important;
          border-bottom: 1px solid rgb(40,42,53) !important;
        }
        .testcase-evidence-header {
          background: #DEEAF6 !important;
          border-right: 1px solid rgb(40,42,53) !important;
          border-bottom: 1px solid rgb(40,42,53) !important;
        }
        .hidden-header-output {
          background: #fff !important;
          border-right: none !important;
          border-bottom: none !important;
        }
        .testcase-evidence-output-header {
          background: rgb(127,127,127) !important;
          border-right: 1px solid rgb(40,42,53) !important;
          border-bottom: 1px solid rgb(40,42,53) !important;
        }
        .testcase-evidence-output-col {
          border-right: 1px solid rgb(40,42,53) !important;
          border-bottom: 1px solid rgb(40,42,53) !important;
        }
        .custom-action-col {
          border-right: none !important;
          border-bottom: none !important;
        }
        .custom-maxtrix-col-header {
          background: #767a74 !important;
          color: #fff !important;
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
        .border-left {
          border-left: 1px solid #e8e8e8 !important;
        }
        .group-test-case {
          height: 33px;
          margin-right: 25px;
          display: flex;
          justify-content: space-between;
        }
        .anticon-setting > svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      .testcase-matrix {
        margin-bottom: 30px;
      }
      .testcase-group-name {
        margin-bottom: 0;
        background-color: rgb(109,158,235);
        padding-left: 5px;
        width: 580px;
      }
      .testcase-matrix-name {
        margin-bottom: 0;
        background-color: rgb(201,218,248);
        width: 580px;
        display: flex;
      }
      .flex-box {
        display: flex;
      }
      .icon-wrap {
        margin-left: 6px;
      }
      .testcase-number-action-btn {
        bottom: 55px;
        right: 20px;
        position: relative;
      }
      .testcase-number {
        position: absolute;
        width: 40px;
      }
      .testcase-number-number {
        margin-left: -40px;
      }
      .icon-gen-matrix {
        margin-right: 5px;
        cursor: pointer;
      }
      .main-row {
        overflow-x: auto;
      }
      :deep() {

        .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td:not(.selected) {
          background: transparent;
        }
        .ant-table-tbody {
          .selected {
            background-color: #e6f7ff;
          }
        }
        .disabled-row {
          .fixed__column-index {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
          .fixed__column-test-object {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
          .fixed__column-test-case {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
          .fixed__column-note {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
          .fixed__column-classify {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
          .fixed__column-action {
            background-color: rgba(217, 217, 217, 0.5);
            td {
              text-decoration: line-through;
            }
          }
        }

        .ant-table-tbody {
          .selected {
            .fixed__column-index {
              background-color: #e6f7ff;
            }
            .fixed__column-test-object {
              background-color: #e6f7ff;
            }
            .fixed__column-test-case {
              background-color: #e6f7ff
            }
            .fixed__column-note {
              background-color: #e6f7ff;
            }
            .fixed__column-classify {
              background-color: #e6f7ff;
            }
            .fixed__column-action {
              background-color: #e6f7ff;
            }
          }
          .selected:hover {
            .fixed__column-index {
              background-color: #e6f7ff;
            }
            .fixed__column-test-object {
              background-color: #e6f7ff;
            }
            .fixed__column-test-case {
              background-color: #e6f7ff
            }
            .fixed__column-note {
              background-color: #e6f7ff;
            }
            .fixed__column-classify {
              background-color: #e6f7ff;
            }
            .fixed__column-action {
              background-color: #e6f7ff;
            }
          }
        }
      .fixed__column-test-object {
        position: sticky;
        left: 0px;
        z-index: 999;
        background-color: white;
      }
      .fixed__column-test-case {
        position: sticky;
        left: 200px;
        z-index: 999;
        background-color: white;
      }
      .fixed__column-note {
        position: sticky;
        left: 400px;
        z-index: 999;
        background-color: white;
      }
      .fixed__column-classify {
        position: sticky;
        left: 500px;
        z-index: 999;
        background-color: white;
      }
      .fixed__column-action {
        position: sticky;
        left: 580px;
        z-index: 999;
        background-color: white;
      }
      .fixed-column {
        position: sticky;
        left: 580px;
        z-index: 999;
        background-color: white;
      }
    }
    .selected {
      background-color: #e6f7ff !important;
    }
    </style>
