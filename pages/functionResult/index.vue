<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.functionResult') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoCopyUrl()"
        >
          {{ $t('common.copy_url') }}
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
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_id"
                :placeholder="$t('module.function')"
                allow-clear
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in functions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.code }}: {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.test_session_id')"
              prop="test_session_id"
            >
              <a-select
                v-model="filters.test_session_id"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.functionResult.test_session_id')"
              >
                <a-select-option
                  v-for="(item, index) in testSessions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionResult.mst_evn_test_case_id')"
              prop="mst_evn_test_case_id"
            >
              <a-select
                v-model="filters.mst_evn_test_case_id"
                allow-clear
                :placeholder="$t('module.mstEvnTestCase')"
              >
                <a-select-option
                  v-for="(item, index) in mstEvnTestCases"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.code }}: {{ record.function.name }}
          </div>
        </template>
        <template
          slot="version_code"
          slot-scope="text, record"
        >
          <div v-if="record.version_code">
            {{ record.version_code }}
          </div>
          <span v-else class="link" @click="updateVersionCode(record)">
            <a-tag color="blue" class="link">
              {{ $t('common.update') }}
            </a-tag>
          </span>
        </template>
        <template
          slot="mst_evn_test_case_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.testSession?.mst_evn_test_case.name }}
          </div>
        </template>
        <template
          slot="test_session_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.testSession?.name }}
          </div>
        </template>
        <template
          slot="total_case"
          slot-scope="text, record"
        >
          <div>
            {{ calculateTotalTestCase(record) }}
          </div>
        </template>

        <template slot="test_result" slot-scope="text, record">
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
          slot="use_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="large"
            :disabled="loading"
            @click="showFunctionResultDetail(record)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionResult') }}
      </template>

      <a-spin :spinning="loading">
        <functionResult-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <ModalUpdateVersionCode ref="updateVersionCode" @save="save" />
    <!-- end modal-detail -->
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import FunctionResultForm from '~/components/templates/functionResult/FunctionResultForm'
import { USE_FLG, USE_FLG_VALUE, SORT, OUTPUT_DETAIL_TYPE_VALUE } from '~/constants'
import ModalUpdateVersionCode from '~/components/templates/functionResult/ModalUpdateVersionCode'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionResultForm,
    ModalUpdateVersionCode
  },

  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.project_id = this.project_id

      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
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
      resource: 'functionResult',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        test_session_id: this.$route.query.name || '',
        function_id: +this.$route.query.function_id || undefined,
        mst_evn_test_case_id: +this.$route.query.mst_evn_test_case_id || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      mstEvnTestCases: [],
      testSessions: [],
      project: {},
      USE_FLG,
      USE_FLG_VALUE,
      OUTPUT_DETAIL_TYPE_VALUE,
      SORT,
      versions: [],
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('common.ordinal_number'),
          dataIndex: 'ordinal_number',
          align: 'center',
          customRender: (text, record, index) => index + 1,
          width: 60
        },
        {
          title: this.$t('module.functionResult.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionResult.version_code'),
          dataIndex: 'version_code',
          scopedSlots: { customRender: 'version_code' },
          sorter: true,
          width: 140
        },
        {
          title: this.$t('module.functionResult.test_session_id'),
          dataIndex: 'test_session_id',
          scopedSlots: { customRender: 'test_session_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionResult.mst_evn_test_case_id'),
          dataIndex: 'mst_evn_test_case_id',
          scopedSlots: { customRender: 'mst_evn_test_case_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionResult.total_case'),
          dataIndex: 'total_case',
          scopedSlots: { customRender: 'total_case' },
          sorter: true,
          width: 130
        },
        {
          title: this.$t('module.functionResult.test_result'),
          dataIndex: 'test_result',
          scopedSlots: { customRender: 'test_result' },
          sorter: true,
          width: 350
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 120
        }
      ]
    }
  },

  created() {
    this.getFunctions()
    this.getMstEvnTestCases()
    this.showDetailProject()
    this.getTestSessions()
  },

  methods: {
    async showDetailProject() {
      try {
        if (this.project_id !== this.$store.state.project.id) {
          const { data: { result: { data } } } = await this.$api.project.show(this.project_id)
          this.project = data
          this.$store.dispatch('addProject', {
            id: this.project_id,
            name: this.project.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/functionResult'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },
    /**
     * List Function.
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionList({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
    * List test session
     */
    async getTestSessions() {
      try {
        const params = {
          project_id: this.project_id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.testSession.list({ params })
        this.testSessions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstEvnTestCase.
     */
    async getMstEvnTestCases() {
      try {
        const params = {
          project_id: this.project_id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstEvnTestCase.list({ params })
        this.mstEvnTestCases = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List version
     */
    async getVersions(functionId) {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: functionId,
          order_by: 'id',
          order_type: SORT.desc
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionVersionList({ params })
        this.versions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async updateVersionCode(record) {
      await this.getVersions(record.function_id)
      this.$refs.updateVersionCode.open(record, this.versions)
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    showFunctionResultDetail(record) {
      if (record.version_code) {
        this.$router.push({ name: 'function-id-version-version_code-function_result-function_result_id', params: { id: record.function_id, version_code: record.version_code, function_result_id: record.id } })
      } else {
        this.$notification.error({
          message: this.$t('module.functionResult.message_update_code')
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
      if (fetch) {
        this.$fetch()
      }
    },

    save() {
      this.$fetch()
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        function_id: undefined,
        test_session_id: undefined,
        mst_evn_test_case_id: undefined
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Count total testcase of one row
     *
     * @param record
     * @returns {number|*}
     */
    calculateTotalTestCase(record) {
      let totalTestCase = 0

      record.testcaseMatrices.forEach(matrix => {
        totalTestCase += this.getTotalTestCase(matrix.testcase_numbers)
      })

      return totalTestCase
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
     * @param record
     *
     * @returns Object
     */
    getResultTest(record) {
      const totalTestCase = this.calculateTotalTestCase(record)

      const judgement = record.testcaseOutputResultDetails.filter(item => item.type === OUTPUT_DETAIL_TYPE_VALUE.judgement)
      let totalPass = 0
      let totalFail = 0
      let totalPending = 0
      let totalOther = 0
      judgement.forEach(item => {
        switch (item.judgement) {
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
<style lang="scss" scoped>
:deep() {
  .link {
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
  .ant-tag {
    margin-right: 0px;
  }
}
</style>
