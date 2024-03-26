<template>
  <div>
    <a-row
      class="main-row p-4"
      :class="[!shouldDisplayGroupName(matrix) ? 'pt-3': '' ]"
    >
      <div
        v-if="shouldDisplayGroupName(matrix, index)"
        class="flex-box"
      >
        <p
          class="testcase-group-name"
        >
          {{ matrix?.testcaseGroup?.name }}
        </p>
      </div>

      <div class="flex-box">
        <p
          class="testcase-matrix-name"
        >
          {{ matrix.functionItem ? matrix.functionItem.item_num + ' ' + matrix.name : matrix.name }}
        </p>
        <div class="icon-wrap">
          <font-awesome-icon
            icon="eye"
            class="icon icon-eye"
            @click="showDetailMatrix(index)"
          />

          <font-awesome-icon
            v-if="matrix?.testcaseGroup?.group_type === 3 || (matrix.id && matrix?.testcaseGroup?.group_type === 0)"
            icon="copy"
            class="icon icon-copy"
            @click="copyMatrix(matrix, index)"
          />
          <font-awesome-icon
            v-if="isIconPaste"
            icon="paste"
            class="icon icon-paste"
            @click="pasteMatrix(matrix, index)"
          />
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
          {{ record.test_object }}
        </template>

        <template slot="test_case" slot-scope="text, record">
          {{ record.test_case }}
        </template>

        <template slot="note" slot-scope="text, record">
          {{ record.note }}
        </template>

        <template slot="classify" slot-scope="text, record">
          {{ record.classify }}
        </template>

        <template slot="action" slot-scope="text, record, inputIndex">
          <font-awesome-icon
            v-if="record.id"
            icon="copy"
            class="icon icon-copy button-container"
            @click="copyMatrixInput(matrix, inputIndex, record)"
          />
          <font-awesome-icon
            v-if="$store.state.testcase_matrix_inputs !== null"
            icon="paste"
            class="icon icon-paste button-container"
            @click="pasteMatrixInput(matrix, inputIndex, record)"
          />
        </template>
        <template
          v-for="testcaseNumber in matrix.testcaseNumbers"
          :slot="'testcase_number_pk_' + testcaseNumber.testcase_number_pk"
          slot-scope="text, record"
        >
          <div
            :key="testcaseNumber.id"
            class="input-value"
          >
            {{ CHECK_MATRIX_INPUT_VALUE[convertResultInputData(record.testcase_input_results, testcaseNumber)] }}
          </div>
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
          {{ record.test_content }}
        </template>

        <template slot="expected_result" slot-scope="text, record">
          {{ record.expected_result }}
        </template>

        <template slot="action" slot-scope="text, record, outputIndex">
          <font-awesome-icon
            v-if="record.id"
            icon="copy"
            class="icon icon-copy button-container"
            @click="copyMatrixOutput(matrix, outputIndex, record)"
          />
          <font-awesome-icon
            v-if="$store.state.testcase_matrix_outputs !== null"
            icon="paste"
            class="icon icon-paste button-container"
            @click="pasteMatrixOutput(matrix, outputIndex, record)"
          />
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
          <div
            :key="testcaseNumber.testcase_number_pk"
            class="output-result"
          >
            {{ CHECK_MATRIX_OUTPUT_VALUE[convertResultOutputData(record.testcase_output_results, testcaseNumber, record.type)] }}
          </div>
        </template>
      </a-table>
    </a-row>
    <a-divider v-if="matrix.testcaseGroup !== null && matrix.testcaseGroup.group_type === GROUP_TEST_CASE_VALUE.function && isLastRecord(index)" />
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
  CHECK_MATRIX_INPUT_VALUE,
  CHECK_MATRIX_OUTPUT_VALUE,
  OUTPUT_DETAIL_TYPE_VALUE,
  USE_FLG_VALUE
} from '~/constants'
import DraggableTestCaseMatrixInput from '~/components/templates/testCase/DraggableTestCaseMatrixInput'
import DraggableTestCaseMatrixOutput from '~/components/templates/testCase/DraggableTestCaseMatrixOutput'
import { db, deleteDoc, doc, addDoc, updateDoc, collection, query, getDocs, onSnapshot, where } from '~/plugins/firebase'
export default {
  components: {
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
      selectedRowInput: 0,
      selectedRowOutput: 0,
      CHECK_MATRIX_INPUT_VALUE,
      CHECK_MATRIX_OUTPUT_VALUE,
      OUTPUT_DETAIL_TYPE_VALUE,
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
          title: '#',
          scopedSlots: { customRender: 'index' },
          align: 'center',
          width: 40,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-index'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-index'
            }
          }
        },
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
          scopedSlots: { customRender: 'index' },
          width: 40,
          align: 'center',
          slots: { title: 'customMatrixIndexColTitle' },
          customHeaderCell: () => {
            return {
              class: 'custom-index-header fixed__column-index'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-index'
            }
          }
        },
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
    }
  },
  watch: {
    testcaseMatrixs: {
      immediate: true,
      handler(newVal) {
        this.dataTestcaseMatrix = newVal
        this.updateTestCaseData(newVal)
      }
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('clearClipboardData')
    this.updateFirebase()
    this.checkCopyTestCaseProcess()
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

    shouldDisplayGroupName(matrix, index) {
      if (matrix.testcaseGroup && matrix.testcaseGroup.group_type !== 0) {
        if (!this.displayedGroups.includes(matrix.testcaseGroup.group_type)) {
          this.displayedGroups.push(matrix.testcaseGroup.group_type)
          return true
        }

        for (let i = index - 1; i >= 0; i--) {
          if (this.dataTestcaseMatrix[i].testcaseGroup) {
            if (this.dataTestcaseMatrix[i].testcaseGroup.group_type === matrix.testcaseGroup.group_type) {
              return false
            }
          }
        }
      }

      return true
    },

    isLastRecord(index) {
      for (let i = index + 1; i < this.dataTestcaseMatrix.length; i++) {
        if (this.dataTestcaseMatrix[i].testcaseGroup.group_type === GROUP_TEST_CASE_VALUE.function) {
          return false
        }
      }
      return true
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

    async copyMatrix(matrix, index) {
      const propertiesToRemove = [
        'id',
        'testcase_matrix_pk',
        'functionItem'
      ]
      let allTestcaseNumbers = []
      this.dataTestcaseMatrix.forEach(record => {
        allTestcaseNumbers = allTestcaseNumbers.concat(record.testcaseNumbers)
      })

      let maxTestcaseNumberPk = Math.max(...allTestcaseNumbers.map(record => record.testcase_number_pk))

      const push = { ...matrix }
      push.item_pk = null
      propertiesToRemove.forEach(property => delete push[property])

      const modifiedTestcaseMatrixInputs = matrix.testcaseMatrixInputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_input_pk = null
        modifiedRecord.test_case_input_id = null
        modifiedRecord.testcase_matrix_pk = null
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_input

        return modifiedRecord
      })

      push.testcaseMatrixInputs = modifiedTestcaseMatrixInputs

      const modifiedTestcaseMatrixOutputs = matrix.testcaseMatrixOutputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_output_pk = null
        modifiedRecord.test_case_output_id = null
        modifiedRecord.testcase_matrix_pk = null
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_output

        return modifiedRecord
      })

      push.testcaseMatrixOutputs = modifiedTestcaseMatrixOutputs

      const modifiedTestcaseNumbers = matrix.testcaseNumbers.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_pk = null
        modifiedRecord.testcase_number_old_pk = modifiedRecord.testcase_number_pk
        modifiedRecord.testcase_number_pk = ++maxTestcaseNumberPk
        modifiedRecord.temporary_pk = modifiedRecord.testcase_number_pk
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.testcase_input
        delete modifiedRecord.testcase_output

        return modifiedRecord
      })

      // Update testcase_number_pk in testcaseMatrixInputs based on testcase_number_old_pk
      push.testcaseMatrixInputs.forEach(input => {
        input.testcase_input_results.forEach(result => {
          const correspondingTestCase = modifiedTestcaseNumbers.find(testcase => testcase.testcase_number_old_pk === result.testcase_number_pk)
          if (correspondingTestCase) {
            result.testcase_number_pk = correspondingTestCase.testcase_number_pk
            result.testcase_number_temporary_pk = correspondingTestCase.testcase_number_pk
            result.testcase_matrix_pk = null
            result.test_case_input_id = null
          }
        })
      })

      // Update testcase_number_pk in testcaseMatrixOutputs based on testcase_number_old_pk
      push.testcaseMatrixOutputs.forEach(input => {
        input.testcase_output_results.forEach(result => {
          const correspondingTestCase = modifiedTestcaseNumbers.find(testcase => testcase.testcase_number_old_pk === result.testcase_number_pk)
          if (correspondingTestCase) {
            result.testcase_number_pk = correspondingTestCase.testcase_number_pk
            result.testcase_number_temporary_pk = correspondingTestCase.testcase_number_pk
            result.testcase_matrix_pk = null
            result.test_case_output_id = null
          }
        })
      })

      push.testcaseNumbers = modifiedTestcaseNumbers
      this.$store.dispatch('copyTestCaseMatrix', push)
      await addDoc(collection(db, 'Testcase_matrix'), {
        user_id: this.$auth.user.id,
        function_id: this.function_id,
        version_code: this.version_code,
        matrix_id: matrix.id,
        status: 1
      })
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    async pasteMatrix(matrix, index) {
      await this.$emit('copy', index)
      const q = query(
        collection(db, 'Testcase_matrix'),
        where('user_id', '==', this.$auth.user.id)
      )
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(data => {
        const docRef = doc(db, 'Testcase_matrix', data.id)
        updateDoc(docRef, { status: 0 })
      })
    },

    checkCopyTestCaseProcess() {
      const q = query(
        collection(db, 'Testcase_matrix'),
        where('user_id', '==', this.$auth.user.id)
      )
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              if (data) {
                if (data.user_id === this.$auth.user.id) {
                  if (data.status === 1) {
                    this.isIconPaste = true
                  } else {
                    this.isIconPaste = false
                    this.deleteRecordFromFirebase(doc.id, 'Testcase_matrix')
                  }
                }
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    /**
     * Delete document firebase
     */
    async deleteRecordFromFirebase(id, collection) {
      try {
        this.isIconPaste = false
        const docRef = doc(db, collection, id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    /**
     * Delete document firebase
     */
    async updateFirebase() {
      try {
        const q = query(
          collection(db, 'Testcase_matrix'),
          where('user_id', '==', this.$auth.user.id)
        )
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(data => {
          const docRef = doc(db, 'Testcase_matrix', data.id)
          updateDoc(docRef, { status: 0 })
        })
      } catch (error) {
        console.error('Error deleting document:', error)
      }
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
        const selectedInput = this.matrix.testcaseMatrixInputs.find(item => item.id === this.selectedRowInput)
        let isResultExist = false

        if (selectedInput) {
          isResultExist = selectedInput.testcase_input_results.some(result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_input_result === 1)
          if (isResultExist) {
            const matchingOutput = this.matrix.testcaseMatrixOutputs.find(output =>
              output.testcase_output_results.some(result =>
                result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_output_result === 1
              )
            )
            if (matchingOutput) {
              this.selectedRowOutput = matchingOutput.id
              matchingOutput.isSelected = true
              if (this.selectedRowOutput !== 0 && this.matrix.testcaseMatrixOutputs.some(item => item.isSelected === true)) {
                this.matrix.testcaseMatrixOutputs.forEach(item => {
                  if (item.id !== matchingOutput.id && item.isSelected === true) {
                    item.isSelected = false
                  }
                })
              }
            }
          }
        }

        const customCellFunction = () => {
          const classes = {
            'disabled-column': isInputNull || isOutputNull,
            'testcase-evidence-output-col': !isInputNull && !isOutputNull,
            selected: isResultExist
          }
          return {
            class: classes
          }
        }
        result.push({
          title: () => {
            return (
              <div class="testcase-number">
                <span class="testcase-number-number">{i.number}</span>
              </div>
            )
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
      // result.unshift(marginHeader)
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
        const selectedOutput = this.matrix.testcaseMatrixOutputs.find(item => item.id === this.selectedRowOutput)
        let isResultExist = false
        if (selectedOutput) {
          isResultExist = selectedOutput.testcase_output_results.some(result => result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_output_result === 1)
          if (isResultExist) {
            const matchingInput = this.matrix.testcaseMatrixInputs.find(input =>
              input.testcase_input_results.some(result =>
                result.testcase_number_pk === i.testcase_number_pk && result.testcase_matrix_input_result === 1
              )
            )
            if (matchingInput) {
              matchingInput.isSelected = true
              this.selectedRowInput = matchingInput.id
              if (this.selectedRowInput !== 0 && this.matrix.testcaseMatrixInputs.some(item => item.isSelected === true)) {
                this.matrix.testcaseMatrixInputs.forEach(item => {
                  if (item.id !== matchingInput.id && item.isSelected === true) {
                    item.isSelected = false
                  }
                })
              }
            }
          }
        }

        const customCellFunction = () => {
          const classes = {
            'disabled-column': isInputNull || isOutputNull,
            'testcase-evidence-output-col': !isInputNull && !isOutputNull,
            selected: isResultExist
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
        // result.unshift(evidenceHeader)
      }

      // result.unshift(marginHeader)
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

    createTestcaseResultTable(index) {
      const currentInputRow = this.dataTestcaseMatrix[index].testcaseMatrixInputs.length
      let quantityOfTestcase = 0

      if (currentInputRow < 2) {
        quantityOfTestcase = 2
      } else {
        quantityOfTestcase = (currentInputRow * (currentInputRow - 1) / 2) + 2
      }
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
      const currentInputRow = matrix.testcaseMatrixInputs.length
      let quantityOfTestcase = 0

      if (currentInputRow < 2) {
        quantityOfTestcase = 2
      } else {
        quantityOfTestcase = (currentInputRow * (currentInputRow - 1) / 2) + 2
      }
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
          dblclick: () => {
            this.selectedRowOutput = 0
            this.matrix.testcaseMatrixOutputs.forEach(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            if (this.selectedRowInput !== 0 && this.matrix.testcaseMatrixInputs.some(item => item.isSelected === true)) {
              this.matrix.testcaseMatrixInputs.find(item => item.id === this.selectedRowInput).isSelected = false
            }
            this.selectedRowInput = record.id
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
            this.selectedRowInput = 0
            this.matrix.testcaseMatrixInputs.forEach(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            if (this.selectedRowOutput !== 0 && this.matrix.testcaseMatrixOutputs.some(item => item.isSelected === true)) {
              this.matrix.testcaseMatrixOutputs.find(item => item.id === this.selectedRowOutput).isSelected = false
            }
            this.selectedRowOutput = record.id
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
    },

    showDetailMatrix(index) {
      this.$emit('selectMatrix', index)
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
    width: 620px;
  }
  .testcase-matrix-name {
    margin-bottom: 0;
    background-color: rgb(201,218,248);
    width: 620px;
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
  .fixed__column-index {
    position: sticky;
    left: 0;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-test-object {
    position: sticky;
    left: 40px;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-test-case {
    position: sticky;
    left: 240px;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-note {
    position: sticky;
    left: 440px;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-classify {
    position: sticky;
    left: 540px;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-action {
    position: sticky;
    left: 620px;
    z-index: 999;
    background-color: white;
  }
  .fixed-column {
    position: sticky;
    left: 620px;
    z-index: 999;
    background-color: white;
  }
}
.selected {
  background-color: #e6f7ff !important;
}
</style>
