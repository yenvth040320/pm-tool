<template>
  <div class="detail-task">
    <a-form-model
      ref="form"
      :model="model"
      :rules="formRules"
      :label-col="{ sm: 7 }"
      :wrapper-col="{ sm: 17 }"
      @submit.prevent="handleSubmit"
    >
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
              {{ model?.project?.name }}
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
              {{ model?.requirement?.title }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.status')"
            >
              <div
                v-for="item in TASK_STATUS"
                :key="item.value"
              >
                <div v-if="item.value === model.status">
                  {{ item.label }}
                </div>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.approve_status')"
            >
              <div
                v-for="item in TASK_APPROVE_STATUS"
                :key="item.value"
              >
                <div v-if="item.value === model.approve_status">
                  {{ item.label }}
                </div>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.member_id')"
            >
              <div
                v-for="owner in model.taskOwners"
                :key="owner.id"
              >
                {{ owner.member.name }}
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.approver')"
            >
              {{ model?.approverUser?.name }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.start_datetime')"
            >
              {{ model.start_datetime ? getDateTime(model.start_datetime) : '' }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.end_datetime')"
            >
              {{ model.end_datetime ? getDateTime(model.end_datetime) : '' }}
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.task_type')"
            >
              <div
                v-for="item in TASK_TYPE"
                :key="item.value"
              >
                <div v-if="item.value === model.task_type">
                  {{ item.label }}
                </div>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.et_point')"
            >
              {{ model.et_point }}
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row
          type="flex"
          :gutter="30"
          class="info-task"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.task.title')"
            >
              {{ model.title }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.task.description')"
            >
              <p v-html="model.description" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          v-if="approvalCompletedAllow() && model.status !== TASK_STATUS_VALUE.done"
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          {{ $t('module.task.approval_completed') }}
        </a-button>

        <a-button
          v-if="isDeleteAllowed() && model.status !== TASK_STATUS_VALUE.done"
          html-type="button"
          type="default"
          class="min-w-100 btn-delete"
          @click="confirmToDelete(model.id)"
        >
          {{ $t('common.delete') }}
        </a-button>
        <a-button
          v-if="isUpdateAllowed() && model.status !== TASK_STATUS_VALUE.done"
          html-type="button"
          type="default"
          class="min-w-100 btn-update"
          @click="gotoDetail(model.id)"
        >
          {{ $t('common.update') }}
        </a-button>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import { TASK_TYPE, TASK_STATUS, TASK_APPROVE_STATUS, FORMAT_DATE_TIME, TASK_STATUS_VALUE, TASK_APPROVE_STATUS_VALUE } from '~/constants'
import WorkingHours from '~/mixins/working-hours'

export default {
  /**
     * Declare components.
     */
  components: {
  },
  /**
     * Declare mixins.
     */
  mixins: [WorkingHours],

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  /**
     * Init data for component.
     */
  data: () => ({
    TASK_TYPE,
    TASK_STATUS,
    TASK_APPROVE_STATUS,
    FORMAT_DATE_TIME,
    TASK_STATUS_VALUE,
    TASK_APPROVE_STATUS_VALUE,
    totalWorkHours: 0
  }),

  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
      }
    }
  },

  watch: {
    model(newVal) {
      this.setProject(newVal.project)
    }
  },

  /**
     * Mounted event.
     */
  mounted() {
    if (this.model.id) {
      this.setProject(this.model.project)
    }
  },

  /**
     * List of methods.
     */
  methods: {
    setProject(project) {
      if (project) {
        this.$store.dispatch('addProject', {
          id: project.id,
          name: project.name
        })
      }
    },
    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    approvalCompletedAllow() {
      if (this.model.id) {
        const loggedInUserId = this.$auth.user.id
        const isApprover = loggedInUserId === this.model.approver

        const leaderOfMember = this.model.taskOwners.some(owner => {
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

        return isApprover || leaderOfMember
      }
    },

    isUpdateAllowed() {
      if (this.model.id) {
        const loggedInUserId = this.$auth.user.id
        const isApprover = loggedInUserId === this.model.approver
        const isMember = this.model.taskOwners.some(owner => owner.member_id === loggedInUserId)

        const leaderOfMember = this.model.taskOwners.some(owner => {
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
          (this.model.status === TASK_STATUS_VALUE.new && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.approving || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.in_progress && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.approving || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.re_progress && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.approving || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.resolved && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.approving || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.pending && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.approving || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved))
        )
        const isAllowedByMember = isMember && (
          (this.model.status === TASK_STATUS_VALUE.new && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.in_progress && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.re_progress && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved)) ||
        (this.model.status === TASK_STATUS_VALUE.resolved && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve)) ||
        (this.model.status === TASK_STATUS_VALUE.pending && (this.model.approve_status === TASK_APPROVE_STATUS_VALUE.not_approve || this.model.approve_status === TASK_APPROVE_STATUS_VALUE.unapproved))
        )

        if (isAllowedByApprover && isAllowedByMember) {
          return true
        }

        return isAllowedByApprover || isAllowedByMember
      }
    },

    isDeleteAllowed() {
      if (this.model.id) {
        if (this.model.id) {
          const loggedInUserId = this.$auth.user.id
          const isApprover = loggedInUserId === this.model.approver
          const isMember = this.model.taskOwners.some(owner => owner.member_id === loggedInUserId)

          const leaderOfMember = this.model.taskOwners.some(owner => {
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

          const isAllowed = (isMember || isApprover || leaderOfMember) && (this.model.status === 0 && this.model.approve_status === 0)
          return isAllowed
        }
      }
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetail(id) {
      this.$router.push(`/task/${id}`)
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.task.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('success')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const data = this.model
            data.status = TASK_STATUS_VALUE.done
            data.approve_status = TASK_APPROVE_STATUS_VALUE.approved
            data.member_id = this.model.taskOwners.map(owner => owner.member.id)

            if (this.model.id) {
              await this.$api.task.approveTask(this.model.id, data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
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
    .info-task {
      .ant-col-sm-7 {
          width: 14.3%;
      }
      .ant-col-sm-17 {
          width: 85.7%;
      }
    }
  }
  .btn-update {
    float: right;
  }
  .btn-delete {
    float: right;
    margin-left: 5px;
  }
  </style>
