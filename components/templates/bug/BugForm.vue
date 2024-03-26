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
          <!-- <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.function_result_id')"
              prop="function_result_id"
            >
              <a-select
                id="bug_function_result_id"
                v-model="model.function_result_id"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.functionResult')"
              >
                <a-select-option
                  v-for="(item, index) in functionResults"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
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
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.bug.category')"
              prop="category"
            >
              <a-select
                id="bug_category"
                v-model="model.category"
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.bug.category')"
              >
                <a-select-option
                  v-for="(cate, index) in BUG_CATEGORY"
                  :key="index"
                  :value="cate.value"
                >
                  {{ cate.label }}
                </a-select-option>
              </a-select>
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
  BUG_CATEGORY
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
    functionResults: [],
    fileList: [],
    members: [],
    editor: DecoupledEditor,
    BUG_STATUS,
    BUG_PRIORITY,
    BUG_DONE_PERCENT,
    BUG_STATUS_VALUE,
    BUG_PRIORITY_VALUE,
    SORT,
    BUG_CATEGORY,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    selectFileId: 0,
    testcaseNumber: {},
    requirements: []
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
        function_result_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.function_result_id') }),
            trigger: ['change', 'blur']
          }
        ],
        category: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.category') }),
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
        ]
      }
    }
  },

  created() {
    this.getFunctionResults()
    this.getMemberOfProject()
    this.getListRequirement()
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
        let model = {}
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          model = data
          model.users = model.users.map(user => user.id)
          this.fileList = []
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

    openCreateModal(testcaseNumberId, bugTitle, bugCondition, functionResultId, testcaseMatrixOutputId, testcaseNumber, testcaseMatrixId) {
      this.fileList = []
      const model = {
        project_id: undefined,
        function_id: undefined,
        version_code: undefined,
        requirement_id: undefined,
        function_result_id: functionResultId,
        testcase_number_id: testcaseNumberId,
        testcase_matrix_output_id: testcaseMatrixOutputId,
        testcase_matrix_id: testcaseMatrixId,
        title: bugTitle,
        condition: bugCondition,
        actual_result: undefined,
        status: BUG_STATUS_VALUE.new,
        priority: BUG_PRIORITY_VALUE.normal,
        assignee: undefined,
        create_user_id: this.$auth.user.id,
        done_percent: 0,
        start_date: undefined,
        end_date: undefined,
        is_deleted: 0,
        users: [],
        files: []
      }
      this.testcaseNumber = testcaseNumber
      this.setModel(model)
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
     * List FunctionResult
     */
    async getFunctionResults() {
      try {
        const { data: { result: { data } } } = await this.$api.functionResult.getListFunctionResultToSelect()
        this.functionResults = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
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
        function_result_id: this.model.function_result_id,
        testcase_number_id: this.model.testcase_number_id,
        requirement_id: this.model.requirement_id,
        category: this.model.category,
        testcase_matrix_output_id: this.model.testcase_matrix_output_id,
        testcase_matrix_id: this.model.testcase_matrix_id,
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
        files: this.model.files
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
            if (!this.model.id) {
              data.project_id = this.$store.state.project.id
              data.function_id = this.$route.params.id
              data.version_code = this.$route.params.version_code
            }
            const form = new FormData()
            form.append('project_id', data.project_id)
            form.append('function_id', data.function_id)
            form.append('version_code', data.version_code)
            form.append('function_result_id', data.function_result_id ?? null)
            form.append('testcase_number_id', data.testcase_number_id ?? null)
            form.append('testcase_matrix_output_id', data.testcase_matrix_output_id ?? null)
            form.append('testcase_matrix_id', data.testcase_matrix_id ?? null)
            form.append('title', data.title)
            form.append('requirement_id', data.requirement_id)
            form.append('category', data.category)
            form.append('condition', data.condition)
            form.append('actual_result', data.actual_result)
            form.append('status', data.status)
            form.append('priority', data.priority)
            form.append('assignee', data.assignee)
            form.append('create_user_id', data.create_user_id)
            form.append('done_percent', data.done_percent)
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
            let bug
            if (this.model.id) {
              await this.repository.updateBug(this.model.id, form, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
            } else {
              const result = await this.repository.create(form, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
              if (result && result.data) {
                bug = result.data.result.data
              }
            }
            this.$emit('save', bug, this.testcaseNumber)

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
