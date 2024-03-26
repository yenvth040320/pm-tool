<template>
  <div>
    <a-card class="mb-4">
      <a-statistic :title="$t('module.home.current_month_point')" :precision="2" :value="currentMonthPoints" />
      <a-statistic :title="$t('module.home.last_month_point')" :precision="2" :value="lastMonthPoints" />
    </a-card>
    <a-card class="mb-4">
      <a-collapse default-active-key="1">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" :header="$t('module.home.to_do_task_today')">
          <div class="container-fuild">
            <div>
              <h3>{{ $t('module.point_history.total_point') + ': ' + totalPointTodayToDo }}</h3>
            </div>
          </div>
          <a-table
            bordered
            :data-source="todayTodoTaskList"
            :row-key="record => record.id"
            :pagination="false"
            :columns="columnTaskTodo"
            :loading="loading"
            class="main-table"
          >
            <template
              slot="project_id"
              slot-scope="text, record"
            >
              <span>{{ record?.project?.name }}</span>
            </template>
            <template
              slot="approve_point"
              slot-scope="text, record"
            >
              {{ record.approve_point ? record.approve_point.toFixed(2) : '' }}
            </template>
            <template
              slot="function_id"
              slot-scope="text, record"
            >
              <a target="_blank" :href="`/function/${record?.function?.id}/version/${record?.function?.latest_version}/`">{{ record.function ? '[' + record.function.code + '] : ' + record.function.name : '' }}</a>
            </template>
            <template
              slot="title_task"
              slot-scope="text, record"
            >
              <a target="_blank" :href="`/task/detail/${record.id}`">
                {{ record.title }}
              </a>
            </template>
            <template
              slot="status"
              slot-scope="text, record"
            >
              <div v-for="i in TASK_STATUS" :key="i.value">
                <span v-if="record.status === i.value">{{ i.label }}</span>
              </div>
            </template>
            <template
              slot="approve_status"
              slot-scope="text, record"
            >
              <div v-for="i in TASK_APPROVE_STATUS" :key="i.value">
                <span v-if="record.approve_status === i.value">{{ i.label }}</span>
              </div>
            </template>
            <template
              slot="approver"
              slot-scope="text, record"
            >
              <span>{{ record?.approver_user?.name }}</span>
            </template>
          </a-table>
        </a-collapse-panel>
        <!-- End table task todo today -->
      </a-collapse>
    </a-card>
    <a-card v-if="todayToApproveTaskList.length > 0" class="mb-4">
      <a-collapse default-active-key="2">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="2" :header="$t('module.home.to_approve_task_today')">
          <div class="container-fuild">
            <div>
              <h3>{{ $t('module.point_history.total_point') + ': ' + totalPointToApprove }}</h3>
            </div>
          </div>
          <a-table
            bordered
            :data-source="todayToApproveTaskList"
            :row-key="record => record.id"
            :pagination="false"
            :columns="columnTaskToApprove"
            :loading="loading"
            class="main-table"
          >
            <template
              slot="project_id"
              slot-scope="text, record"
            >
              <span>{{ record?.project?.name }}</span>
            </template>
            <template
              slot="function_id"
              slot-scope="text, record"
            >
              <a target="_blank" :href="`/function/${record?.function?.id}/version/${record?.function?.latest_version}/`">{{ record.function ? '[' + record.function.code + '] : ' + record.function.name : '' }}</a>
            </template>
            <template
              slot="approve_point"
              slot-scope="text, record"
            >
              {{ record.approve_point ? record.approve_point.toFixed(2) : '' }}
            </template>
            <template
              slot="title_task"
              slot-scope="text, record"
            >
              <a target="_blank" :href="`/task/detail/${record.id}`">
                {{ record.title }}
              </a>
            </template>
            <template
              slot="status"
              slot-scope="text, record"
            >
              <div v-for="i in TASK_STATUS" :key="i.value">
                <span v-if="record.status === i.value">{{ i.label }}</span>
              </div>
            </template>
            <template
              slot="approve_status"
              slot-scope="text, record"
            >
              <div v-for="i in TASK_APPROVE_STATUS" :key="i.value">
                <span v-if="record.approve_status === i.value">{{ i.label }}</span>
              </div>
            </template>
            <template
              slot="member_id"
              slot-scope="text, record"
            >
              <span v-for="(item, index) in record.task_owners" :key="index">
                {{ item?.member?.name }}
                <br />
              </span>
            </template>
          </a-table>
        </a-collapse-panel>
      </a-collapse>
      <!-- End table task to approve today -->
    </a-card>
    <NotificationSelectProject />
  </div>
</template>
<script>
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import NotificationSelectProject from '~/components/templates/popupNotification/NotificationSelectProject.vue'
import {
  TASK_STATUS,
  TASK_APPROVE_STATUS,
  TASK_STATUS_VALUE,
  TASK_APPROVE_STATUS_VALUE,
  TASK_TYPE_VALUE
} from '~/constants'
export default {
  /**
   * Declare components.
   */
  components: {
    NotificationSelectProject
  },

  data() {
    return {
      TASK_STATUS,
      TASK_APPROVE_STATUS,
      TASK_STATUS_VALUE,
      TASK_APPROVE_STATUS_VALUE,
      TASK_TYPE_VALUE,
      moment,
      currentMonthPoints: 0,
      lastMonthPoints: 0,
      todayTodoTaskList: [],
      todayToApproveTaskList: []
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    }),

    columnTaskTodo() {
      return [
        {
          title: this.$t('module.task.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          width: 150
        },
        {
          title: this.$t('module.task.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          width: 200
        },
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_task' }
        },
        {
          title: this.$t('module.task.approve_point'),
          scopedSlots: { customRender: 'approve_point' },
          dataIndex: 'approve_point',
          width: 80
        },
        {
          title: this.$t('module.task.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 140
        },
        {
          title: this.$t('module.task.approve_status'),
          dataIndex: 'approve_status',
          scopedSlots: { customRender: 'approve_status' },
          width: 140
        },
        {
          title: this.$t('module.task.approver'),
          dataIndex: 'approver',
          scopedSlots: { customRender: 'approver' },
          width: 120
        }
      ]
    },

    columnTaskToApprove() {
      return [
        {
          title: this.$t('module.task.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          width: 150
        },
        {
          title: this.$t('module.task.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          width: 200
        },
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_task' }
        },
        {
          title: this.$t('module.task.approve_point'),
          scopedSlots: { customRender: 'approve_point' },
          dataIndex: 'approve_point',
          width: 80
        },
        {
          title: this.$t('module.task.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 140
        },
        {
          title: this.$t('module.task.approve_status'),
          dataIndex: 'approve_status',
          scopedSlots: { customRender: 'approve_status' },
          width: 140
        },
        {
          title: this.$t('module.task.member_id'),
          dataIndex: 'member_id',
          scopedSlots: { customRender: 'member_id' },
          width: 120
        }
      ]
    },

    totalPointTodayToDo() {
      if (this.todayTodoTaskList.length > 0) {
        const total = this.todayTodoTaskList.reduce((total, item) => {
          const point = parseFloat(item.et_point) || 0
          return total + point
        }, 0)
        return total.toFixed(2)
      } else {
        return 0
      }
    },

    totalPointToApprove() {
      if (this.todayToApproveTaskList.length > 0) {
        const total = this.todayToApproveTaskList.reduce((total, item) => {
          const point = parseFloat(item.et_point) || 0
          return total + point
        }, 0)
        return total.toFixed(2)
      } else {
        return 0
      }
    }
  },

  created() {
    this.getTotalPointCurrentMonth()
    this.getTotalPointLastMonth()
    this.getListTaskTodoToday()
    this.getListTaskToApproveToday()
  },

  methods: {
    /**
     * Get Total Point Current Month
     */
    async getTotalPointCurrentMonth() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.not_limit = true
        params.point_history = true
        params.owner = this.$auth.user.id
        params.start_date = moment().startOf('month').format('YYYY-MM-DD')
        params.end_date = moment().format('YYYY-MM-DD')
        const { data: { result: { data } } } = await this.$api.userPointTransactionHistory.list({ params })
        if (data.length > 0) {
          const total = data.reduce((total, item) => {
            const point = parseFloat(item.number_point)
            return total + point
          }, 0)
          this.currentMonthPoints = total.toFixed(2)
        } else {
          this.currentMonthPoints = 0
        }
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
     * Get Total Point Last Month
     */
    async getTotalPointLastMonth() {
      try {
        const params = {}
        params.not_limit = true
        params.point_history = true
        params.owner = this.$auth.user.id
        params.start_date = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        params.end_date = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
        const { data: { result: { data } } } = await this.$api.userPointTransactionHistory.list({ params })
        if (data.length > 0) {
          const total = data.reduce((total, item) => {
            const point = parseFloat(item.number_point)
            return total + point
          }, 0)
          this.lastMonthPoints = total.toFixed(2)
        } else {
          this.lastMonthPoints = 0
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list task todo today
     */
    async getListTaskTodoToday() {
      try {
        const params = {}
        params.owner = this.$auth.user.id
        params.is_open = true
        params.task_type = TASK_TYPE_VALUE.project
        params.end_date = moment().format('YYYY-MM-DD')
        const { data: { result: { data } } } = await this.$api.task.listHome({ params })
        this.todayTodoTaskList = data
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list task to approve today
     */
    async getListTaskToApproveToday() {
      try {
        const params = {}
        params.is_open = true
        params.approver = this.$auth.user.id
        params.end_date = moment().format('YYYY-MM-DD')
        const { data: { result: { data } } } = await this.$api.task.listHome({ params })
        this.todayToApproveTaskList = data
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
  .ant-collapse-header {
    font-weight: 600;
  }
}
</style>
