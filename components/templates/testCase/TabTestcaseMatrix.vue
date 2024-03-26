<template>
  <a-card class="mb-4">
    <template slot="extra">
      <a-form-model
        ref="form"
        :model="filters"
        :rules="formRules"
        :label-col="{ sm: 8 }"
        :wrapper-col="{ sm: 16 }"
        @submit.prevent="autoCreateTestcase"
      >
        <div style="display: flex">
          <a-form-model-item
            :label="$t('module.caseTest.group_test_case')"
            class="function-type-search-form"
            prop="group_test_case"
          >
            <a-select
              v-model="filters.group_test_case"
              :placeholder="$t('module.caseTest.group_test_case')"
              show-arrow
              show-search
              mode="multiple"
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in GROUP_TEST_CASE" :key="item.id">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="filters.group_test_case && filters.group_test_case.includes(GROUP_TEST_CASE_VALUE.function)"
            :label="$t('module.caseTest.mstCategoryTestCaseCommon')"
            class="function-type-search-form"
            prop="category_test_case"
          >
            <a-select
              v-model="filters.category_test_case"
              :placeholder="$t('module.caseTest.mstCategoryTestCaseCommon')"
              show-search
              mode="multiple"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="item in functionTypeList"
                :key="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="filters.group_test_case && filters.group_test_case.includes(GROUP_TEST_CASE_VALUE.validate)"
            :label="$t('module.functionItem.item_pk')"
            class="function-type-search-form"
            prop="item_pk"
          >
            <a-select
              v-model="filters.item_pks"
              :placeholder="$t('module.functionItem.item_pk')"
              show-search
              mode="multiple"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="item in functionItems"
                :key="item.item_pk"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <div
            class="auto-create-button"
          >
            <a-button
              html-type="submit"
              type="primary"
            >
              {{ $t('module.test_case_matrix.auto_create') }}
            </a-button>
            <a-button
              class="min-w-100 copy-btn"
              title="Copy ma trận"
              @click="openCopyModal"
            >
              <font-awesome-icon icon="copy" class="mr-1" />
              {{ $t('module.test_case_matrix_result.copy') }}
            </a-button>

            <a-button
              class="min-w-100 copy-all-code-btn"
              title="Copy code"
              @click="copyCodeTestAuto"
            >
              <font-awesome-icon icon="copy" class="mr-1" />
              {{ $t('module.test_case_matrix.copy_code_for_function') }}
            </a-button>
          </div>
        </div>
      </a-form-model>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.test_case_matrix.summary_test_case')">
        <SummaryTestCaseMatrix
          ref="listTestCase"
          :spin="spin"
          :index="index"
          :testcase-matrixs="dataTestcaseMatrix"
          @change-tab="handleChangeTab"
          @changeSpin="changeSpin"
          @saveMatrixResult="saveMatrixResult"
          @copy="copy"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.test_case_matrix.create_or_update')">
        <TestCaseMatrixDetail
          :matrix="matrix"
          :index="index"
          :testcase-matrixs="dataTestcaseMatrix"
          :spin="spin"
          @saveMatrixResult="saveMatrixResult"
          @changeSpin="$emit('changeSpin')"
          @copy="copy"
          @cancel="cancel"
          @save="save"
        />
      </a-tab-pane>
    </a-tabs>
    <TestCaseMatrixCopyModal
      ref="testcaseMatrixCopyModal"
      :version="version"
      @saveMatrixResult="saveMatrixResult"
    />
  </a-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import { SORT, GROUP_TEST_CASE, GROUP_TEST_CASE_VALUE } from '~/constants'
import SummaryTestCaseMatrix from '~/components/templates/testCase/SummaryTestCaseMatrix'
import TestCaseMatrixDetail from '~/components/templates/testCase/TestCaseMatrixDetail'
import TestCaseMatrixCopyModal from '~/components/templates/testCase/TestCaseMatrixCopyModal'
import { db, collection, query, getDocs, where } from '~/plugins/firebase'

export default {
  components: {
    SummaryTestCaseMatrix,
    TestCaseMatrixDetail,
    TestCaseMatrixCopyModal
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },

    functionItems: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      SORT,
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code,
      functionTypeList: [],
      GROUP_TEST_CASE,
      mapCasetest: [],
      dataTestcaseMatrix: [],
      spin: false,
      matrixId: 0,
      matrix: {},
      index: -1,
      activeKey: '1',
      GROUP_TEST_CASE_VALUE,
      filters: {
        group_test_case: undefined,
        category_test_case: undefined,
        item_pks: undefined
      }
    }
  },

  computed: {
    formRules() {
      return {
        group_test_case: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.caseTest.group_test_case') }),
            trigger: ['change', 'blur']
          }
        ],
        category_test_case: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.caseTest.mstCategoryTestCaseCommon') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  watch: {},

  async created() {
    await this.getMapCaseTest()
    await this.getFunctionTestcaseMatrix()
    this.getFunctionType()
  },

  mounted() {},

  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_testcase_tab_summary',
        2: 'tab_testcase_tab_detail'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
      if (key === '1' || key === 1) {
        this.$refs.listTestCase.scrollToIndex(this.index)
      }
    },
    /**
     * Get function type
     */
    async getFunctionType() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.mstCategoryTestCaseCommon.list({ params })
        this.functionTypeList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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

    async getMapCaseTest() {
      try {
        const { data: { result: { data } } } = await this.$api.testCaseInput.getMapCaseTest()
        this.mapCasetest = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Auto generate testcase (group, matrix, input, output)
     */
    autoCreateTestcase() {
      this.$refs.form.validate(async valid => {
        if (this.functionItems.length > 40 && this.filters.group_test_case.includes(GROUP_TEST_CASE_VALUE.validate) && (!this.filters.item_pks || this.filters.item_pks.length > 20)) {
          this.$notification.warning({
            message: this.$t('text.select_less_than_ten_items')
          })
          return
        }
        if (valid) {
          this.spin = true
          try {
            const params = {
              project_id: this.project_id,
              function_id: this.function_id,
              version_code: this.version_code,
              group_test_case: this.filters.group_test_case,
              category_test_case: this.filters.category_test_case,
              item_pks: this.filters.item_pks
            }

            await this.$api.testcaseMatrix.autoCreate(params)
            await this.getFunctionTestcaseMatrix()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.spin = false
          }
        }
      })
    },

    /**
     * Get function testcase matrix
     */
    async getFunctionTestcaseMatrix() {
      this.spin = true
      try {
        const params = {
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          order_by: 'testcase_group_pk',
          order_type: SORT.asc
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.testcaseMatrix.getFunctionTestcaseMatrix({ params })
        this.dataTestcaseMatrix = data
        this.dataTestcaseMatrix.sort((a, b) => {
          if (a.order !== null && b.order !== null) {
            return a.order - b.order
          } else if (a.functionItem && b.functionItem) {
            return a.functionItem.item_num - b.functionItem.item_num
          } else {
            return 0
          }
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.spin = false
      }
    },

    changeSpin(val) {
      this.spin = val
    },

    async copy(index) {
      const dataCopy = this.$store.state.testcase_matrix
      let matrix = {}
      if (dataCopy) {
        matrix = cloneDeep(dataCopy)
      } else {
        const q = query(
          collection(db, 'Testcase_matrix'),
          where('user_id', '==', this.$auth.user.id)
        )
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(doc => {
          const documentData = doc.data()
          this.matrixId = documentData.matrix_id
        })
        const dataMatrix = await this.showTestcaseMatrix()
        matrix = this.convertDataMatrix(dataMatrix)
      }
      if (matrix) {
        matrix.order = index + 2
        this.dataTestcaseMatrix.splice(index + 1, 0, matrix)
        await this.saveMatrix(matrix, index + 1)
      }
    },

    async saveMatrix(matrix, index) {
      this.spin = true
      try {
        const data = {}
        data.testCaseMatrix = matrix
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
        this.getFunctionTestcaseMatrix()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.spin = false
      }
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
            delete item.function
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

    async handleChangeTab(id, index) {
      this.matrix = {}
      this.matrixId = parseInt(id)
      this.index = index
      this.activeKey = '2'
      this.changeTab(2)
      this.matrix = await this.showTestcaseMatrix()
      if (this.matrix.project_id !== this.project_id) {
        this.$store.dispatch('addProject', {
          id: this.matrix.project.id,
          name: this.matrix.project.name
        })
      }
    },

    save() {
      this.matrixId = 0
      this.matrix = {}
    },

    /**
     * Get function testcase matrix
     */
    async showTestcaseMatrix() {
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
        } = await this.$api.testcaseMatrix.getFunctionTestcaseMatrix({ params })
        return data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.spin = false
      }
    },

    convertDataMatrix(matrix) {
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
      push.function_id = this.function_id
      push.version_code = this.version_code
      push.testcase_group_pk = null
      propertiesToRemove.forEach(property => delete push[property])
      const testcaseGroup = push.testcaseGroup
      if (testcaseGroup.function_id !== Number(this.function_id) || testcaseGroup.version_code !== Number(this.version_code)) {
        push.testcaseGroup = {
          id: 0,
          function_id: this.function_id,
          version_code: this.version_code,
          project_id: testcaseGroup.project_id,
          group_type: testcaseGroup.group_type,
          name: testcaseGroup.name,
          testcase_group_pk: null
        }
      }
      const modifiedTestcaseMatrixInputs = matrix.testcaseMatrixInputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_input_pk = null
        modifiedRecord.test_case_input_id = null
        modifiedRecord.testcase_matrix_pk = null
        modifiedRecord.function_id = this.function_id
        modifiedRecord.version_code = this.version_code
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_input

        modifiedRecord.testcase_input_results = modifiedRecord.testcase_input_results.map(result => {
          const modifiedResult = cloneDeep(result)
          modifiedResult.function_id = this.function_id
          modifiedResult.version_code = this.version_code

          return modifiedResult
        })

        return modifiedRecord
      })

      push.testcaseMatrixInputs = modifiedTestcaseMatrixInputs

      const modifiedTestcaseMatrixOutputs = matrix.testcaseMatrixOutputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_output_pk = null
        modifiedRecord.test_case_output_id = null
        modifiedRecord.testcase_matrix_pk = null
        modifiedRecord.function_id = this.function_id
        modifiedRecord.version_code = this.version_code
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_output

        modifiedRecord.testcase_output_results = modifiedRecord.testcase_output_results.map(result => {
          const modifiedResult = cloneDeep(result)
          modifiedResult.function_id = this.function_id
          modifiedResult.version_code = this.version_code

          return modifiedResult
        })

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
        modifiedRecord.function_id = this.function_id
        modifiedRecord.version_code = this.version_code
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

      return push
    },

    pushEmptyCustomTestcase() {
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

    saveMatrixResult() {
      this.getFunctionTestcaseMatrix()
    },

    cancel() {
      this.activeKey = '1'
      this.changeTab(this.activeKey)
    },

    openCopyModal() {
      this.$refs.testcaseMatrixCopyModal.openModal()
    },

    async copyCodeTestAuto() {
      this.$emit('changeSpin', true)

      try {
        const params = {
          project_id: this.project_id,
          function_id: this.function_id,
          version_code: this.version_code,
          order_by: 'testcase_group_pk',
          order_type: SORT.asc
        }

        const { data: { result: { data } } } = await this.$api.testcaseMatrix.copyCodeTestCaseForFunction(params)
        if (data !== '') {
          await navigator.clipboard.writeText(data)
          this.$message.success(this.$t('module.functionItem.copy_message'))
        } else {
          this.$message.error(this.$t('module.test_case_matrix.not_sample_code'))
        }
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

<style lang="scss" scoped>
.function-type-search-form {
  width: 400px;
}
.auto-create-button {
  margin-top: 4px;
  margin-left: 15px;
  display: flex;
}
.note {
  margin-bottom: 0;
}
.copy-btn {
  background-color: $warning-color;
}

.copy-all-code-btn {
  background-color: #31be7d;
}
</style>
