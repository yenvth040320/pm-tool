<template>
  <a-card class="mb-4">
    <template slot="title">
      {{
        (this.$store.state.project.name
          ? this.$store.state.project.name + ' / '
          : '') + $t('module.caseTest.sampleCode')
      }}
    </template>

    <SearchForm
      :filters="filters"
      :category-test-case-list="categoryTestCaseList"
      :item-type-list="itemTypeList"
      :item-property-list="itemPropertyList"
      @onChangeGroupTestcase="onChangeGroupTestcase"
      @clearSearch="reset"
      @search="search"
    />

    <a-row class="main-row">
      <a-spin :spinning="loading">
        <a-col :span="10">
          <CaseTestList
            :case-tests="caseTests"
            @chooseCaseTest="chooseCaseTest"
          />
        </a-col>
        <a-col :span="14">
          <div v-if="currentSelectedCaseTest.id">
            <CaseTestSampleCodeInput
              :sample-code="sampleCode"
              @saveCode="handleSaveCode"
            />
          </div>
        </a-col>
      </a-spin>
    </a-row>
  </a-card>
</template>
<script>
import { cloneDeep } from 'lodash'
import DataTable from '~/mixins/data-table'
import { GROUP_TEST_CASE, GROUP_TEST_CASE_VALUE, SORT } from '~/constants'
import SearchForm from '~/components/templates/caseTest/SampleCode/SearchForm.vue'
import CaseTestList from '~/components/templates/caseTest/SampleCode/CaseTestList.vue'
import CaseTestSampleCodeInput from '~/components/templates/caseTest/SampleCode/CaseTestSampleCodeInput.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    SearchForm,
    CaseTestList,
    CaseTestSampleCodeInput
  },

  /**
   * Declare mixins.
   */
  mixins: [DataTable],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      this.currentSelectedCaseTest = {}
      if (
        this.filters.group_test_case === undefined
      ) {
        this.caseTests = []
        return
      }
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.order_by = 'order'
      params.order_type = SORT.asc
      const { data: { result: { data } } } = await this.$api.caseTest.list({ params })
      this.caseTests = data.map(item => {
        return { ...item, isSelected: false }
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
      caseTests: [],
      project_id: this.$store.state.project.id,
      sampleCode: '',
      currentSelectedCaseTest: {}
    }
  },

  created() {
    this.getListItemType()
    this.getListCategoryTestCase()
    this.getListItemProperty()
  },

  mounted() {},

  /**
   * Methods.
   */
  methods: {
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
     * Change Group Testcase
     */
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
     * Choose one case test
     *
     * @param testCaseRecord
     */
    chooseCaseTest(testCaseRecord) {
      this.sampleCode = testCaseRecord.sample_code
      this.currentSelectedCaseTest = cloneDeep(testCaseRecord)
    },

    /**
     * Save case test sample code
     *
     * @param code
     * @returns {Promise<void>}
     */
    async handleSaveCode(code) {
      try {
        if (!code) {
          this.$notification.error({
            message: this.$t('module.caseTest.sampleCode_save_required_err')
          })
          return
        }
        const dataUpdate = {
          sample_code: code
        }
        const { data: { result: { data } } } = await this.$api.caseTest.update(this.currentSelectedCaseTest.id, dataUpdate)

        // Set new sample code just updated
        this.chooseCaseTest(data)
        const caseTest = this.caseTests.find(i => i.id === data.id)
        if (caseTest) {
          caseTest.sample_code = data.sample_code
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        this.$emit('save')
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
.title {
  font-weight: 700;
}
</style>
