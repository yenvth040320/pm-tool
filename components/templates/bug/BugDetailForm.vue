<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :label-col="{ sm: 4 }"
      :wrapper-col="{ sm: 20 }"
    >
      <a-spin :spinning="loading">
        <a-card class="mb-4 info-card">
          <template slot="title">
            {{ $t('module.bug') + '#' + id }}
          </template>
          <template slot="extra">
            <a-icon v-if="model.category === BUG_CATEGORY_VALUE.customer" type="edit" @click="gotoDetailBugCustomer(id)" />
            <a-icon v-else type="edit" @click="gotoDetailBugInternal(id)" />
            {{ $t('common.edit') }}
          </template>
          <div>
            <a-row
              type="flex"
              :gutter="30"
            >
              <a-col
                :span="24"
                :md="24"
              >
                <h3>{{ model.title }}</h3>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.requirement_id')"
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
                  :label="$t('module.bug.function_id')"
                  prop="status"
                >
                  <span>
                    {{ model?.function?.code }}: {{ model?.function?.name }}/version: {{ model?.version_code }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.test_session_id')"
                  prop="test_session_id"
                >
                  <span v-if="model.functionResult">
                    <a :href="`/function/${model.function_id}/version/${model.version_code}/function_result/${model.function_result_id}`" target="_blank" style="color:#0077c0;">
                      {{ model?.functionResult?.test_session?.name }}
                    </a>
                    <a-icon type="edit" @click="updateTestSession(model)" />
                  </span>

                  <span v-else class="link" @click="updateTestSession(model)">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                v-if="model.functionResult"
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.testcase_matrix_id')"
                  prop="testcase_matrix_id"
                >
                  <a v-if="model.testcaseMatrix" :href="`/function/${model.function_id}/version/${model.version_code}/function_result/${model.function_result_id}?testcase_matrix_id=${model.testcase_matrix_id}#tab_update`" target="_blank" style="color:#0077c0;">
                    {{ model?.testcaseMatrix?.name }}
                  </a>
                  <a v-else class="link" :href="`/function/${model.function_id}/version/${model.version_code}/function_result/${model.function_result_id}?bug_id=${model.id}`" target="_blank" style="color:#0077c0;">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </a>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.mst_bug_type_id')"
                  prop="status"
                >
                  <span v-if="model.mst_bug_type_id !== 0 && model.mstBugType !== null" class="link" @click="updateMstBugType(model)">
                    {{ model?.mstBugType?.name }}
                  </span>
                  <span v-else class="link" @click="updateMstBugType(model)">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.status')"
                  prop="status"
                >
                  <span class="link" @click="updateStatus(model)">
                    {{ BUG_STATUS_INDEX[model.status] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.priority')"
                  prop="priority"
                >
                  <span class="link" @click="updatePriority(model)">
                    {{ BUG_PRIORITY_INDEX[model.priority] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.start_date')"
                  prop="start_date"
                >
                  <span v-if="model.start_date !== null" class="link" @click="updateStartDate(model)">
                    {{ model.start_date }}
                  </span>
                  <span v-else class="link" @click="updateStartDate(model)">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.assignee')"
                  prop="assignee"
                >
                  <span class="link" @click="updateAssignee(model)">
                    {{ model.assigneeUser.name }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.end_date')"
                  prop="end_date"
                >
                  <span v-if="model.end_date !== null" class="link" @click="updateEndDate(model)">
                    {{ model.end_date }}
                  </span>
                  <span v-else class="link" @click="updateEndDate(model)">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.done_percent')"
                  prop="done_percent"
                >
                  <span class="link" @click="updateDonePercent(model)">
                    {{ BUG_DONE_PERCENT_INDEX[model.done_percent] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.who_bug')"
                  prop="who_bug"
                >
                  <span
                    v-for="(user, index) in model.users"
                    :key="user.id"
                  >
                    <span class="link" @click="updateUsers(model)">
                      {{ user.name }}
                    </span>
                    <span v-if="index !== model.users.length - 1">, </span>
                  </span>
                  <span v-if="model.users.length === 0" @click="updateUsers(model)">
                    <a-tag color="blue" class="link">
                      {{ $t('common.update') }}
                    </a-tag>
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.create_user_id')"
                  prop="create_user_id"
                >
                  <span>
                    {{ model?.createUser?.name }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  prop="files"
                  class="files"
                  :label-col="{ sm: 4 }"
                  :wrapper-col="{ sm: 20 }"
                  :label="$t('module.bug.files')"
                >
                  <a-upload
                    v-model="model.files"
                    list-type="picture-card"
                    :file-list="fileList"
                    :show-upload-list="{ showPreviewIcon: true, showRemoveIcon: false }"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.category')"
                  prop="category"
                >
                  <span>
                    {{ BUG_CATEGORY_INDEX[model.category] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-divider />
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.bug.condition')"
                  prop="condition"
                  :wrapper-col="{ sm: 24 }"
                >
                  <div v-html="model.condition" />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.bug.actual_result')"
                  prop="actual_result"
                  :wrapper-col="{ sm: 24 }"
                >
                  <div v-html="model.actual_result" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
        <div class="task-bug">
          <a-card class="no-border task_main">
            <template slot="extra">
              <a-button
                html-type="button"
                type="primary"
                title="Tạo mới"
                @click="openAddTaskModal()"
              >
                <font-awesome-icon
                  icon="plus-circle"
                  class="mr-1"
                />
                {{ $t('module.bug.create_fix_bug_task') }}
              </a-button>
            </template>
            <table-fix-bug-task
              v-if="fixBugTasks.length > 0"
              ref="addFixBugTaskTable"
              :members="members"
              :fix-bug-tasks="fixBugTasks"
            />
          </a-card>
        </div>
        <div class="file-note">
          <a-row
            type="flex"
            :gutter="30"
          >
            <a-col
              :span="24"
              :md="24"
            >
              <a-form-model-item
                :label="$t('module.bugNote')"
                prop="note"
                :wrapper-col="{ sm: 24 }"
              >
                <ul class="bug-note" style="list-style-type:disc">
                  <li
                    v-for="note in model.bugNotes"
                    :key="note.id"
                  >
                    <BugNoteEdit
                      :note="note"
                      :members="members"
                      @updateNote="updateNote"
                    />
                  </li>
                </ul>
                <div>
                  <ckeditor
                    v-model="model.note"
                    :editor="editor"
                    :config="editorConfig"
                    @ready="onReady"
                  />
                </div>
              </a-form-model-item>
              <div class="text-center p-3">
                <a-button
                  html-type="button"
                  type="primary"
                  class="min-w-100"
                  @click="addBugNote"
                >
                  <a-icon type="plus" />
                  {{ $t('module.bugNote') }}
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <ModalUpdateStatus ref="updateStatusBug" @save="save" />
        <ModalUpdatePriority ref="updatePriorityBug" @save="save" />
        <ModalUpdateDonePercent ref="updateDonePercentBug" @save="save" />
        <ModalUpdateAssignee ref="updateAssigneeBug" :members="members" @save="save" />
        <ModalUpdateUsers ref="updateUsersBug" :members="members" @save="save" />
        <ModalUpdateStartDate ref="updateStartDateBug" @save="save" />
        <ModalUpdateEndDate ref="updateEndDateBug" @save="save" />
        <ModalUpdateTestSession ref="updateTestSessionBug" :test-sessions="testSessions" @save="save" />
        <ModalUpdateMstBugType ref="updateMstBugType" :mst-bug-types="mstBugTypes" @save="save" />
        <a-modal
          ref="detail"
          :visible="visible"
          :width="900"
          :footer="null"
          @cancel="visible = false"
        >
          <template slot="title">
            <font-awesome-icon :icon="`${currentTaskId ? 'pencil-alt' : 'plus-circle'}`" />
            {{ currentTaskId ? $t('common.edit') : $t('common.create') }} {{ $t('module.task') }}
          </template>

          <a-spin :spinning="loading">
            <modal-add-fix-bug-task
              :id="currentTaskId"
              :members="members"
              :current-bug="model"
              :fix-bug-mst-life-cycle="fixBugMstLifeCycle"
              @save="saveTask"
              @cancel="visible = false"
            />
          </a-spin>
        </a-modal>
      </a-spin>
    </a-form-model>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataForm from '~/mixins/data-form'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import BugNoteEdit from '~/components/templates/bug/BugNoteEdit'
import ModalUpdateStatus from '~/components/templates/bug/ModalUpdateStatus'
import ModalUpdatePriority from '~/components/templates/bug/ModalUpdatePriority'
import ModalUpdateDonePercent from '~/components/templates/bug/ModalUpdateDonePercent'
import ModalUpdateAssignee from '~/components/templates/bug/ModalUpdateAssignee'
import ModalUpdateUsers from '~/components/templates/bug/ModalUpdateUsers'
import ModalUpdateStartDate from '~/components/templates/bug/ModalUpdateStartDate'
import ModalUpdateEndDate from '~/components/templates/bug/ModalUpdateEndDate'
import ModalUpdateTestSession from '~/components/templates/bug/ModalUpdateTestSession'
import TableFixBugTask from '~/components/templates/bug/TableFixBugTask.vue'
import ModalAddFixBugTask from '~/components/templates/bug/ModalAddFixBugTask.vue'
import ModalUpdateMstBugType from '~/components/templates/bug/ModalUpdateMstBugType.vue'
import {
  CKEDITOR_TOOLBAR_SETTING,
  BUG_STATUS,
  BUG_PRIORITY,
  BUG_DONE_PERCENT,
  BUG_STATUS_VALUE,
  BUG_PRIORITY_VALUE,
  SORT,
  BUG_STATUS_INDEX,
  BUG_PRIORITY_INDEX,
  BUG_DONE_PERCENT_INDEX,
  API_ROOT_URL,
  FORMAT_DATE_TIME,
  BUG_CATEGORY_INDEX,
  BUG_CATEGORY_VALUE,
  TASK_TYPE_VALUE
} from '~/constants'

export function uploadFn(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const imageUrl = this.$nuxt.$store.$api.bug.uploadImageContent(formData, {
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
  components: {
    BugNoteEdit,
    ModalUpdateStatus,
    ModalUpdatePriority,
    ModalUpdateDonePercent,
    ModalUpdateAssignee,
    ModalUpdateUsers,
    ModalUpdateStartDate,
    ModalUpdateEndDate,
    ModalUpdateTestSession,
    TableFixBugTask,
    ModalAddFixBugTask,
    ModalUpdateMstBugType
  },

  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  props: {},

  /**
   * Init data for component.
   */
  data: () => ({
    moment,
    resource: 'bug',
    fileList: [],
    members: [],
    testSessions: [],
    editor: DecoupledEditor,
    BUG_STATUS,
    BUG_PRIORITY,
    BUG_DONE_PERCENT,
    BUG_STATUS_VALUE,
    BUG_PRIORITY_VALUE,
    BUG_STATUS_INDEX,
    BUG_PRIORITY_INDEX,
    BUG_DONE_PERCENT_INDEX,
    API_ROOT_URL,
    FORMAT_DATE_TIME,
    BUG_CATEGORY_INDEX,
    BUG_CATEGORY_VALUE,
    TASK_TYPE_VALUE,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    isToolbarInserted: false,
    fixBugTasks: [],
    currentTaskId: 0,
    visible: false,
    fixBugMstLifeCycle: {},
    mstBugTypes: [],
    model: {
      id: undefined,
      project_id: undefined,
      function_id: undefined,
      version_code: undefined,
      function_result_id: undefined,
      testcase_number_id: undefined,
      testcase_matrix_output_id: undefined,
      title: undefined,
      condition: undefined,
      actual_result: undefined,
      status: undefined,
      priority: undefined,
      assignee: undefined,
      create_user_id: undefined,
      done_percent: undefined,
      start_date: undefined,
      end_date: undefined,
      functionResult: {},
      assigneeUser: {},
      users: [],
      files: [],
      bugNotes: [],
      test_session_id: undefined
    }
  }),

  watch: {
    id(val) {
      this.getListTaskOfBug(val)
      this.getDetail(val)
    }
  },

  created() {
    this.getMemberOfProject()
    this.getListTaskOfBug(this.id)
    this.getMstLifeCycleFixBug()
    this.getMstBugType()
  },

  async mounted() {
    await this.getDetail(this.id)
    if (this.model.id) {
      this.getTestSessions()
    }
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        let model = {}
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
        }
        this.setModel(model)
        this.fileList = []
        this.model.files.forEach(item => {
          this.fileList.push({
            uid: item.id,
            url: this.API_ROOT_URL + item.file_path,
            name: item.file_path
          })
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
     * Mst bug type
     */
    async getMstBugType() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstBugType.list({ params })
        this.mstBugTypes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get member in project
     *
     * @returns {Promise<void>}
     */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.$store.state.project.id
        }

        const { data: { result: { data } } } = await this.$api.user.getListUser({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
    * List test session
     */
    async getTestSessions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          tab_bug: true
        }
        const { data: { result: { data } } } = await this.$api.testSession.list({ params })
        this.testSessions = data.filter(session => {
          return session.functionResults.some(result => {
            return result.function_id === this.model.function_id && result.version_code === this.model.version_code && result.project_id === this.model.project_id
          })
        })
        console.log(this.testSessions)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    onReady(editor) {
      // Note: Using DecoupledEditor then Insert the toolbar by manual before the editable area.
      setTimeout(() => {
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        )
      }, 100)
    },

    /**
     * Add Bug Note
     */
    async addBugNote() {
      try {
        const data = {
          note: this.model.note,
          updated_user_id: this.$auth.user.id
        }
        await this.repository.addBugNote(this.model.id, data)
        await this.getDetail(this.id)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Trigger when user update bug note
     */
    updateNote() {
      this.getDetail(this.id)
    },

    updateStatus(bug) {
      this.$refs.updateStatusBug.open(bug)
    },

    updatePriority(bug) {
      this.$refs.updatePriorityBug.open(bug)
    },

    updateDonePercent(bug) {
      this.$refs.updateDonePercentBug.open(bug)
    },

    updateAssignee(bug) {
      this.$refs.updateAssigneeBug.open(bug)
    },

    updateUsers(bug) {
      this.$refs.updateUsersBug.open(bug)
    },

    updateStartDate(bug) {
      this.$refs.updateStartDateBug.open(bug)
    },

    updateEndDate(bug) {
      this.$refs.updateEndDateBug.open(bug)
    },

    updateTestSession(bug) {
      this.$refs.updateTestSessionBug.open(bug)
    },

    updateTestcase(bug) {
      this.$refs.updateTestcaseBug.open(bug)
    },

    updateMstBugType(bug) {
      this.$refs.updateMstBugType.open(bug)
    },

    save() {
      this.getDetail(this.id)
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetailBugCustomer(id) {
      this.$router.push(`/${this.resource}/customer/${id}`)
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetailBugInternal(id) {
      this.$router.push(`/${this.resource}/internal/${id}`)
    },

    /**
     * Get list tasks
     */
    async getListTaskOfBug(id) {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          project_id: this.$store.state.project.id,
          bug_id: id,
          order_by: 'id',
          order_type: SORT.asc
        }

        const { data: { result: { data } } } = await this.$api.task.getListTasksOfBug({ params })
        if (data.length > 0) {
          data.forEach(task => {
            if (task.task_owners && task.task_owners.length > 0) {
              if (task.task_type === TASK_TYPE_VALUE.project) {
                task.member_id = task.task_owners[0].member_id
              }
            }
            task.et_point = Number(task.et_point).toFixed(2)
          })
        }
        this.fixBugTasks = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Open Add Task Modal
     */
    openAddTaskModal() {
      this.visible = true
    },

    saveTask() {
      this.visible = false
      this.getListTaskOfBug(this.id)
    },

    /**
     * MstLifeCycle for Fix bug
     */
    async getMstLifeCycleFixBug() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          isQA: true,
          first: true,
          not_limit: true,
          name: 'Fixbug Function Test'
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.fixBugMstLifeCycle = data
      } catch (_) {
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
  .anticon-picture svg path {
    d: path(
      'M719.4 499.1l-296.1-215A15.9 15.9 0 00398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 000-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z'
    );
  }
  .anticon-file svg path {
    d: path(
      'M719.4 499.1l-296.1-215A15.9 15.9 0 00398 297v430c0 13.1 14.8 20.5 25.3 12.9l296.1-215a15.9 15.9 0 000-25.8zm-257.6 134V390.9L628.5 512 461.8 633.1z'
    );
  }
  .anticon-edit > svg {
    color: rgb(51,51,51) !important;
    margin-left: 5px;
  }
  textarea {
    resize: none;
    background-color: inherit !important;
    color: #000000 !important;
    cursor: auto !important;
    border: none !important;
  }
  .ant-divider-horizontal {
    margin: 12px 0;
  }
  .ant-form-item-label {
    text-align: left;
    font-weight: 700;
  }
  .ck-editor .ck-toolbar {
    z-index: 9999;
  }
  .ck-editor__editable {
    min-height: 200px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
}
.info-card {
  background-color: #FFFFDD;
}
.bug-note {
  margin-left: 18px;
}
.note-user {
  display: flex;
}
.note-time {
  margin-left: 2px;
  color: dodgerblue;
  font-style: italic;
}
.link {
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
}
:deep() {
  .ant-form-item-control {
    zoom: 1;
    line-height: 23px;
    position: relative;
  }
  .ant-form-item:not(.default) {
    margin-bottom: 0px;
    position: relative;
  }
  .ant-col {
    padding-top: 0;
  }
}
.task-bug {
  margin-bottom: 25px;
}
</style>
