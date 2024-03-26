<template>
  <div>
    <a-spin :spinning="spin">
      <div class="main-container">
        <a-row class="main-row">
          <div
            class="flex-box"
          >
            <p
              class="testcase-group-name"
            >
              {{ matrix.testcaseGroup.name }}
            </p>
          </div>

          <div class="flex-box">
            <p
              class="testcase-matrix-name"
            >
              ■ {{ matrix.name }}
            </p>
          </div>
          <a-table
            :columns="getTestcaseId(matrix.testcaseNumbers)"
            :data-source="matrix.testcaseMatrixInputs"
            :row-key="String(Math.random())"
            :pagination="false"
            :row-class-name="rowClassNameInput"
            bordered
            class="matrix-input-table"
          >
            <template slot="index">
              {{ index + 1 }}
            </template>

            <template slot="test_object" slot-scope="text, record">
              <span>{{ record.test_object }}</span>
            </template>

            <template slot="test_case" slot-scope="text, record">
              <span>{{ record.test_case }}</span>
            </template>

            <template slot="note" slot-scope="text, record">
              <span>{{ record.note }}</span>
            </template>

            <template slot="classify" slot-scope="text, record">
              <span>{{ record.classify }}</span>
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
            :columns="getMatrixOutputResultHeaders(matrix.testcaseNumbers)"
            :data-source="matrix.formatDetail"
            :row-key="String(Math.random())"
            :row-class-name="rowClassNameOutput"
            :pagination="false"
            bordered
            class="matrix-output-table"
          >
            <span slot="customMatrixIndexColTitle">
              {{ index + 1 }}
            </span>

            <template slot="index">
              {{ index + 1 }}
            </template>

            <template slot="expected_result" slot-scope="text, record">
              <span>{{ record.data.expected_result }}</span>
            </template>
            <template
              slot="achievements"
              slot-scope="text, record"
            >
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.result"
              >
                {{ $t('module.testcase_output_result_detail.type_result') }}
              </span>
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.judgement"
              >
                {{ $t('module.testcase_output_result_detail.type_judgement') }}
              </span>
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.executed_date"
              >
                {{ $t('module.testcase_output_result_detail.type_executed_date') }}
              </span>
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.executor"
              >
                {{ $t('module.testcase_output_result_detail.type_executor') }}
              </span>
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.bug"
              >
                {{ $t('module.testcase_output_result_detail.type_bug') }}
              </span>
            </template>
            <template
              v-for="(testcaseNumber, index) in matrix.testcaseNumbers"
              :slot="'testcase_number_pk_' + testcaseNumber.testcase_number_pk"
              slot-scope="text, record"
            >
              <div
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.result"
                :key="testcaseNumber.testcase_number_pk"
                class="output-result"
              >
                {{ CHECK_MATRIX_OUTPUT_VALUE[convertResultOutputData(record.testcase_output_results, testcaseNumber, record.type)] }}
              </div>
              <a-select
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.judgement && checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)"
                :key="testcaseNumber.testcase_number_pk"
                allow-clear
                show-search
                :filter-option="filterOption"
                :value="convertResultOutputData(record.testcase_output_result_details, testcaseNumber, record.type)"
                :class="TESTCASE_DETAIL_JUDGEMENT_VALUE_COLOR_CLASS[convertResultOutputData(record.testcase_output_result_details, testcaseNumber, record.type)]"
                @change="handleOutputResultDetailChange(record, testcaseNumber, record.type, $event)"
              >
                <a-select-option
                  v-for="judge in TESTCASE_DETAIL_JUDGEMENT"
                  :key="judge.value"
                  :value="judge.value"
                >
                  {{ judge.label }}
                </a-select-option>
              </a-select>
              <div v-else-if="record.type !== OUTPUT_DETAIL_TYPE_VALUE.result && !checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)" :key="index">
                -
              </div>
              <a-date-picker
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.executed_date && checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)"
                :key="testcaseNumber.testcase_number_pk"
                :value="convertResultOutputData(record.testcase_output_result_details, testcaseNumber, record.type)"
                format="YYYY/MM/DD"
                style="width:100%"
                placeholder=""
                @change="handleOutputResultDetailChange(record, testcaseNumber, record.type, $event)"
              />
              <a-select
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.executor && checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)"
                :key="testcaseNumber.testcase_number_pk"
                allow-clear
                show-search
                :filter-option="filterOption"
                :value="convertResultOutputData(record.testcase_output_result_details, testcaseNumber, record.type)"
                @change="handleOutputResultDetailChange(record, testcaseNumber, record.type, $event)"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
              <span
                v-if="record.type === OUTPUT_DETAIL_TYPE_VALUE.bug"
                :key="testcaseNumber.testcase_number_pk"
              >
                <span
                  v-for="(bug, ind) in testcaseNumber.bugs"
                  :key="bug.id"
                >
                  <span v-if="bug.testcase_matrix_output_id == record.data.id && bug.function_result_id == functionResultId">
                    <NuxtLink :to="`/bug/detail/${bug.id}`" target="_blank">
                      {{ '[' + bug.id }}
                      <span v-if="bug.category === BUG_CATEGORY_VALUE.customer">*</span>
                      <span>]</span>
                    </NuxtLink>
                    <span v-if="ind !== testcaseNumber.bugs.length - 1">,</span>
                  </span>
                </span>
                <a-divider v-if="checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)" />
                <a-icon
                  v-if="checkIfTestcaseOutputExists(testcaseNumber, record.data.testcase_output_results)"
                  type="plus"
                  class="icon icon-plus"
                  @click="addBug(matrix.id, matrix.testcaseMatrixInputs, record, testcaseNumber)"
                />
              </span>
            </template>
          </a-table>
        </a-row>
      </div>
      <div class="text-center p-4">
        <a-button html-type="button" type="primary" @click.prevent="save">
          {{ $t('common.save') }}
        </a-button>
      </div>
      <a-divider v-if="matrix.testcaseGroup.group_type === GROUP_TEST_CASE_VALUE.function && isLastRecord(index)" />
    </a-spin>
    <a-modal
      ref="detail"
      :visible="visible"
      :mask-closable="false"
      :footer="null"
      @cancel="closeDialog(false)"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.bug') }}
      </template>

      <a-spin :spinning="loading">
        <bug-form
          :id="currentId"
          ref="bugForm"
          :ckeditor-ready="ckeditorReady"
          :members="members"
          @save="pushBug"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
    <div>
      {{ $t('module.testcase_output_result_detail.case_note') }}
      <p class="note">
        {{ $t('module.test_case_matrix.case_note.input_in_case_test') }}
      </p>
      <p class="note">
        {{ $t('module.test_case_matrix.case_note.input_no_case_test') }}
      </p>
      <p class="note">
        {{ $t('module.test_case_matrix.case_note.output_need_test') }}
      </p>
      <p class="note">
        {{ $t('module.testcase_output_result_detail.judgement_pass') }}
      </p>
      <p class="note">
        {{ $t('module.testcase_output_result_detail.judgement_failed') }}
      </p>
      <p class="note">
        {{ $t('module.testcase_output_result_detail.judgement_pending') }}
      </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import {
  GROUP_TEST_CASE,
  SORT,
  CHECK_MATRIX_OUTPUT,
  CHECK_MATRIX_INPUT,
  EVIDENCE_TYPE,
  GROUP_TEST_CASE_NAME,
  GROUP_TEST_CASE_VALUE,
  OUTPUT_DETAIL_TYPE_VALUE,
  CHECK_MATRIX_INPUT_VALUE,
  CHECK_MATRIX_OUTPUT_VALUE,
  EVIDENCE_TYPE_VALUE,
  TESTCASE_DETAIL_JUDGEMENT,
  TESTCASE_DETAIL_JUDGEMENT_VALUE,
  TESTCASE_DETAIL_JUDGEMENT_VALUE_COLOR_CLASS,
  TESTCASE_DETAIL_JUDGEMENT_VALUE_DATA,
  BUG_CATEGORY_VALUE
} from '~/constants'
import BugForm from '~/components/templates/bug/BugForm'

export default {
  components: {
    BugForm
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
    matrix: {
      type: Object,
      default: () => {}
    },
    index: {
      type: [Number, String],
      default: 0
    },
    members: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      moment,
      GROUP_TEST_CASE_NAME,
      GROUP_TEST_CASE,
      SORT,
      CHECK_MATRIX_OUTPUT,
      CHECK_MATRIX_INPUT,
      EVIDENCE_TYPE,
      GROUP_TEST_CASE_VALUE,
      OUTPUT_DETAIL_TYPE_VALUE,
      CHECK_MATRIX_INPUT_VALUE,
      CHECK_MATRIX_OUTPUT_VALUE,
      EVIDENCE_TYPE_VALUE,
      TESTCASE_DETAIL_JUDGEMENT,
      TESTCASE_DETAIL_JUDGEMENT_VALUE,
      TESTCASE_DETAIL_JUDGEMENT_VALUE_COLOR_CLASS,
      TESTCASE_DETAIL_JUDGEMENT_VALUE_DATA,
      BUG_CATEGORY_VALUE,
      project_id: this.$store.state.project.id,
      function_id: Number(this.$route.params.id),
      version_code: Number(this.$route.params.version_code),
      function_result_id: Number(this.$route.params.function_result_id),
      visible: false,
      currentId: 0,
      loading: false,
      ckeditorReady: false,
      bugTitle: '',
      bugCondition: '',
      displayedGroups: [],
      bug: {},
      functionResultId: +this.$route.params.function_result_id || 0
    }
  },
  computed: {
    inputMatrixColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_object'),
          scopedSlots: { customRender: 'test_object' },
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
          width: 200,
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
        }
      ]
    },

    outputMatrixColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_content'),
          scopedSlots: { customRender: 'test_content' },
          width: 200,
          customRender: (value, row, index) => {
            const obj = {
              children: (
                <span>
                  {value.data.test_content}
                </span>
              ),
              attrs: {}
            }
            if (index % 5 === 0) {
              obj.attrs.rowSpan = 5
            } else {
              obj.attrs.rowSpan = 0
            }
            return obj
          },
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
          width: 200,
          customRender: (value, row, index) => {
            const obj = {
              children: (
                <span>
                  {value.data.expected_result}
                </span>
              ),
              attrs: {}
            }
            if (index % 5 === 0) {
              obj.attrs.rowSpan = 5
            } else {
              obj.attrs.rowSpan = 0
            }
            return obj
          },
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
          width: 200,
          customRender: (value, row, index) => {
            const obj = {
              children: (
                <span>
                </span>
              ),
              attrs: {}
            }
            if (index % 5 === 0) {
              obj.attrs.rowSpan = 5
            } else {
              obj.attrs.rowSpan = 0
            }
            return obj
          },
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
        }
      ]
    }
  },
  watch: {
    '$route.query.bug_id': {
      handler(newBugId, oldBugId) {
        this.showDetailBug(newBugId)
      },
      immediate: true
    }
  },

  mounted() {
    if (this.$route.query.bug_id) {
      this.showDetailBug(this.$route.query.bug_id)
    }
    console.log(this.matrix, 'matrix')
  },

  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
       * Get header testcase id
       */
    getTestcaseId(testcaseNumbers) {
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
      const marginHeader = {
        title: '',
        width: 40,
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
      testcaseNumbers.forEach(i => {
        const isInputNull = i.testcase_input === null && i.test_case_input_id !== null
        const isOutputNull = i.testcase_output === null && i.test_case_output_id !== null
        const customCellFunction = () => {
          return {
            class: isInputNull || isOutputNull ? 'disabled-column' : 'testcase-evidence-output-col'
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
          width: 150,
          customHeaderCell: () => {
            return {
              class: 'testcase-evidence-output-header'
            }
          },
          customCell: customCellFunction
        })
      })
      result.unshift(hiddenHeader)
      result.unshift(marginHeader)
      result.unshift(...this.inputMatrixColumns)
      return result
    },

    /**
       * Get Matrix Output Result Headers
       */
    getMatrixOutputResultHeaders(testcaseNumbers) {
      const marginHeader = {
        title: '',
        width: 40,
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

      const actionHeader = {
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
        const customCellFunction = () => {
          return {
            class: isInputNull || isOutputNull ? 'disabled-column' : 'testcase-evidence-output-col'
          }
        }
        result.push({
          title: '-',
          scopedSlots: { customRender: `testcase_number_pk_${i.testcase_number_pk}` },
          align: 'center',
          width: 150,
          customHeaderCell: () => {
            return {
              class: 'testcase-evidence-output-header'
            }
          },
          customCell: customCellFunction
        })
      })
      result.unshift(actionHeader)
      result.unshift(marginHeader)
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
    convertResultOutputData(testcaseOutputResults, testcaseNumber, type) {
      if (testcaseOutputResults.length > 0) {
        for (const outputResult of testcaseOutputResults) {
          if (outputResult.testcase_number_pk === testcaseNumber.testcase_number_pk) {
            switch (type) {
              case OUTPUT_DETAIL_TYPE_VALUE.result:
                return outputResult.testcase_matrix_output_result
              case OUTPUT_DETAIL_TYPE_VALUE.judgement:
                return outputResult.judgement
              case OUTPUT_DETAIL_TYPE_VALUE.executed_date:
                return outputResult.executed_date
              case OUTPUT_DETAIL_TYPE_VALUE.executor:
                return outputResult.executor
            }
          }
        }
        return null
      } else {
        return null
      }
    },

    /**
       * Save data
       */
    async save() {
      this.$emit('changeSpin', true)
      try {
        const data = []
        this.matrix.formatDetail.forEach(output => {
          if (output.type > OUTPUT_DETAIL_TYPE_VALUE.result && output.type < OUTPUT_DETAIL_TYPE_VALUE.bug) {
            output.testcase_output_result_details.forEach(detail => {
              data.push(detail)
            })
          }
        })
        await this.$api.testcaseOutputResultDetail.multiStore(data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        this.$emit('saveMatrixResult')
        this.$emit('cancel')
        this.$emit('save')
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    },

    /**
       * Convert Evidence Type Value
       *
       * @param data Record data
       */
    convertEvidenceTypeValue(data) {
      if (data.testcase_output_results) {
        if (data.testcase_output_results.length > 0) {
          return data.testcase_output_results[0].evidence_classify
        }
        return null
      }
    },

    /**
       * On change testcase output results details
       *
       * @param record Row record.
       * @param testcaseNumber Current testcase number
       * @param type type of testcase details
       * @param event Event target
       */
    handleOutputResultDetailChange(record, testcaseNumber, type, event) {
      const index = record.testcase_output_result_details.findIndex(e => e.testcase_number_pk === testcaseNumber.testcase_number_pk)
      if (index > -1) {
        switch (type) {
          case OUTPUT_DETAIL_TYPE_VALUE.result:
            record.testcase_output_result_details[index].testcase_matrix_output_result = event.target.value
            break
          case OUTPUT_DETAIL_TYPE_VALUE.judgement:
            record.testcase_output_result_details[index].judgement = event
            break
          case OUTPUT_DETAIL_TYPE_VALUE.executed_date:
            record.testcase_output_result_details[index].executed_date = moment(event).isValid() ? moment(event).format('YYYY-MM-DD') : null
            break
          case OUTPUT_DETAIL_TYPE_VALUE.executor:
            record.testcase_output_result_details[index].executor = event
            break
        }
      } else {
        const push = {
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          function_result_id: this.function_result_id,
          test_case_output_id: record.data.test_case_output_id,
          testcase_matrix_output_pk: record.data.testcase_matrix_output_pk,
          testcase_number_pk: testcaseNumber.testcase_number_pk,
          testcase_matrix_pk: record.data.testcase_matrix_pk,
          evidence_classify: null,
          type: null,
          judgement: null,
          executed_date: null,
          executor: null
        }
        switch (type) {
          case OUTPUT_DETAIL_TYPE_VALUE.judgement:
            push.type = OUTPUT_DETAIL_TYPE_VALUE.judgement
            push.judgement = event
            break
          case OUTPUT_DETAIL_TYPE_VALUE.executed_date:
            push.type = OUTPUT_DETAIL_TYPE_VALUE.executed_date
            push.executed_date = moment(event).isValid() ? moment(event).format('YYYY-MM-DD') : null
            break
          case OUTPUT_DETAIL_TYPE_VALUE.executor:
            push.type = OUTPUT_DETAIL_TYPE_VALUE.executor
            push.executor = event
            break
        }
        record.testcase_output_result_details.push(push)
      }
    },

    /**
       * open modal to add bug
       */
    async addBug(testcaseMatrixId, testcaseMatrixInputs, outputRecord, testcaseNumber) {
      if (this.$route.query.bug_id && this.bug.id) {
        try {
          this.bug.testcase_number_id = testcaseNumber.id
          this.bug.testcase_matrix_output_id = outputRecord.data.id
          this.bug.testcase_matrix_id = testcaseMatrixId

          await this.$api.bug.updateBug(this.bug.id, this.bug)
          const bugExists = testcaseNumber.bugs.some(existingBug => existingBug.id === this.bug.id)

          if (!bugExists) {
            testcaseNumber.bugs.push(this.bug)
          }
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } else {
        this.visible = true
        this.ckeditorReady = true
        // autofill bug title, bug condition from testcase
        await this.setBugTitleAndCondition(testcaseMatrixInputs, outputRecord)
        // open modal to add bug
        await this.$refs.bugForm.openCreateModal(testcaseNumber.id, this.bugTitle, this.bugCondition, this.function_result_id, outputRecord.data.id, testcaseNumber, testcaseMatrixId)
      }
    },

    pushBug(bug, testcaseNumber) {
      const bugExists = testcaseNumber.bugs.some(existingBug => existingBug.id === bug.id)

      if (!bugExists) {
        testcaseNumber.bugs.push(bug)
      }
      this.visible = false
    },

    async showDetailBug(id) {
      try {
        if (id) {
          const { data: { result: { data } } } = await this.$api.bug.show(id)
          this.bug = data
          console.log(this.bug)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
       * Close dialog.
       *
       * @param {boolean} fetch - fetch status.
       */
    closeDialog(fetch) {
      this.visible = false
      this.ckeditorReady = false
      if (fetch) {
        this.$emit('saveMatrixResult')
      }
    },

    isLastRecord(index) {
      for (let i = index + 1; i < this.dataTestcaseResult.length; i++) {
        if (this.dataTestcaseResult[i].testcaseGroup.group_type === GROUP_TEST_CASE_VALUE.function) {
          return false
        }
      }
      return true
    },

    /**
       * Set table class
       *
       * @param {array} record
       */
    rowClassNameInput(record) {
      if (record.testcase_input === null && record.test_case_input_id !== null) {
        return 'disabled-row'
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
      } else {
        return null
      }
    },

    shouldDisplayGroupName(matrix, index) {
      if (!this.displayedGroups.includes(matrix.testcaseGroup.group_type)) {
        this.displayedGroups.push(matrix.testcaseGroup.group_type)
        return true
      }

      for (let i = index - 1; i >= 0; i--) {
        if (this.dataTestcaseResult[i].testcaseGroup.group_type === matrix.testcaseGroup.group_type) {
          return false
        }
      }

      return true
    },

    /**
       * Set bug title and bug condition
       *
       * @param testcaseMatrixInputs all testcase matrix input
       * @param outputRecord output row record
       */
    setBugTitleAndCondition(testcaseMatrixInputs, outputRecord) {
      let input = ''
      let output = ''
      testcaseMatrixInputs.forEach((item, index) => {
        input += `${item.test_object}: ${item.test_case}`
        if (index < testcaseMatrixInputs.length - 1) {
          input += ', '
        }
      })
      output = outputRecord.data.expected_result
      this.bugTitle = this.$t('module.bug.title_template', { input, output })
      const bugConditionTestContent = `${this.$t('module.bug.condition.test_content')}: ${outputRecord.data.test_content}`
      const bugConditionExpectResult = `${this.$t('module.bug.condition.expect')}: ${outputRecord.data.expected_result}`
      this.bugCondition = `<p>${this.$t('module.bug.condition.link_test')}: </p><p>${this.$t('module.bug.condition.browser')}: </p><p>${this.$t('module.bug.condition.step')}: </p><p>${bugConditionTestContent}</p><p>${bugConditionExpectResult}`
    },

    checkIfTestcaseOutputExists(testcaseNumber, outputResults) {
      for (const result of outputResults) {
        if (result.testcase_number_pk === testcaseNumber.testcase_number_pk && result.testcase_matrix_output_pk === testcaseNumber.testcase_matrix_output_pk && result.testcase_matrix_output_result === 1) {
          return true
        }
      }
      return false
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
  .disabled-column {
    pointer-events: none;
    background-color: rgba(217, 217, 217, 0.5);
    border-right: 1px solid rgb(40,42,53) !important;
    border-bottom: 1px solid rgb(40,42,53) !important;
  }
  .custom-index-header {
    border-top-left-radius: 0 !important;
    color: #000000a6 !important;
    background-color: transparent !important;
    font-weight: normal;
  }
  .ant-modal {
    width: 80% !important;
  }
  .ant-table table {
    width: auto;
  }
  .ant-divider-horizontal {
    margin: 2px 0;
  }
  .ant-btn-background-ghost {
    height: 10px;
  }
  .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 0;
  }
  .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 0;
  }
  .pass > .ant-select-selection {
    background-color: rgb(212,237,188);
    color: rgb(17,115,75);
  }
  .false > .ant-select-selection {
    background-color: rgb(177,2,2);
    color: rgb(225,168,201);
  }
  .pe > .ant-select-selection {
    background-color: rgb(230,230,230);
    color: rgb(112,108,108);
  }
  .none > .ant-select-selection {
    background-color: rgb(230,230,230);
    color: rgb(112,108,108);
  }
  .ant-table-thead > tr > th {
    background: #6a9356;
  }
  .ant-table table {
    border-top: none;
  }
  .ant-select-disabled {
    color: #000000;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 6px 5px !important;
  }
  .matrix-output-table {
    .ant-table-tbody > tr > td {
      max-width: 200px !important;
    }
  }
  .matrix-output-table {
    .ant-select {
      max-width: 140px;
      width: 100%;
    }
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
  .icon-plus {
    color: rgb(34, 182, 227);
  }
  .icon {
    cursor: pointer;
    font-size: 16px;
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
  margin-bottom: 20px;
}
.testcase-group-name {
  margin-bottom: 0;
  background-color: rgb(109,158,235);
  padding-left: 5px;
  width: 600px;
}
.testcase-matrix-name {
  margin-bottom: 0;
  background-color: rgb(201,218,248);
  width: 600px;
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
.output-result {
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-row {
  overflow-x: auto;
}
:deep() {
  .fixed__column-test-object {
    position: sticky;
    left: 0;
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
    left: 600px;
    z-index: 999;
    background-color: white;
  }
  .fixed-column {
    position: sticky;
    left: 600px;
    z-index: 999;
    background-color: white;
  }
}
</style>
