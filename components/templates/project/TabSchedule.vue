<template>
  <div class="main">
    <a-button v-if="isShowSearchForm" @click="isShowSearchForm = false">
      <a-icon type="minus" />
    </a-button>
    <a-button v-if="!isShowSearchForm" @click="isShowSearchForm = true">
      <a-icon type="plus" />
    </a-button>
    <a-form-model
      v-if="isShowSearchForm"
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
            :label="$t('module.function.category_id')"
            prop="category_id"
          >
            <a-select
              v-model="filters.category_id"
              :placeholder="$t('module.function.category_id')"
              :filter-option="filterOption"
              show-search
              @change="setCategory(filters.category_id)"
            >
              <a-select-option
                v-for="(item, index) in categories"
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
            :label="$t('module.tab_schedule.code')"
            prop="version_code"
          >
            <a-input
              v-model="filters.code"
              :placeholder="$t('module.tab_schedule.code')"
            />
          </a-form-model-item>
        </a-col>
        <a-col
          :span="24"
          :md="12"
        >
          <a-form-model-item
            :label="$t('module.lifeCycle.reviewer_user_id')"
            prop="reviewer_user_id"
          >
            <a-select
              v-model="filters.reviewer_user_id"
              mode="single"
              :disabled="loading"
              :placeholder="$t('module.lifeCycle.reviewer_user_id')"
              show-search
              allow-clear
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col
          :span="24"
          :md="12"
        >
          <a-form-model-item
            :label="$t('module.mstLifeCycleStatus.mst_life_cycle_id')"
            prop="mst_life_cycle_id"
          >
            <a-select
              v-model="filters.mst_life_cycle_id"
              :placeholder="$t('module.mstLifeCycleStatus.mst_life_cycle_id')"
              :filter-option="filterOption"
              :disabled="loading"
              show-search
              allow-clear
            >
              <a-select-option
                v-for="(item, index) in mstLifeCycles"
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
            title="Tìm kiếm"
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
            title="Xoá điều kiện tìm kiếm"
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
      ref="calendarTable"
      :columns="columns"
      :data-source="dataFunction"
      :row-key="record => record.key"
      :loading="loading"
      :pagination="false"
      :expand-row-by-click="true"
      :scroll="{ x: 900, y: 700 }"
      bordered
      class="components-table-demo-nested"
      @expand="handleExpand"
      @change="handleTableChange"
    >
      <template
        slot="name"
        slot-scope="text, record"
      >
        <span
          v-if="record.key.startsWith('cycle')"
        >
          {{ record?.mst_life_cycle?.name }}
        </span>
        <span v-else>
          {{ record.name }}
        </span>
      </template>
      <template
        slot="code"
        slot-scope="text, record"
      >
        <span v-if="!record.key.startsWith('cycle')">
          {{ record.code ? record.code : (record.version_code ?? '') }}
        </span>
      </template>
      <template
        slot="status_table"
        slot-scope="text, record"
      >
        <span
          v-if="record.key.startsWith('cycle')"
        >
          <span v-if="record.mst_life_cycle_status" class="link" @click="updateStatus(record)">
            {{ record?.mst_life_cycle_status?.name }}
          </span>
          <span v-else class="to_update" @click="updateStatus(record)">
            Update
          </span>
        </span>
      </template>
      <template
        slot="reviewer_user_id"
        slot-scope="text, record"
      >
        <span v-if="record.key.startsWith('cycle')">
          <span v-if="record.reviewer_user" class="link" @click="updateReviewUser(record)">
            {{ record?.reviewer_user?.name }}
          </span>
          <span v-else class="to_update" @click="updateReviewUser(record)">
            Update
          </span>
        </span>
      </template>
      <template
        slot="start_date"
        slot-scope="text, record"
      >
        <div v-if="record.key.startsWith('cycle')">
          <span v-if="record.start_date" class="link" @click="updateDate(record)">{{ record.start_date ? moment(record.start_date).format('DD-MM-YYYY') : '' }}</span>
          <span v-else class="to_update" @click="updateDate(record)">
            Update
          </span>
        </div>
      </template>
      <template
        slot="end_date"
        slot-scope="text, record"
      >
        <div v-if="record.key.startsWith('cycle')">
          <span v-if="record.end_date" class="link" @click="updateDate(record)">{{ record.end_date ? moment(record.end_date).format('DD-MM-YYYY') : '' }}</span>
          <span v-else class="to_update" @click="updateDate(record)">
            Update
          </span>
        </div>
      </template>
      <template
        slot="point_et"
        slot-scope="text, record"
      >
        <div v-if="record.key.startsWith('cycle')">
          <span class="link" @click="updatePointEt(record)">{{ record.function_et_points ? calculateTotalPointEt(record.function_et_points) : 0 }} (+)</span>
        </div>
        <div v-if="record.key.startsWith('child')">
          <span class="link" @click="openPointDistributionForm(record)">{{ calVersionPoint(record) === null ? 0 : calVersionPoint(record) }}</span>
        </div>
      </template>
      <template
        v-for="item in dates"
        :slot="item.key"
        slot-scope="text, record"
      >
        <div
          :key="item.key"
          :style="{ backgroundColor: compareDate(record.start_date, record.end_date, moment(item.dataIndex, 'DD-MM-YYYY').format('YYYY-MM-DD')) ? record?.mst_life_cycle_status?.color : '' }"
          :class="isWeekend(item) ? 'weekend' : getStatusColor(record, item)"
        />
      </template>
    </a-table>
    <ModalChangeMstLifeCycleStatus ref="modalChangeStatus" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <ModalChangeReviewUserId ref="modalChangeReviewUser" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <ModalInsertPointEt ref="modalInsertPointEt" :users="users" @save="save" />
    <ModalUpdateDateTabSchedule ref="modalUpdateDateTabSchedule" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <EtPointDistribution ref="etPointDistribution" :mst-life-cycles="mstLifeCycles" @save="save" />
    <!-- end main-table -->
  </div>
</template>
<script>
import moment from 'moment-timezone'
import ModalChangeMstLifeCycleStatus from './ModalChangeMstLifeCycleStatus.vue'
import ModalChangeReviewUserId from './ModalChangeReviewUserId.vue'
import ModalInsertPointEt from './ModalInsertPointEt.vue'
import ModalUpdateDateTabSchedule from '~/components/templates/project/ModalUpdateDateTabSchedule'
import EtPointDistribution from '~/components/templates/project/EtPointDistribution'
import DataTable from '~/mixins/data-table'
import { FORMAT_DATE_FULL, USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    ModalChangeMstLifeCycleStatus,
    ModalChangeReviewUserId,
    ModalInsertPointEt,
    ModalUpdateDateTabSchedule,
    EtPointDistribution
  },

  props: {
    users: {
      type: [Array],
      default: () => []
    },
    categories: {
      type: [Array],
      default: () => []
    }
  },

  mixins: [
    DataTable
  ],
  async fetch() {
    this.$store.dispatch('setLoading', true)
    try {
      const params = this.$route.query
      params.project_id = this.id
      params.not_limit = true
      params.is_schedule = true
      params.category_id = this.$store.state.category.id ? this.$store.state.category.id : undefined
      const { data: { result: { data } } } = await this.$api.function.getDataTabSchedule({ params })
      this.functionSchedule = data
      this.modifyChildrenData(this.functionSchedule)
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
        code: this.$route.query.code || '',
        reviewer_user_id: +this.$route.query.reviewer_user_id || undefined,
        category_id: +this.$route.query.category_id || (this.$store.state.category.id ? this.$store.state.category.id : undefined),
        mst_life_cycle_id: +this.$route.query.mst_life_cycle_id || undefined
      },
      USE_FLG,
      USE_FLG_VALUE,
      innerData: [],
      mstLifeCycleStatus: [],
      mstLifeCycles: [],
      dataFunction: [],
      moment,
      smallestDate: '',
      largestDate: '',
      numberOfDays: '',
      dateArray: [],
      weekend: [],
      mstColor: [],
      functionSchedule: [],
      groupOfMonth: [],
      isShowSearchForm: true
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
          title: '',
          fixed: 'left',
          dataIndex: 'index',
          width: 40
        },
        {
          title: this.$t('module.tab_schedule.code_version'),
          key: 'code',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' },
          fixed: 'left',
          width: 90
        },
        {
          title: this.$t('module.tab_process.name'),
          key: 'name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          fixed: 'left',
          width: 160
        },
        {
          title: this.$t('module.tab_schedule.status'),
          key: 'status_table',
          scopedSlots: { customRender: 'status_table' },
          fixed: 'left',
          width: 105
        },
        {
          title: this.$t('module.lifeCycle.reviewer_user_id'),
          key: 'reviewer_user_id',
          dataIndex: 'reviewer_user_id',
          fixed: 'left',
          scopedSlots: { customRender: 'reviewer_user_id' },
          width: 110
        },
        {
          title: this.$t('module.tab_schedule.start_date'),
          key: 'start_date',
          dataIndex: 'start_date',
          scopedSlots: { customRender: 'start_date' },
          fixed: 'left',
          width: 83
        },
        {
          title: this.$t('module.tab_schedule.end_date'),
          key: 'end_date',
          dataIndex: 'end_date',
          scopedSlots: { customRender: 'end_date' },
          fixed: 'left',
          width: 83
        },
        {
          title: this.$t('module.tab_schedule.point_et'),
          key: 'point_et',
          scopedSlots: { customRender: 'point_et' },
          fixed: 'left',
          width: 70
        },
        ...calendarTitle
      ]
    },

    dates() {
      return this.getSlot()
    }
  },

  watch: {
    functionSchedule() {
      this.getLimitDays()
    }
  },

  created() {
    this.getMstLifeCycles()
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getMstColor()
  },

  updated() {
    this.getBackgroundColor()
  },

  methods: {
    /**
     * Convert function data to table
     */
    modifyChildrenData(val) {
      this.dataFunction = val.map(parent => {
        if (parent.children.length > 0) {
          parent.children = parent.children.map(child => {
            // get mst life cycle
            const uncheck = this.mstLifeCycles.map(lifeCycle => ({
              project_id: this.id,
              function_id: parent.id,
              version_code: child.version_code,
              mst_life_cycle_id: lifeCycle.id,
              mst_life_cycle: {
                id: lifeCycle.id,
                name: lifeCycle.name,
                et_percent: lifeCycle.et_percent
              },
              mst_life_cycle_status_id: null,
              reviewer_user_id: null,
              start_date: null,
              end_date: null,
              tasks: [],
              key: 'cycle' + this.id + parent.id + child.version_code + lifeCycle.id
            }))
            if (child.version_function_life_cycles.length > 0) {
              // filter data mst_life_cycle_id
              const mapIds = child.version_function_life_cycles.map(i => {
                return i.mst_life_cycle_id
              })
              const push = uncheck.filter(item => !mapIds.includes(item.mst_life_cycle_id))
              child.children = child.version_function_life_cycles.map(cycle => {
                return { ...cycle, key: 'cycle' + cycle.id }
              })
              if (push.length > 0) {
                // push uncheck mst_life_cycle to children to make column
                child.children.push(...push)
              }
            } else {
              // if version doesn't have life cycle push all
              child.children = []
              child.children.push(...uncheck)
            }
            return {
              ...child,
              function: parent,
              key: 'child' + child.id
            }
          })
        }
        // map key to avoid err
        return { ...parent, key: 'parent' + parent.id }
      })
    },

    /**
     * Compare date to determine range schedule of version functions
     */
    compareDate(start, end, columnDate) {
      const dateStart = moment(start)
      const dateEnd = moment(end)
      const column = moment(columnDate)
      if (start && end && column) {
        return dateStart.isSameOrBefore(column) && dateEnd.isSameOrAfter(column)
      } else if (start && !end) {
        return dateStart.isSame(column)
      } else if (!start && end) {
        return dateEnd.isSame(column)
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        mst_life_cycle_id: undefined,
        code: '',
        reviewer_user_id: undefined,
        category_id: undefined
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
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
     * Get smallest of start date and largest of end date
     */
    getLimitDays() {
      this.largestDate = ''
      this.smallestDate = ''
      this.functionSchedule.forEach(item => {
        const children = item.children
        if (children && children.length > 0) {
          children.forEach(child => {
            const subChildren = child.version_function_life_cycles
            if (subChildren && subChildren.length > 0) {
              subChildren.forEach(subChild => {
                if (subChild.end_date && subChild.start_date) {
                  if (moment(subChild.end_date).isAfter(moment(this.largestDate)) || !this.largestDate) {
                    this.largestDate = subChild.end_date
                  }
                  if (moment(subChild.start_date).isBefore(moment(this.smallestDate)) || !this.smallestDate) {
                    this.smallestDate = subChild.start_date
                  }
                } else if (subChild.end_date && !subChild.start_date) {
                  if (moment(subChild.end_date).isAfter(moment(this.largestDate)) || !this.largestDate) {
                    this.largestDate = subChild.end_date
                  }
                  if (moment(subChild.end_date).isBefore(moment(this.smallestDate)) || !this.smallestDate) {
                    this.smallestDate = subChild.end_date
                  }
                } else if (!subChild.end_date && subChild.start_date) {
                  if (moment(subChild.start_date).isAfter(moment(this.largestDate)) || !this.largestDate) {
                    this.largestDate = subChild.start_date
                  }
                  if (moment(subChild.start_date).isBefore(moment(this.smallestDate)) || !this.smallestDate) {
                    this.smallestDate = subChild.start_date
                  }
                }
              })
            }
          })
        }
      })
      this.dateArray = []
      if (this.largestDate && this.smallestDate) {
        this.numberOfDays = moment(this.largestDate).diff(moment(this.smallestDate), 'days')
        const currentDay = moment(this.smallestDate)
        while (currentDay.isSameOrBefore(this.largestDate)) {
          this.dateArray.push({
            date: currentDay.format('DD-MM-YYYY'),
            dayOfWeek: currentDay.format('dddd')
          })
          currentDay.add(1, 'days')
        }
      }
      console.log(this.dateArray, 'ss')
      this.$forceUpdate()
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
        header.width = 42
        header.align = 'center'
        header.dayName = element.dayOfWeek
        header.scopedSlots = { customRender: header.key }
        header.backgroundColor = (element.dayOfWeek === 'Sunday' || element.dayOfWeek === 'Saturday') ? '#EA9999' : ''
        daysOfMonth.push(header)
      })
      daysOfMonth.forEach(element => {
        const dateParts = element.dataIndex.split('-')
        const year = parseInt(dateParts[2])
        const month = parseInt(dateParts[1])

        const existingMonth = groupedMonths.find(group => group.title === `Tháng ${month} ${year}`)
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
     * Apply color by status
     */
    getStatusColor(record, item) {
      return this.compareDate(record.start_date, record.end_date, moment(item.dataIndex, 'DD-MM-YYYY').format('YYYY-MM-DD')) ? record?.mst_life_cycle_status?.color : ''
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
     * Update DOM when expand row
     */
    handleExpand() {
      this.$forceUpdate()
    },

    /**
     * On select update or create record
     */
    async updateOrCreateRecord(record) {
      this.$store.dispatch('setLoading', true)
      try {
        if (record.start_date && record.end_date) {
          const start = moment(record.start_date)
          const end = moment(record.end_date)
          if (start.isSameOrAfter(end)) {
            this.$notification.error({
              message: this.$t('module.tab_schedule.validate_date_err_message')
            })
            return
          }
        }
        record.start_date = record.start_date ? moment(record.start_date).format(FORMAT_DATE_FULL) : null
        record.end_date = record.end_date ? moment(record.end_date).format(FORMAT_DATE_FULL) : null
        if (record.id) {
          await this.repository.update(record.id, record)
        } else {
          await this.repository.create(record)
        }
        this.$fetch()
        this.$forceUpdate()
        this.getBackgroundColor()

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
    },

    /**
     * Open update status modal
     */
    updateStatus(record) {
      this.$refs.modalChangeStatus.open(record)
    },

    /**
     * Open update reviewer modal
     */
    updateReviewUser(record) {
      this.$refs.modalChangeReviewUser.open(record)
    },

    updatePointEt(record) {
      try {
        if (record.mst_life_cycle_status_id === undefined || record.mst_life_cycle_status_id === null) {
          throw new Error('Hãy update trạng thái trước.')
        } else {
          this.$refs.modalInsertPointEt.open(record)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.error_insert_point')
        })
      }
    },

    /**
     * Emit event submit from child components
     */
    save() {
      this.$fetch()
      this.$forceUpdate()
      this.getBackgroundColor()
    },

    /**
     * Get all mst col
     */
    async getMstColor() {
      try {
        const params = {
          project_id: this.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycleStatus.listColor({ params })
        this.mstColor = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    scrollToDate(date) {
      const target = moment(date).format('DD-MM-YYYY')
      const table = this.$refs.calendarTable.$el
      const thead = table.querySelector('.ant-table-thead')
      const item = thead.querySelector(`[key="${target}"]`)
      if (item) {
        item.scrollIntoView()
      }
    },

    async getMstLifeCycles() {
      try {
        const params = {
          project_id: this.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
    },

    /**
     * Set category on search
     */
    setCategory(categoryId) {
      const category = this.categories.find(item => item.id === categoryId)
      this.$store.dispatch('addCategory', {
        id: category.id,
        name: category.name
      })
    },

    /**
     * Calculate points in 1 life cycle
     */
    calculateTotalPointEt(pointEts) {
      if (pointEts.length > 0) {
        const total = pointEts.reduce((total, pointObj) => total + pointObj.point_et, 0)
        return Math.max(total.toFixed(2), 0)
      } else {
        return 0
      }
    },
    /**
     * Open update start and end date modal
     */
    updateDate(record) {
      this.$refs.modalUpdateDateTabSchedule.open(record)
    },

    /**
     * Calculate points for one version
     */
    calVersionPoint(record) {
      if (record.version_function_life_cycles.length > 0) {
        const versionFunctionLifeCycles = record.version_function_life_cycles
        const totalPointEt = versionFunctionLifeCycles.reduce((total, versionFunction) => {
          const functionEtPoints = versionFunction.function_et_points
          const pointsSum = functionEtPoints.reduce((sum, functionEtPoint) => sum + functionEtPoint.point_et, 0)
          return total + pointsSum
        }, 0)
        return totalPointEt.toFixed(2)
      } else {
        return null
      }
    },

    openPointDistributionForm(record) {
      this.$refs.etPointDistribution.open(record)
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
</style>
