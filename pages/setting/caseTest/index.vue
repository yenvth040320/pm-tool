<template>
  <a-card class="mb-4">
    <template slot="title">
      {{
        (this.$store.state.project.name
          ? this.$store.state.project.name + ' / '
          : '') + $t('module.caseTest')
      }}
    </template>

    <template slot="extra">
      <a-button
        v-if="showButtonCopy"
        class="min-w-100 copy-btn"
        title="Copy setting testcase"
        @click="openCopyModal"
      >
        <font-awesome-icon icon="copy" class="mr-1" />
        {{ $t('module.functionItem.copy') }}
      </a-button>
    </template>

    <a-form-model
      ref="form"
      :model="filters"
      :label-col="{ sm: 6 }"
      :wrapper-col="{ sm: 18 }"
      class="mb-4"
      @submit.prevent="search"
    >
      <a-row type="flex" :gutter="30">
        <!-- Group test case -->
        <a-col :span="12">
          <a-form-model-item
            :label="$t('module.caseTest.group_test_case')"
            show-search
            :filter-option="filterOption"
          >
            <a-select
              v-model="filters.group_test_case"
              :placeholder="$t('module.caseTest.group_test_case')"
              @change="onChangeGroupTestcase"
            >
              <a-select-option v-for="item in GROUP_TEST_CASE" :key="item.id">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <!-- category test case -->
        <a-col
          v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.function"
          :span="12"
        >
          <a-form-model-item
            :label="$t('module.caseTest.mstCategoryTestCaseCommon')"
          >
            <a-select
              v-model="filters.category_test_case"
              :placeholder="$t('module.caseTest.mstCategoryTestCaseCommon')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="item in categoryTestCaseList"
                :key="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <!-- item type -->
        <a-col
          v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.validate"
          :span="12"
        >
          <a-form-model-item :label="$t('module.caseTest.mstItemType')">
            <a-select
              v-model="filters.item_type"
              :placeholder="$t('module.caseTest.mstItemType')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in itemTypeList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <!-- item property -->
        <a-col
          v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.validate"
          :span="12"
        >
          <a-form-model-item :label="$t('module.caseTest.mstItemProperty')">
            <a-select
              v-model="filters.item_property"
              :placeholder="$t('module.mstItemProperty')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in itemPropertyList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col
          :span="12"
          class="text-center"
        >
          <a-button
            html-type="submit"
            :loading="loading"
            type="primary"
            class="min-w-100"
          >
            <font-awesome-icon icon="search" class="mr-1" />
            {{ $t('common.search') }}
          </a-button>

          &nbsp;
          <a-button
            html-type="button"
            type="default"
            class="min-w-100"
            :loading="loading"
            @click="reset"
          >
            <font-awesome-icon icon="eraser" class="mr-1" />
            {{ $t('common.clear') }}
          </a-button>
        </a-col>
      </a-row>
      <!-- end search -->
    </a-form-model>

    <a-row class="main-row">
      <a-spin :spinning="loading">
        <!-- table test case input -->
        <a-col :span="8">
          <a-table
            :columns="testCaseInputColumns"
            :row-key="record => record.id"
            :data-source="testCaseInputs"
            :pagination="false"
            :custom-row="customRowTestCaseInput"
            :row-class-name="rowClassName"
            :components="customWrapperInput"
            :scroll="{ y: 700 }"
          >
            <template slot="test_object" slot-scope="text, record">
              <a-textarea
                v-model="record.test_object"
                @blur="record.test_object = record.test_object.trim()"
              />
            </template>
            <template slot="test_case" slot-scope="text, record">
              <a-textarea
                v-model="record.test_case"
                @blur="record.test_case = record.test_case.trim()"
              />
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div v-if="record.id">
                <a-icon
                  type="edit"
                  theme="filled"
                  class="edit-icon"
                  @click="submitTestCaseInput(record)"
                />
                <a-icon
                  type="delete"
                  theme="filled"
                  class="delete-icon"
                  @click="confirmToDelete(record, 'testCaseInput')"
                />
              </div>
              <div v-if="!record.id">
                <a-icon type="plus" @click="submitTestCaseInput(record, index)" />
              </div>
            </template>
          </a-table>
          <div class="button-add-row">
            <a-button
              html-type="button"
              :loading="loading"
              type="primary"
              @click="addRowInput"
            >
              <font-awesome-icon icon="plus-circle" class="mr-1" />
            </a-button>
          </div>
        </a-col>

        <!--table case test-->
        <a-col :span="7" style="margin-left: 2%">
          <a-table
            :columns="caseTestColumns"
            :row-key="record => record.id"
            :data-source="caseTests"
            :pagination="false"
            :custom-row="customRowCaseTest"
            :components="customWrapperCaseTest"
            :scroll="{ y: 700 }"
          >
            <template slot="case_test" slot-scope="text, record">
              <span v-html="getCaseTest(record)" />
            </template>
          </a-table>
        </a-col>

        <!-- table test case output -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="testCaseOutputColumns"
            :row-key="record => record.id"
            :data-source="testCaseOutputs"
            :pagination="false"
            :custom-row="customRowTestCaseOutput"
            :components="customWrapperOutput"
            :row-class-name="rowClassName"
            :scroll="{ y: 700 }"
          >
            <template slot="test_content" slot-scope="text, record">
              <a-textarea
                v-model="record.test_content"
                @blur="record.test_content = record.test_content.trim()"
              />
            </template>
            <template slot="expected_result" slot-scope="text, record">
              <a-textarea
                v-model="record.expected_result"
                @blur="record.expected_result = record.expected_result.trim()"
              />
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div v-if="record.id">
                <a-icon
                  type="edit"
                  theme="filled"
                  class="edit-icon"
                  @click="submitTestCaseOutput(record)"
                />
                <a-icon
                  type="delete"
                  theme="filled"
                  class="delete-icon"
                  @click="confirmToDelete(record, 'testCaseOutput')"
                />
              </div>
              <div v-if="!record.id">
                <a-icon type="plus" @click="submitTestCaseOutput(record, index)" />
              </div>
            </template>
          </a-table>
          <div class="button-add-row text-right">
            <a-button
              html-type="button"
              :loading="loading"
              type="primary"
              @click="addRowOutput"
            >
              <font-awesome-icon icon="plus-circle" class="mr-1" />
            </a-button>
          </div>
        </a-col>
      </a-spin>
    </a-row>
    <div class="text-center">
      <a-button
        class="text-center"
        type="primary"
        :loading="loading"
        @click="saveCaseTest"
      >
        {{ $t('common.save') }}
      </a-button>
    </div>
    <SettingTestCaseCopyModal
      ref="settingTestCaseCopyModal"
    />
  </a-card>
</template>
<script>
import { cloneDeep } from 'lodash'
import customWrapperOutput from '~/components/templates/testCase/customWrapperOutput'
import customWrapperInput from '~/components/templates/testCase/customWrapperInput'
import customWrapperCaseTest from '~/components/templates/testCase/customWrapperCaseTest'
import DataTable from '~/mixins/data-table'
import SettingTestCaseCopyModal from '~/components/templates/setting/SettingTestCaseCopyModal'
import { SORT, GROUP_TEST_CASE, GROUP_TEST_CASE_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: { SettingTestCaseCopyModal },
  provide() {
    return {
      data: {
        changePosition: this.changePosition
      },
      list: this
    }
  },

  /**
   * Declare mixins.
   */
  mixins: [DataTable],

  fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      if (
        this.filters.group_test_case === undefined
      ) {
        this.testCaseInputs = []
        this.testCaseOutputs = []
        this.caseTests = []
        return
      }
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.all = true
      params.order_by = 'order'
      params.order_type = 1
      this.getTestCaseInput(params)
      this.getTestCaseOutput(params)
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'caseTest',
      filters: {
        group_test_case: isNaN(+this.$route.query.group_test_case)
          ? undefined
          : +this.$route.query.group_test_case,
        item_type: +this.$route.query.item_type || undefined,
        category_test_case: +this.$route.query.category_test_case || undefined,
        item_property: +this.$route.query.item_property || undefined,
        project_id: this.$store.state.project.id
      },
      SORT,
      GROUP_TEST_CASE,
      GROUP_TEST_CASE_VALUE,
      itemTypeList: [],
      categoryTestCaseList: [],
      itemPropertyList: [],
      testCaseInputs: [],
      testCaseOutputs: [],
      caseTests: [],
      project_id: this.$store.state.project.id,
      showButtonCopy: false,
      customWrapperOutput: {
        body: {
          wrapper: customWrapperOutput
        }
      },
      customWrapperInput: {
        body: {
          wrapper: customWrapperInput
        }
      },
      customWrapperCaseTest: {
        body: {
          wrapper: customWrapperCaseTest
        }
      }
    }
  },

  /**
   * Computed event.
   */
  computed: {
    testCaseInputColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_object'),
          scopedSlots: { customRender: 'test_object' }
        },
        {
          title: this.$t('module.caseTest.test_case'),
          scopedSlots: { customRender: 'test_case' }
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 70
        }
      ]
    },

    caseTestColumns() {
      return [
        {
          title: this.$t('module.caseTest.list'),
          scopedSlots: { customRender: 'case_test' }
        }
      ]
    },

    testCaseOutputColumns() {
      return [
        {
          title: this.$t('module.caseTest.test_content'),
          scopedSlots: { customRender: 'test_content' }
        },
        {
          title: this.$t('module.caseTest.expected_result'),
          scopedSlots: { customRender: 'expected_result' }
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 70
        }
      ]
    }
  },

  created() {
    this.getListItemType()
    this.getListCategoryTestCase()
    this.getListItemProperty()
  },

  mounted() {
    this.checkCopyTestCase()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * Get list category test case
     */
    async checkCopyTestCase() {
      try {
        const params = {
          project_id: this.$store.state.project.id
        }

        const { data: { result: { data } } } = await this.$api.testCaseInput.getConditionShowButtonCopy({ params })
        this.showButtonCopy = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async changePosition(newData, rep) {
      for (let i = 0; i < this[rep].length; i++) {
        this[rep][i].order = i
      }
      this.$store.dispatch('setLoading', true)
      try {
        if (rep === 'testCaseOutputs') {
          await this.$api.testCaseOutput.updateOrder(this[rep])
        }
        if (rep === 'testCaseInputs') {
          await this.$api.testCaseInput.updateOrder(this[rep])
        }
        if (rep === 'caseTests') {
          await this.$api.testCaseInput.updateOrderCaseTest(this[rep])
        }
        this.$fetch()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Get conent case test
     * @param {Object} record
     */
    getCaseTest(record) {
      return `${record.test_case_input?.test_object}(${record.test_case_input?.test_case}) - ${record.test_case_output?.test_content}(${record.test_case_output?.expected_result})`
    },

    /**
     * Get list item type
     */
    async getListItemType() {
      this.$store.dispatch('setLoading', true)

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
        } = await this.$api.mstItemType.list({ params })
        this.itemTypeList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list category test case
     */
    async getListCategoryTestCase() {
      this.$store.dispatch('setLoading', true)

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
        this.categoryTestCaseList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list item property
     */
    async getListItemProperty() {
      this.$store.dispatch('setLoading', true)

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
        } = await this.$api.mstItemProperty.list({ params })
        this.itemPropertyList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get test case input data
     * @param {*} params
     */
    async getTestCaseInput(params) {
      this.$store.dispatch('setLoading', true)
      try {
        const {
          data: {
            result: { data }
          }
        } = await this.$api.testCaseInput.list({ params })
        const newData = data.map(item => {
          return { ...item, isSelected: false }
        })

        this.testCaseInputs = newData
        this.getListCaseTest(data)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list case test
     */
    async getListCaseTest(testCaseInputs) {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {}
        if (testCaseInputs.length > 0) {
          const ids = testCaseInputs.map(item => item.id)
          params.ids = ids
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.testCaseInput.getListCaseTest({ params })
        const arrSort = data.sort((a, b) => a.order - b.order)
        this.caseTests = arrSort.map(item => {
          const matchedInput = this.testCaseInputs.find(
            input => input.id === item.test_case_input_id
          )

          const matchedOutput = this.testCaseOutputs.find(
            input => input.id === item.test_case_output_id
          )
          if (matchedInput && matchedOutput) {
            return {
              ...item,
              test_case_input: matchedInput,
              test_case_output: matchedOutput
            }
          }
          return item
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * Get test case outup data
     * @param {*} params
     */
    async getTestCaseOutput(params) {
      this.$store.dispatch('setLoading', true)
      try {
        const {
          data: {
            result: { data }
          }
        } = await this.$api.testCaseOutput.list({ params })
        const newData = data.map(item => {
          return { ...item, isSelected: false }
        })
        this.testCaseOutputs = newData
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Add row input
     */
    addRowInput() {
      if (
        this.filters.group_test_case === undefined
      ) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      if (this.filters.group_test_case === GROUP_TEST_CASE_VALUE.validate && (this.filters.item_type === undefined || this.filters.item_property === undefined)) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      if (this.filters.group_test_case === GROUP_TEST_CASE_VALUE.function && this.filters.category_test_case === undefined) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      this.testCaseInputs.push({
        test_object: '',
        test_case: '',
        isSelected: false,
        group_test_case: this.filters.group_test_case,
        mst_category_test_case_common_id: this.filters.category_test_case,
        mst_item_property_id: this.filters.item_property,
        mst_item_type_id: this.filters.item_type,
        project_id: this.project_id
      })
    },

    /**
     * Add row output
     */
    addRowOutput() {
      if (
        this.filters.group_test_case === undefined
      ) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      if (this.filters.group_test_case === GROUP_TEST_CASE_VALUE.validate && (this.filters.item_type === undefined || this.filters.item_property === undefined)) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      if (this.filters.group_test_case === GROUP_TEST_CASE_VALUE.function && this.filters.category_test_case === undefined) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.filters_search')
        })
        return
      }
      this.testCaseOutputs.push({
        test_content: '',
        expected_result: '',
        isSelected: false,
        group_test_case: this.filters.group_test_case,
        mst_category_test_case_common_id: this.filters.category_test_case,
        mst_item_property_id: this.filters.item_property,
        mst_item_type_id: this.filters.item_type,
        project_id: this.project_id
      })
    },

    /**
     * Search data
     */
    search() {
      if (this.filters.group_test_case === undefined) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.group_test_case')
        })
        return
      }
      if (this.filters.item_type === undefined && this.filters.group_test_case === GROUP_TEST_CASE_VALUE.validate) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.item_type')
        })
        return
      }
      if (this.filters.item_property === undefined && this.filters.group_test_case === GROUP_TEST_CASE_VALUE.validate) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.item_property')
        })
        return
      }
      if (this.filters.category_test_case === undefined && this.filters.group_test_case === GROUP_TEST_CASE_VALUE.function) {
        this.$notification.error({
          message: this.$t('module.caseTest.required.category_test_case')
        })
        return
      }
      this.replaceQuery(this.filters)
    },

    openCopyModal() {
      this.$refs.settingTestCaseCopyModal.openModal()
    },

    /**
     * reset form search
     */
    reset() {
      this.filters = {
        group_test_case: undefined,
        item_type: undefined,
        category_test_case: undefined,
        item_property: undefined
      }
      this.replaceQuery(this.filters)
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
    },

    /**
     * Custom row event of table test case input
     */
    customRowTestCaseInput(record) {
      return {
        on: {
          click: () => {
            this.testCaseInputs.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            record.isSelected = true
          }
        }
      }
    },

    /**
     * Custom row event of table test case output
     */
    customRowTestCaseOutput(record) {
      return {
        on: {
          click: () => {
            this.testCaseOutputs.filter(item => {
              if (item.isSelected === true) {
                item.isSelected = false
              }
            })
            record.isSelected = true
          },
          dblclick: () => {
            const dataInput = this.testCaseInputs.find(item => {
              return item.isSelected === true && item.id
            })
            if (dataInput) {
              const existsCaseTest = this.caseTests.find(item => {
                return (
                  item.test_case_input.id === dataInput.id &&
                item.test_case_output.id === record.id
                )
              })

              if (existsCaseTest) {
                this.$notification.error({
                  message: this.$t('module.caseTest.exists')
                })
                return
              }
              this.caseTests.push({
                test_case_input: dataInput,
                test_case_output: record
              })
            }
          }
        }
      }
    },

    /**
     * Custom row event of table case test
     */
    customRowCaseTest(record, index) {
      return {
        on: {
          dblclick: () => {
            this.deleteRecordCaseTest(record, index)
          }
        }
      }
    },

    onChangeGroupTestcase() {
      const filters = {
        group_test_case: this.filters.group_test_case,
        item_type: undefined,
        category_test_case: undefined,
        item_property: undefined,
        project_id: this.$store.state.project.id
      }
      this.filters = filters
    },

    /**
     * Confirm to delete
     *
     * @param {Object} record
     * @param {String} rep
     *
     */
    confirmToDelete(record, rep) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(record, rep)
      })
    },

    /**
     * Delete record
     *
     * @param {Object} record
     * @param {String} rep
     *
     */
    async deleteRecord(record, rep) {
      this.$store.dispatch('setLoading', true)
      try {
        await this.$api[rep].delete(record.id)
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Delete case test
     *
     * @param record
     * @param index
     * @returns {Promise<void>}
     */
    async deleteRecordCaseTest(record, index) {
      this.$store.dispatch('setLoading', true)
      try {
        const {
          data: {
            result: { data }
          }
        } = await this.$api.testCaseInput.deleteRecordCaseTest(record.id)
        if (data) {
          this.caseTests.splice(index, 1)
        }
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * create or update a test case input
     *
     * @param record
     */
    async submitTestCaseInput(record, index) {
      if (record.test_object === '') {
        this.$notification.error({
          message: this.$t('module.caseTest.required_test_object.err_message')
        })
        return
      }
      if (record.test_case === '') {
        this.$notification.error({
          message: this.$t('module.caseTest.required_test_case.err_message')
        })
        return
      }
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.order = index
        if (record.id) {
          await this.$api.testCaseInput.update(record.id, data)
        } else {
          await this.$api.testCaseInput.create(data)
        }
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * create or update a test case output
     *
     * @param record
     */
    async submitTestCaseOutput(record, index) {
      if (record.test_content === '') {
        this.$notification.error({
          message: this.$t('module.caseTest.required_test_content.err_message')
        })
        return
      }
      if (record.expected_result === '') {
        this.$notification.error({
          message: this.$t(
            'module.caseTest.required_expected_result.err_message'
          )
        })
        return
      }
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.order = index
        if (record.id) {
          await this.$api.testCaseOutput.update(record.id, data)
        } else {
          await this.$api.testCaseOutput.create(data)
        }
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Save case test data
     */
    async saveCaseTest() {
      this.$store.dispatch('setLoading', true)

      try {
        for (let i = 0; i < this.caseTests.length; i++) {
          this.caseTests[i].order = i
        }
        const data = {
          caseTests: this.caseTests
        }
        await this.$api.testCaseInput.saveCaseTest(data)
        this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
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
.button-add-row {
  margin-top: 10px;
}
.delete-icon {
  margin-left: 10px;
}
.title {
  font-weight: 700;
}
.ant-row-flex {
  flex-flow: column;
  align-items: center;
}
.copy-btn {
  background-color: $warning-color;
}
</style>
