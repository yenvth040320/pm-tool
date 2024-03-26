<template>
  <div>
    <a-card class="mb-4 card-container">
      <template slot="title">
        {{ $t('module.task') }}
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

        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoCopyUrl()"
        >
          {{ $t('common.copy_url') }}
        </a-button>
      </template>
      <a-collapse default-active-key="1">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" header="Tìm kiếm">
          <a-form-model
            ref="form"
            layout="inline"
            label-align="left"
            :colon="false"
            :model="filters"
            :label-col="{ sm: 14 }"
            :wrapper-col="{ sm: 24 }"
            class="mb-4"
            @submit.prevent="search"
          >
            <a-row>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  prop="title"
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                >
                  <div class="label">
                    {{ $t('module.task.title') }}
                  </div>
                  <a-input
                    v-model="filters.title"
                    :placeholder="$t('module.task.title')"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  prop="requirement_id"
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                >
                  <div class="label">
                    {{ $t('module.task.requirement_id') }}
                  </div>
                  <a-select
                    v-model="filters.requirement_ids"
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
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="task_type"
                >
                  <div class="label">
                    {{ $t('module.task.task_type') }}
                  </div>
                  <a-select
                    v-model="filters.task_types"
                    :placeholder="$t('module.task.task_type')"
                    :filter-option="filterOption"
                    mode="multiple"
                    show-arrow
                    show-search
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in TASK_TYPE"
                      :key="index"
                      :value="String(item.value)"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="function_id"
                >
                  <div class="label">
                    {{ $t('module.task.function_id') }}
                  </div>
                  <a-select
                    v-model="filters.function_id"
                    :placeholder="$t('module.function')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                    @change="changeFunction"
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
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  prop="version_code"
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                >
                  <div class="label">
                    {{ $t('module.task.version_code') }}
                  </div>
                  <a-select
                    v-model="filters.version_code"
                    :placeholder="$t('module.task.version_code')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in versions"
                      :key="index"
                      :value="item.version_code"
                    >
                      {{ item.version_code + ': ' + item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="mst_life_cycle_id"
                >
                  <div class="label">
                    {{ $t('module.task.mst_life_cycle_id') }}
                  </div>
                  <a-select
                    v-model="filters.mst_life_cycle_id"
                    :placeholder="$t('module.task.mst_life_cycle_id')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in mstLifeCycles"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item?.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="approver"
                >
                  <div class="label">
                    {{ $t('module.task.approver') }}
                  </div>
                  <a-select
                    v-model="filters.approver"
                    :placeholder="$t('module.task.approver')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
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
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="approve_status"
                >
                  <div class="label">
                    {{ $t('module.task.approve_status') }}
                  </div>
                  <a-select
                    v-model="filters.approve_status"
                    :placeholder="$t('module.task.approve_status')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in TASK_APPROVE_STATUS"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="start_datetime"
                >
                  <div class="label">
                    {{ $t('module.task.start_datetime') }}
                  </div>
                  <a-date-picker
                    v-model="filters.start_datetime"
                    :placeholder="$t('module.task.start_datetime')"
                    format="YYYY-MM-DD"
                    style="width:100%"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="status"
                >
                  <div class="label">
                    {{ $t('module.userPointTransactionHistory.owner') }}
                  </div>
                  <a-select
                    v-model="filters.owners"
                    :placeholder="$t('module.userPointTransactionHistory.owner')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                    mode="multiple"
                    show-arrow
                  >
                    <a-select-option
                      v-for="(item, index) in users"
                      :key="index"
                      :value="String(item.id)"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="status"
                >
                  <div class="label">
                    {{ $t('module.task.status') }}
                  </div>
                  <a-select
                    v-model="filters.status"
                    :placeholder="$t('module.task.status')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in TASK_STATUS"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="8"
                :lg="8"
                :xl="8"
                :xxl="8"
              >
                <a-form-model-item
                  class="ant-col-md-24 ant-col-sm-24 ant-col-xs-24"
                  prop="end_datetime"
                >
                  <div class="label">
                    {{ $t('module.task.end_datetime') }}
                  </div>
                  <a-date-picker
                    v-model="filters.end_datetime"
                    :placeholder="$t('module.task.end_datetime')"
                    format="YYYY-MM-DD"
                    style="width:100%"
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
        </a-collapse-panel>
      </a-collapse>
      <!-- end main-search -->

      <div class="container-fuild pt-3">
        <div>
          <h3>{{ $t('module.point_history.total_point') + ': ' + totalPoint }}</h3>
        </div>
      </div>

      <a-table
        bordered
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template
          slot="id"
          slot-scope="text, record"
        >
          <span>
            {{ record.id }}
          </span>
          <span v-if="record.task_type === TASK_TYPE_VALUE.project">
            <a-tooltip>
              <template slot="title">
                {{ $t('module.task.normal_task') }}
              </template>
              <a-icon type="calculator" />
            </a-tooltip>
          </span>
          <span v-if="record.task_type === TASK_TYPE_VALUE.meeting">
            <a-tooltip>
              <template slot="title">
                {{ $t('module.task.meeting_task') }}
              </template>
              <a-icon type="phone" />
            </a-tooltip>
          </span>
          <span v-if="record.task_type === TASK_TYPE_VALUE.manager">
            <a-tooltip>
              <template slot="title">
                {{ $t('module.task.manage_task') }}
              </template>
              <a-icon type="crown" />
            </a-tooltip>
          </span>
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
          <NuxtLink :to="`/task/detail/${record.id}`" target="_blank">
            {{ record.title }}
          </NuxtLink>
        </template>
        <template
          slot="task_type"
          slot-scope="text, record"
        >
          <div v-for="item in TASK_TYPE" :key="item.value">
            <span v-if="record.task_type === item.value">{{ item.label }}</span>
          </div>
        </template>
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div v-if="record.version_code && record.function_id">
            <NuxtLink :to="`/function/${record.function_id}/version/${record.version_code}#tab_info`" target="_blank">
              {{ '[' + record?.function?.code + '](Ver:' + record.version_code + '): ' + record?.function?.name }}
            </NuxtLink>
          </div>
        </template>
        <template
          slot="status"
          slot-scope="text, record"
        >
          <span :class="getStatusClass(record)">{{ TASK_STATUS_OPTION[record.status] }}</span>
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
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            v-if="isUpdateAllowed(record)"
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            v-if="isDeleteAllowed(record)"
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
  TASK_STATUS_OPTION
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
      params.project_id = this.project_id
      params.list_task = true
      if (params.owners && typeof params.owners === 'string') {
        params.owners = [params.owners]
      }

      if (params.task_types && typeof params.task_types === 'string') {
        params.task_types = [params.task_types]
      }
      params.not_limit = true
      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 40
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
      resource: 'task',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        owners: this.$route.query.owners ? this.$route.query.owners : [],
        task_types: this.$route.query.task_types ? this.$route.query.task_types : [],
        function_id: +this.$route.query.function_id || undefined,
        version_code: +this.$route.query.version_code || undefined,
        mst_life_cycle_id: +this.$route.query.mst_life_cycle_id || undefined,
        title: this.$route.query.title || '',
        start_datetime: this.$route.query.start_datetime || null,
        end_datetime: this.$route.query.end_datetime || null,
        approver: +this.$route.query.approver || undefined,
        status: +this.$route.query.status || undefined,
        approve_status: this.$route.query.approve_status ? +this.$route.query.approve_status : undefined,
        requirement_ids: this.$route.query.requirement_ids ? this.$route.query.requirement_ids : []
      },
      defaultParams: {
      },
      projects: [],
      functions: [],
      mstLifeCycles: [],
      users: [],
      versions: [],
      TASK_TYPE,
      TASK_TYPE_VALUE,
      TASK_STATUS,
      TASK_APPROVE_ET_STATUS,
      TASK_APPROVE_STATUS,
      TASK_STATUS_VALUE,
      TASK_APPROVE_STATUS_VALUE,
      TASK_STATUS_OPTION,
      moment,
      requirements: [],
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
          title: '#',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' },
          width: 100
        },
        {
          title: this.$t('module.task.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          width: 150,
          sorter: true
        },
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_task' },
          width: 300
        },
        {
          title: this.$t('module.task.approve_point'),
          dataIndex: 'approve_point',
          scopedSlots: { customRender: 'approve_point' },
          width: 90,
          sorter: true
        },
        {
          title: this.$t('module.task.start_datetime'),
          dataIndex: 'start_datetime',
          width: 160,
          sorter: true
        },
        {
          title: this.$t('module.task.end_datetime'),
          dataIndex: 'end_datetime',
          width: 160,
          sorter: true
        },
        {
          title: this.$t('module.task.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 140,
          sorter: true
        },
        {
          title: this.$t('module.task.approve_status'),
          dataIndex: 'approve_status',
          scopedSlots: { customRender: 'approve_status' },
          width: 150,
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    },

    totalPoint() {
      if (this.data.length > 0) {
        const total = this.data.reduce((total, item) => {
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
    this.getListRequirements()
    this.getFunctions()
    this.getMstLifeCycles()
    this.getUsers()
  },

  mounted() {
    this.showDetailProject()
  },

  updated() {
    this.getBackgroundColor()
  },

  /**
   * Methods.
   */
  methods: {
    isUpdateAllowed(record) {
      const loggedInUserId = this.$auth.user.id
      const isApprover = loggedInUserId === record.approver
      const isMember = record.taskOwners.some(owner => owner.member_id === loggedInUserId)

      const leaderOfMember = record.taskOwners.some(owner => {
        const members = owner.member.belong_group_members
        if (members) {
          return members.some(groupMember => {
            if (groupMember.leader_id === loggedInUserId) {
              const today = moment()
              const startDate = moment(groupMember.start_date)
              const endDate = groupMember.end_date ? moment(groupMember.end_date) : null
              if ((startDate.isValid() && startDate.isBefore(today)) && (!endDate || endDate.isAfter(today))) {
                return true
              }
            }
            return false
          })
        }
        return false
      })

      const isAllowedByApprover = (isApprover || leaderOfMember) && (
        (record.status === TASK_STATUS_VALUE.new && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.approving || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.in_progress && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.approving || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.re_progress && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.approving || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.resolved && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.approving || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.pending && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.approving || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved))
      )
      const isAllowedByMember = isMember && (
        (record.status === TASK_STATUS_VALUE.new && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.in_progress && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.re_progress && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (record.status === TASK_STATUS_VALUE.resolved && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve)) ||
        (record.status === TASK_STATUS_VALUE.pending && (record.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || record.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved))
      )

      if (isAllowedByApprover && isAllowedByMember) {
        return true
      }

      return isAllowedByApprover || isAllowedByMember
    },

    isDeleteAllowed(record) {
      const loggedInUserId = this.$auth.user.id
      const isApprover = loggedInUserId === record.approver
      const isMember = record.taskOwners.some(owner => owner.member_id === loggedInUserId)

      const leaderOfMember = record.taskOwners.some(owner => {
        const members = owner.member.belong_group_members
        if (members) {
          return members.some(groupMember => {
            if (groupMember.leader_id === loggedInUserId) {
              const today = moment()
              const startDate = moment(groupMember.start_date)
              const endDate = groupMember.end_date ? moment(groupMember.end_date) : null
              if ((startDate.isValid() && startDate.isBefore(today)) && (!endDate || endDate.isAfter(today))) {
                return true
              }
            }
            return false
          })
        }
        return false
      })
      let isAllowed = false
      if (record.requirementEstimate) {
        isAllowed = (isMember || isApprover || leaderOfMember) && (record.status === 0 && record.approve_status === 0 && record.requirementEstimate.approve_status === 0)
      } else {
        isAllowed = (isMember || isApprover || leaderOfMember) && (record.status === 0 && record.approve_status === 0)
      }
      return isAllowed
    },

    /**
     * Custom row event of table -> go to detail
     */
    customRow(record) {
      return {
        on: {
          click: () => {
            this.$router.push({ name: 'task-detail-id', params: { id: record.id } })
          }
        }
      }
    },

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

    async getListRequirements() {
      try {
        const params = {
          not_limit: true,
          project_id: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.requirement.list({ params })
        this.requirements = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List Function.
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.task.listFunction({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstLifeCycle.
     */
    async getMstLifeCycles() {
      try {
        const params = {
          not_limit: true,
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.task.listMstLifeCycles({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List ApproveUser.
     */
    async getUsers() {
      try {
        const params = {
          belong_to_project: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.task.listOwner({ params })
        this.users = data
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
        task_types: undefined,
        function_id: undefined,
        version_code: undefined,
        mst_life_cycle_id: undefined,
        owners: undefined,
        title: '',
        start_datetime: null,
        end_datetime: null,
        approver: undefined,
        status: undefined,
        approve_status: undefined,
        requirement_ids: undefined
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
      if (this.filters.start_datetime) {
        this.filters.start_datetime = moment(this.filters.start_datetime).format('YYYY-MM-DD')
      }
      if (this.filters.end_datetime) {
        this.filters.end_datetime = moment(this.filters.end_datetime).format('YYYY-MM-DD')
      }
      if (this.filters.approve_datetime) {
        this.filters.approve_datetime = moment(this.filters.approve_datetime).format('YYYY-MM-DD')
      }
      if (this.filters.report_datetime) {
        this.filters.report_datetime = moment(this.filters.report_datetime).format('YYYY-MM-DD')
      }
      if (this.filters.approve_et_datetime) {
        this.filters.approve_et_datetime = moment(this.filters.approve_et_datetime).format('YYYY-MM-DD')
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/task'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
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
    },

    /**
     * Get class css by status
     */
    getStatusClass(record) {
      const isInProgress = record.status === TASK_STATUS_VALUE.in_progress
      const isAfterCurrentTime = moment(record.end_datetime).startOf('day').isBefore(moment().startOf('day'))
      if (isInProgress) {
        if (isAfterCurrentTime) {
          return 'red'
        } else {
          return 'in_progress'
        }
      } else if (record.status === TASK_STATUS_VALUE.done) {
        return 'done'
      }

      return '' // Trường hợp mặc định
    },

    /**
     * Set background of child elements to parent elements
     */
    getBackgroundColor() {
      const done = document.getElementsByClassName('done')
      const inProgress = document.getElementsByClassName('in_progress')
      const red = document.getElementsByClassName('red')
      for (let i = 0; i < done.length; i++) {
        done[i].parentElement.style.backgroundColor = '#1890ff'
      }
      for (let i = 0; i < red.length; i++) {
        red[i].parentElement.style.backgroundColor = 'red'
      }
      for (let i = 0; i < inProgress.length; i++) {
        inProgress[i].parentElement.style.backgroundColor = 'gold'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card-container {
  .ant-card-body{
    .ant-form-inline {
      .ant-form-item {
        padding:5px;
        .ant-form-item-label {
          label {
            &::before {
              content: "" !important;
            }
          }
        }
      }
    }
  }
}
/deep/ {
  .ant-form-item:not(.default) {
    margin-bottom: 0px;
  }
  .ant-collapse-header {
    font-size: 18px;
  }
  .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters:hover {
    background: none;
  }
  .ant-table-thead > tr > th .ant-table-header-column .ant-table-column-sorters:hover::before {
    background: none;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    cursor: pointer;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) {
    box-shadow: 0 4px 24px #1f1f1f29;
    transition: box-shadow .2s,-webkit-box-shadow .2s;
  }
  .ant-table-tbody > tr > td.ant-table-column-sort {
    background: none;
  }
  div[title='Sort'] {
    pointer-events: none;
  }
  .ant-select-selection.ant-select-selection--single, .ant-select-selection--multiple, .ant-input {
    min-height: 38px;
    background: #FAFAFA;
    border: 1px solid #C0C0C0;
    border-radius: 4px;
    ::placeholder {
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #C0C0C0;
    }
  }
  .ant-select-selection--multiple .ant-select-selection__placeholder {
    padding-top: 3px;
  }
  .ant-select-selection--single .ant-select-selection__rendered {
    margin-right: 24px;
    min-height: 38px;
  }
  .ant-select-selection-selected-value {
    height: 38px;
    line-height: 38px;
  }
  .ant-input {
    margin-top: 4.15px;
    height: 38px;
  }
  .btn_wrapper .ant-btn {
    height: 35px;
    border-radius: 3px;
    margin-top: 10px;
  }
  .ant-select-arrow {
    top: 20px;
  }
  .anticon-crown > svg ,
  .anticon-calculator > svg ,
  .anticon-phone > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
.label {
  font-weight: 500;
  font-size: 15px;
  line-height: 23px;
  color:  rgba(0, 0, 0, 0.85);
}
.done {
  background-color: #1890ff;
}
.in_progress {
  background-color: gold;
}
.red {
  background-color: red;
}
</style>
