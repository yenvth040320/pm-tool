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
              :label="$t('module.task.start_datetime')"
              prop="start_datetime"
            >
              <a-date-picker
                v-model="filters.start_datetime"
                style="width:100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.end_datetime')"
              prop="end_datetime"
            >
              <a-date-picker
                v-model="filters.end_datetime"
                style="width:100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.status')"
              prop="status"
            >
              <a-select
                v-model="filters.status"
                allow-clear
                mode="multiple"
                show-search
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

      <gantt-elastic
        :options="options"
        :tasks="filteredTasks"
      />
    </a-card>
  </a-spin>
</template>

<script>
import moment from 'moment-timezone'
import GanttElastic from 'gantt-elastic'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { SORT, TASK_STATUS_CHART, USE_FLG_VALUE } from '~/constants'

export default {
  components: {
    GanttElastic
  },

  props: {
    requirementIds: {
      type: [Array],
      default: () => []
    }
  },
  async fetch() {
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

  data() {
    return {
      tasks: [],
      filteredTasks: [],
      dynamicStyle: {},
      members: [],
      functions: [],
      dataGrantt: {},
      SORT,
      TASK_STATUS_CHART,
      USE_FLG_VALUE,
      filters: {
        member_name: this.$route.query.member_id || undefined,
        function_name: +this.$route.query.function_id || undefined,
        status: +this.$route.query.status || undefined,
        start_datetime: +this.$route.query.start_datetime || null,
        end_datetime: +this.$route.query.start_datetime || null
      }
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    })
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

  mounted() {
    this.getProjectProgress()
    this.getMemberOfProject()
    this.getListFunction()
    this.$nextTick(() => {
      if (this.filteredTasks.length > 0) {
        const elementToObserve = this.$refs.myGanttElastic

        this.myResizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            console.log('Kích thước thay đổi', entry.contentRect)
          }
        })

        if (elementToObserve) {
          this.myResizeObserver.observe(elementToObserve)
        }
      }
    })
  },

  beforeDestroy() {
    if (this.myResizeObserver && this.myElement) {
      this.myResizeObserver.unobserve(this.myElement)
    }
  },

  methods: {
    /**
     * Get member in project
     */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.$store.state.project.id
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
        params.project_id = this.$store.state.project.id
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
        member_name: undefined,
        function_name: undefined,
        status: null,
        start_datetime: null,
        end_datetime: null
      }

      this.search()
    },

    /**
     * Search data.
     */
    search() {
      const filterTasks = task => {
        const users = task.user.split(',').map(user => user.trim())
        let memberMatch = false
        if (!this.filters.member_name) {
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
      this.filteredTasks = filteredTasks
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
  </style>
