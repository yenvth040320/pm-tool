<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.testSession') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
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
              :label="$t('module.testSession.mst_evn_test_case_id')"
              prop="mst_evn_test_case_id"
            >
              <a-select
                v-model="filters.mst_evn_test_case_id"
                :allow-clear="true"
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
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.testSession.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.testSession.name')"
              />
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
          slot="mst_evn_test_case_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstEvnTestCase.name }}
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
          slot="total_bug"
          slot-scope="text, record"
        >
          <div>
            {{ calculateTotalBug(record) }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.testSession') }}
      </template>

      <a-spin :spinning="loading">
        <testSession-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import TestSessionForm from '~/components/templates/testSession/TestSessionForm'
import { USE_FLG, USE_FLG_VALUE, OUTPUT_DETAIL_TYPE_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    TestSessionForm
  },

  /**
   * Declare mixins.
   */
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
      resource: 'testSession',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        name: this.$route.query.name || '',
        mst_evn_test_case_id: +this.$route.query.mst_evn_test_case_id || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      mstEvnTestCases: [],
      USE_FLG,
      USE_FLG_VALUE,
      OUTPUT_DETAIL_TYPE_VALUE,
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0
    }
  },

  /**
   * Computed event.
   */
  computed: {
    /**
     * Declare header columns.
     */
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
          title: this.$t('module.testSession.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.testSession.mst_evn_test_case_id'),
          dataIndex: 'mst_evn_test_case_id',
          scopedSlots: { customRender: 'mst_evn_test_case_id' },
          sorter: true
        },
        {
          title: this.$t('module.testSession.total_case'),
          dataIndex: 'total_case',
          scopedSlots: { customRender: 'total_case' },
          sorter: true
        },
        {
          title: this.$t('module.testSession.test_result'),
          dataIndex: 'test_result',
          scopedSlots: { customRender: 'test_result' },
          sorter: true,
          width: 350
        },
        {
          title: this.$t('module.testSession.total_bug'),
          dataIndex: 'total_bug',
          scopedSlots: { customRender: 'total_bug' },
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.showDetailProject()
    this.getMstEvnTestCases()
  },

  /**
   * Methods.
   */
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
     * Get No.
     */
    getIndex(index) {
      return (this.pagination.current - 1) * this.pagination.pageSize + index
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/testSession'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
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
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
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

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        project_id: '',
        mst_evn_test_case_id: undefined,
        name: ''
      }

      this.replaceQuery(this.filters)
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

      record.functionResults.forEach(result => {
        result.testcase_matrices.forEach(matrix => {
          totalTestCase += this.getTotalTestCase(matrix.testcase_numbers)
        })
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
     * Count total testcase of one row
     *
     * @param record
     * @returns {number|*}
     */
    calculateTotalBug(record) {
      let totalBug = 0
      record.functionResults.forEach(result => {
        result.testcase_matrices.forEach(matrix => {
          matrix.testcase_numbers.forEach(number => {
            totalBug += number.bugs.length
          })
        })
      })

      return totalBug
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
      let totalPass = 0
      let totalFail = 0
      let totalPending = 0
      let totalOther = 0
      record.functionResults.forEach(result => {
        const judgement = result.testcase_output_result_details.filter(item => item.type === OUTPUT_DETAIL_TYPE_VALUE.judgement)
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
