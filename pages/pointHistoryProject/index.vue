<template>
  <div>
    <a-card class="mb-4 card-container">
      <a-collapse default-active-key="1">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" header="Tìm kiếm">
          <a-form-model
            ref="form"
            :colon="false"
            :model="filters"
            :label-col="{ sm: 8 }"
            :wrapper-col="{ sm: 16 }"
            class="mb-4"
            @submit.prevent="search"
          >
            <a-row>
              <a-col
                :md="12"
                :lg="12"
                :xl="12"
                :xxl="12"
              >
                <a-form-model-item
                  :label="$t('module.task.project_id')"
                  prop="project_id"
                >
                  <a-select
                    v-model="filters.project_id"
                    :placeholder="$t('module.task.project_id')"
                    show-search
                    :filter-option="filterOption"
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in projects"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="12"
                :lg="12"
                :xl="12"
                :xxl="12"
              >
                <a-form-model-item
                  :label="$t('module.point_history.action_type')"
                  prop="action_types"
                >
                  <a-select
                    v-model="filters.action_types"
                    :placeholder="$t('module.point_history.action_type')"
                    show-search
                    :filter-option="filterOption"
                    allow-clear
                    show-arrow
                    mode="multiple"
                  >
                    <a-select-option
                      v-for="(item, index) in POINT_HISTORY_ACTION_TYPE"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :md="12"
                :lg="12"
                :xl="12"
                :xxl="12"
              >
                <a-form-model-item
                  :label="$t('module.point_history.start_date')"
                  prop="start_date"
                >
                  <a-date-picker
                    v-model="filters.start_date"
                    :placeholder="$t('module.point_history.start_date')"
                    format="YYYY-MM-DD"
                    style="width:100%"
                    :allow-clear="false"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :md="12"
                :lg="12"
                :xl="12"
                :xxl="12"
              >
                <a-form-model-item
                  :label="$t('module.point_history.end_date')"
                  prop="end_date"
                >
                  <a-date-picker
                    v-model="filters.end_date"
                    :placeholder="$t('module.point_history.end_date')"
                    format="YYYY-MM-DD"
                    style="width:100%"
                    :allow-clear="false"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row class="mt-3">
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
              </a-col>
            </a-row>
          </a-form-model>
        </a-collapse-panel>
      </a-collapse>
      <!-- end main-search -->
      <div class="container-fuild pt-3">
        <div>
          <h3 v-if="getProjectName() !== null">
            {{ $t('module.point_history_project.title_user_point', { name: getProjectName() }) }}
          </h3>
          <h3>{{ $t('module.point_history.title_date', { start: moment(this.$route.query.start_date).format('DD/MM/YYYY'), end: moment(this.$route.query.end_date).format('DD/MM/YYYY') }) }}</h3>
          <h3>{{ $t('module.point_history.total_point') + ': ' + totalPoint }}</h3>
        </div>
        <div class="pie-chart">
          <a-button
            html-type="button"
            type="default"
            class="min-w-100 export-excel"
            @click="exportExcelDataPoint"
          >
            {{ $t('module.point_history_project.export_excel') }}
          </a-button>
          <a-button
            v-if="!showChartPie"
            html-type="button"
            type="default"
            class="min-w-100 show-chart"
            @click="showChart"
          >
            {{ $t('common.show_chart') }}
          </a-button>
          <a-button
            v-else
            html-type="button"
            type="default"
            class="min-w-100"
            @click="goBack"
          >
            {{ $t('common.back') }}
          </a-button>
        </div>
      </div>

      <a-table
        v-if="!showChartPie"
        bordered
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :custom-row="customRow"
        :loading="loading"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template
          slot="project_id"
          slot-scope="text, record"
        >
          <span>
            {{ record?.project?.name }}
          </span>
        </template>
        <template
          slot="task"
          slot-scope="text, record"
        >
          <span>
            {{ record?.task?.title }}
          </span>
        </template>
        <template
          slot="approver"
          slot-scope="text, record"
        >
          <div>
            {{ record?.taskApprover?.name }}
          </div>
        </template>
        <template
          slot="mst_life_cycle_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.mstLifeCycle?.name }}
          </div>
        </template>
        <template
          slot="action_type"
          slot-scope="text, record"
        >
          <div v-for="i in POINT_HISTORY_ACTION_TYPE" :key="i.value">
            <span v-if="record.action_type === Number(i.value)">{{ i.label }}</span>
          </div>
        </template>
      </a-table>

      <div v-else class="chart">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :sm="12"
          >
            <PointChartComponent :chart-data="chartData" :chart-options="chartOptions" />
          </a-col>
          <a-col
            :span="24"
            :sm="12"
          >
            <div class="statistical-data">
              <a-table
                v-if="dataTable.length > 0"
                bordered
                :columns="columnStatistical"
                :row-key="record => record.id"
                :data-source="dataTable"
                :pagination="false"
                :loading="loading"
              />
            </div>
          </a-col>
        </a-row>
        <div
          class="text-center pt-3"
        >
          <a-button
            html-type="button"
            type="default"
            class="min-w-100"
            @click="goBack"
          >
            {{ $t('common.back') }}
          </a-button>
        </div>
      </div>

      <!-- end main-table -->
    </a-card>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import PointChartComponent from '~/components/templates/pointHistoryProject/PointChartComponent.vue'
import {
  TASK_TYPE,
  TASK_TYPE_VALUE,
  TASK_STATUS,
  TASK_APPROVE_ET_STATUS,
  TASK_APPROVE_STATUS,
  TASK_STATUS_VALUE,
  TASK_APPROVE_STATUS_VALUE,
  POINT_HISTORY_ACTION_TYPE,
  SORT,
  USE_FLG_VALUE
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    PointChartComponent
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
      params.point_history = true
      this.project_id = this.filters.project_id ?? undefined
      params.project_id = this.filters.project_id ?? undefined
      if (!this.$route.query.start_date) {
        params.start_date = moment().startOf('month').format('YYYY-MM-DD')
      }
      if (!this.$route.query.end_date) {
        params.end_date = moment().endOf('month').format('YYYY-MM-DD')
      }
      params.not_limit = true
      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
      await this.calculateChartData()
    } catch (_) {
      console.log(_)
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
      resource: 'userPointTransactionHistory',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        action_types: this.$route.query.action_types ? this.$route.query.action_types : undefined,
        start_date: this.$route.query.start_date || moment().startOf('month').format('YYYY-MM-DD'),
        end_date: this.$route.query.end_date || moment().endOf('month').format('YYYY-MM-DD')
      },
      defaultParams: {},
      project_id: 0,
      projects: [],
      TASK_TYPE,
      TASK_TYPE_VALUE,
      TASK_STATUS,
      TASK_APPROVE_ET_STATUS,
      TASK_APPROVE_STATUS,
      TASK_STATUS_VALUE,
      TASK_APPROVE_STATUS_VALUE,
      POINT_HISTORY_ACTION_TYPE,
      SORT,
      USE_FLG_VALUE,
      moment,
      dataAll: [],
      showChartPie: false,
      mstLifeCycles: [],
      dataTable: [],
      totalPointsRef: 0,
      chartData: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: []
        }]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 30
            }
          }]
        },
        legend: {
          labels: {
            fontSize: 30
          }
        }
      }
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.point_history.project'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          width: 200
        },
        {
          title: this.$t('module.point_history.task'),
          scopedSlots: { customRender: 'task' },
          width: 250
        },
        {
          title: this.$t('module.point_history.number_point'),
          dataIndex: 'number_point',
          width: 105,
          sorter: true
        },
        {
          title: this.$t('module.point_history.approver'),
          dataIndex: 'approver',
          scopedSlots: { customRender: 'approver' },
          width: 150
        },
        {
          title: this.$t('module.point_history.action_type'),
          dataIndex: 'action_type',
          scopedSlots: { customRender: 'action_type' },
          width: 150
        },
        {
          title: this.$t('module.point_history.date_created'),
          dataIndex: 'date_created',
          width: 180,
          sorter: true
        },
        {
          title: this.$t('module.point_history.description'),
          dataIndex: 'description'
        }
      ]
    },

    headerStatistical() {
      return [
        {
          title: this.$t('module.point_history_project.mst_life_cycle_id'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('module.point_history_project.point_et'),
          dataIndex: 'absoluteValue',
          scopedSlots: { customRender: 'absoluteValue' }
        },
        {
          title: this.$t('module.point_history_project.percentage'),
          dataIndex: 'percentage',
          scopedSlots: { customRender: 'percentage' }
        }
      ]
    },

    columnStatistical() {
      return this.headerStatistical.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    totalPoint() {
      if (this.data.length > 0) {
        const total = this.data.reduce((total, item) => {
          const point = parseFloat(item.number_point) || 0
          return total + point
        }, 0)
        return total.toFixed(2)
      } else {
        return 0
      }
    }
  },

  created() {
    this.getProjects()
    this.getMstLifeCycles()
  },

  /**
   * Methods.
   */
  methods: {
    getProjectName() {
      if (this.projects.length > 0) {
        const project = this.projects.find(item => item.id === Number(this.project_id))
        if (project) {
          return project.name
        }
        return null
      }

      return null
    },

    async getProjects() {
      const params = {
        not_limit: true,
        order_by: 'id',
        order_type: SORT.asc
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },

    /**
     * List MstLifeCycle
     */
    async getMstLifeCycles() {
      try {
        if (this.$route.query.project_id) {
          this.project_id = this.$route.query.project_id
        } else {
          this.project_id = this.$store.state.project.id
        }
        const params = {
          not_limit: true,
          project_id: this.project_id,
          point_history: true,
          use_flg: USE_FLG_VALUE.yes
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    calculateChartData() {
      const mstLifeCycleMap = {}
      let totalPoints = 0
      this.totalPointsRef = 0
      this.data.forEach(item => {
        if (item.task && item.task.mst_life_cycle_id !== null) {
          const mstLifeCycleName = item.task.mst_life_cycle.name
          const numberPoint = parseFloat(item.number_point)

          if (mstLifeCycleMap[mstLifeCycleName]) {
            mstLifeCycleMap[mstLifeCycleName] += numberPoint
          } else {
            mstLifeCycleMap[mstLifeCycleName] = numberPoint
          }

          totalPoints += numberPoint
        }
      })
      this.totalPointsRef = totalPoints

      const labels = this.mstLifeCycles.map(mstLifeCycle => mstLifeCycle.name)
      const data = labels.map(label => parseFloat((mstLifeCycleMap[label] || 0).toFixed(2)))

      const fixedColors = ['#ebe2ca', '#e31956', '#6f76d9', '#a9def5', '#9e3d24', '#27871e', '#eb316f', '#ed2de7', '#9c7b9b', '#7b9c9b', '#d4e352', '#7a0c14', '#b9c9c9', '#b0e677', '#db9340', '#c78781', '#5e9fd1', '#0c3b5e', '#f2a0ea', '#1e522b', '#d6b822']
      const getRandomColor = () => {
        let randomColor
        do {
          randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        } while (fixedColors.includes(randomColor))
        return randomColor
      }

      const backgroundColors = labels.map((label, index) => {
        if (index < 21) {
          return fixedColors[index % fixedColors.length]
        } else {
          return getRandomColor()
        }
      })

      this.dataTable = labels.map((label, index) => {
        const absoluteValue = data[index]
        const percentage = parseFloat((absoluteValue / totalPoints * 100).toFixed(2)) + '%'
        return {
          name: label,
          absoluteValue,
          percentage
        }
      })

      this.chartData = {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors
        }]
      }
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.labels[tooltipItem.index]
              const total = this.totalPointsRef
              const absoluteValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              const percentage = parseFloat((absoluteValue / total * 100).toFixed(2))
              return `${label}: ${absoluteValue} (${percentage}%)`
            }
          }
        }
      }
    },

    /**
     * Custom row event of table -> go to detail
     */
    customRow(record) {
      return {
        on: {
          click: () => {
            this.$router.push({ name: 'task-detail-id', params: { id: record.task_id } })
          }
        }
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
        project_id: undefined,
        action_types: undefined
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
      if (this.filters.start_date) {
        this.filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD')
      }
      if (this.filters.end_date) {
        this.filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD')
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Filter select box
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

    async showChart() {
      await this.calculateChartData()
      this.showChartPie = true
    },

    goBack() {
      this.showChartPie = false
    },

    changeFunction(val) {
      if (!val) {
        this.versions = []
      } else {
        this.versions = this.functions.find(i => i.id === val).version_functions
      }
    },

    async exportExcelDataPoint() {
      try {
        const fileDownload = require('js-file-download')
        const params = this.$route.query
        params.project_id = this.filters.project_id ?? undefined
        if (!this.$route.query.start_date) {
          params.start_date = moment().startOf('month').format('YYYY-MM-DD')
        }
        if (!this.$route.query.end_date) {
          params.end_date = moment().endOf('month').format('YYYY-MM-DD')
        }
        if (params.not_limit) {
          delete params.not_limit
        }
        const rawData = await this.repository.exportExcel(params, {
          responseType: 'blob'
        })
        const today = moment().format('MM/YYYY')
        console.log(today)
        const fileName =
          'Yeu_cau_ket_xuat_du_lieu_tu_PM_tool_' +
          today +
          '.xlsx'
        fileDownload(rawData.data, fileName)
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-table-tbody {
    > tr {
      cursor: pointer;
    }
  }
}
.link {
  color: #1890ff;
  cursor: pointer;
}

.container-fuild {
  display: flex;
  justify-content: space-between;
}

.export-excel {
  background-color: #2ff81d;
  cursor: pointer;
  &:hover {
    background-color: #a7f3a0;
  }
}

.show-chart {
  background-color: #e98c36;
  cursor: pointer;
  &:hover {
    background-color: #f0a35c;
  }
}
</style>
