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
                  :label="$t('module.point_history.approver')"
                  prop="approvers"
                >
                  <a-select
                    v-model="filters.approvers"
                    :placeholder="$t('module.point_history.approver')"
                    show-search
                    :filter-option="filterOption"
                    allow-clear
                    show-arrow
                    mode="multiple"
                  >
                    <a-select-option
                      v-for="(item, index) in approvers"
                      :key="index"
                      :value=" String(item.id)"
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
                    format="YYYY/MM/DD"
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
                    format="YYYY/MM/DD"
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

      <div>
        <h3>{{ $t('module.point_history.title_user_point', { name: $auth.user.name }) }}</h3>
        <h3>{{ $t('module.point_history.title_date', { start: moment(this.$route.query.start_date).format('DD/MM/YYYY'), end: moment(this.$route.query.end_date).format('DD/MM/YYYY') }) }}</h3>
        <h3>{{ $t('module.point_history.total_point') + ': ' + totalPoint }}</h3>
      </div>
      <a-table
        bordered
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="false"
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
      <!-- end main-table -->
    </a-card>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import {
  TASK_TYPE,
  TASK_TYPE_VALUE,
  TASK_STATUS,
  TASK_APPROVE_ET_STATUS,
  TASK_APPROVE_STATUS,
  TASK_STATUS_VALUE,
  TASK_APPROVE_STATUS_VALUE,
  POINT_HISTORY_ACTION_TYPE
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
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
      params.not_limit = true
      params.point_history = true
      params.owner = this.$auth.user.id
      if (!this.$route.query.start_date) {
        params.start_date = moment().startOf('month').format('YYYY-MM-DD')
      }
      if (!this.$route.query.end_date) {
        params.end_date = moment().endOf('month').format('YYYY-MM-DD')
      }

      const { data: { result: { data } } } = await this.repository.list({ params })
      this.data = data
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
        project_id: +this.$route.query.project_id || undefined,
        approvers: this.$route.query.approvers ? this.$route.query.approvers : [],
        action_types: this.$route.query.action_types ? this.$route.query.action_types : [],
        start_date: this.$route.query.start_date || moment().startOf('month').format('YYYY/MM/DD'),
        end_date: this.$route.query.end_date || moment().endOf('month').format('YYYY/MM/DD')
      },
      defaultParams: {},
      projects: [],
      approvers: [],
      TASK_TYPE,
      TASK_TYPE_VALUE,
      TASK_STATUS,
      TASK_APPROVE_ET_STATUS,
      TASK_APPROVE_STATUS,
      TASK_STATUS_VALUE,
      TASK_APPROVE_STATUS_VALUE,
      POINT_HISTORY_ACTION_TYPE,
      moment
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
    this.getUserApprovers()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * List Function.
     */
    async getProjects() {
      try {
        const { data: { result: { data } } } = await this.$api.userPointTransactionHistory.listProject()
        this.projects = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List ApproveUser.
     */
    async getUserApprovers() {
      try {
        const { data: { result: { data } } } = await this.$api.userPointTransactionHistory.listApprovers()
        this.approvers = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
        approvers: undefined,
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
        this.filters.start_date = moment(this.filters.start_date).format('YYYY/MM/DD')
      }
      if (this.filters.end_date) {
        this.filters.end_date = moment(this.filters.end_date).format('YYYY/MM/DD')
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

    changeFunction(val) {
      if (!val) {
        this.versions = []
      } else {
        this.versions = this.functions.find(i => i.id === val).version_functions
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
</style>
