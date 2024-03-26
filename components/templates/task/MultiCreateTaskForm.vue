<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 8 }"
    :wrapper-col="{ sm: 16 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <!-- Row project -->
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.project_id')"
              prop="project_id"
            >
              {{ this.$store.state.project.name }}
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- Row Task Type -->
        <a-row>
          <a-col
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.task_type')"
              prop="task_type"
            >
              <a-radio-group v-model="model.task_type" name="radioGroup" :default-value="1" @change="changeTypeTask">
                <a-radio
                  v-for="item in filteredTaskType"
                  :key="item.value"
                  :value="item.value"
                >
                  <a-icon v-if="item.value === TASK_TYPE_VALUE.meeting" type="phone" />
                  <a-icon v-if="item.value === TASK_TYPE_VALUE.manager" type="crown" />
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- Row Member Of Task -->
        <a-row>
          <a-col
            v-if="memberSelectionMode === 'single'"
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.member_id')"
              prop="member_id"
            >
              <a-select
                v-model="model.member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
                @change="changeMember"
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
            v-else-if="memberSelectionMode === 'multiple'"
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.member_id')"
              prop="member_id"
            >
              <a-select
                v-model="model.member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
                mode="multiple"
                @change="changeMember"
              >
                <a-select-option
                  v-for="(item, index) in users"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <a-checkbox v-model="isAllMembersSelected" @change="(e) => checkAll(e)">
                {{ $t('common.check_all') }}
              </a-checkbox>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- Row Task Reviewer/Approver -->
        <a-row>
          <a-col
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.approver')"
              prop="approver"
            >
              <a-select
                v-model="model.approver"
                :placeholder="$t('module.task.approver')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in userApprovers"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- Row Task Supporter ( normal task only ) -->
        <a-row class="mb-4">
          <a-col
            v-if="model.task_type === TASK_TYPE_VALUE.project && !hiddenInput"
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task.support_user_id')"
              prop="support_user_id"
            >
              <a-select
                v-model="model.support_user_id"
                :placeholder="$t('module.task.support_user_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in supportMembers"
                  :key="index"
                  :value="item.supporter_id"
                >
                  {{ item.supporter?.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row class="mb-4">
          <a-col
            v-if="model.task_type === TASK_TYPE_VALUE.project"
            :span="12"
          >
            <a-form-model-item
              :label="$t('module.task_multi_create.auto_calendar')"
              prop="auto_calendar"
            >
              <a-checkbox v-model="autoCalendar" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- Row Task Table -->
        <a-row>
          <div v-if="model.task_type === TASK_TYPE_VALUE.project" class="table-wrap">
            <table class="table table-striped" style="width: 100%;">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    {{ $t('module.task.function_id') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task.version_code') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task.mst_life_cycle_id') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task_multi_create.usable_point') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task_multi_create.et_point') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task.start_datetime') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task.end_datetime') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.task.title') }}
                  </th>
                  <th scope="col" />
                </tr>
              </thead>
              <draggable :list="model.listTask" tag="tbody" @change="updateRow">
                <tr v-for="(record, index) in model.listTask" :key="index">
                  <td>
                    <a-form-model-item
                      :key="`listTask.` + index + `.function_id`"
                      :prop="`listTask.` + index + `.function_id`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.function_id') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-select
                        v-model="record.function_id"
                        :placeholder="$t('module.task.function_id')"
                        show-search
                        :filter-option="filterOption"
                        @change="changeFunction(index)"
                      >
                        <a-select-option
                          v-for="item in functions"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{ item.code }}: {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.version_code`"
                      :prop="`listTask.` + index + `.version_code`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.version_code') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-select
                        v-model="record.version_code"
                        :placeholder="$t('module.task.version_code')"
                        @change="calculateUsablePoint(index)"
                      >
                        <a-select-option
                          v-for="(item, i) in versionCode[index]"
                          :key="i"
                          :value="item.version_code"
                        >
                          {{ item.version_code }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.mst_life_cycle_id`"
                      :prop="`listTask.` + index + `.mst_life_cycle_id`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.mst_life_cycle_id') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-select
                        v-model="record.mst_life_cycle_id"
                        :placeholder="$t('module.task.mst_life_cycle_id')"
                        @change="calculateUsablePoint(index)"
                      >
                        <a-select-option
                          v-for="item in mstLifeCycles"
                          :key="item.id"
                          :value="item.id"
                        >
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.usable_point`"
                      :prop="`listTask.` + index + `.usable_point`"
                      :wrapper-col="{ xs: 24 }"
                    >
                      {{ (record.usable_point ?? 0) + '/' + (record.total_point ?? 0) }}
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.et_point`"
                      :prop="`listTask.` + index + `.et_point`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="[
                        {
                          required: true,
                          message: $t('validation.required', { field: $t('module.task_multi_create.et_point') }),
                          trigger: ['change', 'blur'],
                        },
                        {
                          validator: (rule, value, callback) => $antdvalidate.checkPointTaskLimit(rule, value, callback),
                          message: $t('validation.number.max', { field: $t('module.task_multi_create.et_point'), max: 4 }),
                          trigger: ['change', 'blur']
                        },
                        {
                          validator: (rule, value, callback) => $antdvalidate.checkPointExceedUsable(rule, value, callback, record.usable_point ?? 0),
                          message: $t('module.task.et_point_exceed_usable'),
                          trigger: ['change', 'blur']
                        }
                      ]"
                    >
                      <a-input-number
                        v-model="record.et_point"
                        :placeholder="$t('module.task_multi_create.et_point')"
                        :step="0.01"
                        :min="0"
                        @keypress.native="preventAlphabetCharacterInput($event)"
                        @change="changeEtPoint"
                      />
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.start_datetime`"
                      :prop="`listTask.` + index + `.start_datetime`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.start_datetime') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-date-picker
                        v-model="record.start_datetime"
                        :placeholder="$t('module.task.start_datetime')"
                        :disabled-date="date => disabledStartDate(date, index)"
                        :disabled-time="disabledDateTimes"
                        :disabled="autoCalendar && index !== 0"
                        disabled-seconds
                        :show-time="{ format: 'HH:mm' }"
                        format="YYYY/MM/DD HH:mm"
                        style="width:100%; min-width: 150px;"
                        @change="calculatePointByDatetime(index)"
                      />
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.end_datetime`"
                      :prop="`listTask.` + index + `.end_datetime`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.end_datetime') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-date-picker
                        v-model="record.end_datetime"
                        :placeholder="$t('module.task.end_datetime')"
                        :disabled-date="date => disabledEndDate(date, index)"
                        :disabled-time="disabledDateTimes"
                        :disabled="autoCalendar"
                        disabled-seconds
                        :show-time="{ format: 'HH:mm' }"
                        format="YYYY/MM/DD HH:mm"
                        style="width:100%; min-width: 150px;"
                        @change="calculatePointByDatetime(index)"
                      />
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-form-model-item
                      :key="`listTask.` + index + `.title`"
                      :prop="`listTask.` + index + `.title`"
                      :wrapper-col="{ xs: 24 }"
                      :rules="{
                        required: true,
                        message: $t('validation.required', { field: $t('module.task.title') }),
                        trigger: ['change', 'blur'],
                      }"
                    >
                      <a-input
                        v-model="record.title"
                        :placeholder="$t('module.task.title')"
                      />
                    </a-form-model-item>
                  </td>
                  <td
                    scope="row"
                  >
                    <a-button
                      html-type="button"
                      type="danger"
                      size="small"
                      :disabled="loading"
                      @click="deleteRow(record)"
                    >
                      <font-awesome-icon
                        icon="trash-alt"
                        class="width-1x"
                      />
                    </a-button>
                  </td>
                </tr>
              </draggable>
            </table>
          </div>
          <!-- End table for normal task -->

          <a-table
            v-if="model.task_type !== TASK_TYPE_VALUE.project"
            :columns="columns"
            :data-source="model.listTask"
            :pagination="false"
            :row-key="record => record.key"
          >
            <template
              slot="usable_point"
              slot-scope="text, record"
            >
              <a-form-model-item
                :key="`listTask.` + model.listTask.indexOf(record) + `.usable_point`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.usable_point`"
                :wrapper-col="{ xs: 24 }"
              >
                {{ usablePointsMeetingManageTask + '/' + totalPointMeetingManageTask }}
              </a-form-model-item>
            </template>

            <template
              slot="et_point"
              slot-scope="text, record"
            >
              <a-form-model-item
                v-if="model.task_type === TASK_TYPE_VALUE.meeting"
                :key="`listTask.` + model.listTask.indexOf(record) + `.et_point`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.et_point`"
                :wrapper-col="{ xs: 24 }"
              >
                <span :class="{ 'error-text': displayError }">
                  {{ etPointForTaskMeeting[model.listTask.indexOf(record)] ?? 0 }}
                </span>
              </a-form-model-item>
              <a-form-model-item
                v-if="model.task_type === TASK_TYPE_VALUE.manager"
                :key="`listTask.` + model.listTask.indexOf(record) + `.et_point`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.et_point`"
                :wrapper-col="{ xs: 24 }"
                :rules="[
                  {
                    required: true,
                    message: $t('validation.required', { field: $t('module.task_multi_create.et_point') }),
                    trigger: ['change', 'blur'],
                  },
                  {
                    validator: (rule, value, callback) => $antdvalidate.checkPointTaskLimit(rule, value, callback),
                    message: $t('validation.number.max', { field: $t('module.task_multi_create.et_point'), max: 4 }),
                    trigger: ['change', 'blur']
                  },
                  {
                    validator: (rule, value, callback) => $antdvalidate.checkPointExceedUsable(rule, value, callback, usablePointsMeetingManageTask ?? 0),
                    message: $t('module.task.et_point_exceed_usable'),
                    trigger: ['change', 'blur']
                  }
                ]"
              >
                <a-input-number
                  v-model="record.et_point"
                  :placeholder="$t('module.task_multi_create.et_point')"
                  :step="0.01"
                  :min="0"
                  @keypress.native="preventAlphabetCharacterInput($event)"
                />
              </a-form-model-item>
            </template>

            <template
              slot="start_datetime"
              slot-scope="text, record"
            >
              <a-form-model-item
                :key="`listTask.` + model.listTask.indexOf(record) + `.start_datetime`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.start_datetime`"
                :wrapper-col="{ xs: 24 }"
                :rules="{
                  required: true,
                  message: $t('validation.required', { field: $t('module.task.start_datetime') }),
                  trigger: ['change', 'blur'],
                }"
              >
                <a-date-picker
                  v-model="record.start_datetime"
                  :placeholder="$t('module.task.start_datetime')"
                  :disabled-date="date => disabledStartDate(date, model.listTask.indexOf(record))"
                  :disabled-time="disabledDateTimes"
                  disabled-seconds
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY/MM/DD HH:mm"
                  style="width:100%;"
                  @change="calculatePointByDatetime(model.listTask.indexOf(record))"
                />
              </a-form-model-item>
            </template>

            <template
              slot="end_datetime"
              slot-scope="text, record"
            >
              <a-form-model-item
                :key="`listTask.` + model.listTask.indexOf(record) + `.end_datetime`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.end_datetime`"
                :wrapper-col="{ xs: 24 }"
                :rules="{
                  required: true,
                  message: $t('validation.required', { field: $t('module.task.end_datetime') }),
                  trigger: ['change', 'blur'],
                }"
              >
                <a-date-picker
                  v-model="record.end_datetime"
                  :placeholder="$t('module.task.end_datetime')"
                  :disabled-date="date => disabledEndDate(date, model.listTask.indexOf(record))"
                  :disabled-time="disabledDateTimes"
                  disabled-seconds
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY/MM/DD HH:mm"
                  style="width:100%;"
                  @change="calculatePointByDatetime(model.listTask.indexOf(record))"
                />
              </a-form-model-item>
            </template>

            <template
              slot="task_title"
              slot-scope="text, record"
            >
              <a-form-model-item
                :key="`listTask.` + model.listTask.indexOf(record) + `.title`"
                :prop="`listTask.` + model.listTask.indexOf(record) + `.title`"
                :wrapper-col="{ xs: 24 }"
                :rules="{
                  required: true,
                  message: $t('validation.required', { field: $t('module.task.title') }),
                  trigger: ['change', 'blur'],
                }"
              >
                <a-input
                  v-model="record.title"
                  :placeholder="$t('module.task.title')"
                />
              </a-form-model-item>
            </template>

            <template
              slot="action"
              slot-scope="text, record"
            >
              <a-button
                html-type="button"
                type="danger"
                size="small"
                :disabled="loading"
                @click="deleteRow(record)"
              >
                <font-awesome-icon
                  icon="trash-alt"
                  class="width-1x"
                />
              </a-button>
            </template>
          </a-table>
        </a-row>
      </div>
      <div class="pb-4 ml-4">
        <template>
          <div class="col-md-6 col-md-offset-3">
            <ul class="list-group" />
          </div>
          <a-button
            style="margin-top:20px;"
            html-type="button"
            type="primary"
            class="min-w-100"
            @click="addTaskRow"
          >
            {{ $t('module.task_multi_create.add_task') }}
          </a-button>
        </template>
      </div>
      <div v-if="model.listTask.length > 0" class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>
      </div>
      <NotificationProjectNotSelectedVue />
    </a-spin>
  </a-form-model>
</template>

<script>
import draggable from 'vuedraggable'
import moment from 'moment-timezone'
import DataForm from '~/mixins/data-form'
import WorkingHours from '~/mixins/working-hours'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'
import { TASK_TYPE, TASK_TYPE_VALUE, ERROR_CODE } from '~/constants'

export default {
  components: {
    NotificationProjectNotSelectedVue,
    draggable
  },

  mixins: [DataForm, WorkingHours],

  data: () => ({
    model: {
      listTask: [],
      task_type: undefined,
      member_id: undefined,
      approver: undefined,
      support_user_id: undefined
    },
    resource: 'task',
    functions: [],
    mstLifeCycles: [],
    versionCode: [],
    TASK_TYPE,
    TASK_TYPE_VALUE,
    totalApprovePoint: [],
    totalApprovePointMeetingManageTask: 0,
    totalPoint: [],
    totalPointMeetingManageTask: 0,
    usablePoints: [],
    usablePointsMeetingManageTask: 0,
    etPointForTaskMeeting: [],
    totalWorkHours: [],
    ERROR_CODE,
    users: [],
    kpis: [],
    memberSelectionMode: 'single',
    defaultSelectedMembers: [],
    isAllMembersSelected: false,
    userApprovers: [],
    supportMembers: [],
    errorMessage: '',
    hiddenInput: false,
    totalFunctionPoint: 0,
    displayError: false,
    disabledDateTimes: disableHours => { },
    stepHours: 1,
    stepMinutes: 15,
    autoCalendar: true
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        task_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.task_type') }),
            trigger: ['change', 'blur']
          }
        ],
        approver: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.approver') }),
            trigger: ['change', 'blur']
          }
        ],
        member_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.member_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    },

    columns() {
      return [
        {
          title: this.$t('module.task_multi_create.usable_point'),
          scopedSlots: { customRender: 'usable_point' },
          width: '15%'
        },
        {
          title: this.$t('module.task_multi_create.et_point'),
          scopedSlots: { customRender: 'et_point' },
          width: '15%'
        },
        {
          title: this.$t('module.task.start_datetime'),
          scopedSlots: { customRender: 'start_datetime' },
          width: '15%'
        },
        {
          title: this.$t('module.task.end_datetime'),
          scopedSlots: { customRender: 'end_datetime' },
          width: '15%'
        },
        {
          title: this.$t('module.task.title'),
          scopedSlots: { customRender: 'task_title' },
          width: '20%'
        },
        {
          key: 'action',
          className: 'text-center',
          width: '4%',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },

    filteredTaskType() {
      return this.TASK_TYPE.filter(item => item.value !== 0)
    }
  },

  watch: {},

  created() {
    this.getProjectUser()
    this.getFunctions()
    this.getMstLifeCycles()
  },

  mounted() {
    this.changeTypeTask()
    this.disableHours = [0, 1, 2, 3, 4, 5, 6, 7, 18, 19, 20, 21, 22, 23, 24]
    this.disabledDateTimes = () => {
      return {
        disabledHours: () => this.disableHours,
        hourStep: this.stepHours,
        minuteStep: this.stepMinutes
      }
    }
  },

  methods: {
    /**
     * Change type of task
     */
    changeTypeTask() {
      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
          this.memberSelectionMode = 'multiple'
          this.model.member_id = this.users.map(user => user.id)
          this.isAllMembersSelected = this.model.member_id.length === this.users.length
          this.model.listTask = []
        } else {
          this.memberSelectionMode = 'single'
          this.setDefaultTaskOwner()
        }
        this.calculateUsablePoint()
        this.getKpis()
        this.getApproveUsers()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Set Default task owner to current login user
     */
    setDefaultTaskOwner() {
      const model = {
        member_id: this.$auth.user.id,
        task_type: this.model.task_type,
        approver: this.model.approver,
        support_user_id: this.model.support_user_id,
        listTask: []
      }
      this.model = model
    },

    /**
     * On Change function
     */
    changeFunction(index) {
      if (this.functions.length > 0 && this.model.listTask[index].function_id) {
        // find all version of selected function
        const functionData = this.functions.find(item => item.id === this.model.listTask[index].function_id)
        this.versionCode[index] = functionData.version_functions
        if (this.versionCode[index].length > 0) {
          // set latest version
          this.$set(this.model.listTask[index], 'version_code', this.versionCode[index][0].version_code)
        }
        if (this.model.listTask[index].function_id && this.model.listTask[index].version_code && this.model.listTask[index].mst_life_cycle_id) {
          // calculate point can be used with function, version and mst life cycle
          this.calculateUsablePoint(index)
        }
      }
    },

    /**
     * Calculate usable points
     */
    async calculateUsablePoint(index) {
      this.$store.dispatch('setLoading', true)
      try {
        await this.getTotalPointEt(index)
        await this.getApprovedPoint(index)
        this.usablePointsMeetingManageTask = (this.totalPointMeetingManageTask - this.totalApprovePointMeetingManageTask).toFixed(2)
        if (this.model.listTask.length > 0) {
          this.model.listTask[index].usable_point = (this.model.listTask[index].total_point - this.model.listTask[index].total_approve_point).toFixed(2)
          this.$set(this.model.listTask[index], 'et_point', Math.min(4, this.model.listTask[index].usable_point))
          if (this.$refs.form) {
            this.$refs.form.clearValidate(`listTask.${index}.et_point`)
          }
        }
        this.autoSetCalendar()
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
     * Calculate the total ET POINT of 1 function, 1 version, 1 mst life cycle (function_et_points table)
     */
    async getTotalPointEt(index) {
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.project && index !== undefined) {
          if (this.model.listTask[index].function_id && this.model.listTask[index].version_code && this.model.listTask[index].mst_life_cycle_id) {
            const params = {
              project_id: this.$store.state.project.id,
              function_id: this.model.listTask[index].function_id,
              version_code: this.model.listTask[index].version_code,
              mst_life_cycle_id: this.model.listTask[index].mst_life_cycle_id,
              not_limit: true
            }
            const { data: { result: { data } } } = await this.repository.listFunctionEtPoint({ params })
            let total = 0
            for (const item of data) {
              total += item.point_et
            }
            this.model.listTask[index].total_point = total.toFixed(2)
          } else {
            this.model.listTask[index].total_point = 0
          }
        } else {
          const params = {
            project_id: this.$store.state.project.id
          }
          const { data: { result: { data } } } = await this.repository.listProjectEtPoint({ params })
          const total = data.reduce((total, item) => {
            const pointEt =
                typeof item.total_pm_point_et === 'number' ? item.total_pm_point_et : 0
            return total + pointEt
          }, 0)
          this.totalPointMeetingManageTask = total.toFixed(2)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * calculate total POINT used of 1 function, 1 version, 1 mst life cycle (tasks table)
     */
    async getApprovedPoint(index) {
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.project && index !== undefined) {
          if (this.model.listTask[index].function_id && this.model.listTask[index].version_code && this.model.listTask[index].mst_life_cycle_id) {
            const params = {
              project_id: this.$store.state.project.id,
              task_type: this.model.task_type ? this.model.task_type : 0,
              function_id: this.model.listTask[index].function_id,
              version_code: this.model.listTask[index].version_code,
              mst_life_cycle_id: this.model.listTask[index].mst_life_cycle_id,
              isCreateTask: true,
              not_limit: true
            }
            const { data: { result: { data } } } = await this.$api.task.list({ params })
            let total = 0
            for (const item of data) {
              total += item.et_point + item.support_point + item.review_point
            }
            this.model.listTask[index].total_approve_point = total.toFixed(2)
          } else {
            this.model.listTask[index].total_approve_point = 0
          }
        } else {
          const params = {
            project_id: this.$store.state.project.id,
            task_type: this.model.task_type,
            isCreateTask: true,
            not_limit: true
          }
          const { data: { result: { data } } } = await this.$api.task.list({ params })
          let total = 0
          for (const item of data) {
            total += item.et_point
          }
          this.totalApprovePointMeetingManageTask = total.toFixed(2)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Select all members
     */
    checkAll(e) {
      if (e.target.checked) {
        this.model.member_id = this.users.map(user => user.id)
      } else {
        this.model.member_id = []
      }
      this.getApproveUsers()
    },

    /**
     * Get kpi of the member
     */
    async getKpis() {
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.meeting && this.model.member_id.length > 0) {
          const params = {
            member_id: this.model.member_id
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
     * Calculate point by start date and end date of task
     *
     * @param index
     */
    calculatePointByDatetime(index) {
      if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
        this.filterKpi()
        if (this.model.listTask[index].start_datetime && this.model.listTask[index].end_datetime) {
          const start = moment(this.model.listTask[index].start_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
          const end = moment(this.model.listTask[index].end_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')

          const totalHours = this.calculateDuration(start, end)
          this.totalWorkHours[index] = Math.max(totalHours, 0)
          this.etPointForTaskMeeting[index] = this.calculatePointFromKpis(this.kpis, this.totalWorkHours[index])
          this.$forceUpdate()
        }
      }
      if (this.model.task_type === TASK_TYPE_VALUE.project) {
        this.autoSetCalendar()
      }
    },

    async autoSetCalendar() {
      if (this.autoCalendar && this.model.listTask[0].start_datetime && this.model.task_type === TASK_TYPE_VALUE.project) {
        let startTime = ''
        const params = {
          user_id: this.model.member_id
        }
        const { data: { result: { data } } } = await this.$api.task.getKpis({ params })
        this.kpis = data
        const currentKpi = this.kpis.find(i => i.user_id === this.model.member_id)
        if (currentKpi) {
          this.model.listTask.forEach((task, index) => {
            if (task.et_point) {
              const hour = task.et_point / currentKpi.kpi_per_hour
              if (index === 0) {
                startTime = this.model.listTask[index].start_datetime
                const startLunchTime = moment(startTime).set({ hour: 12, minute: 0, second: 0 })
                const endLunchTime = moment(startTime).set({ hour: 13, minute: 0, second: 0 })
                if (startTime.isBetween(startLunchTime, endLunchTime)) {
                  startTime.set(endLunchTime.toObject())
                }
              } else {
                startTime = this.model.listTask[index - 1].end_datetime

                const lunchStartPrevious = moment(this.model.listTask[index - 1].end_datetime).set({ hour: 12, minute: 0, second: 0 })
                const endWorkPrevious = moment(this.model.listTask[index - 1].end_datetime).set({ hour: 17, minute: 30, second: 0 })
                if (lunchStartPrevious.isSame(this.model.listTask[index - 1].end_datetime)) {
                  startTime = lunchStartPrevious.add(1, 'hours')
                } else if (endWorkPrevious.isSame(this.model.listTask[index - 1].end_datetime)) {
                  startTime = endWorkPrevious.add({ hours: 15, minutes: 0, seconds: 0 })
                  if (startTime.days() === 6) {
                    startTime.add(2, 'days')
                  }
                }
              }
              this.$set(this.model.listTask[index], 'start_datetime', startTime)
              this.$set(this.model.listTask[index], 'end_datetime', this.calculateEndTime(startTime, hour))

              if (this.$refs.form) {
                if (task.start_datetime) {
                  this.$refs.form.clearValidate(`listTask.${index}.start_datetime`)
                }
                if (task.end_datetime) {
                  this.$refs.form.clearValidate(`listTask.${index}.end_datetime`)
                }
              }
            }
          })
        }
      }
    },

    /**
     * On change et point -> auto calculate calendar
     */
    changeEtPoint() {
      this.autoSetCalendar()
    },

    /**
     * Calculator total point for task meeting.
     * @param {Array} kpis - Kpi.
     * @param {number} totalWorkHours - Total hours.
     * @returns {number}
     */
    calculatePointFromKpis(kpis, totalWorkHours) {
      let totalPoint = 0

      for (const kpi of kpis) {
        const kpiPerHour = kpi.kpi_per_hour
        const point = kpiPerHour * totalWorkHours
        totalPoint += point
      }

      return totalPoint.toFixed(2)
    },

    /**
     * Get list user of project
     */
    async getProjectUser() {
      try {
        const params = {
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.repository.showProject({ params })
        const uniqueUsersMap = new Map()

        data.users.forEach(user => {
          if (!uniqueUsersMap.has(user.id)) {
            uniqueUsersMap.set(user.id, {
              id: user.id,
              name: user.name
            })
          }
        })
        this.users = Array.from(uniqueUsersMap.values())
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List Function
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.repository.listFunction({ params })
        this.functions = data
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstLifeCycle
     */
    async getMstLifeCycles() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.repository.listMstLifeCycles({ params })
        this.mstLifeCycles = data
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List Approve Of User
     */
    async getApproveUsers() {
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.project || this.model.task_type === TASK_TYPE_VALUE.manager) {
          if (this.model.task_type === TASK_TYPE_VALUE.project) {
            this.getListUserSupport()
          }
          if (this.model.member_id) {
            const memberId = Array.isArray(this.model.member_id) && this.model.member_id.length > 0
              ? this.model.member_id[0]
              : this.model.member_id.length === 0
                ? 0
                : this.model.member_id
            if (memberId !== 0) {
              const params = {
                project_id: this.$store.state.project.id,
                member_id: memberId
              }
              const { data: { result: { data } } } = await this.repository.getLeaders({ params })
              this.userApprovers = data
              const loggedInUserId = this.$auth.user.id
              const loggedInUserIsApprover = this.userApprovers.some(user => user.id === loggedInUserId)
              if (!this.id) {
                if (loggedInUserIsApprover) {
                  this.$set(this.model, 'approver', loggedInUserId)
                } else if (this.userApprovers.length > 0) {
                  this.$set(this.model, 'approver', this.userApprovers[0].id)
                } else {
                  this.$set(this.model, 'approver', undefined)
                }
              }
            }
          }
        } else if (this.model.task_type === TASK_TYPE_VALUE.meeting && this.model.member_id && this.model.member_id.length > 0) {
          const params = {
            project_id: this.$store.state.project.id,
            member_id: this.model.member_id
          }
          const { data: { result: { data } } } = await this.repository.listMemberApproves({ params })
          this.userApprovers = data
          if (!this.id) {
            if (this.userApprovers.length > 0) {
              this.$set(this.model, 'approver', this.userApprovers[0].id)
            } else {
              this.$set(this.model, 'approver', undefined)
            }
          }
        }
        this.errorMessage = ''
      } catch (_) {
        if (_.response.data.code && _.response.data.code === ERROR_CODE.NO_APPROVER) {
          this.userApprovers = []
          this.$set(this.model, 'approver', undefined)
          this.errorMessage = this.$t('module.task.message_no_approver')
        } else {
          this.errorMessage = ''
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      }
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     */
    getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        const model = {}
        model.task_type = TASK_TYPE_VALUE.project
        this.setModel(model)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * List Support of User
     */
    async getListUserSupport() {
      this.$store.dispatch('setLoading', true)
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.project) {
          if (this.model.member_id) {
            const memberId = Array.isArray(this.model.member_id) && this.model.member_id.length > 0
              ? this.model.member_id[0]
              : this.model.member_id.length === 0
                ? 0
                : this.model.member_id
            if (memberId !== 0) {
              const params = {
                project_id: this.$store.state.project.id,
                member_id: memberId
              }
              const { data: { result: { data } } } = await this.repository.getSupportMember({ params })
              this.supportMembers = data

              if (this.supportMembers.length === 1) {
                this.model.support_user_id = this.supportMembers[0].supporter_id
              } else if (this.supportMembers.length >= 2) {
                const eligibleSupportMembers = this.supportMembers.filter(member => member.end_date !== null)
                if (!this.id) {
                  if (eligibleSupportMembers.length > 0) {
                    eligibleSupportMembers.sort((a, b) => {
                      const durationA = a.end_date ? moment(a.end_date).diff(moment()) : 0
                      const durationB = b.end_date ? moment(b.end_date).diff(moment()) : 0

                      if (durationA !== durationB) {
                        return durationA - durationB
                      } else {
                        return this.supportMembers.indexOf(a) - this.supportMembers.indexOf(b)
                      }
                    })
                    this.$set(this.model, 'support_user_id', eligibleSupportMembers[0].supporter_id)
                  } else {
                    this.$set(this.model, 'support_user_id', this.supportMembers[0].supporter_id)
                  }
                }
              } else {
                this.$set(this.model, 'support_user_id', undefined)
              }
              this.hiddenInput = false
            }
          }
        }
      } catch (_) {
        if (_.response.data.code && _.response.data.code === ERROR_CODE.CUSTOMER_SERVICE_STAFF) {
          this.hiddenInput = true
        } else {
          this.hiddenInput = false
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Disable start date
     */
    disabledStartDate(startValue, index) {
      const endValue = this.model.listTask[index].end_datetime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    /**
     * Disable end date
     */
    disabledEndDate(endValue, index) {
      const startValue = this.model.listTask[index].start_datetime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
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
     * On change member of task (model.member_id)
     */
    changeMember() {
      this.getApproveUsers()
      if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
        const currentMemberKpi = this.filterKpi()
        // recalculate meeting task point on changing model.member_id
        this.model.listTask.forEach((item, index) => {
          if (this.model.listTask[index].start_datetime && this.model.listTask[index].end_datetime) {
            const start = moment(this.model.listTask[index].start_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
            const end = moment(this.model.listTask[index].end_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')

            const totalHours = this.calculateDuration(start, end)
            this.totalWorkHours[index] = Math.max(totalHours, 0)
            this.etPointForTaskMeeting[index] = this.calculatePointFromKpis(currentMemberKpi, this.totalWorkHours[index])
          }
        })
      }
      if (this.model.task_type === TASK_TYPE_VALUE.project) {
        this.autoSetCalendar()
      }
    },

    /**
     * On change member of task (model.member_id) -> filter kpi of member
     */
    filterKpi() {
      return this.kpis.filter(item => this.model.member_id.includes(item.user_id))
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        task_type: this.model.task_type,
        project_id: this.model.project_id,
        member_id: this.model.member_id,
        approver: this.model.approver,
        support_user_id: this.model.support_user_id,
        listTask: this.model.listTask
      }

      return model
    },

    /**
     * Delete row at task table
     *
     * @param item
     */
    async deleteRow(item) {
      const index = this.model.listTask.indexOf(item)
      await this.model.listTask.splice(index, 1)
      this.autoSetCalendar()
    },

    /**
     * Add new row at task table
     */
    addTaskRow() {
      this.model.listTask.push({
        function_id: undefined
      })
    },

    updateRow() {
      this.autoSetCalendar()
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
        const totalPointMeetingET = this.etPointForTaskMeeting.reduce((total, item) => {
          const pointEt = Number(item)
          return total + pointEt
        }, 0)
        if (totalPointMeetingET > this.usablePointsMeetingManageTask) {
          this.$notification.error({
            message: this.$t('module.task.et_point_exceed_usable')
          })
          return
        }
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const dataTask = this.getModel()
            dataTask.listTask.forEach((item, index) => {
              item.start_datetime = moment(item.start_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
              item.end_datetime = moment(item.end_datetime).second(0).format('YYYY-MM-DD HH:mm:ss')
              if (dataTask.task_type === TASK_TYPE_VALUE.meeting) {
                item.total_work_hours = this.totalWorkHours[index]
                item.et_point = this.etPointForTaskMeeting[index]
              }
            })
            if (dataTask.task_type === TASK_TYPE_VALUE.meeting) {
              delete dataTask.support_user_id
              dataTask.kpi = []
              dataTask.member_id.forEach((member, index) => {
                dataTask.kpi.push({
                  member_id: member,
                  kpi_per_hour: this.kpis.find(i => i.user_id === member) ? this.kpis.find(i => i.user_id === member).kpi_per_hour : 0
                })
              })
            }

            dataTask.project_id = this.$store.state.project.id
            await this.repository.multiCreate(dataTask)
            if (dataTask.task_type === TASK_TYPE_VALUE.meeting) {
              this.$emit('save')
            } else {
              this.$emit('save', dataTask.member_id)
            }

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
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-form-item {
  margin: 0px !important;
}
.mb-10 {
  margin-bottom: 10px !important;
  margin-top: 10px !important;
}
.inp {
  min-height: 90px;
}

.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  transition: background 0.3s ease;
  padding: 16px 16px;
  word-wrap: break-word;
  border-bottom: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
}
.thead-dark {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  > tr > td {
    border-bottom: 1px solid #e8e8e8;
    padding: 20px 5px;
    word-wrap: break-word;
    word-break: break-all;
    transition: background 0.3s;
    cursor: pointer;
  }
  > tr {
    cursor: pointer;
  }
}
.table-wrap {
   width: 100%;
   table th:first-child,
   table td:first-child {
     width: 18%;
   }

   table th:nth-child(2),
   table td:nth-child(2) {
     width: 8%;
   }

   table th:nth-child(3),
   table td:nth-child(3) {
     width: 15%;
   }

  table th:nth-child(4),
  table td:nth-child(4) {
    width: 7%;
  }

  table th:nth-child(5),
  table td:nth-child(5) {
    width: 6%;
  }

  table th:nth-child(6),
  table td:nth-child(6) {
    width: 8%;
  }

  table th:nth-child(7),
  table td:nth-child(7) {
    width: 8%;
  }

  table th:nth-child(8),
  table td:nth-child(8) {
    width: 21%;
  }

  table th:nth-child(9),
  table td:nth-child(9) {
    width: 4%;
  }
 }

/deep/ {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-form-explain {
    width: 200%;
  }
  .ant-table-tbody > tr > td {
    padding: 20px 5px;
  }
  .ant-table-content .ant-calendar-picker {
    max-width: 120px;
  }
  textarea {
    resize: none;
  }
  .ant-input-number {
    width: 100%;
  }
  .error {
    color: red;
    font-style: italic;
    font-size: 12px;
    position: absolute;
    top: 31px;
    left: 0;
  }
  .error-text {
    color: red;
  }
}
</style>
