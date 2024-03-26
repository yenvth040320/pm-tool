<template>
  <a-spin :spinning="loading">
    <a-card class="no-border">
      <template slot="title">
        <div>
          {{ $t('module.requirement.percent_complete') }}: {{ calculatePercent(dataGrantt.totalPointDone, dataGrantt.totalPointNotPending) }} % ({{ dataGrantt.totalPointDone }}/{{ dataGrantt.totalPointNotPending }})
        </div>
        <div>
          {{ $t('module.requirement.percent_complete_yesterday') }} {{ getYesterday() }}: {{ calculatePercent(dataGrantt.totalPointNow, dataGrantt.totalPointNotPending) }} % ({{ dataGrantt.totalPointNow }}/{{ dataGrantt.totalPointNotPending }})
        </div>
      </template>
      <template slot="extra">
        <div v-if="dataGrantt.delayTime > 0" class="warning">
          {{ this.$t('module.task.delay_time') }} {{ dataGrantt.delayTime }} (H) / {{ this.$t('module.task.delay_point') }} {{ dataGrantt.delayPoint }} (Point)
        </div>
        <div v-else>
          Đúng tiến độ
        </div>
        <div>
          {{ $t('module.requirement.deadline') }}: {{ getDate(dataGrantt.deadline) }}
        </div>
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="m-4"
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
              :label="$t('module.task.requirement_id')"
              prop="requirement_id"
            >
              <a-select
                v-model="filters.requirement_id"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.task.requirement_id')"
              >
                <a-select-option
                  v-for="item in requirements"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.progress.status_request_requirement')"
              prop="status_request"
            >
              <a-select
                v-model="filters.status_request"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_request')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_REQUEST_STATUS"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.member_id')"
              prop="member_id"
            >
              <a-select
                v-model="filters.member_name"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.task.member_id')"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.name"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.progress.status_processing_requirement')"
              prop="status_processing"
            >
              <a-select
                v-model="filters.statuses_processing"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_processing')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_PROCESS_STATUS"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_name"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.task.function_id')"
              >
                <a-select-option
                  v-for="item in functions"
                  :key="item.id"
                  :value="item.code + ': ' + item.name"
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
              :label="$t('module.progress.status_task')"
              prop="status"
            >
              <a-select
                v-model="filters.status"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.task.status')"
              >
                <a-select-option
                  v-for="(item, index) in TASK_STATUS_CHART"
                  :key="index"
                  :value="item.label"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.progress.start_datetime_task')"
              prop="start_datetime"
            >
              <a-date-picker
                v-model="filters.start_datetime"
                format="YYYY-MM-DD"
                style="width:100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.progress.end_datetime_task')"
              prop="end_datetime"
            >
              <a-date-picker
                v-model="filters.end_datetime"
                format="YYYY-MM-DD"
                style="width:100%"
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

      <div :key="ganttKey" ref="myGanttElastic">
        <gantt-elastic
          v-if="ganttVisible"
          :options="options"
          :tasks="tasks"
        />
      </div>
    </a-card>
  </a-spin>
</template>

<script>
import moment from 'moment-timezone'
import GanttElastic from 'gantt-elastic'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { SORT, TASK_STATUS_CHART, USE_FLG_VALUE, REQUIREMENT_PROCESS_STATUS, REQUIREMENT_REQUEST_STATUS, REQUIREMENT_PROCESS_STATUS_VALUE, REQUIREMENT_REQUEST_STATUS_VALUE } from '~/constants'

export default {
  components: {
    GanttElastic
  },

  async fetch() {
    this.$store.dispatch('setLoading', true)
    try {
      const params = {
        not_limit: true
      }
      if (this.$route.query.project_id) {
        params.project_id = this.$route.query.project_id
      } else {
        params.project_id = this.$store.state.project.id
      }
      const { data: { result: { data } } } = await this.$api.requirement.list({ params })
      this.requirements = data
      if (this.requirements.length > 0) {
        this.$store.dispatch('addProject', {
          id: this.requirements[0].project.id,
          name: this.requirements[0].project.name
        })
        await this.search()
      }
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  data() {
    return {
      tasks: [],
      filteredTasks: [],
      dynamicStyle: {},
      members: [],
      functions: [],
      requirements: [],
      requirementIds: [],
      dataGrantt: {},
      ganttKey: 0,
      ganttVisible: false,
      myElement: null,
      myResizeObserver: null,
      SORT,
      TASK_STATUS_CHART,
      REQUIREMENT_PROCESS_STATUS,
      REQUIREMENT_REQUEST_STATUS,
      REQUIREMENT_PROCESS_STATUS_VALUE,
      REQUIREMENT_REQUEST_STATUS_VALUE,
      USE_FLG_VALUE,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        requirement_id: Array.isArray(this.$route.query.requirement_id) && this.$route.query.requirement_id.length > 0
          ? this.$route.query.requirement_id.map(id => +id)
          : (this.$route.query.requirement_id !== undefined && this.$route.query.requirement_id !== 0 ? [+this.$route.query.requirement_id] : []),
        status_request: +this.$route.query.status_request || REQUIREMENT_REQUEST_STATUS_VALUE.open,
        statuses_processing: Array.isArray(this.$route.query.statuses_processing) && this.$route.query.statuses_processing.length > 0
          ? this.$route.query.statuses_processing.map(status => +status)
          : (this.$route.query.statuses_processing ? [+this.$route.query.statuses_processing] : this.getDefaultProcessingStatus()),
        member_name: Array.isArray(this.$route.query.member_name) && this.$route.query.member_name.length > 0
          ? this.$route.query.member_name.map(name => decodeURIComponent(name))
          : (this.$route.query.member_name ? [decodeURIComponent(this.$route.query.member_name)] : []),
        function_name: +this.$route.query.function_id || undefined,
        status: Array.isArray(this.$route.query.status) && this.$route.query.status.length > 0
          ? this.$route.query.status.map(name => decodeURIComponent(name))
          : (this.$route.query.status ? [decodeURIComponent(this.$route.query.status)] : []),
        start_datetime: +this.$route.query.start_datetime || null,
        end_datetime: +this.$route.query.start_datetime || null
      },
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    })
  },
  watch: {
    tasks(newTasks, oldTasks) {
      // this.ganttKey++
      // this.ganttVisible = false
      // this.$nextTick(() => {
      //   this.ganttVisible = true
      // })
    }
  },

  created() {
    this.options = {
      taskMapping: {
        progress: 'percent'
      },
      row: {
        height: 24
      },
      calendar: {
        week: {
          display: true
        },
        day: {
          display: true
        },
        hour: {
          display: false
        }
      },
      chart: {
        progress: {
          bar: false
        },
        expander: {
          display: true
        }
      },
      taskList: {
        expander: {
          straight: false
        },
        columns: [
          {
            id: 1,
            value: 'id',
            width: 40
          },
          {
            id: 2,
            label: this.$t('module.task.title'),
            value: 'label',
            width: 200,
            expander: true,
            html: true
          },
          {
            id: 3,
            label: this.$t('module.task.member_id'),
            value: 'user',
            width: 130,
            html: true
          },
          {
            id: 4,
            label: this.$t('module.task.et_hour'),
            value: task => task.esitmate_time ? task.esitmate_time + 'h' : null,
            width: 78
          },
          {
            id: 5,
            label: this.$t('module.task.start_datetime'),
            value: task => dayjs(task.start).format('YYYY-MM-DD'),
            width: 78
          },
          {
            id: 6,
            label: this.$t('module.task.end_datetime'),
            value: task => dayjs(task.dueDate).format('YYYY-MM-DD'),
            width: 78
          },
          {
            id: 6,
            label: this.$t('module.task.status'),
            value: 'status',
            scopedSlots: { customRender: 'status' },
            width: 78
          }
        ]
      },
      locale: {
        name: 'en',
        Now: 'Now'
      }
    }
  },
  async mounted() {
    this.getMemberOfProject()
    this.getListFunction()
    await this.initializeResizeObserver()
  },

  beforeDestroy() {
    if (this.myElement && this.myElement instanceof Element && this.myResizeObserver) {
      this.myResizeObserver.unobserve(this.myElement)
    }
  },

  methods: {
    initializeResizeObserver() {
      const elementToObserve = this.$refs.myGanttElastic
      if (elementToObserve instanceof Element) {
        this.myResizeObserver = new ResizeObserver(entries => {
        })
        this.myElement = elementToObserve
        this.myResizeObserver.observe(this.myElement)
      }
    },

    async filterRequirements() {
      if (this.$route.query.date) {
        const dateFormat = this.$route.query.date
        const formattedDate = moment(dateFormat, 'DD-MM-YYYY').format('YYYY-MM-DD')

        if (this.filters.start_datetime === null) {
          this.filters.start_datetime = formattedDate
        }

        if (this.filters.end_datetime === null) {
          this.filters.end_datetime = formattedDate
        }
      }
      if (this.requirements.length > 0) {
        let filteredRequirements = [...this.requirements]

        if (this.filters.status_request) {
          filteredRequirements = filteredRequirements.filter(req =>
            req.status_request === this.filters.status_request
          )
        }

        if (this.filters.statuses_processing && Array.isArray(this.filters.statuses_processing) && this.filters.statuses_processing.length > 0) {
          filteredRequirements = filteredRequirements.filter(req =>
            this.filters.statuses_processing.includes(req.status_processing)
          )
        }

        // Lọc theo this.filters.requirement_id (nếu có)
        if (this.filters.requirement_id && Array.isArray(this.filters.requirement_id) && this.filters.requirement_id.length > 0) {
          filteredRequirements = filteredRequirements.filter(req =>
            this.filters.requirement_id.includes(req.id)
          )
        }

        this.requirementIds = filteredRequirements.map(item => item.id)
        if (this.requirementIds.length > 0) {
          this.getProjectProgress()
          await this.getListTask()
        }
      }
    },

    getDefaultProcessingStatus() {
      const excludedKeys = ['new', 'in_progress', 'testing']
      const filteredStatuses = Object.keys(REQUIREMENT_PROCESS_STATUS_VALUE)
        .filter(key => excludedKeys.includes(key))
        .map(key => REQUIREMENT_PROCESS_STATUS_VALUE[key])

      return filteredStatuses
    },

    async getListTask() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          requirementIds: this.requirementIds,
          not_limit: true,
          taskGantt: true
        }
        const { data: { result: { data } } } = await this.$api.task.list({ params })
        this.tasks = data
        this.filteredTasks = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
         * Get member in project
         */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.user.getGroupMembers({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListFunction() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.project_id = this.project_id
        params.use_flg = USE_FLG_VALUE.yes

        const { data: { result: { data } } } = await this.$api.function.getListFunction({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
         * On clear form search.
         */
    reset() {
      this.filters = {
        requirement_id: undefined,
        status_request: undefined,
        statuses_processing: undefined,
        member_name: undefined,
        function_name: undefined,
        status: undefined,
        start_datetime: null,
        end_datetime: null
      }
      if (this.$route.query.date) {
        delete this.$route.query.date
      }

      this.search()
    },

    /**
         * Search data.
         */
    async search() {
      this.replaceQuery(this.filters)
      this.ganttKey++
      this.ganttVisible = false
      this.$nextTick(() => {
        this.ganttVisible = true
      })
      await this.filteredListTasks()
    },

    async filteredListTasks() {
      if (this.filters.member_name !== undefined) {
        this.filters.member_name = this.filters.member_name.filter(name => name !== '')
      }

      if (this.filters.requirement_id !== undefined) {
        this.filters.requirement_id = this.filters.requirement_id.filter(id => id !== 0)
      }
      await this.filterRequirements()
      const filterTasks = task => {
        const users = task.user.split(',').map(user => user.trim())
        let memberMatch = false
        if (!this.filters.member_name || this.filters.member_name.length === 0) {
          memberMatch = true
        } else if (this.filters.member_name.some(member => users.includes(member))) {
          memberMatch = typeof task.status !== 'undefined' && task.status !== null
        }
        const functionMatch = !this.filters.function_name || this.filters.function_name.some(fn =>
          task.label.trim().toLowerCase().includes(fn.trim().toLowerCase())
        )

        let statusMatch = false
        if (!this.filters.status || this.filters.status.length === 0) {
          statusMatch = true
        } else if (!task.status || this.filters.status.some(fn =>
          task.status.trim().toLowerCase().includes(fn.trim().toLowerCase())
        )) {
          statusMatch = typeof task.status !== 'undefined' && task.status !== null
        }
        const startMatch = !this.filters.start_datetime || this.$moment(task.start).isSameOrAfter(this.$moment(this.filters.start_datetime), 'day')
        const endMatch = !this.filters.end_datetime || this.$moment(task.dueDate).isSameOrBefore(this.$moment(this.filters.end_datetime), 'day')

        return memberMatch && functionMatch && statusMatch && startMatch && endMatch
      }
      const idsToInclude = new Set()
      this.tasks.forEach(task => {
        if (filterTasks(task)) {
          idsToInclude.add(task.id)
          if (task.parents) {
            task.parents.forEach(id => idsToInclude.add(id))
          }
          if (task.allChildren) {
            task.allChildren.forEach(id => idsToInclude.add(id))
          }
        }
      })

      const filteredTasks = this.tasks.filter(task => idsToInclude.has(task.id))
      this.tasks = filteredTasks
    },

    /**
     * Replace query
     *
     * @param {Object} Data query
     */
    replaceQuery(data) {
      const query = {}
      const newQuery = {
        ...this.$route.query,
        ...data
      }
      Object.entries(newQuery).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          query[key] = value
        }
      })
      this.$router.push({ query })
    },

    /**
         * Get date
         */
    getDate(value) {
      if (value) {
        return moment(String(value)).format('DD-MM-YYYY')
      } else {
        return ''
      }
    },
    calculatePercent(dividend, division) {
      if (dividend && division) {
        const result = (dividend / division) * 100
        return result.toFixed(2)
      }
      return 0
    },

    getYesterday() {
      const yesterday = moment().subtract(1, 'days').format('DD-MM-YYYY')
      return yesterday
    },

    async getProjectProgress() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          not_limit: true,
          requirementIds: this.requirementIds
        }
        const { data: { result: { data } } } = await this.$api.task.getProjectCompletionProgress({ params })
        this.dataGrantt = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/progress'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('text.copy_url_successful'))
    },

    /**
     * Filter select box
     *
     * @param input
     * @param option
     *
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(){
  .gantt-elastic__chart-expander.gantt-elastic__chart-expander--project{
    display: none;
  }
  .ant-card-body {
    padding: 0px;
  }
}
.warning{
  color: #ff0000;
}
.copy-url {
  padding: 0 24px;
}
</style>
