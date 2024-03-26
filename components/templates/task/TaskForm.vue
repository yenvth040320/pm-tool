<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 7 }"
    :wrapper-col="{ sm: 17 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.project_id')"
              prop="project_id"
            >
              {{ this.$store.state.project.name }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.requirement_id')"
              prop="requirement_id"
            >
              <a-select
                v-if="model.task_type === TASK_TYPE_VALUE.meeting"
                v-model="model.requirement_id"
                :placeholder="$t('module.task.requirement_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in requirements"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.title }}
                </a-select-option>
              </a-select>
              <span v-else>
                {{ model?.requirement?.title }}
              </span>
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="id"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.task_type')"
              prop="task_type"
            >
              <span v-for="(type, indexType) in TASK_TYPE" :key="indexType" class="pb-3">
                <span v-if="type.value === model.task_type">
                  {{ type.label }}
                </span>
              </span>
            </a-form-model-item>
          </a-col>
          <a-col
            v-if="model.function"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.function_id')"
              prop="function_id"
            >
              {{ model.function.code }}: {{ model.function.name }} / version: {{ model.version_code }}
            </a-form-model-item>
          </a-col>
          <a-col
            v-if="model.mstLifeCycle"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.mst_life_cycle_id')"
              prop="mst_life_cycle_id"
            >
              <span>
                {{ model?.mstLifeCycle?.name }}
              </span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              v-if="model.task_type === TASK_TYPE_VALUE.meeting"
              :label="$t('module.task.et_point')"
            >
              <span>
                {{ calculatedPoint }}
              </span>
            </a-form-model-item>
            <a-form-model-item
              v-else
              :label="$t('module.task.et_point')"
              prop="et_point"
            >
              {{ model.et_point }}
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="memberSelectionMode === 'single'"
            :span="24"
            :md="12"
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
                @change="getApproveUsers"
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
            :span="24"
            :md="12"
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

          <a-col
            :span="24"
            :md="12"
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

          <a-col
            v-if="model.task_type === TASK_TYPE_VALUE.project || model.task_type === TASK_TYPE_VALUE.manager"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.review_point')"
              prop="review_point"
            >
              {{ calculatePointReview }}
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="model.task_type === TASK_TYPE_VALUE.project && !hiddenInput"
            :span="24"
            :md="12"
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

          <a-col
            v-if="model.task_type === TASK_TYPE_VALUE.project && !hiddenInput"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.support_point')"
              prop="support_point"
            >
              {{ calculatePointSupport }}
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
                v-model="model.start_datetime"
                :placeholder="$t('module.task.start_datetime')"
                :disabled-date="date => disabledStartDate(date) || isWeekend(date)"
                :disabled-time="disabledDateTimes"
                disabled-seconds
                :show-time="{ format: 'HH:mm' }"
                format="YYYY/MM/DD HH:mm"
                style="width:100%"
                @change="caculatorPoint"
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
                v-model="model.end_datetime"
                :placeholder="$t('module.task.end_datetime')"
                :disabled-date="date => disabledEndDate(date) || isWeekend(date)"
                :disabled-time="disabledDateTimes"
                disabled-seconds
                :show-time="{ format: 'HH:mm' }"
                format="YYYY/MM/DD HH:mm"
                style="width:100%"
                @change="caculatorPoint"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.title')"
              prop="title"
            >
              <a-input
                v-model="model.title"
                :placeholder="$t('module.task.title')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.description')"
              prop="description"
            >
              <ckeditor
                v-model="model.description"
                :editor="editor"
                :config="editorConfig"
                @ready="onReady"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
      <NotificationProjectNotSelectedVue />
    </a-spin>
  </a-form-model>
</template>

<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import DataForm from '~/mixins/data-form'
import WorkingHours from '~/mixins/working-hours'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'
import { TASK_TYPE, TASK_TYPE_VALUE, CKEDITOR_TOOLBAR_SETTING, ERROR_CODE, SORT } from '~/constants'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'

/**
 * Upload function
 *
 * @param {File} file
 * @return {String} upload path
 */
export function uploadFn(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const imageUrl = this.$nuxt.$store.$api.task.uploadImageContent(formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }).then(data => {
      return data.data
    })

    return imageUrl
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  /**
   * Declare components.
   */
  components: {
    NotificationProjectNotSelectedVue
  },
  /**
   * Declare mixins.
   */
  mixins: [DataForm, WorkingHours],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'task',
    projects: [],
    approveUsers: [],
    reportUsers: [],
    approveEtUsers: [],
    TASK_TYPE,
    TASK_TYPE_VALUE,
    totalPoint: 0,
    calculatedPoint: 0,
    totalWorkHours: 0,
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
    editor: DecoupledEditor,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    displayError: false,
    disabledDateTimes: disableHours => { },
    stepHours: 1,
    stepMinutes: 15,
    requirements: [],
    listMstLifeCycles: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      const rules = {
        task_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.task_type') }),
            trigger: ['change', 'blur']
          }
        ],
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.title') }),
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
        start_datetime: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.start_datetime') }),
            trigger: ['change', 'blur']
          }
        ],
        end_datetime: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.end_datetime') }),
            trigger: ['change', 'blur']
          }
        ],
        et_point: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.et_point') }),
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

      if (this.model.task_type === 1) {
        rules.requirement_id = [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.task.requirement_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }

      return rules
    },

    calculatePointReview() {
      if (this.model.task_type === 0 || this.model.task_type === TASK_TYPE_VALUE.manager) {
        if (this.model.et_point) {
          return (this.model.et_point * 0.1).toFixed(2)
        }
      }
      return 0
    },
    calculatePointSupport() {
      if (this.model.task_type === TASK_TYPE_VALUE.project) {
        if (this.model.et_point && this.model.support_user_id) {
          return (this.model.et_point * 0.1).toFixed(2)
        }
      }
      return 0
    },
    filteredTaskType() {
      return this.TASK_TYPE.filter(item => item.value !== 0)
    }
  },
  watch: {
    id(val) {
      this.getDetailTask(val)
    }
  },

  created() {
    this.getListMstLifeCyclesForTaskEdit()
  },

  /**
   * Mounted event.
   */
  async mounted() {
    await this.getProjectUser()
    this.getDetailTask(this.id)
    this.getListRequirement()

    if (!this.id) {
      this.changeTypeTask()
    }
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
    async getListRequirement() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
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
     * Get List Mst Life Cycles To Edit
     */
    async getListMstLifeCyclesForTaskEdit() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_by: 'wbs',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.listForQaDetail({ params })
        this.listMstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Change type of task
     */
    changeTypeTask() {
      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        this.memberSelectionMode = 'multiple'
        this.model.member_id = this.users.map(user => user.id)
        this.isAllMembersSelected = this.model.member_id.length === this.users.length
        this.calculatePointAndUseablePoint()
        this.getApproveUsers()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async calculatePointAndUseablePoint() {
      if (this.totalWorkHours !== 0) {
        await this.getKpis()
        this.calculatedPoint = this.calculatePointFromKpis(this.kpis, this.totalWorkHours)
      }
    },

    /**
     * Disable start date
     */
    disabledStartDate(startValue) {
      const endValue = this.model.end_datetime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    /**
     * Disable end date
     */
    disabledEndDate(endValue) {
      const startValue = this.model.start_datetime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },

    isWeekend(date) {
      const day = date.days()
      return day === 0 || day === 6
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
      if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
        const currentMemberKpi = this.filterKpi()
        if (this.model.start_datetime && this.model.end_datetime) {
          const start = moment(this.model.start_datetime).second(0)
          const end = moment(this.model.end_datetime).second(0)

          const totalHours = this.calculateDuration(start, end)
          this.totalWorkHours = Math.max(totalHours, 0)
          this.calculatedPoint = this.calculatePointFromKpis(currentMemberKpi, this.totalWorkHours)
        }
      }
    },
    changeApprover() {
      this.getKpis()
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

    async caculatorPoint() {
      if (this.kpis.length === 0) {
        await this.getKpis()
      }
      if (this.model.start_datetime && this.model.end_datetime) {
        const start = moment(this.model.start_datetime).second(0)
        const end = moment(this.model.end_datetime).second(0)

        const totalHours = this.calculateDuration(start, end)
        this.totalWorkHours = Math.max(totalHours, 0)
        this.calculatedPoint = this.calculatePointFromKpis(this.kpis, this.totalWorkHours)
      }
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
     * List ApproveUser
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
              if (!this.id || this.model.approver === undefined || this.model.approver === null) {
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
        } else if (this.model.member_id && this.model.member_id.length > 0) {
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
    async getDetailTask(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        const loggedInUser = this.users.find(user => user.id === this.$auth.user.id)
        let model = {}

        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
          if (this.$store.state.project.id !== data.project.id) {
            this.$store.dispatch('addProject', {
              id: data.project.id,
              name: data.project.name
            })
            this.getProjectUser()
          }

          if (data.task_type === TASK_TYPE_VALUE.meeting) {
            this.calculatedPoint = (data.et_point).toFixed(2)
            this.memberSelectionMode = 'multiple'
            const taskOwnerIds = model.taskOwners.map(owner => owner.member_id)

            model.member_id = taskOwnerIds
            this.isAllMembersSelected = model.member_id.length === this.users.length
          } else if (data.taskOwners.length > 0 && (data.task_type === TASK_TYPE_VALUE.project || data.task_type === TASK_TYPE_VALUE.manager)) {
            this.memberSelectionMode = 'single'
            model.member_id = model.taskOwners[0].member_id
          }
        } else {
          model.task_type = TASK_TYPE_VALUE.meeting
          model.member_id = loggedInUser ? loggedInUser.id : 0
        }
        if (model.description === null || model.description === undefined) {
          model.description = ''
        }
        this.setModel(model)
        this.getApproveUsers()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * On change member of task (model.member_id)
     */
    changeMember() {
      this.getApproveUsers()
      if (this.model.task_type === TASK_TYPE_VALUE.meeting) {
        const currentMemberKpi = this.filterKpi()
        if (this.model.start_datetime && this.model.end_datetime) {
          const start = moment(this.model.start_datetime).second(0)
          const end = moment(this.model.end_datetime).second(0)

          const totalHours = this.calculateDuration(start, end)
          this.totalWorkHours = Math.max(totalHours, 0)
          this.calculatedPoint = this.calculatePointFromKpis(currentMemberKpi, this.totalWorkHours)
        }
      }
    },

    /**
     * On change member of task (model.member_id) -> filter kpi of member
     */
    filterKpi() {
      return this.kpis.filter(item => this.model.member_id.includes(item.user_id))
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      try {
        await console.log('detail')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List ApproveUser
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

    onReady(editor) {
      // Note: Using DecoupledEditor then Insert the toolbar by manual before the editable area.
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
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
          code === 45 || //  (-)
          (code >= 37 && code <= 40) // arrow keys
      ) {
        return
      }
      event.preventDefault()
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
        id: this.model.id,
        member_id: this.model.member_id,
        task_type: this.model.task_type,
        project_id: this.model.project_id,
        requirement_id: this.model.requirement_id,
        function_id: this.model.function_id,
        version_code: this.model.version_code,
        mst_life_cycle_id: this.model.mst_life_cycle_id,
        title: this.model.title,
        description: this.model.description,
        et_point: this.model.et_point,
        approve_point: this.model.approve_point,
        start_datetime: this.model.start_datetime ? this.model.start_datetime : null,
        end_datetime: this.model.end_datetime ? this.model.end_datetime : null,
        approver: this.model.approver,
        status: this.model.status,
        support_user_id: this.model.support_user_id,
        approve_et_status: this.model.approve_et_status,
        approve_status: this.model.approve_status,
        approve_datetime: this.model.approve_datetime,
        report_datetime: this.model.report_datetime,
        approve_et_datetime: this.model.approve_et_datetime,
        approve_user_id: this.model.approve_user_id,
        report_user_id: this.model.report_user_id,
        approve_et_user_id: this.model.approve_et_user_id,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      if (this.errorMessage !== '') {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        return
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const dataTask = this.getModel()
            dataTask.start_datetime = dataTask.start_datetime ? moment(dataTask.start_datetime).format('YYYY-MM-DD HH:mm:ss') : null
            dataTask.end_datetime = dataTask.end_datetime ? moment(dataTask.end_datetime).format('YYYY-MM-DD HH:mm:ss') : null
            dataTask.project_id = this.$store.state.project.id
            if (this.totalWorkHours !== 0) {
              dataTask.duration = this.totalWorkHours
            }
            if (dataTask.task_type === TASK_TYPE_VALUE.meeting) {
              dataTask.total_work_hours = this.totalWorkHours
              dataTask.et_point = this.calculatedPoint
            }
            let idTask = 0
            if (this.model.id) {
              const { data: { result: { data } } } = await this.repository.update(this.model.id, dataTask)
              idTask = data.id
            } else {
              const { data: { result: { data } } } = await this.repository.create(dataTask)
              idTask = data.id
            }
            this.$emit('save', idTask)
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
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
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
  .ck-editor__editable {
    min-height: 200px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
}
</style>
