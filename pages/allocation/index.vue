<template>
  <div>
    <a-card class="mb-4">
      <div class="main">
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
                :label="$t('module.allocation.month')"
                prop="month"
              >
                <a-month-picker
                  v-model="filters.month"
                  :placeholder="$t('module.allocation.month')"
                  :disabled="isWeekSelected"
                  @change="onMonthChange"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="24"
              :md="12"
            >
              <a-form-model-item
                :label="$t('module.allocation.week')"
                prop="week"
              >
                <a-week-picker v-model="filters.week" placeholder="Select week" :disabled="isMonthSelected" @change="onWeekChange" />
              </a-form-model-item>
            </a-col>

            <a-col
              :span="24"
              :md="12"
            >
              <a-form-model-item
                :label="$t('module.user')"
                prop="user_id"
              >
                <a-select
                  v-model="filters.owners"
                  :placeholder="$t('module.user')"
                  :filter-option="filterOption"
                  show-search
                  mode="multiple"
                >
                  <a-select-option
                    v-for="(item, index) in users"
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
                :label="$t('user.is_partner')"
                prop="is_partner"
              >
                <a-select
                  v-model="filters.is_partner"
                  :placeholder="$t('user.is_partner')"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="(item, index) in IS_PARTNER"
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
                :label="$t('user.roles')"
                prop="roles"
              >
                <a-select
                  v-model="filters.roles"
                  :placeholder="$t('user.roles')"
                  :filter-option="filterOption"
                  show-search
                  mode="multiple"
                >
                  <a-select-option
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.id"
                  >
                    {{ role.name }}
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
                title="Tìm kiếm"
                class="min-w-100"
                :disabled="loading"
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
                title="Xoá điều kiện tìm kiếm"
                class="min-w-100"
                :disabled="loading"
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
          ref="calendarTable"
          :columns="columns"
          :data-source="data"
          :row-key="record => record.id"
          :loading="loading"
          :pagination="false"
          :scroll="{ x: 900, y: 700 }"
          bordered
          @change="handleTableChange"
        >
          <template
            slot="name"
            slot-scope="text, record"
          >
            <span>
              {{ record.name }}
            </span>
          </template>
          <template
            v-for="date in dates"
            :slot="date.dataIndex"
            slot-scope="text, record"
          >
            <div
              :key="date.key"
              :class="isWeekend(date) ? 'weekend' : ''"
              class="total__point-date"
            >
              <div class="text-center total-point">
                {{ getRoundedEtPoints(record.points_by_day[date.dataIndex]?.totalEtPoints) || 0 }}
              </div>
              <a-divider
                v-if="record.points_by_day[date.dataIndex] &&
                  record.points_by_day[date.dataIndex].projects &&
                  Object.keys(record.points_by_day[date.dataIndex].projects).length > 0"
              />
              <div v-for="project in record.points_by_day[date.dataIndex]?.projects || []" :key="project.id">
                <a :href="`/progress?project_id=${project.id}&date=${date.dataIndex}&member_name=${record.name}&status=New&status=In%20progress&status=Re%20progress&status=Resolved&status=Done`" target="_blank" style="color:#0077c0;" class="link__detail-task">{{ project.name }}: {{ getRoundedEtPoints(project.etPoint) }}</a>
              </div>
            </div>
          </template>
        </a-table>
        <!-- end main-table -->
      </div>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import { USE_FLG, USE_FLG_VALUE, TASK_TYPE_VALUE, IS_PARTNER, IS_PARTNER_VALUE } from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
  },

  mixins: [
    DataTable
  ],
  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.user.list({ params })
      this.users = data.map(item => {
        return { ...item, tasks: [], points_by_day: {} }
      })
      this.filteredUsers = this.users
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
      resource: 'versionFunctionLifeCycle',
      id: +this.$route.params.id || 0,
      visible: false,
      currentId: 0,
      filters: {
        month: null,
        week: null,
        owners: Array.isArray(this.$route.query.owners) && this.$route.query.owners.length > 0
          ? this.$route.query.owners.map(owners => +owners)
          : (this.$route.query.owners ? [+this.$route.query.owners] : []),
        is_partner: +this.$route.query.is_partner || IS_PARTNER_VALUE.no,
        roles: +this.$route.query.roles || undefined
      },
      USE_FLG,
      USE_FLG_VALUE,
      innerData: [],
      moment,
      smallestDate: '',
      largestDate: '',
      numberOfDays: '',
      dateArray: [],
      weekend: [],
      mstColor: [],
      functionSchedule: [],
      groupOfMonth: [],
      isShowSearchForm: true,
      users: [],
      isMonthSelected: false,
      isWeekSelected: true,
      tasks: [],
      filteredUsers: [],
      TASK_TYPE_VALUE,
      IS_PARTNER,
      IS_PARTNER_VALUE,
      data: [],
      roles: []
    }
  },

  /**
     * Computed event.
     */
  computed: {
    header() {
      const calendarTitle = this.getCalendarTitle()
      return [
        {
          title: this.$t('module.allocation.user_name'),
          key: 'name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150
        },
        ...calendarTitle
      ]
    },

    dates() {
      return this.getSlot()
    }
  },

  watch: {
  },

  created() {
    this.filters.week = moment()
  },

  /**
     * Mounted event.
     */
  mounted() {
    this.search()
    this.getRoleList()
  },

  updated() {
    this.getBackgroundColor()
  },

  methods: {
    async getRoleList() {
      try {
        const params = {
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.role.list({ params })
        this.roles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    onMonthChange() {
      if (this.filters.month === null) {
        this.isMonthSelected = false
        this.isWeekSelected = false
      } else {
        this.isMonthSelected = true
        this.isWeekSelected = false
      }
    },
    onWeekChange() {
      if (this.filters.week === null) {
        this.isWeekSelected = false
        this.isMonthSelected = false
      } else {
        this.isWeekSelected = true
        this.isMonthSelected = false
      }
    },

    search() {
      this.dateArray = []
      if (this.filters.month) {
        const selectedMonth = this.$moment(this.filters.month).startOf('month')
        const lastDayOfMonth = this.$moment(this.filters.month).endOf('month')

        while (selectedMonth.isSameOrBefore(lastDayOfMonth, 'day')) {
          this.dateArray.push({
            date: selectedMonth.format('DD-MM-YYYY'),
            dayOfWeek: selectedMonth.format('dddd')
          })
          selectedMonth.add(1, 'day')
        }
      }
      if (this.filters.week) {
        const selectedWeek = this.$moment(this.filters.week).startOf('week')
        const lastDayOfWeek = this.$moment(this.filters.week).endOf('week')
        while (selectedWeek.isSameOrBefore(lastDayOfWeek, 'day')) {
          this.dateArray.push({
            date: selectedWeek.format('DD-MM-YYYY'),
            dayOfWeek: selectedWeek.format('dddd'),
            weekOfMonth: selectedWeek.week() - this.$moment(selectedWeek).startOf('month').week() + 1
          })
          selectedWeek.add(1, 'day')
        }
      }

      if (this.filters.week || this.filters.month) {
        const firstDate = this.dateArray.length > 0 ? this.dateArray[0].date : null
        const lastDate = this.dateArray.length > 0 ? this.dateArray[this.dateArray.length - 1].date : null
        this.getListTask(firstDate, lastDate)
      }
    },

    async getListTask(startDate, endDate) {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          task_type: TASK_TYPE_VALUE.project,
          owners: this.filters.owners,
          start: this.$moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          end: this.$moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          is_partner: this.filters.is_partner,
          roles: this.filters.roles
        }

        const query = {}
        const newQuery = {
          ...this.$route.query,
          ...params
        }
        Object.entries(newQuery).forEach(([key, value]) => {
          if (value !== '' && value !== null && value !== undefined) {
            query[key] = value
          }
        })
        this.$router.push({ query })
        const { data: { result: { data } } } = await this.$api.task.getTaskOfEveryBody({ params })
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
     * Convert function data to table
     */
    processUserTasks() {
      const getWorkingMinutesInDay = (date, start, end) => {
        const workStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30, 0)
        const lunchStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
        const lunchEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0)
        const workEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 30, 0)

        start = (start < workStart) ? workStart : start
        end = (end > workEnd) ? workEnd : end

        const morningWork = (start < lunchStart && end > lunchStart) ? (lunchStart - start) : (end - start)
        const afternoonWork = (start < lunchEnd && end > lunchEnd) ? (end - lunchEnd) : 0

        return Math.max(0, morningWork + afternoonWork) / 60000 // Return minutes
      }
      this.filteredUsers.forEach(user => {
        user.points_by_day = {}

        user.tasks.forEach(task => {
          const start = new Date(task.start_datetime)
          const end = new Date(task.end_datetime)

          let current = new Date(start)
          if (start.toDateString() === end.toDateString()) {
            // Task within a single day
            const dateKey = `${String(start.getDate()).padStart(2, '0')}-${String(start.getMonth() + 1).padStart(2, '0')}-${start.getFullYear()}`
            if (!user.points_by_day[dateKey]) {
              user.points_by_day[dateKey] = {
                totalEtPoints: 0,
                projects: {}
              }
            }
            if (!user.points_by_day[dateKey].projects[task.project_id]) {
              user.points_by_day[dateKey].projects[task.project_id] = {
                id: task.project_id,
                name: task.project.name,
                etPoint: 0
              }
            }
            user.points_by_day[dateKey].totalEtPoints += parseFloat(task.et_point)
            user.points_by_day[dateKey].projects[task.project_id].etPoint += parseFloat(task.et_point)
          } else {
            let totalWorkingMinutes = 0

            while (current < end) {
              if (current.getDay() !== 0 && current.getDay() !== 6) {
                totalWorkingMinutes += getWorkingMinutesInDay(current, start, end)
              }
              current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1)
            }
            current = new Date(start)
            while (current < end) {
              if (current.getDay() !== 0 && current.getDay() !== 6) {
                const dailyWorkingMinutes = getWorkingMinutesInDay(current, start, end)
                const dailyEtPoint = totalWorkingMinutes > 0 ? (parseFloat(task.et_point) * dailyWorkingMinutes) / totalWorkingMinutes : 0

                const dateKey = `${String(current.getDate()).padStart(2, '0')}-${String(current.getMonth() + 1).padStart(2, '0')}-${current.getFullYear()}`
                if (!user.points_by_day[dateKey]) {
                  user.points_by_day[dateKey] = {
                    totalEtPoints: 0,
                    projects: {}
                  }
                }
                if (!user.points_by_day[dateKey].projects[task.project_id]) {
                  user.points_by_day[dateKey].projects[task.project_id] = {
                    id: task.project_id,
                    name: task.project.name,
                    etPoint: 0
                  }
                }
                user.points_by_day[dateKey].totalEtPoints += dailyEtPoint
                user.points_by_day[dateKey].projects[task.project_id].etPoint += dailyEtPoint
              }
              current = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1)
            }
          }
        })
      })
    },

    getRoundedEtPoints(value) {
      // Check if value is not undefined or null before trying to round it
      return value != null ? parseFloat(value).toFixed(2) : '0.00'
    },

    /**
       * On clear form search.
       */
    reset() {
      this.filters = {
        month: null,
        week: moment(),
        user_id: undefined,
        role: undefined,
        is_partner: undefined
      }
      this.search()
    },

    /**
       * Search on select box
       */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
       * Check if date is weekend
       */
    isWeekend(date) {
      return date.dayName === 'Sunday' || date.dayName === 'Saturday'
    },

    /**
       * Get title day of calendar
       */
    getCalendarTitle() {
      const daysOfMonth = []
      const groupedMonths = []
      this.dateArray.forEach(element => {
        const header = {}
        header.title = moment(element.date, 'DD-MM-YYYY').format('DD') + ' ' + '(' + element.dayOfWeek.slice(0, 3) + ')'
        header.dataIndex = element.date
        header.key = element.date
        header.width = 100
        header.align = 'center'
        header.dayName = element.dayOfWeek
        header.weekName = element.weekOfMonth ? element.weekOfMonth : ''
        header.scopedSlots = { customRender: header.key }
        header.backgroundColor = (element.dayOfWeek === 'Sunday' || element.dayOfWeek === 'Saturday') ? '#EA9999' : ''
        daysOfMonth.push(header)
      })
      daysOfMonth.forEach(element => {
        const dateParts = element.dataIndex.split('-')
        const year = parseInt(dateParts[2])
        const month = parseInt(dateParts[1])
        let existingMonth = null
        existingMonth = groupedMonths.find(group => group.title === `Tháng ${month} ${year}`)

        if (existingMonth) {
          existingMonth.children.push(element)
        } else {
          groupedMonths.push({
            title: `Tháng ${month} ${year}`,
            children: [element]
          })
        }
      })

      return groupedMonths
    },

    getSlot() {
      const daysOfMonth = []
      this.dateArray.forEach(element => {
        const header = {}
        header.title = element.date
        header.dataIndex = element.date
        header.key = element.date
        header.width = 110
        header.align = 'center'
        header.dayName = element.dayOfWeek
        header.scopedSlots = { customRender: header.key }
        header.backgroundColor = (element.dayOfWeek === 'Sunday' || element.dayOfWeek === 'Saturday') ? '#EA9999' : ''
        daysOfMonth.push(header)
      })
      return daysOfMonth
    },

    /**
       * Set background of child elements to parent elements
       */
    getBackgroundColor() {
      const table = this.$refs.calendarTable.$el
      const tbody = table.querySelector('.ant-table-tbody')
      const tdElements = tbody.querySelectorAll('td')
      if (tdElements) {
        tdElements.forEach(td => {
          td.removeAttribute('style')
        })
      }
      this.weekend = document.getElementsByClassName('weekend')
      const today = document.getElementsByClassName('today')
      this.mstColor.forEach(color => {
        const element = document.getElementsByClassName(color)
        for (let i = 0; i < element.length; i++) {
          element[i].parentElement.style.backgroundColor = color
        }
      })
      for (let i = 0; i < this.weekend.length; i++) {
        this.weekend[i].parentElement.style.backgroundColor = '#EA9999'
      }
      for (let i = 0; i < today.length; i++) {
        today[i].parentElement.style.backgroundColor = '#00FFFF'
      }
    },

    /**
       * Replace query
       *
       * @param {Object} data query
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
      const currentHash = window.location.hash
      const newRoute = { query }
      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
        this.$fetch()
      } else {
        if (currentHash) {
          newRoute.hash = currentHash
        }
        this.$router.push(newRoute)
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  .description-version {
    word-wrap: break-word;
    white-space: normal;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.5em;
  }
  .link {
    color: #1890ff;
  }
  .to_update {
    color: red;
  }
  :deep() {
    .ant-divider {
      margin: 6px;
    }
    .ant-table-tbody > tr > td {
      cursor: pointer;
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 1px 1px;
    }
  }
  .weekend {
    background-color: #EA9999;
  }
  .today {
    background-color: rgb(0,255,255);
  }
  .total__point-date {
    height: 100%;
  }
  </style>
