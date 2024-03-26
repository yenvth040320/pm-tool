<template>
  <div class="detail-task">
    <a-form-model
      ref="form"
      :rules="formRules"
      :label-col="{ sm: 7 }"
      :wrapper-col="{ sm: 17 }"
    >
      <div class="p-2">
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
              <a target="_blank" :href="`/requirement/detail/${model?.requirement?.id}`">
                {{ model?.requirement?.title }}
              </a>
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
              :label="$t('module.task.approve_et_status')"
            >
              <div class="approve-status">
                <div
                  v-for="item in APPROVE_STATUS_ESTIMATE"
                  :key="item.value"
                >
                  <div v-if="item.value === model.requirementEstimate.approve_status">
                    {{ item.label }}
                  </div>
                </div>
                <div v-if="model.requirementEstimate.approve_status === 0 && isHasPermision" class="btn-approve">
                  <a-button
                    html-type="button"
                    type="primary"
                    size="small"
                    @click="gotoApprove(model.requirementEstimate)"
                  >
                    {{ $t('module.requirement.estimate.approve') }}
                  </a-button>
                </div>
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="model.function"
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.function_id')"
            >
              {{ model.function.code }}: {{ model.function.name }} / {{ $t('module.task.version_code') + ': ' + model.version_code }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.mst_life_cycle_id')"
            >
              {{ model.mstLifeCycle.name }}
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
              {{ model.approverUser ? model.approverUser.name + ' (' + model.review_point + ' point)' : '' }}
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.task.support_user_id')"
            >
              {{ model.supportUser ? model.supportUser?.name + ' (' + model?.support_point + ' point)' : '' }}
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
        <div class="p-2">
          <div
            v-for="(item, index) in replies"
            :key="item.id"
            class="reply p-2 mb-3"
            :style="{ 'background-color': getColor(index) }"
          >
            <TaskReplyComponent
              :reply="item"
              :task="model"
              @updateReply="updateReply"
            />
          </div>
          <div class="pb-3">
            <a-upload
              v-model="model.files"
              list-type="picture"
              :file-list="fileTaskList"
              :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: customRemove() }"
              :remove="handleRemove"
            />
          </div>
          <div v-if="(replies.length === 0 && model.status === TASK_STATUS_VALUE.resolved) && isMember()" class="pb-3">
            <!-- add note -->
            <div v-if="!showEditingArea" class="update-note pb-3">
              <a-button type="primary" @click="showUpdateNote">
                {{ $t('module.task.update_note') }}
              </a-button>
            </div>
            <div v-else>
              <a-button type="primary" @click="updateNote">
                {{ $t('common.submit') }}
              </a-button>
              <a-button type="button" @click="cancel">
                {{ $t('common.cancel') }}
              </a-button>
              <div class="pt-3">
                <ckeditor
                  v-model="reply"
                  :editor="editor"
                  :config="editorConfig"
                  @ready="onReady"
                />
              </div>
            </div>
          </div>
          <div v-if="(model.files.length > 0 || model.status === TASK_STATUS_VALUE.resolved) && isMember() && model.status !== TASK_STATUS_VALUE.done" class="pb-3">
            <!-- upload file -->
            <a-upload
              v-model="files"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
              @change="handleChangeFile"
            >
              <a-button> <a-icon type="upload" /> Select File </a-button>
            </a-upload>
            <div v-if="fileList.length > 0" class="pt-3">
              <a-button type="primary" @click="updateTaskFile">
                {{ $t('common.submit') }}
              </a-button>
              <a-button type="button" @click="cancelUpload">
                {{ $t('common.cancel') }}
              </a-button>
            </div>
          </div>

          <!-- checklist container -->
          <div v-if="checkLists.length > 0 || checkListTasks.length > 0" class="section-checklist">
            <div v-if="model.status !== TASK_STATUS_VALUE.resolved && model.status !== TASK_STATUS_VALUE.done">
              <div v-for="(item) in checkLists" :key="item.id" class="check-list mb-3">
                <p class="checklist-name">
                  {{ item.name }}
                </p>
                <a-table
                  :columns="columns"
                  :row-key="record => record.id"
                  :data-source="item.checklist_details"
                  :pagination="false"
                  :scroll="{ x: 900 }"
                  class="checklist-result"
                >
                  <template
                    slot="dev_check_flg"
                    slot-scope="text, record"
                  >
                    <a-select
                      v-if="isMember()"
                      v-model="record.task_checklist_result.dev_check_flg"
                      :placeholder="$t('module.taskChecklistResult.dev_check_flg')"
                    >
                      <a-select-option
                        v-for="(val) in CHECK_LIST_RESULT"
                        :key="val.value"
                        :value="val.value"
                      >
                        {{ val.label }}
                      </a-select-option>
                    </a-select>
                    <div v-else>
                      <div
                        v-for="val in CHECK_LIST_RESULT"
                        :key="val.value"
                      >
                        <div v-if="val.value === record.task_checklist_result?.dev_check_flg">
                          {{ val.label }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <template
                    slot="dev_description"
                    slot-scope="text, record"
                  >
                    <a-input
                      v-if="isMember()"
                      v-model="record.task_checklist_result.dev_description"
                      :placeholder="$t('module.taskChecklistResult.dev_description')"
                    />
                    <span v-else>
                      {{ record.task_checklist_result?.dev_description }}
                    </span>
                  </template>
                  <template
                    slot="approve_check_flg"
                    slot-scope="text, record"
                  >
                    <div
                      v-for="val in CHECK_LIST_RESULT"
                      :key="val.value"
                    >
                      <div v-if="val.value === record.task_checklist_result?.approve_check_flg">
                        {{ val.label }}
                      </div>
                    </div>
                  </template>

                  <template
                    slot="approve_description"
                    slot-scope="text, record"
                  >
                    {{ record.task_checklist_result?.approve_description }}
                  </template>
                </a-table>
              </div>
              <div v-if="isMember()" class="text-center p-3 checklist-note">
                <p>
                  {{ $t('module.taskChecklistResult.note') }}
                </p>
                <a-button
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  @click="temporarilySave()"
                >
                  {{ $t('module.taskChecklistResult.button_save') }}
                </a-button>
              </div>
            </div>

            <div v-else>
              <div v-for="(item) in checkListTasks" :key="item.id" class="check-list mb-3">
                <p class="checklist-name">
                  {{ item.checklist_name }}
                </p>
                <a-table
                  :columns="columns"
                  :row-key="record => record.id"
                  :data-source="item.task_checklist_results"
                  :pagination="false"
                  :scroll="{ x: 900 }"
                  class="checklist-result"
                >
                  <template
                    slot="name"
                    slot-scope="text, record"
                  >
                    {{ record.checklist_detail_name }}
                  </template>
                  <template
                    slot="dev_check_flg"
                    slot-scope="text, record"
                  >
                    <div
                      v-for="val in CHECK_LIST_RESULT"
                      :key="val.value"
                    >
                      <div v-if="val.value === record.dev_check_flg">
                        {{ val.label }}
                      </div>
                    </div>
                  </template>
                  <template
                    slot="dev_description"
                    slot-scope="text, record"
                  >
                    <span>
                      {{ record.dev_description }}
                    </span>
                  </template>
                  <template
                    slot="approve_check_flg"
                    slot-scope="text, record"
                  >
                    <a-select
                      v-if="isLeader() && model.status !== TASK_STATUS_VALUE.done"
                      v-model="record.approve_check_flg"
                      :placeholder="$t('module.taskChecklistResult.approve_check_flg')"
                    >
                      <a-select-option
                        v-for="(val) in CHECK_LIST_RESULT"
                        :key="val.value"
                        :value="val.value"
                      >
                        {{ val.label }}
                      </a-select-option>
                    </a-select>
                    <div v-else>
                      <div
                        v-for="val in CHECK_LIST_RESULT"
                        :key="val.value"
                      >
                        <div v-if="val.value === record.approve_check_flg">
                          {{ val.label }}
                        </div>
                      </div>
                    </div>
                  </template>

                  <template
                    slot="approve_description"
                    slot-scope="text, record"
                  >
                    <a-input
                      v-if="isLeader() && model.status !== TASK_STATUS_VALUE.done"
                      v-model="record.approve_description"
                      :placeholder="$t('module.taskChecklistResult.approve_description')"
                    />
                    <span v-else>
                      {{ record.approve_description }}
                    </span>
                  </template>
                </a-table>
              </div>
              <div v-if="isLeader() && model.status !== TASK_STATUS_VALUE.done" class="text-center p-3 checklist-note">
                <p>
                  {{ $t('module.taskChecklistResult.note') }}
                </p>
                <a-button
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  @click="temporarilyChecklistTask()"
                >
                  {{ $t('module.taskChecklistResult.button_save') }}
                </a-button>
              </div>
            </div>
          </div>

          <!-- form reply -->
          <a-row
            v-if="isAllowUpdateDescription() && (showButtonInprogress() || showButtonReportResolved() || showButtonPending() || (isLeader() && model.status === TASK_STATUS_VALUE.resolved))"
            type="flex"
            :gutter="30"
            class="info-task"
          >
            <a-col
              :span="24"
              :md="24"
            >
              <a-form-model-item
                :label="$t('module.task.note')"
              >
                <div id="reply-task" ref="replyTask">
                  <ckeditor
                    v-model="reply"
                    :editor="editor"
                    :config="editorConfig"
                    @ready="onReady"
                  />
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row
            v-if="isAllowUpdateDescription() && (showButtonInprogress() || showButtonReportResolved() || showButtonPending())"
            type="flex"
            :gutter="30"
            class="info-task"
          >
            <a-col
              :span="24"
              :md="24"
            >
              <a-form-model-item
                :label="$t('module.task.upload_file')"
                prop="files"
                class="files"
              >
                <a-upload
                  v-model="files"
                  :file-list="fileList"
                  :remove="handleRemove"
                  :before-upload="beforeUpload"
                  @change="handleChangeFile"
                >
                  <a-button> <a-icon type="upload" /> Select File </a-button>
                </a-upload>
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
        <!-- History -->
        <div v-if="taskLogs.length > 0">
          <a-divider />
          <h3>
            {{ $t('module.task.history') }}
          </h3>
        </div>
        <div
          v-for="item in taskLogs"
          :key="item.id"
          class="history p-2 mb-3"
        >
          <div class="info-log">
            <div>
              {{ item?.updatedUser?.name }}
            </div>
            <div
              class="time-change"
            >
              {{ item.updated_time }}
            </div>
          </div>
          <div>
            <a-tag :color="getColorAction(item.action)">
              {{ item.action }} {{ TYPE_LOG_INDEX[item.type_log] }}
            </a-tag>
          </div>
          <div v-if="item.type_log === 3">
            <a :href="JSON.parse(item.json_before).file_path ? API_ROOT_URL + JSON.parse(item.json_before).file_path : API_ROOT_URL + JSON.parse(item.json_after).file_path" target="_blank">
              {{ JSON.parse(item.json_before).file_name ? JSON.parse(item.json_before).file_name : JSON.parse(item.json_after).file_name }}
            </a>
          </div>
          <DiffTaskLog v-else :task="item" />
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
import { TASK_TYPE, TASK_STATUS, TASK_TYPE_VALUE, TASK_APPROVE_STATUS, FORMAT_DATE_TIME, TASK_STATUS_VALUE, TASK_APPROVE_STATUS_VALUE, CKEDITOR_TOOLBAR_SETTING, CHECK_LIST_RESULT, CHECK_LIST_RESULT_VALUE, APPROVE_STATUS_ESTIMATE, APPROVE_STATUS_VALUE, API_ROOT_URL, TYPE_LOG_INDEX } from '~/constants'
import WorkingHours from '~/mixins/working-hours'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import TaskReplyComponent from '~/components/templates/task/TaskReplyComponent'
import DiffTaskLog from '~/components/templates/task/DiffTaskLog'

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
    TaskReplyComponent,
    DiffTaskLog
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
    TYPE_LOG_INDEX,
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
    },
    checkLists: [],
    checkListTasks: [],
    CHECK_LIST_RESULT,
    CHECK_LIST_RESULT_VALUE,
    APPROVE_STATUS_ESTIMATE,
    supportMembers: [],
    TASK_TYPE_VALUE,
    editable: false,
    readyEditor: false,
    isHasPermision: false,
    showEditingArea: false,
    APPROVE_STATUS_VALUE,
    files: [],
    fileList: [],
    fileTaskList: [],
    API_ROOT_URL,
    taskLogs: []
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

  watch: {
    model(newVal) {
      this.getListUserSupport()
      this.setProject(newVal.project)
      this.getListFile()
    },

    replies(newVal) {
      this.scrollToReplyTask()
    },

    checkLists(newVal) {
      this.scrollToReplyTask()
    },

    checkListTasks(newVal) {
      this.scrollToReplyTask()
    },

    taskLogs(newVal) {
      this.scrollToReplyTask()
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getTaskReplies()
    this.getTaskLog()
    this.checkPermissionApprove()
    if (this.model.id) {
      this.getListUserSupport()
      this.getCheckList()
      this.setProject(this.model.project)
      this.getListFile()
    }
  },

  /**
   * List of methods.
   */
  methods: {
    scrollToReplyTask() {
      const replyTaskElement = this.$refs.replyTask

      // Check if the element exists
      if (replyTaskElement) {
        this.$nextTick(() => {
          replyTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
      }
    },

    setProject(project) {
      if (project) {
        this.$store.dispatch('addProject', {
          id: project.id,
          name: project.name
        })
      }
    },

    getListFile() {
      if (this.model.id) {
        this.fileTaskList = []
        this.model.files.forEach(item => {
          this.fileTaskList.push({
            uid: item.id,
            url: API_ROOT_URL + item.file_path,
            name: item.file_name
          })
        })
      }
    },

    async checkPermissionApprove() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        const { data: { result: { data } } } = await this.$api.user.checkUser({ params })
        this.isHasPermision = data
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
      try {
        if (this.model.task_type === TASK_TYPE_VALUE.project) {
          const memberIds = this.model.taskOwners.map(owner => owner.member_id)
          if (memberIds.length > 0) {
            const params = {
              project_id: this.$store.state.project.id,
              member_id: memberIds
            }
            const { data: { result: { data } } } = await this.$api.task.getSupportMember({ params })
            this.supportMembers = data
          }
        }
      } catch (_) {
        console.log(_)
      }
    },
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
     * Get list task log
     */
    async getTaskLog() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          task_id: this.model.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.taskLog.list({ params })
        this.taskLogs = data
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
     * get color of the reply message
     */
    getColor(index) {
      const colors = ['#d7f7dd', '#f5d0d7', '#f5f7d7', '#d2dff7', '#ecc8fa']
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
     * show input update note
     */
    showUpdateNote() {
      if (this.reply === null || this.reply === undefined) {
        this.reply = ''
      }
      this.showEditingArea = true
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
     * update description of task
     */
    async updateNote() {
      try {
        const data = {
          reply: this.reply
        }
        if (this.model.id) {
          await this.$api.task.updateTask(this.model.id, data)
        }
        this.showEditingArea = false
        this.getTaskReplies()
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
      if (statusTask !== TASK_STATUS_VALUE.pending) {
        if (this.model.description === '' || this.model.description === null) {
          this.$notification.error({
            message: this.$t('module.task.message_required_description')
          })
          return
        }

        if (statusTask === TASK_STATUS_VALUE.resolved) {
          if (this.checkLists.length > 0) {
            const allChecklistResultsValid = this.checkLists.every(item => {
              return item.checklist_details.every(detail => {
                const result = detail.task_checklist_result
                return result &&
            result.dev_check_flg !== undefined &&
            result.dev_check_flg !== null &&
            result.dev_check_flg !== CHECK_LIST_RESULT_VALUE.fail
              })
            })

            if (!allChecklistResultsValid) {
              this.$notification.error({
                message: this.$t('module.taskChecklistResult.message_error')
              })
              return
            }
          }
          if (this.model.approver === null && this.model.support_user_id === null && this.supportMembers.length > 0) {
            this.$notification.error({
              message: this.$t('module.task.required_message')
            })
            return
          } else if (this.model.approver === null && (this.model.support_user_id !== null || this.supportMembers.length === 0)) {
            this.$notification.error({
              message: this.$t('module.task.approver_required')
            })
            return
          } else if (this.model.approver !== null && this.model.support_user_id === null && this.supportMembers.length > 0) {
            this.$notification.error({
              message: this.$t('module.task.supporter_required')
            })
            return
          }
        }
      }
      if (this.checkLists.length > 0) {
        if (this.areChecklistResultsValid(this.checkLists, 'dev_check_flg', 'dev_description')) {
          this.$notification.error({
            message: this.$t('module.taskChecklistResult.dev_description_required')
          })
          return
        }
      }

      try {
        const data = {
          status: statusTask,
          member_id: this.model.taskOwners.map(owner => owner.member.id),
          reply: this.reply,
          checklists: this.checkLists
        }
        const form = new FormData()
        form.append('status', data.status)
        form.append('reply', data.reply)
        data.member_id.forEach(memberId => {
          form.append('member_id[]', memberId)
        })

        if (this.checkLists.length > 0) {
          if (this.checkDataCheckList(this.checkLists, 'dev_check_flg', 'dev_description')) {
            data.checklists.forEach((checklist, index) => {
              // Thêm thông tin của checklist
              form.append(`checklists[${index}][id]`, checklist.id)
              form.append(`checklists[${index}][project_id]`, checklist.project_id)
              form.append(`checklists[${index}][mst_life_cycle_id]`, checklist.mst_life_cycle_id)
              form.append(`checklists[${index}][name]`, checklist.name)
              form.append(`checklists[${index}][use_flg]`, checklist.use_flg)
              form.append(`checklists[${index}][created_at]`, checklist.created_at)
              form.append(`checklists[${index}][updated_at]`, checklist.updated_at)

              // Thêm thông tin của checklist_details
              checklist.checklist_details.forEach((detail, detailIndex) => {
                form.append(`checklists[${index}][checklist_details][${detailIndex}][id]`, detail.id)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][project_id]`, detail.project_id)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][checklist_id]`, detail.checklist_id)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][name]`, detail.name)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][use_flg]`, detail.use_flg)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][created_at]`, detail.created_at)
                form.append(`checklists[${index}][checklist_details][${detailIndex}][updated_at]`, detail.updated_at)

                // Thêm thông tin của task_checklist_result
                if (detail.task_checklist_result) {
                  if (detail.task_checklist_result.id) {
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][id]`, detail.task_checklist_result.id)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][project_id]`, detail.task_checklist_result.project_id)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][task_id]`, detail.task_checklist_result.task_id)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][task_checklist_id]`, detail.task_checklist_result.task_checklist_id)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][checklist_detail_id]`, detail.task_checklist_result.checklist_detail_id)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][checklist_detail_name]`, detail.task_checklist_result.checklist_detail_name)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][dev_check_flg]`, detail.task_checklist_result.dev_check_flg)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][dev_description]`, detail.task_checklist_result.dev_description)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][approve_check_flg]`, detail.task_checklist_result.approve_check_flg)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][approve_description]`, detail.task_checklist_result.approve_description)
                  } else {
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][dev_check_flg]`, detail.task_checklist_result.dev_check_flg)
                    form.append(`checklists[${index}][checklist_details][${detailIndex}][task_checklist_result][dev_description]`, detail.task_checklist_result.dev_description)
                  }
                }
              })
            })
          }
        }
        this.files.forEach(file => {
          if (file.originFileObj) {
            form.append('newFile[]', file.originFileObj)
          } else {
            form.append('oldFile[]', JSON.stringify(file))
          }
        })
        if (this.model.id) {
          await this.$api.task.updateTask(this.model.id, form, {
            headers: {
              'Content-type': 'multipart/form-data'
            }
          })
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.reply = ''
        this.getTaskReplies()
        if (statusTask === TASK_STATUS_VALUE.resolved) {
          this.getCheckListTask()
        } else {
          this.getCheckListProject()
        }
        this.fileList = []
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    checkDataCheckList(checkLists, resultKey, descriptionKey) {
      return checkLists.length > 0 && checkLists.every(item => {
        if (item.checklist_details) {
          const details = item.checklist_details
          return details && details.every(detail => {
            const result = detail.task_checklist_result
            return result[resultKey] !== undefined
          })
        } else {
          return item.task_checklist_results.every(result => {
            return result[resultKey] !== undefined
          })
        }
      })
    },

    async updateTaskFile() {
      try {
        const form = new FormData()
        this.fileList.forEach(file => {
          if (file.originFileObj) {
            form.append('newFile[]', file.originFileObj)
          } else {
            form.append('oldFile[]', JSON.stringify(file))
          }
        })
        if (this.model.id) {
          await this.$api.task.createTaskFile(this.model.id, form, {
            headers: {
              'Content-type': 'multipart/form-data'
            }
          })
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.fileList = []
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list checklist of project
     */
    getCheckList() {
      if (this.model.status === TASK_STATUS_VALUE.resolved || this.model.status === TASK_STATUS_VALUE.done) {
        this.getCheckListTask()
      } else {
        this.getCheckListProject()
      }
    },

    async getCheckListProject() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          mst_life_cycle_id: this.model.mst_life_cycle_id
        }
        const { data: { result: { data } } } = await this.$api.task.listCheckList({ params })
        if (data.length > 0) {
          this.checkLists = data.map(item => {
            if (item.checklist_details) {
              item.checklist_details = item.checklist_details.map(detail => {
                const result = detail.task_checklist_result.find(resultItem => resultItem.task_id === this.model.id)
                if (!result) {
                  detail.task_checklist_result = {
                    dev_check_flg: undefined,
                    dev_description: null
                  }
                } else {
                  detail.task_checklist_result = result
                }
                return detail
              })
            }
            return item
          })
          this.checkLists = this.checkLists.filter(item => item.checklist_details.length > 0)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getCheckListTask() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          task_id: this.model.id
        }
        const { data: { result: { data } } } = await this.$api.task.listCheckListTask({ params })
        this.checkListTasks = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    areChecklistResultsValid(checkLists, resultKey, descriptionKey) {
      return checkLists.length > 0 && checkLists.every(item => {
        if (item.checklist_details) {
          const details = item.checklist_details
          return details && details.every(detail => {
            const result = detail.task_checklist_result
            return result[resultKey] === CHECK_LIST_RESULT_VALUE.fail && (result[descriptionKey] === null || result[descriptionKey] === '')
          })
        } else {
          return item.task_checklist_results.every(result => {
            return result[resultKey] === CHECK_LIST_RESULT_VALUE.fail && (result[descriptionKey] === null || result[descriptionKey] === '')
          })
        }
      })
    },

    /**
     * temporarily checklist
     */
    async temporarilySave() {
      if (this.areChecklistResultsValid(this.checkLists, 'dev_check_flg', 'dev_description')) {
        this.$notification.error({
          message: this.$t('module.taskChecklistResult.dev_description_required')
        })
        return
      }
      try {
        const data = {
          task_id: this.model.id,
          checklists: this.checkLists
        }
        await this.$api.task.temporarilyChecklist(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getCheckList()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * temporarily checklist task
     */
    async temporarilyChecklistTask() {
      if (this.areChecklistResultsValid(this.checkListTasks, 'approve_check_flg', 'approve_description')) {
        this.$notification.error({
          message: this.$t('module.taskChecklistResult.dev_description_required')
        })
        return
      }

      try {
        const data = this.checkListTasks
        await this.$api.task.temporarilyChecklistTask(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getCheckListTask()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    beforeUpload(file) {
      const isVideo = file.type.startsWith('video/')
      const maxFileSize = 50000000
      if (isVideo) {
        return new Promise((resolve, reject) => {
          const video = document.createElement('video')
          video.preload = 'metadata'
          video.src = URL.createObjectURL(file)
          this.$nextTick(() => {
            video.onloadedmetadata = () => {
              if (file.size <= maxFileSize) {
                resolve(file)
              } else {
                this.$notification.error({
                  message: this.$t('module.bug.file.file_length_err')
                })
                reject(file)
              }
            }
          })
        })
      } else if (file.size <= maxFileSize) {
        return file
      } else {
        this.$notification.error({
          message: this.$t('module.bug.file.file_length_err')
        })
        return new Promise((resolve, reject) => {
          reject(file)
        })
      }
    },

    handleRemove(file) {
      if (file.originFileObj) {
        return true
      } else {
        this.$confirm({
          title: this.$t('module.task.file.delete_warning'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteTaskFile(file.uid)
        })
        return false
      }
    },

    customRemove(file) {
      return this.model.status !== TASK_STATUS_VALUE.done
    },

    async deleteTaskFile(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.taskFile.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Change File
     */
    handleChangeFile({ fileList }) {
      this.fileList = fileList
      this.files = fileList
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

      if (this.checkListTasks.length > 0) {
        const allChecklistResultsValid = this.checkListTasks.every(item => {
          return item.task_checklist_results.every(detail => {
            return detail &&
            detail.approve_check_flg !== undefined &&
            detail.approve_check_flg !== null &&
            detail.approve_check_flg !== CHECK_LIST_RESULT_VALUE.fail
          })
        })

        if (!allChecklistResultsValid) {
          this.$notification.error({
            message: this.$t('module.taskChecklistResult.message_error')
          })
          return
        }
      }

      if (this.checkListTasks.length > 0) {
        if (this.areChecklistResultsValid(this.checkListTasks, 'approve_check_flg', 'approve_description')) {
          this.$notification.error({
            message: this.$t('module.taskChecklistResult.dev_description_required')
          })
          return
        }
      }

      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const data = this.model
            data.status = TASK_STATUS_VALUE.done
            data.approve_status = TASK_APPROVE_STATUS_VALUE.approved
            data.member_id = this.model.taskOwners.map(owner => owner.member.id)
            data.reply = this.reply
            data.checkListTasks = this.checkListTasks

            if (this.model.id) {
              await this.$api.task.approveTask(this.model.id, data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.getCheckListTask()
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
      if (this.checkListTasks.length > 0) {
        if (this.areChecklistResultsValid(this.checkListTasks, 'approve_check_flg', 'approve_description')) {
          this.$notification.error({
            message: this.$t('module.taskChecklistResult.dev_description_required')
          })
          return
        }
      }

      try {
        const data = this.model
        data.status = TASK_STATUS_VALUE.re_progress
        data.approve_status = TASK_APPROVE_STATUS_VALUE.unapproved
        data.reply = this.reply
        data.checkListTasks = this.checkListTasks

        if (this.model.id) {
          await this.$api.task.unApproveTask(this.model.id, data)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getCheckListTask()
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
      this.showEditingArea = false
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
     * Approve estimate
     */
    async gotoApprove(estimate) {
      try {
        if (estimate.id) {
          const data = { ...estimate }
          data.approve_status = APPROVE_STATUS_VALUE.approved
          data.approve_user_id = this.$auth.user.id
          await this.$api.requirementEstimate.update(estimate.id, data)
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
     * show button in progress
     */
    showButtonInprogress() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.pending) && this.model.requirementEstimate.approve_status === 1
        return showButton
      }
    },

    /**
     * show button report resolved
     */
    showButtonReportResolved() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.in_progress || this.model.status === TASK_STATUS_VALUE.re_progress) && this.model.requirementEstimate.approve_status === 1
        return showButton
      }
    },

    /**
     * show button pending
     */
    showButtonPending() {
      if (this.model.id) {
        const isMember = this.isMember()

        const showButton = isMember && (this.model.status === TASK_STATUS_VALUE.new || this.model.status === TASK_STATUS_VALUE.in_progress || this.model.status === TASK_STATUS_VALUE.re_progress) && this.model.requirementEstimate.approve_status === 1
        return showButton
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

    gotoListTask() {
      this.$router.push('/task')
    },

    /**
     * Trigger when user update reply
     */
    updateReply() {
      this.getTaskReplies()
    },

    cancelUpload() {
      this.fileList = []
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

    getColorAction(action) {
      if (action === 'Thêm mới') {
        return '#87d068'
      } else if (action === 'Cập nhật') {
        return '#2db7f5'
      } else if (action === 'Xóa') {
        return '#f50'
      } else {
        return '#000000'
      }
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
  .jsondiffpatch-deleted .jsondiffpatch-deleted pre, .jsondiffpatch-modified .jsondiffpatch-left-value pre, .jsondiffpatch-textdiff-deleted {
    text-decoration: unset;
  }
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
  min-height: 200px;
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
.checklist-name {
  font-weight: 700;
  font-size: 16px;
}
.checklist-note {
  font-style: italic;
}
.approve-status {
  display: flex;
  .btn-approve {
    margin-left: 5px;
  }
}

.info-log {
    display: flex;
  }
  .time-change {
    margin-left: 5px;
    color: dodgerblue;
    font-style: italic;
  }
:deep() {
  .ant-form-item-control {
    zoom: 1;
    line-height: 30px;
    position: relative;
  }
  .ant-form-item:not(.default) {
    margin-bottom: 0px;
    position: relative;
  }
  .ant-card-body {
    zoom: 1;
    padding: 0px;
  }
}
</style>
