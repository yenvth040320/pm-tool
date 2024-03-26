<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :label-col="{ sm: 8 }"
      :wrapper-col="{ sm: 16 }"
      @submit.prevent="handleSubmit"
    >
      <a-spin :spinning="loading">
        <div class="btn-action">
          <a-button
            v-show="!expandAllRow"
            class="mb-3"
            html-type="button"
            type="primary"
            @click="toggleExpandAllRows"
          >
            {{ $t('module.requirement.schedule.open_all') }}
          </a-button>
          <a-button
            v-show="expandAllRow"
            class="mb-3"
            html-type="button"
            type="primary"
            @click="toggleExpandAllRows"
          >
            {{ $t('module.requirement.schedule.close_all') }}
          </a-button>
          <a-button
            v-show="model.data.length > 0 && !isSettingWbs && isUserScheduling && !isSettingMember"
            html-type="submit"
            type="primary"
            class="min-w-100"
          >
            {{ $t('common.update') }}
          </a-button>
          <a-button
            class="mb-3"
            html-type="button"
            type="primary"
            :disabled="isInSchedulingProcess"
            @click="startScheduling"
          >
            {{ $t('module.requirement.schedule.start') }}
          </a-button>
          <a-button
            v-show="isUserScheduling"
            html-type="button"
            type="default"
            title="Huỷ bỏ"
            class="min-w-100"
            @click="cancelScheduling"
          >
            {{ $t('common.cancel') }}
          </a-button>

          <div
            v-show="isUserScheduling"
            class="action-container"
          >
            <a-button
              v-show="!isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="startSetWbs"
            >
              {{ $t('module.requirement.button_start_set_wbs') }}
            </a-button>
            <a-button
              v-show="isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="saveSetWbs"
            >
              {{ $t('module.requirement.button_done_set_wbs') }}
            </a-button>
            &nbsp;
            <a-button
              v-show="isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="cancelSetWbs"
            >
              {{ $t('module.requirement.button_cancel_set_wbs') }}
            </a-button>
          </div>

          <div
            v-show="isUserScheduling"
            class="action-container"
          >
            <a-button
              v-show="!isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="startSetMember"
            >
              {{ $t('module.requirement.button_start_set_member') }}
            </a-button>
            <a-button
              v-show="isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="saveSetMember"
            >
              {{ $t('module.requirement.button_done_set_member') }}
            </a-button>
            &nbsp;
            <a-button
              v-show="isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="cancelSetMember"
            >
              {{ $t('module.requirement.button_cancel_set_member') }}
            </a-button>
            &nbsp;
            <div class="select-member">
              <a-select
                v-show="isSettingMember"
                v-model="member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <h3
            v-if="isInSchedulingProcess"
          >
            {{ userSchedulingName + ' đang chỉnh sửa' }}
          </h3>
        </div>
        <a-table
          :key="model.data.length"
          bordered
          :columns="columns"
          :row-key="record => record.key"
          :row-selection="isSettingWbs || isSettingMember ? rowSelection : null"
          :data-source="model.data"
          :pagination="false"
          class="main-table"
          :custom-row="customRow"
          :row-class-name="rowClassName"
          :default-expand-all-rows="expandAllRow"
          :expanded-row-keys.sync="expandedRowKeys"
          @change="handleTableChange"
        >
          <template
            slot="title_task"
            slot-scope="text, record"
          >
            <span>
              <span
                v-show="shouldShowSelected(record)"
                class="selected-index"
              >
                <a-badge :count="getSelectedTaskCount(record)" />
              </span>
              <span :class="[ !record.is_task ? (record.is_cycle ? 'cycle' : 'title') : '' ]">
                <a v-if="record.is_task" target="_blank" :href="`/task/detail/${record.id}`" class="link">
                  {{ record.title }}
                </a>
                <span v-else>
                  {{ record.title }}
                </span>
              </span>
            </span>
          </template>
          <template
            v-if="record.is_task"
            slot="et_point"
            slot-scope="text, record"
          >
            <a-form-model-item
              :wrapper-col="{ xs: 24 }"
            >
              <span>
                {{ record.et_point }}
              </span>
            </a-form-model-item>
          </template>
          <template
            v-if="record.is_task"
            slot="wbs"
            slot-scope="text, record"
          >
            <a-form-model-item
              :wrapper-col="{ xs: 24 }"
            >
              <span :class="wbsClass(record)" @click="selectedWbs(record)">
                {{ record.wbs }}
              </span>
              <span>
                <a-icon
                  v-show="record.wbs !== null && isSettingWbs"
                  type="close-circle"
                  @click="removeWbs(record)"
                />
              </span>
            </a-form-model-item>
          </template>

          <template
            v-if="record.is_task"
            slot="id"
            slot-scope="text, record"
          >
            <a-form-model-item
              :wrapper-col="{ xs: 24 }"
            >
              <span :id="record.key" :class="idClass(record)">
                {{ record.key }}
              </span>
            </a-form-model-item>
          </template>

          <template
            v-if="record.is_task"
            slot="member_id"
            slot-scope="text, record"
          >
            <div>
              <span class="limited-lines">
                {{ getMemberName(record.member_id) }}
              </span>
            </div>
          </template>

          <template
            v-if="record.is_task"
            slot="duration"
            slot-scope="text, record"
          >
            <div>
              {{ Number(record.duration) }}
            </div>
          </template>

          <template
            v-if="record.is_task"
            slot="start_datetime"
            slot-scope="text, record"
          >
            <div>
              {{ getFormattedDatetime(record.start_datetime, false) }}
            </div>
          </template>

          <template
            v-if="record.is_task"
            slot="end_datetime"
            slot-scope="text, record"
          >
            <div>
              {{ getFormattedDatetime(record.end_datetime, false) }}
            </div>
          </template>
        </a-table>

        <div class="text-center p-3">
          <a-button
            v-if="!expandAllRow"
            class="mb-3"
            html-type="button"
            type="primary"
            @click="toggleExpandAllRows"
          >
            {{ $t('module.requirement.schedule.open_all') }}
          </a-button>
          <a-button
            v-if="expandAllRow"
            class="mb-3"
            html-type="button"
            type="primary"
            @click="toggleExpandAllRows"
          >
            {{ $t('module.requirement.schedule.close_all') }}
          </a-button>
          <a-button
            v-if="model.data.length > 0 && !isSettingWbs && isUserScheduling"
            html-type="submit"
            type="primary"
            class="min-w-100"
          >
            {{ $t('common.update') }}
          </a-button>
          <a-button
            class="mb-3"
            html-type="button"
            type="primary"
            :disabled="isInSchedulingProcess"
            @click="startScheduling"
          >
            {{ $t('module.requirement.schedule.start') }}
          </a-button>
          <a-button
            v-if="isUserScheduling"
            html-type="button"
            type="default"
            title="Huỷ bỏ"
            class="min-w-100"
            @click="cancelScheduling"
          >
            {{ $t('common.cancel') }}
          </a-button>
          <div
            v-if="isUserScheduling"
            class="action-footer"
          >
            <a-button
              v-if="!isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="startSetWbs"
            >
              {{ $t('module.requirement.button_start_set_wbs') }}
            </a-button>
            &nbsp;
            <a-button
              v-if="isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="saveSetWbs"
            >
              {{ $t('module.requirement.button_done_set_wbs') }}
            </a-button>
            &nbsp;
            <a-button
              v-if="isSettingWbs"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="cancelSetWbs"
            >
              {{ $t('module.requirement.button_cancel_set_wbs') }}
            </a-button>
            &nbsp;
            <a-button
              v-if="!isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="startSetMember"
            >
              {{ $t('module.requirement.button_start_set_member') }}
            </a-button>
            &nbsp;
            <a-button
              v-if="isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="saveSetMember"
            >
              {{ $t('module.requirement.button_done_set_member') }}
            </a-button>
            &nbsp;
            <a-button
              v-if="isSettingMember"
              class="mb-3"
              html-type="button"
              type="primary"
              @click="cancelSetMember"
            >
              {{ $t('module.requirement.button_cancel_set_member') }}
            </a-button>
            &nbsp;
            <div class="select-member">
              <a-select
                v-if="isSettingMember"
                v-model="member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </a-spin>
      <ModalUpdateTask ref="modalUpdateTask" :members="members" :data="model" :kpis="kpis" @save="save" />
      <!-- end main-table -->
    </a-form-model>
    <div class="schedule-note">
      {{ $t('module.requirement.schedule.note') }}
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import WorkingHours from '~/mixins/working-hours'
import ModalUpdateTask from '~/components/templates/requirement/ModalUpdateTask.vue'
import { db, deleteDoc, doc, addDoc, collection, query, where, onSnapshot, getDocs, updateDoc } from '~/plugins/firebase'
import {
  SORT,
  ERROR_CODE,
  DEFAULT_KPI,
  TASK_STATUS_OPTION,
  TASK_STATUS_VALUE,
  TASK_TYPE_VALUE
} from '~/constants'
export default {
  components: {
    ModalUpdateTask
  },

  /**
   * Declare mixins.
   */
  mixins: [DataTable, WorkingHours],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = {}
      params.project_id = this.$store.state.project.id
      params.requirement_id = this.id
      const { data: { result: { data } } } = await this.repository.getDataTabSchedule({ params })
      const formatData = []
      data.forEach(task => {
        if (task.taskOwners && task.taskOwners.length > 0) {
          if (task.task_type === TASK_TYPE_VALUE.project) {
            task.member_id = task.taskOwners[0].member_id
          } else {
            task.member_id = task.taskOwners.map(owner => owner.member_id)
          }
        }
        task.et_point = Number(task.et_point).toFixed(2)
        const existFunction = formatData.find(curr => curr.id === (task.function ? task.function.id : 0))
        if (!existFunction) {
          formatData.push({
            key: `R.${this.id}.F.${task.function ? task.function.id : 0}`,
            function_code: task.function ? task.function.code : 0,
            id: task.function ? task.function.id : 0,
            title: `${task.function ? task.function.code + ':' : ''} ${task.function ? task.function.name : this.$t('module.requirement.estimate.joint_work')}`,
            children: [{
              key: `R.${this.id}.F.${task.function ? task.function.id : 0}.C.${task.mstLifeCycle ? task.mstLifeCycle.id : 0}`,
              id: task.mstLifeCycle ? task.mstLifeCycle.id : 0,
              title: task.mstLifeCycle ? task.mstLifeCycle.name : 'Họp dự án',
              wbs: task.mstLifeCycle ? task.mstLifeCycle.wbs : 0,
              is_cycle: true,
              children: [{
                key: `R.${this.id}.F.${task.function ? task.function.id : 0}.C.${task.mstLifeCycle ? task.mstLifeCycle.id : 0}.T.${task.id}`,
                id: task.id,
                task_type: task.task_type,
                project_id: task.project_id,
                approve_status: task.approve_status,
                PENALTY_flg: task.PENALTY_flg,
                status: task.status,
                title: `[${TASK_STATUS_OPTION[task.status]}] ${task.title}`,
                member_id: task.member_id,
                start_datetime: task.start_datetime,
                end_datetime: task.end_datetime,
                duration: task.duration,
                et_point: task.et_point,
                wbs: task.wbs,
                is_task: true
              }]
            }]
          })
        } else if (existFunction) {
          if (task.mst_life_cycle_id === null) {
            const existCycle = existFunction.children.find(c => c.id === 0)
            if (task.task_type === TASK_TYPE_VALUE.meeting) {
              if (!existCycle) {
                existFunction.children.push({
                  key: `R.${this.id}.F.${0}.C.${0}`,
                  id: 0,
                  title: 'Họp dự án',
                  wbs: 0,
                  is_cycle: true,
                  children: [{
                    key: `R.${this.id}.F.${0}.C.${0}.T.${task.id}`,
                    id: task.id,
                    task_type: task.task_type,
                    approve_status: task.approve_status,
                    PENALTY_flg: task.PENALTY_flg,
                    project_id: task.project_id,
                    status: task.status,
                    title: `[${TASK_STATUS_OPTION[task.status]}] ${task.title}`,
                    member_id: task.member_id,
                    start_datetime: task.start_datetime,
                    end_datetime: task.end_datetime,
                    duration: task.duration,
                    et_point: task.et_point,
                    wbs: task.wbs,
                    is_task: true
                  }]
                })
              } else {
                existCycle.children.push({
                  key: `R.${this.id}.F.${0}.C.${0}.T.${task.id}`,
                  id: task.id,
                  task_type: task.task_type,
                  approve_status: task.approve_status,
                  PENALTY_flg: task.PENALTY_flg,
                  project_id: task.project_id,
                  status: task.status,
                  title: `[${TASK_STATUS_OPTION[task.status]}] ${task.title}`,
                  member_id: task.member_id,
                  start_datetime: task.start_datetime,
                  end_datetime: task.end_datetime,
                  duration: task.duration,
                  et_point: task.et_point,
                  wbs: task.wbs,
                  is_task: true
                })
              }
            }
          } else {
            const existCycle = existFunction.children.find(c => c.id === task.mstLifeCycle.id)
            if (!existCycle) {
              existFunction.children.push({
                key: `R.${this.id}.F.${task.function ? task.function.id : 0}.C.${task.mstLifeCycle.id}`,
                id: task.mstLifeCycle.id,
                title: task.mstLifeCycle.name,
                wbs: task.mstLifeCycle.wbs,
                is_cycle: true,
                children: [{
                  key: `R.${this.id}.F.${task.function ? task.function.id : 0}.C.${task.mstLifeCycle.id}.T.${task.id}`,
                  id: task.id,
                  task_type: task.task_type,
                  approve_status: task.approve_status,
                  PENALTY_flg: task.PENALTY_flg,
                  project_id: task.project_id,
                  status: task.status,
                  title: `[${TASK_STATUS_OPTION[task.status]}] ${task.title}`,
                  member_id: task.member_id,
                  start_datetime: task.start_datetime,
                  end_datetime: task.end_datetime,
                  duration: task.duration,
                  et_point: task.et_point,
                  wbs: task.wbs,
                  is_task: true
                }]
              })
            } else {
              existCycle.children.push({
                key: `R.${this.id}.F.${task.function ? task.function.id : 0}.C.${task.mstLifeCycle.id}.T.${task.id}`,
                id: task.id,
                task_type: task.task_type,
                approve_status: task.approve_status,
                PENALTY_flg: task.PENALTY_flg,
                project_id: task.project_id,
                status: task.status,
                title: `[${TASK_STATUS_OPTION[task.status]}] ${task.title}`,
                member_id: task.member_id,
                start_datetime: task.start_datetime,
                end_datetime: task.end_datetime,
                duration: task.duration,
                et_point: task.et_point,
                wbs: task.wbs,
                is_task: true
              })
            }
          }
        }
      })
      // sort
      formatData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.sort((a, b) => a.wbs - b.wbs)
        }
      })
      formatData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            if (child.children && child.children.length > 0) {
              child.children.sort((a, b) => a.id - b.id)
            }
          })
        }
      })
      formatData.forEach(itemFunction => {
        if (itemFunction.children && itemFunction.children.length > 0) {
          if (this.checkSetDefault(itemFunction.children)) {
            itemFunction.children.forEach((itemCycle, index) => {
              if (itemCycle.children && itemCycle.children.length > 0) {
                itemCycle.children.forEach((itemTask, indexGrand) => {
                  if (itemTask.task_type !== TASK_TYPE_VALUE.meeting) {
                    if (index === 0 && indexGrand === 0) {
                      itemTask.wbs = 0
                    } else if (indexGrand === 0 && index > 0) {
                      itemTask.wbs = itemFunction.children[index - 1].children[itemFunction.children[index - 1].children.length - 1].key
                    } else {
                      itemTask.wbs = itemCycle.children[indexGrand - 1].key
                    }
                  }
                })
              }
            })
          }
        }
      })
      formatData.sort((a, b) => {
        if (a.function_code === 0 && b.function_code !== 0) {
          return 1
        } else if (a.function_code !== 0 && b.function_code === 0) {
          return -1
        } else {
          return a.function_code.localeCompare(b.function_code)
        }
      })
      this.model.data = formatData
    } catch (_) {
      console.log(_)
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    moment,
    resource: 'requirement',
    disabledDateTimes: disableHours => { },
    stepHours: 1,
    stepMinutes: 15,
    members: [],
    isInSchedulingProcess: false,
    isUserScheduling: false,
    userSchedulingName: '',
    model: {
      data: []
    },
    isSettingWbs: false,
    isSettingMember: false,
    expandAllRow: true,
    kpis: [],
    selectedTask: [],
    foundId: [],
    beforeSetWbsTask: [],
    cloneData: [],
    expandedRowKeys: [],
    ERROR_CODE,
    SORT,
    DEFAULT_KPI,
    TASK_STATUS_OPTION,
    TASK_STATUS_VALUE,
    TASK_TYPE_VALUE,
    member_id: undefined,
    oldMemberIds: {},
    keySelectWbs: ''
  }),

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_task' },
          width: 350
        },
        {
          title: 'ID',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' },
          width: 170
        },
        {
          title: this.$t('module.task.wbs'),
          dataIndex: 'wbs',
          scopedSlots: { customRender: 'wbs' },
          width: 170
        },
        {
          title: this.$t('module.task.et_point'),
          dataIndex: 'et_point',
          scopedSlots: { customRender: 'et_point' },
          width: 60
        },
        {
          title: this.$t('module.task.member_id'),
          dataIndex: 'member_id',
          scopedSlots: { customRender: 'member_id' },
          width: 140
        },
        {
          title: this.$t('module.task.duration'),
          dataIndex: 'duration',
          scopedSlots: { customRender: 'duration' },
          width: 60
        },
        {
          title: this.$t('module.task.start_datetime'),
          scopedSlots: { customRender: 'start_datetime' },
          width: 110
        },
        {
          title: this.$t('module.task.end_datetime'),
          scopedSlots: { customRender: 'end_datetime' },
          width: 110
        }
      ]
    },

    rowSelection() {
      return {
        getCheckboxProps: record => ({
          props: {
            disabled: !record.key.includes('T') || record.task_type !== TASK_TYPE_VALUE.project || (this.isSettingMember && record.status > TASK_STATUS_VALUE.new),
            style: {
              display: this.isSettingWbs || this.isSettingMember ? 'block' : 'none'
            }
          }
        }),
        selectedRowKeys: this.selectedTask.map(record => record.key),
        onChange: (selectedRowKeys, selectedRows) => {
        },
        onSelect: (record, selected, selectedRows) => {
          this.setDependency(record, selected)
        }
      }
    }
  },

  async created() {
    await this.getMemberOfProject()
    await this.getKpis()
    this.$bus.$on('callListSchedule', editedData => {
      this.$fetch()
    })
  },

  mounted() {
    document.addEventListener('keydown', this.handleKeyPress)
    this.checkSchedulingProcess()
    this.disableHours = [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24]
    this.disabledDateTimes = () => {
      return {
        disabledHours: () => this.disableHours,
        hourStep: this.stepHours,
        minuteStep: this.stepMinutes
      }
    }
  },

  /**
   * List of methods.
   */
  methods: {
    getSelectedTaskCount(record) {
      return this.selectedTask.findIndex(task => task.id === record.id) + 1
    },

    shouldShowSelected(record) {
      return record.is_task && this.selectedTask.findIndex(task => task.id === record.id) > -1
    },

    wbsClass(record) {
      return {
        wbs_selected: this.keySelectWbs === record.wbs,
        wbs: this.keySelectWbs !== record.wbs
      }
    },

    idClass(record) {
      return {
        wbs_selected: this.keySelectWbs === record.wbs,
        '': this.keySelectWbs !== record.wbs
      }
    },

    shouldShowUpdateSection(record) {
      return (
        record.status === TASK_STATUS_VALUE.new &&
        record.task_type === TASK_TYPE_VALUE.project &&
        this.isUserScheduling
      )
    },

    getMemberName(memberId) {
      if (Array.isArray(memberId)) {
        const memberNames = memberId.map(id => {
          const member = this.members.find(x => x.id === id)
          return member ? member.name : ''
        })
        return memberNames.join(', ')
      } else {
        const member = this.members.find(x => x.id === memberId)
        return member ? member.name : ''
      }
    },

    getMemberNameUpdate(memberId) {
      const member = this.members.find(x => x.id === memberId)
      return member ? member.name : 'Chọn'
    },

    getDuration(duration) {
      return duration ? Number(duration) : 'Chọn'
    },

    getFormattedDatetime(datetime, update) {
      if (update) {
        return datetime ? moment(datetime).format('YYYY/MM/DD HH:mm') : 'Chọn'
      } else {
        return datetime ? moment(datetime).format('YYYY/MM/DD HH:mm') : ''
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

    /**
     * Get kpi of all member in project
     */
    async getKpis() {
      try {
        if (this.members.length > 0) {
          const params = {
            member_id: this.members.map(member => member.id)
          }
          const { data: { result: { data } } } = await this.$api.task.getKpis({ params })
          this.kpis = data
        } else {
          this.kpis = []
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
    },

    /**
     * Prevent the user from entering alphabetic characters in the input field.
     * @param {Event} event
     */
    preventAlphabetCharacterInput(event) {
      const code = event.which ? event.which : event.keyCode
      if (
        (code >= 48 && code <= 57) || // 0 -> 9
          code === 8 || //  Backspace
          code === 46 || //  (.)
          (code >= 37 && code <= 40) // arrow keys
      ) {
        return
      }
      event.preventDefault()
    },

    /**
     * Handle user press key
     */
    handleKeyPress() {
      // press f2
      if (this.isUserScheduling) {
        if (event.keyCode === 113 || event.key === 'F2') {
          if (!this.isSettingWbs) {
            this.startSetWbs()
          } else {
            this.saveSetWbs()
          }
        }
        // press esc
        if (event.keyCode === 27 || event.key === 'Escape') {
          if (this.isSettingWbs) {
            this.cancelSetWbs()
          }
        }
      }
    },

    /**
     * Check if task in a function has wbs => not set default
     */
    checkSetDefault(itemFunction) {
      for (const itemCycle of itemFunction) {
        if (itemCycle.children && itemCycle.children.length > 0) {
          for (const task of itemCycle.children) {
            if (task.wbs !== null) {
              return false
            }
          }
        }
      }
      return true
    },

    /**
     * On change task assignee member
     */
    async changeMember(record) {
      // find kpi of member
      const memberKpi = this.findMemberKpi(record)
      if (memberKpi) {
        // set task duration by task's et_point
        await this.setTaskDurationByKpi(record, memberKpi)
      } else {
        await this.setTaskDurationByKpi(record, DEFAULT_KPI)
      }
      await this.changeDuration(record)
    },

    /**
     * On change task start date time
     */
    async changeStartDateTime(record) {
      await this.setEndDateTime(record)
      this.foundId = []
      await this.setRecursiveRowDate(record)
    },

    /**
     * Remove task wbs
     */
    removeWbs(record) {
      this.findRow(record).wbs = null
    },

    /**
     * Selected task wbs
     */
    selectedWbs(record) {
      this.keySelectWbs = record.wbs
      const element = document.getElementById(record.wbs)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },

    /**
     * On change end date time
     */
    changeEndDateTime(record) {
      if (this.findRow(record).start_datetime) {
        this.$set(this.findRow(record), 'duration', this.calculateDuration(moment(this.findRow(record).start_datetime).seconds(0), moment(this.findRow(record).end_datetime).seconds(0)))
      }
      this.foundId = []
      this.setRecursiveRowDate(record)
    },

    /**
     * Toggle Expand All Rows
     */
    toggleExpandAllRows() {
      if (this.expandAllRow) {
        this.expandedRowKeys = []
      } else {
        this.expandedRowKeys = []
        this.getExpandedKeys(this.model.data)
      }
      this.expandAllRow = !this.expandAllRow
    },

    /**
     * Get key of expanded row
     */
    getExpandedKeys(data) {
      for (const item of data) {
        if (item.children && item.children.length > 0) {
          this.expandedRowKeys.push(item.key)
          this.getExpandedKeys(item.children)
        }
      }
    },

    async startScheduling() {
      try {
        this.isInSchedulingProcess = true
        await addDoc(collection(db, 'Scheduling'), {
          user_id: this.$auth.user.id,
          user_name: this.$auth.user.name,
          requirement_id: this.id,
          status: 0
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    checkSchedulingProcess() {
      const q = query(
        collection(db, 'Scheduling'),
        where('requirement_id', '==', this.id)
      )
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              if (data) {
                this.userSchedulingName = data.user_name
                if (data.user_id === this.$auth.user.id) {
                  this.isUserScheduling = true
                } else {
                  this.isUserScheduling = false
                }
                if (data.status === 0) {
                  this.isInSchedulingProcess = true
                } else {
                  this.isInSchedulingProcess = false
                  this.isUserScheduling = false
                }
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    /**
     * Delete document firebase
     */
    async deleteRecordFromFirebase(id, collection) {
      try {
        this.isUserScheduling = false
        this.userSchedulingName = null
        const docRef = doc(db, collection, id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    async cancelScheduling() {
      const q = query(
        collection(db, 'Scheduling'),
        where('requirement_id', '==', this.id)
      )
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(data => {
        const docRef = doc(db, 'Scheduling', data.id)
        updateDoc(docRef, { status: 1 })
      })

      querySnapshot.forEach(async el => {
        await deleteDoc(el.ref)
      })
      this.isSettingWbs = false
      this.isSettingMember = false
      this.foundId = []
      this.selectedTask = []
    },

    /**
     * Trigger when user clicks on start wbs btn
     */
    startSetWbs() {
      this.isSettingWbs = true
      this.cloneData = cloneDeep(this.model.data)
    },

    /**
     * Trigger when user clicks on start wbs btn
     */
    startSetMember() {
      this.isSettingMember = true
      this.cloneData = cloneDeep(this.model.data)
    },

    /**
     * Save wbs that user have just set
     */
    saveSetWbs() {
      this.isSettingWbs = false
      this.setWbs()
      this.foundId = []
      this.selectedTask = []
    },

    /**
     * Save wbs that user have just set
     */
    saveSetMember() {
      this.isSettingMember = false
      this.setMember()
      this.foundId = []
      this.selectedTask = []
    },

    /**
     * Press cancel btn => reset to before
     */
    cancelSetWbs() {
      this.isSettingWbs = false
      this.foundId = []
      this.selectedTask = []
      this.beforeSetWbsTask = []
      this.model.data = this.cloneData
    },

    /**
     * Press cancel btn => reset to before
     */
    cancelSetMember() {
      this.isSettingMember = false
      this.foundId = []
      this.selectedTask = []
      this.beforeSetWbsTask = []
      this.model.data = this.cloneData
      this.member_id = undefined
    },

    /**
     * Set task wbs
     */
    setWbs() {
      this.beforeSetWbsTask = cloneDeep(this.selectedTask)
      if (this.selectedTask.length === 0) {
        return
      }
      this.selectedTask.forEach((task, indexTask) => {
        if (indexTask === 0) {
        } else {
          this.selectedTask[indexTask].wbs = this.selectedTask[indexTask - 1].key
        }
      })
      if (this.member_id) {
        this.setMember()
        this.isSettingMember = false
      }
      this.foundId = []
      this.setRecursiveRowDate(this.selectedTask[0])
    },

    setMember() {
      if (this.selectedTask.length === 0) {
        return
      }
      if (this.member_id) {
        this.selectedTask.forEach(task => {
          if (task.status === TASK_STATUS_VALUE.new) {
            this.oldMemberIds[task.id] = task.member_id
            task.member_id = this.member_id
            this.changeMember(task)
          }
        })
      }
      // this.foundId = []
    },

    /**
     * On click select row, set tasks' dependencies
     */
    setDependency(record, selected) {
      if (selected) {
        if (this.selectedTask.length > 0) {
          this.checkTaskDependency(record)
        } else {
          this.selectedTask.push(record)
          this.foundId = []
          this.foundId.push(record.id)
        }
      } else {
        const indexOfRemoveItem = this.selectedTask.findIndex(i => i.id === record.id)
        if (indexOfRemoveItem > -1) {
          this.selectedTask.splice(indexOfRemoveItem, 1)
        }
        const indexOfRemoveItemFound = this.foundId.findIndex(v => v === record.id)
        if (indexOfRemoveItemFound > -1) {
          this.foundId.splice(indexOfRemoveItemFound, 1)
        }
      }
    },

    /**
     * Check tasks' dependencies
     */
    checkTaskDependency(record) {
      const cloneRecord = cloneDeep(record)
      this.findRow(record).wbs = this.selectedTask[this.selectedTask.length - 1].key
      const cloneData = cloneDeep(this.model.data)
      this.findRow(record).wbs = cloneRecord.wbs
      this.selectedTask.push(record)
      this.findRecursiveTask(cloneRecord, cloneData)
    },

    findDuplicateWbs(record, cloneData, root) {
      for (const itemData of cloneData) {
        if (itemData.children && itemData.children.length > 0) {
          for (const itemLifeCycle of itemData.children) {
            if (itemLifeCycle.children && itemLifeCycle.children.length > 0) {
              const alreadyHasDependItem = itemLifeCycle.children.find(el => el.wbs === root.key)
              if (alreadyHasDependItem) {
                if (alreadyHasDependItem.id !== record.id) {
                  this.$notification.error({
                    message: this.$t(`${root.title} đã có quan hệ với ${alreadyHasDependItem.title}`)
                  })
                  return false
                }
              }
            }
          }
        }
      }
      return true
    },

    copyTextToClipboard(text) {
      // Tạo một phần tử textarea tạm thời
      const tempTextarea = document.createElement('textarea')
      // Đặt giá trị của nó thành chuỗi bạn muốn sao chép
      tempTextarea.value = text
      // Thêm phần tử vào DOM
      document.body.appendChild(tempTextarea)
      // Chọn nội dung của phần tử textarea
      tempTextarea.select()
      // Sao chép nội dung đã chọn vào clipboard
      document.execCommand('copy')
      // Xóa phần tử textarea khỏi DOM
      document.body.removeChild(tempTextarea)
    },

    /**
     * Find recursive task
     */
    findRecursiveTask(cloneRecord, cloneData, p) {
      if (this.foundId.includes(cloneRecord.id)) {
        if (p) {
          this.copyTextToClipboard('Hãy xem xét 2 giá trị này: 1 = [' + p.wbs + ']. 2 = [' + p.key + ']')
          this.$notification.error({
            message: this.$t('Lỗi vòng lặp. Hãy chọn lại quan hệ. ID = ' + p.key + '. Giá trị ID đã được copy vào clipboard!')
          })
          this.selectedTask.splice(-1)
          return
        }
      }
      for (const itemData of cloneData) {
        if (itemData.children && itemData.children.length > 0) {
          for (const itemLifeCycle of itemData.children) {
            if (itemLifeCycle.children && itemLifeCycle.children.length > 0) {
              const targetItem = itemLifeCycle.children.find(el => el.wbs === cloneRecord.key)
              if (targetItem) {
                this.foundId.push(cloneRecord.id)
                this.findRecursiveTask(targetItem, cloneData, cloneRecord)
              }
            }
          }
        }
      }
      return true
    },

    /**
     * Set recursive row date
     */
    setRecursiveRowDate(record) {
      if (!this.foundId.includes(record.id)) {
        for (const itemData of this.model.data) {
          if (itemData.children && itemData.children.length > 0) {
            for (const itemLifeCycle of itemData.children) {
              if (itemLifeCycle.children && itemLifeCycle.children.length > 0) {
                const targetItems = itemLifeCycle.children.filter(el => el.wbs === record.key)
                if (targetItems.length > 0) {
                  targetItems.forEach(target => {
                    this.foundId.push(record.id)
                    let startTime = record.end_datetime
                    const lunchStartPrevious = moment(record.end_datetime).set({ hour: 12, minute: 0, second: 0 })
                    const endWorkPrevious = moment(record.end_datetime).set({ hour: 17, minute: 30, second: 0 })
                    if (lunchStartPrevious.isSame(record.end_datetime)) {
                      startTime = lunchStartPrevious.add(1, 'hours')
                    } else if (endWorkPrevious.isSame(record.end_datetime)) {
                      startTime = endWorkPrevious.add({ hours: 15, minutes: 0, seconds: 0 })
                      if (startTime.days() === 6) {
                        startTime.add(2, 'days')
                      }
                    }
                    if (target.status === TASK_STATUS_VALUE.new) {
                      this.$set(this.findRow(target), 'start_datetime', startTime)
                      if (target.duration && startTime) {
                        this.$set(this.findRow(target), 'end_datetime', this.calculateEndTime(startTime, target.duration))
                      }
                    }
                    this.setRecursiveRowDate(target)
                  })
                }
              }
            }
          }
        }
      }
    },

    /**
     * Find children row from record
     */
    findRow(record) {
      return this.model.data[this.model.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children[this.model.data[this.model.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children.findIndex(y => y.id === this.decodeKey(record.key).mst_life_cycle_id)].children[this.model.data[this.model.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children[this.model.data[this.model.data.findIndex(x => x.id === this.decodeKey(record.key).function_id)].children.findIndex(y => y.id === this.decodeKey(record.key).mst_life_cycle_id)].children.findIndex(z => z.id === this.decodeKey(record.key).task_id)]
    },

    changeDuration(record) {
      if (this.findRow(record).start_datetime) {
        this.setEndDateTime(record)
        this.foundId = []
        this.setRecursiveRowDate(record)
      }
    },

    /**
     * Decode record key to find record's function_id, mst_life_cycle_id, task_id
     */
    decodeKey(key) {
      const parts = key.split('.')
      return {
        function_id: Number(parts[3]),
        mst_life_cycle_id: Number(parts[5]),
        task_id: Number(parts[7])
      }
    },

    /**
     * Find Member Kpi
     */
    findMemberKpi(record) {
      return this.kpis.find(i => i.user_id === this.findRow(record).member_id)?.kpi_per_hour
    },

    /**
     * Set task duration
     */
    setTaskDurationByKpi(record, kpi) {
      if (this.findRow(record).et_point !== null && kpi !== 0) {
        if (kpi < 1) {
          const duration = this.roundPoint(Number(this.findRow(record).et_point) * 0.5)
          this.$set(this.findRow(record), 'duration', duration)
        } else {
          const duration = this.roundPoint((Number(this.findRow(record).et_point) * 0.5) / kpi)
          this.$set(this.findRow(record), 'duration', duration)
        }
      }
    },

    roundPoint(number) {
      return Math.round(number * 4) / 4
    },

    /**
     * Set end_datetime by start_datetime and duration
     */
    setEndDateTime(record) {
      if (this.findRow(record).start_datetime && this.findRow(record).duration) {
        this.$set(this.findRow(record), 'end_datetime', this.calculateEndTime(moment(this.findRow(record).start_datetime), this.findRow(record).duration))
      }
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const dataSave = []
            for (const itemData of this.model.data) {
              if (itemData.children && itemData.children.length > 0) {
                for (const itemLifeCycle of itemData.children) {
                  if (itemLifeCycle.children && itemLifeCycle.children.length > 0) {
                    for (const itemTask of itemLifeCycle.children) {
                      if (itemTask.task_type === TASK_TYPE_VALUE.project) {
                        if (itemTask.start_datetime) {
                          itemTask.start_datetime = moment(itemTask.start_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
                        }
                        if (itemTask.end_datetime) {
                          itemTask.end_datetime = moment(itemTask.end_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
                        }
                        dataSave.push(itemTask)
                      }
                    }
                  }
                }
              }
            }
            await this.$api.requirement.saveRequirementSchedule(dataSave)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            await this.cancelScheduling()
            await this.$fetch()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    updateMember(record) {
      this.$refs.modalMember.open(record)
    },

    updateStartDatetime(record) {
      this.$refs.modalStartDateTime.open(record)
    },

    updateEndDatetime(record) {
      this.$refs.modalEndDateTime.open(record)
    },

    updateDuration(record) {
      this.$refs.modalDuration.open(record)
    },

    rowClassName(record) {
      if (record.is_task && this.shouldShowUpdateSection(record)) {
        return 'dblclickable-row'
      } else {
        return null
      }
    },

    customRow(record) {
      if (record.is_task && this.shouldShowUpdateSection(record)) {
        return {
          on: {
            dblclick: () => {
              this.$refs.modalUpdateTask.open(record)
            }
          }
        }
      }
    },

    save(data) {
      if (data) {
        const record = this.findRow(data)
        if (record) {
          const originalMemberId = record.member_id ?? undefined
          const originalStartDateTime = record.start_datetime ?? null
          const originalEndDateTime = record.end_datetime ?? null
          const originalDuration = record.duration ?? 0
          Object.assign(record, data)
          if (originalMemberId !== data.member_id) {
            this.changeMember(record)
          }

          if (originalStartDateTime !== data.start_datetime) {
            this.changeStartDateTime(record)
          }

          if (originalEndDateTime !== data.end_datetime) {
            this.changeEndDateTime(record)
          }

          if (originalDuration !== data.duration) {
            this.changeDuration(record)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-table-tbody {
    .dblclickable-row {
      background-color: #f0f6f8;
    }
  }
  .ant-checkbox-wrapper-disabled {
    display: none;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 10px 10px;
  }
  .ant-calendar-picker {
    min-width: 150px !important;
  }
  .ant-input-number {
    width: 65px;
  }
  .ant-form-item {
    margin: 0 !important;
  }
  .ant-table-tbody > tr.ant-table-row-selected td {
    color: inherit;
    background: rgb(210,230,253);
  }
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: transparent;
  }
  .ant-table-selection-column > .ant-table-header-column {
    display: none;
  }
  .ant-table-tbody {
    .selected {
      background: rgb(210,230,253) !important;
    }
    > tr {
      cursor: pointer;
    }
  }
}
.main-table {
  overflow-x: auto;
}
.selected-index {
  color: red;
}
.primary {
  color: rgb(92,161,253);
}
.title {
  color: rgb(136, 29, 109);
}
.wbs {
  color: rgb(239,98,63);
}
.wbs_selected {
  color: rgb(82,196,26);
}
.cycle {
  color: rgb(61,189,141);
}
span {
  font-weight: 700;
}
.action-container {
  display: flex;
}
.action-footer {
  display: flex;
  justify-content: center;
}
.select-member {
  width: 200px;
}

.link {
  color: #0077c0
}
.schedule-note {
  font-size: 12px;
  font-style: italic;
  color: red
}
.limited-lines {
  word-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
