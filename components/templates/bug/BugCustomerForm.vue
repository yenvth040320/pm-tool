<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 4 }"
    :wrapper-col="{ sm: 20 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-5">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.bug.title')"
              prop="title"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <a-textarea
                id="bug_title"
                v-model="model.title"
                :placeholder="$t('module.bug.title')"
                auto-size
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.bug.condition')"
              prop="condition"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <div v-if="ckeditorReady">
                <ckeditor
                  v-model="model.condition"
                  :editor="editor"
                  :config="editorConfig"
                  @ready="onReady"
                />
              </div>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.bug.actual_result')"
              prop="actual_result"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <div v-if="ckeditorReady">
                <ckeditor
                  v-model="model.actual_result"
                  :editor="editor"
                  :config="editorConfig"
                  @ready="onReady"
                />
              </div>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.requirement_id')"
              prop="requirement_id"
            >
              <a-select
                v-model="model.requirement_id"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.requirement_id')"
              >
                <a-select-option
                  v-for="(item, index) in requirements"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              v-if="!model.id"
              :label="$t('module.bug.status')"
              prop="status"
            >
              <a-select
                id="bug_status"
                v-model="model.status"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.status')"
              >
                <a-select-option
                  v-for="(item, index) in BUG_STATUS.slice(0, 1)"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item
              v-if="model.id"
              :label="$t('module.bug.status')"
              prop="status"
            >
              <a-select
                id="bug_status"
                v-model="model.status"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.status')"
              >
                <a-select-option
                  v-for="(item, index) in BUG_STATUS"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="model.function_id"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.function')"
                @change="handleFunctionChange"
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
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.version_code')"
              prop="version_code"
            >
              <a-select
                v-model="model.version_code"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.functionResult.version_code')"
                @change="handleVersionChange"
              >
                <a-select-option
                  v-for="(item, index) in filteredVersions"
                  :key="index"
                  :value="item.version_code"
                >
                  {{ item.version_code }}: {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.mst_bug_type_id')"
              prop="mst_bug_type_id"
            >
              <a-select
                id="bug_mst_bug_type_id"
                v-model="model.mst_bug_type_id"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.mst_bug_type_id')"
              >
                <a-select-option
                  v-for="(item, index) in mstBugTypes"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
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
              <a-select
                id="bug_test_session_id"
                v-model="model.test_session_id"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.test_session_id')"
              >
                <a-select-option
                  v-for="(item, index) in filteredTestSessions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
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
              <a-select
                id="bug_priority"
                v-model="model.priority"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.priority')"
              >
                <a-select-option
                  v-for="(item, index) in BUG_PRIORITY"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
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
              <a-date-picker
                id="bug_start_date"
                v-model="model.start_date"
                :placeholder="$t('module.bug.start_date')"
                format="YYYY/MM/DD"
                style="width:100%"
              />
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
              <a-select
                id="bug_assignee"
                v-model="model.assignee"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.assignee')"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
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
              <a-date-picker
                id="bug_end_date"
                v-model="model.end_date"
                :placeholder="$t('module.bug.end_date')"
                format="YYYY/MM/DD"
                style="width:100%"
              />
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
              <a-select
                id="bug_done_percent"
                v-model="model.done_percent"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.done_percent')"
              >
                <a-select-option
                  v-for="(item, index) in BUG_DONE_PERCENT"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
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
              <a-select
                id="bug_who_bug"
                v-model="model.users"
                show-arrow
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.bug.who_bug')"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
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
                :file-list="fileList"
                :before-upload="beforeUpload"
                :remove="handleRemoveFile"
                @change="handleChangeFile"
              >
                <a-button>
                  <a-icon type="upload" />
                </a-button>
              </a-upload>
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
    </a-spin>
  </a-form-model>
</template>

<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataForm from '~/mixins/data-form'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import {
  CKEDITOR_TOOLBAR_SETTING,
  BUG_STATUS,
  BUG_PRIORITY,
  BUG_DONE_PERCENT,
  BUG_STATUS_VALUE,
  BUG_PRIORITY_VALUE,
  SORT,
  BUG_CATEGORY,
  BUG_CATEGORY_VALUE
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
  components: {},

  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  props: {
    ckeditorReady: {
      type: Boolean,
      default: false
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    moment,
    resource: 'bug',
    fileList: [],
    members: [],
    editor: DecoupledEditor,
    BUG_STATUS,
    BUG_PRIORITY,
    BUG_DONE_PERCENT,
    BUG_STATUS_VALUE,
    BUG_PRIORITY_VALUE,
    BUG_CATEGORY_VALUE,
    SORT,
    BUG_CATEGORY,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    selectFileId: 0,
    requirements: [],
    functions: [],
    filteredVersions: [],
    versions: [],
    functionResults: [],
    filteredTestSessions: [],
    dataOriginal: {},
    testSessions: [],
    mstBugTypes: []
  }),

  /**
   * Computed event.
   */
  computed: {
    /**
     * Rules validate when submit form.
     */
    formRules() {
      return {
        requirement_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.requirement_id') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.version_code') }),
            trigger: ['change', 'blur']
          }
        ],
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.title') }),
            trigger: ['change', 'blur']
          },
          {
            max: 500,
            message: this.$t('validation.max', { field: this.$t('module.bug.title'), max: 500 }),
            trigger: ['change', 'blur']
          }
        ],
        condition: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.condition') }),
            trigger: ['change', 'blur']
          }
        ],
        actual_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.actual_result') }),
            trigger: ['change', 'blur']
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.status') }),
            trigger: ['change', 'blur']
          }
        ],
        priority: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.priority') }),
            trigger: ['change', 'blur']
          }
        ],
        assignee: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.assignee') }),
            trigger: ['change', 'blur']
          }
        ],
        create_user_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.create_user_id') }),
            trigger: ['change', 'blur']
          }
        ],
        done_percent: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.done_percent') }),
            trigger: ['change', 'blur']
          }
        ],
        is_deleted: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.is_deleted') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_bug_type_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.mst_bug_type_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  created() {
    this.getMemberOfProject()
    this.getListRequirement()
    this.getFunctions()
    this.getVersions()
    this.getTestSessions()
    this.getMstBugType()
  },

  /**
   * List of methods.
   */
  methods: {
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
        this.testSessions = data
        if (this.model.function_id && this.model.version_code) {
          this.filteredTestSessions = this.testSessions.filter(session => {
            return session.functionResults.some(result => {
              return result.function_id === this.model.function_id && result.version_code === this.model.version_code && result.project_id === this.model.project_id
            })
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
     * Get version follow function
     */
    handleFunctionChange() {
      this.filteredVersions = this.versions.filter(version => version.function_id === this.model.function_id && version.project_id === this.model.project_id)
      if (this.filteredVersions.length > 0) {
        this.$set(this.model, 'version_code', this.filteredVersions[0].version_code)
        this.filteredTestSessions = this.testSessions.filter(session => {
          return session.functionResults.some(result => {
            return result.function_id === this.model.function_id && result.version_code === this.filteredVersions[0].version_code
          })
        })
      }

      if (this.model.test_session_id) {
        this.$set(this.model, 'test_session_id', undefined)
      }
    },

    handleVersionChange() {
      this.filteredTestSessions = this.testSessions.filter(session => {
        return session.functionResults.some(result => {
          return result.function_id === this.model.function_id && result.version_code === this.model.version_code && result.project_id === this.model.project_id
        })
      })
      if (this.model.test_session_id) {
        this.$set(this.model, 'test_session_id', undefined)
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
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionList({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List version
     */
    async getVersions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_by: 'id',
          order_type: SORT.desc
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionVersionList({ params })
        this.versions = data
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
        let model = {
          project_id: this.$store.state.project.id,
          status: BUG_STATUS_VALUE.new,
          priority: BUG_PRIORITY_VALUE.normal,
          category: BUG_CATEGORY_VALUE.customer,
          done_percent: 0,
          users: [],
          files: [],
          create_user_id: this.$auth.user.id
        }
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          this.dataOriginal = data
          model = data
          model.users = model.users.map(user => user.id)
          if (model.mst_bug_type_id === 0) {
            model.mst_bug_type_id = undefined
          }
          if (model.functionResult) {
            this.$set(model, 'test_session_id', model.functionResult.test_session_id)
          }
          this.fileList = []
          this.filteredVersions = this.versions.filter(version => version.function_id === model.function_id && version.project_id === model.project_id)
          this.filteredTestSessions = this.testSessions.filter(session => {
            return session.functionResults.some(result => {
              return result.function_id === model.function_id && result.version_code === model.version_code && result.project_id === model.project_id
            })
          })
          model.files.forEach(item => {
            this.fileList.push({
              uid: item.id,
              url: this.API_ROOT_URL + item.file_path,
              name: item.file_path
            })
          })
        }
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

    /**
     * Change File
     */
    handleChangeFile({ fileList }) {
      this.fileList = fileList
      this.model.files = fileList
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
     * Check before upload file
     */
    beforeUpload(file) {
      const isVideo = file.type.startsWith('video/')
      const isJpgOrPng = file.type.startsWith('image/')
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
      } else if (isJpgOrPng) {
        if (file.size <= maxFileSize) {
          return isJpgOrPng
        } else {
          this.$notification.error({
            message: this.$t('module.bug.file.file_length_err')
          })
          return new Promise((resolve, reject) => {
            reject(file)
          })
        }
      } else {
        this.$notification.error({
          message: this.$t('module.bug.upload_file.failed')
        })
        return new Promise((resolve, reject) => {
          reject(file)
        })
      }
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        project_id: this.model.project_id,
        function_id: this.model.function_id,
        version_code: this.model.version_code,
        requirement_id: this.model.requirement_id,
        mst_bug_type_id: this.model.mst_bug_type_id,
        category: this.model.category,
        title: this.model.title,
        condition: this.model.condition,
        actual_result: this.model.actual_result,
        status: this.model.status,
        priority: this.model.priority,
        assignee: this.model.assignee,
        create_user_id: this.model.create_user_id,
        done_percent: this.model.done_percent,
        start_date: this.model.start_date,
        end_date: this.model.end_date,
        users: this.model.users,
        files: this.model.files,
        test_session_id: this.model.test_session_id,
        testcase_matrix_output_id: this.model.testcase_matrix_output_id,
        testcase_matrix_id: this.model.testcase_matrix_id,
        testcase_number_id: this.model.testcase_number_id,
        function_result_id: this.model.function_result_id
      }

      return model
    },

    handleRemoveFile(file) {
      if (file.originFileObj) {
        return true
      } else {
        this.$confirm({
          title: this.$t('module.bug.file.delete_warning'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteBugFile(file.uid)
        })
        return false
      }
    },

    async deleteBugFile(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.bugFile.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getDetail(this.id)
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
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()

            if (data.test_session_id) {
              const testSession = this.testSessions.find(item => item.id === data.test_session_id)
              if (testSession) {
                const functionResult = testSession.functionResults.find(item => item.function_id === data.function_id && item.version_code === data.version_code)
                if (functionResult) {
                  data.function_result_id = functionResult.id
                }
              }
            } else {
              data.function_result_id = null
            }

            if (data.function_result_id !== this.dataOriginal.function_result_id) {
              data.testcase_number_id = null
              data.testcase_matrix_output_id = null
              data.testcase_matrix_id = null
            }
            const form = new FormData()
            form.append('project_id', data.project_id)
            form.append('function_id', data.function_id)
            form.append('version_code', data.version_code)
            form.append('title', data.title)
            form.append('requirement_id', data.requirement_id)
            form.append('function_result_id', data.function_result_id)
            form.append('testcase_number_id', data.testcase_number_id)
            form.append('testcase_matrix_output_id', data.testcase_matrix_output_id)
            form.append('testcase_matrix_id', data.testcase_matrix_id)
            form.append('category', data.category)
            form.append('condition', data.condition)
            form.append('actual_result', data.actual_result)
            form.append('status', data.status)
            form.append('priority', data.priority)
            form.append('assignee', data.assignee)
            form.append('create_user_id', data.create_user_id)
            form.append('done_percent', data.done_percent)
            form.append('mst_bug_type_id', data.mst_bug_type_id)
            if (data.start_date) {
              form.append('start_date', moment(data.start_date).format('YYYY-MM-DD'))
            }
            if (data.end_date) {
              form.append('end_date', moment(data.end_date).format('YYYY-MM-DD'))
            }
            data.users.forEach(user => {
              form.append('users[]', user)
            })
            data.files.forEach(file => {
              if (file.originFileObj) {
                form.append('newFile[]', file.originFileObj)
              } else {
                form.append('oldFile[]', JSON.stringify(file))
              }
            })
            if (this.model.id) {
              await this.repository.updateBug(this.model.id, form, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
            } else {
              const keysToRemove = []
              for (const [key, value] of form.entries()) {
                if (value === 'null') {
                  keysToRemove.push(key)
                }
              }

              keysToRemove.forEach(key => form.delete(key))
              await this.repository.create(form, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
            }

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
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
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
</style>
