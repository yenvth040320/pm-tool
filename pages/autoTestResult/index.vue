<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.autoTestResult') }}
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
              :label="$t('module.autoTestResult.auto_test_result_id')"
              prop="auto_test_result_id"
            >
              <a-input
                v-model="filters.auto_test_result_id"
                :placeholder="$t('module.autoTestResult.auto_test_result_id')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.autoTestResult.test_result')"
              prop="test_result"
            >
              <a-input
                v-model="filters.test_result"
                :placeholder="$t('module.autoTestResult.test_result')"
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
          slot="number_case"
          slot-scope="text, record"
        >
          <div>
            {{ getTotalTestCase(record.autoTestResultDetail) }}
          </div>
        </template>
        <template slot="result" slot-scope="text, record">
          <div>
            <a-tag color="#34A853">
              {{ getResultTest(record).passedCount }} passed
            </a-tag>
            <a-tag color="#EA4335">
              {{ getResultTest(record).failedCount }} failed
            </a-tag>
            <a-tag color="#8C8C8C">
              {{ getResultTest(record).timedOutCount }} timedOut
            </a-tag>
            <a-tag color="#FBBC05">
              {{ getResultTest(record).skippedCount }} skipped
            </a-tag>
            <a-tag color="#911489">
              {{ getResultTest(record).interruptedCount }} interrupted
            </a-tag>
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
            title="Xem chi tiết"
            @click="showAutoTestResultDetail(record)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            title="Chỉnh sửa"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            title="Xoá"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
    <!-- end modal-detail -->
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
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
      resource: 'autoTestResult',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        auto_test_result_id: this.$route.query.auto_test_result_id || '',
        test_result: +this.$route.query.test_result || ''
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      mstEvnTestCases: [],
      project: {},
      USE_FLG,
      USE_FLG_VALUE,
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
          title: 'STT',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$t('module.autoTestResult.auto_test_result_id'),
          dataIndex: 'auto_test_result_id',
          scopedSlots: { customRender: 'auto_test_result_id' },
          sorter: true,
          width: 200
        },
        {
          title: this.$t('module.autoTestResult.test_result'),
          dataIndex: 'test_result',
          scopedSlots: { customRender: 'test_result' },
          sorter: true
        },
        {
          title: this.$t('module.autoTestResult.number_testcase'),
          dataIndex: 'number_case',
          scopedSlots: { customRender: 'number_case' },
          width: 150
        },
        {
          title: this.$t('module.autoTestResult.result'),
          dataIndex: 'result',
          scopedSlots: { customRender: 'result' },
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 160
        }
      ]
    }
  },

  created() {
    this.showDetailProject()
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

    getTotalTestCase(detail) {
      if (detail) {
        return detail.length
      }

      return 0
    },

    getResultTest(record) {
      const autoTestResultDetail = record.autoTestResultDetail

      let passedCount = 0
      let failedCount = 0
      let interruptedCount = 0
      let timedOutCount = 0
      let skippedCount = 0

      autoTestResultDetail.forEach(result => {
        switch (result.status) {
          case 'passed':
            passedCount++
            break
          case 'failed':
            failedCount++
            break
          case 'interrupted':
            interruptedCount++
            break
          case 'timedOut':
            timedOutCount++
            break
          case 'skipped':
            skippedCount++
            break
          default:
            break
        }
      })

      return {
        passedCount,
        failedCount,
        timedOutCount,
        skippedCount,
        interruptedCount
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
       * Show detail
       *
       * @param {number} id - Item Id.
       */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    showAutoTestResultDetail(record) {
      this.$router.push({ name: 'autoTestResult-id-detail', params: { id: record.id } })
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
        auto_test_result_id: '',
        test_result: ''
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
    }
  }
}
</script>
