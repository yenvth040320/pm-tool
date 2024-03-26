<template>
  <div class="detail-task">
    <a-form-model
      ref="form"
      :rules="formRules"
      :label-col="{ sm: 7 }"
      :wrapper-col="{ sm: 17 }"
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
              :label="$t('module.task.status')"
            >
              <div
                v-for="item in TASK_STATUS"
                :key="item.value"
              >
                <div v-if="item.value === model.status">
                  <a-tag :color="getStatusColorClass()">
                    {{ item.label }}
                  </a-tag>
                </div>
              </div>
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
              :label="$t('module.task.et_point')"
            >
              {{ model.et_point }}
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
              {{ model?.approverUser?.name + ' (' + model.review_point + '  point)' }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.support_user_id')"
            >
              {{ model.supportUser ? model.supportUser?.name + ' (' + model?.support_point + '  point)' : null }}
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
              <div v-if="model.status !== TASK_STATUS_VALUE.done && isAllowUpdateDescription()">
                <div v-if="!showInput" class="update-description">
                  <a-button type="primary" @click="showUpdateInput">
                    {{ $t('module.task.update_description') }}
                  </a-button>
                </div>
                <div v-else>
                  <a-button type="primary" @click="updateDescription">
                    {{ $t('common.submit') }}
                  </a-button>
                  <a-button type="button" @click="cancel">
                    {{ $t('common.cancel') }}
                  </a-button>
                </div>

                <p v-if="!showInput" v-html="model.description" />
                <div v-else>
                  <ckeditor
                    v-model="model.description"
                    :editor="editor"
                    :config="editorConfig"
                    @ready="onReady"
                  />
                </div>
              </div>
              <div v-else>
                <p v-html="model.description" />
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          v-if="isDeleteAllowed() && model.status !== TASK_STATUS_VALUE.done"
          html-type="button"
          type="default"
          class="min-w-100 btn-delete"
          @click="confirmToDelete(model.id)"
        >
          {{ $t('module.task.delete') }}
        </a-button>
        <a-button
          v-if="isUpdateAllowed() && model.status !== TASK_STATUS_VALUE.done"
          html-type="button"
          type="default"
          class="min-w-100 btn-update"
          @click="gotoDetail(model.id)"
        >
          {{ $t('module.task.update') }}
        </a-button>
      </div>
    </a-form-model>
    <a-divider />

    <div>
      <a-form-model
        ref="form"
        :model="this"
        :rules="formRules"
        :label-col="{ sm: 7 }"
        :wrapper-col="{ sm: 17 }"
        @submit.prevent="handleSubmit"
      >
        <div class="p-4">
          <div
            v-for="(item, index) in replies"
            :key="item.id"
            class="reply p-4 mb-3"
            :style="{ 'background-color': getColor(index) }"
          >
            <div class="replier-name">
              <p>{{ item.replier.name }}</p>
              <p>{{ item.reply_datetime ? getDateTime(item.reply_datetime) : '' }}</p>
            </div>
            <div class="content-reply ck ck-content">
              {{ item.description }}
            </div>
          </div>

          <a-row
            v-if="isAllowUpdateDescription() && (showButtonInprogress() || showButtonReportResolved() || showButtonPending() || (isLeader() && model.status === TASK_STATUS_VALUE.resolved))"
            type="flex"
            :gutter="30"
          >
            <a-col
              :span="24"
              :md="24"
            >
              <a-form-model-item
                :label="$t('module.task.note')"
              >
                <a-textarea
                  v-model="reply"
                  :placeholder="$t('module.task.note')"
                  :rows="5"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="text-center p-3">
          <a-button
            v-if="isLeader() && model.status === TASK_STATUS_VALUE.resolved"
            html-type="submit"
            type="primary"
            class="min-w-100"
          >
            {{ $t('module.task.approval_completed') }}
          </a-button>
          <a-button
            v-if="isLeader() && model.status === TASK_STATUS_VALUE.resolved"
            html-type="button"
            type="default"
            class="min-w-100"
            @click="approvalNotCompleted(model.id)"
          >
            {{ $t('module.task.approval_not_completed') }}
          </a-button>

          <a-button
            v-if="showButtonInprogress()"
            html-type="button"
            type="default"
            class="min-w-100"
            @click="updateStatus(TASK_STATUS_VALUE.in_progress)"
          >
            {{ $t('module.task.button_inprogress') }}
          </a-button>

          <a-button
            v-if="showButtonReportResolved()"
            html-type="button"
            type="default"
            class="min-w-100"
            @click="updateStatus(TASK_STATUS_VALUE.resolved)"
          >
            {{ $t('module.task.button_report_resolved') }}
          </a-button>

          <a-button
            v-if="showButtonPending()"
            html-type="button"
            type="default"
            class="min-w-100"
            @click="updateStatus(TASK_STATUS_VALUE.pending)"
          >
            {{ $t('module.task.button_pending') }}
          </a-button>
        </div>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataTable from '~/mixins/data-table'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import { TASK_TYPE, TASK_STATUS, TASK_APPROVE_STATUS, FORMAT_DATE_TIME, TASK_STATUS_VALUE, TASK_APPROVE_STATUS_VALUE, CKEDITOR_TOOLBAR_SETTING } from '~/constants'
import WorkingHours from '~/mixins/working-hours'
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
  },
  /**
     * Declare mixins.
     */
  mixins: [DataTable, WorkingHours],

  /**
     * Fetch event.
     */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
         * Call api and processing data.
         * Note: check API response format ResponseServiceProvider.php.
         */
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

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
    CKEDITOR_TOOLBAR_SETTING,
    totalWorkHours: 0,
    showInput: false,
    updatedDescription: '',
    editor: DecoupledEditor,
    reply: '',
    replies: [],
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    }
  }),

  /**
         * Computed event.
         */
  computed: {
    formRules() {
      return {
      }
    },

    header() {
      return [
        {
          title: this.$t('module.taskChecklistResult.checklist_detail_id'),
          scopedSlots: { customRender: 'name' },
          dataIndex: 'name'
        },
        {
          title: this.$t('module.taskChecklistResult.dev_check_flg'),
          dataIndex: 'dev_check_flg',
          scopedSlots: { customRender: 'dev_check_flg' },
          width: 200
        },
        {
          title: this.$t('module.taskChecklistResult.dev_description'),
          dataIndex: 'dev_description',
          scopedSlots: { customRender: 'dev_description' }

        },
        {
          title: this.$t('module.taskChecklistResult.approve_check_flg'),
          dataIndex: 'approve_check_flg',
          scopedSlots: { customRender: 'approve_check_flg' },
          width: 200
        },
        {
          title: this.$t('module.taskChecklistResult.approve_description'),
          dataIndex: 'approve_description',
          scopedSlots: { customRender: 'approve_description' }
        }
      ]
    }
  },

  /**
         * Mounted event.
         */
  mounted() {
    this.getTaskReplies()
  },

  /**
     * List of methods.
     */
  methods: {
    /**
       * Get list task reply
       */
    async getTaskReplies() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          task_id: this.model.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.taskReply.list({ params })
        this.replies = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
       * get color of the reply message
       */
    getColor(index) {
      const colors = ['#f5d0d7', '#d7f7dd', '#f5f7d7', '#d2dff7', '#ecc8fa']
      return colors[index % colors.length]
    },

    /**
       * show input update description
       */
    showUpdateInput() {
      if (this.model.description === null || this.model.description === undefined) {
        this.model.description = ''
      }
      this.showInput = true
    },

    /**
       * update description of task
       */
    async updateDescription() {
      try {
        const data = {
          description: this.model.description
        }
        if (this.model.id) {
          await this.$api.task.updateTask(this.model.id, data)
        }
        this.showInput = false
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
       * member update status of task
       */
    async updateStatus(statusTask) {
      if (this.model.description === '' || this.model.description === null) {
        this.$notification.error({
          message: this.$t('module.task.message_required_description')
        })
        return
      }

      try {
        const data = {
          status: statusTask,
          member_id: this.model.taskOwners.map(owner => owner.member.id),
          reply: this.reply
        }
        if (this.model.id) {
          await this.$api.task.updateTask(this.model.id, data)
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.reply = ''
        this.getTaskReplies()
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
       * Validate before submit
       */
    handleSubmit() {
      if (this.model.description === '' || this.model.description === null) {
        this.$notification.error({
          message: this.$t('module.task.message_required_description')
        })
        return
      }

      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const data = this.model
            data.status = TASK_STATUS_VALUE.done
            data.approve_status = TASK_APPROVE_STATUS_VALUE.approved
            data.member_id = this.model.taskOwners.map(owner => owner.member.id)
            data.reply = this.reply

            if (this.model.id) {
              await this.$api.task.approveTask(this.model.id, data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.getTaskReplies()
            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          }
        }
      })
    },

    /**
       * Validate before submit
       */
    async approvalNotCompleted(id) {
      try {
        const data = this.model
        data.status = TASK_STATUS_VALUE.re_progress
        data.approve_status = TASK_APPROVE_STATUS_VALUE.unapproved
        data.reply = this.reply

        if (this.model.id) {
          await this.$api.task.unApproveTask(this.model.id, data)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getTaskReplies()
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
       * hide ckeditor
       */
    cancel() {
      this.showInput = false
    },

    /**
       * Format date time
       */
    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    hasPermission(user, model) {
      if (!model.id) {
        return false
      }

      const loggedInUserId = user.id
      const isApprover = loggedInUserId === model.approver
      const isMember = model.taskOwners.some(owner => owner.member_id === loggedInUserId)

      const leaderOfMember = model.taskOwners.some(owner => {
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

      return isApprover || isMember || leaderOfMember
    },

    /**
       * allow update
       */
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

    isAllowUpdateDescription() {
      return this.hasPermission(this.$auth.user, this.model)
    },

    /**
       * allow delete
       */
    isDeleteAllowed() {
      if (this.model.id) {
        const hasPermission = this.hasPermission(this.$auth.user, this.model)
        let isAllowed = false
        if (this.model.requirementEstimate) {
          isAllowed = hasPermission && (this.model.status === 0 && this.model.approve_status === 0 && this.model.requirementEstimate.approve_status === 0)
        } else {
          isAllowed = hasPermission && (this.model.status === 0 && this.model.approve_status === 0)
        }
        return isAllowed
      }
    },

    isMember() {
      if (this.model.id) {
        const loggedInUserId = this.$auth.user.id
        const isMember = this.model.taskOwners.some(owner => owner.member_id === loggedInUserId)

        return isMember
      }
    },

    /**
       * show button approve
       */
    isLeader() {
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

    /**
       * show button in progress
       */
    showButtonInprogress() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.pending)
        return showButton
      }
    },

    /**
       * show button report resolved
       */
    showButtonReportResolved() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.in_progress || this.model.status === TASK_STATUS_VALUE.re_progress)
        return showButton
      }
    },

    /**
       * show button pending
       */
    showButtonPending() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.in_progress || this.model.status === TASK_STATUS_VALUE.re_progress)
        return showButton
      }
    },

    getStatusColorClass() {
      const isInProgress = this.model.status === TASK_STATUS_VALUE.in_progress
      const isAfterCurrentTime = moment(this.model.end_datetime).startOf('day').isBefore(moment().startOf('day'))
      if (isInProgress) {
        if (isAfterCurrentTime) {
          return 'red'
        } else {
          return 'gold'
        }
      } else if (this.model.status === TASK_STATUS_VALUE.done) {
        return '#1890ff'
      }

      return ''
    },

    /**
       * Go to detail
       *
       * @param {Number} id
       */
    gotoDetail(id) {
      this.$router.push(`/task/${id}`)
    },

    gotoListTask() {
      this.$router.push('/task')
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
        this.gotoListTask()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
    .ant-divider {
        height: 2px;
        top: 0.94em;
        background: #000000;
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
  .ck-editor__editable {
    min-height: 400px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
  .update-description {
    float: right;
  }
  .replier-name {
    width: 29.16666667%;
    display: block;
  }
  .content-reply {
    width: 70.83333333%;
  }
  .ant-tag  {
    font-size: 14px;
  }
  .reply {
    display: flex;
  }
  .checklist-name {
    font-weight: 700;
    font-size: 16px;
  }
  .checklist-note {
    font-style: italic;
  }
  </style>
