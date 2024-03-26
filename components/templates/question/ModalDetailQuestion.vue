<template>
  <a-modal
    :visible="openModal"
    :width="1400"
    :footer="null"
    @cancel="close"
  >
    <template slot="title">
      {{ $t('module.question.detail_qna') }}
    </template>
    <a-spin :spinning="loading">
      <div v-if="model.id">
        <div class="p-4 question-container">
          <a-button
            html-type="button"
            type="primary"
            ghost
            @click="gotoCopyUrl()"
          >
            {{ $t('common.copy_url') }}
          </a-button>
          <a-button
            html-type="button"
            type="primary"
            ghost
            @click="gotoCopy()"
          >
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('common.new') }}
          </a-button>
          <a-form-model
            ref="form"
            :model="model"
            :rules="formRules"
            :label-col="{ sm: 7 }"
            :wrapper-col="{ sm: 17 }"
            @submit.prevent="handleSubmit"
          >
            <div class="p-4 question-info">
              <a-row
                type="flex"
                :gutter="30"
              >
                <a-col
                  :span="24"
                  :md="17"
                >
                  <a-form-model-item
                    :label="$t('module.question.function_id')"
                    prop="function_id"
                  >
                    <a :href="`/function/${model?.function?.id}/version/${model.version_code}`" target="_blank">
                      {{ model.function ? '[' + model?.function?.code + '] : ' + model.function.name + '/version: ' + model.version_code : '' }}
                    </a>
                  </a-form-model-item>
                </a-col>

                <a-col
                  :span="24"
                  :md="7"
                >
                  <a-form-model-item
                    :label="$t('module.question.status')"
                    prop="status"
                  >
                    <div
                      v-for="item in STATUS_QUESTION"
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
                  :md="17"
                >
                  <a-form-model-item
                    :label="$t('module.question.item_pk')"
                    prop="item_pk"
                  >
                    <a :href="`/function/${model?.function?.id}/version/${model.version_code}?function_item_num=${model?.functionItem?.item_num}#tab_items`" target="_blank">
                      {{ model?.functionItem?.name }} ({{ model?.functionItem?.mst_item_type.name }})
                    </a>
                  </a-form-model-item>
                </a-col>

                <a-col
                  :span="24"
                  :md="7"
                >
                  <a-form-model-item
                    :label="$t('module.question.category')"
                    prop="category"
                  >
                    <div
                      v-for="item in CATEGORY_QUESTION"
                      :key="item.value"
                    >
                      <div v-if="item.value === model.category">
                        {{ item.label }}
                      </div>
                    </div>
                  </a-form-model-item>
                </a-col>

                <a-col
                  :span="24"
                  :md="17"
                >
                  <a-form-model-item
                    :label="$t('module.question.created_user')"
                    prop="created_user"
                  >
                    {{ model?.createdUser?.name }}
                  </a-form-model-item>
                </a-col>

                <a-col
                  :span="24"
                  :md="7"
                >
                  <a-form-model-item
                    :label="$t('module.question.created_at')"
                    prop="created_at"
                  >
                    {{ model.created_at ? getDateTime(model.created_at) : '' }}
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row
                type="flex"
                :gutter="30"
                class="info-question"
              >
                <a-col
                  :span="24"
                  :md="24"
                  class="content-context title-question"
                >
                  <a-form-model-item
                    :label="$t('module.question.title')"
                    prop="title"
                  >
                    {{ model.title }}
                  </a-form-model-item>
                </a-col>
                <a-col
                  :span="24"
                  :md="24"
                  class="content-context"
                >
                  <a-form-model-item
                    :label="$t('module.question.context')"
                    prop="context"
                  >
                    <p v-html="model.context" />
                  </a-form-model-item>
                </a-col>
                <a-col
                  :span="24"
                  :md="24"
                >
                  <a-form-model-item
                    :label="$t('module.question.question')"
                    prop="question"
                  >
                    <p v-html="model.question" />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
        <a-divider />
        <div class="replied-content">
          <div
            v-for="(item) in model.answers"
            :key="item.id"
            :style="{ 'background-color': item.type == 1 ? '#d7f7dd' : '#ffffff' }"
            class="p-4 mb-3"
          >
            <div v-if="item.type === 1">
              <p class="text-content">
                {{ $t('module.answer.answer_final') }}
              </p>
            </div>
            <div class="reply">
              <ModalDetailReplyEdit
                :item="item"
                @updateReply="updateReply"
              />
            </div>
          </div>
          <a-divider />
          <life-cycle-table
            :data-mst-life-cycle-manage="dataMstLifeCycleManage"
            :list-mst-life-cycles="listMstLifeCycles"
            @changeLifeCycleStatus="changeLifeCycleStatus"
          />
          <a-divider />
          <AddTaskComponent :model="model" />
          <a-divider v-if="model.answers && model.answers.length > 0" />
          <a-form-model
            v-if="model.id && model.functionItem.use_flg === USE_FLG_VALUE.yes"
            ref="form"
            :model="answer"
            :rules="formRules"
            :label-col="{ sm: 7 }"
            :wrapper-col="{ sm: 17 }"
            @submit.prevent="handleSubmit"
          >
            <div class="p-4">
              <p class="text-content">
                {{ $t('module.answer.content') }}
              </p>
              <a-row
                type="flex"
                :gutter="30"
                class="info-question"
              >
                <a-col
                  :span="24"
                  :md="24"
                >
                  <a-form-model-item
                    :label="$t('module.question.status')"
                    prop="status"
                  >
                    <a-select
                      v-model="answer.status"
                      :placeholder="$t('module.question.category')"
                      show-search
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        v-for="(item, index) in STATUS_QUESTION"
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
                  :md="24"
                  class="container-answer"
                >
                  <a-form-model-item
                    prop="answer"
                  >
                    <div v-if="ckeditorReady">
                      <ckeditor
                        v-model="answer.answer"
                        :editor="editor"
                        :config="editorConfig"
                        @ready="onReady"
                      />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="text-center p-3">
                <a-button
                  v-if="version"
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
                  @click="addAnswer(0)"
                >
                  {{ $t('module.answer.button_answer') }}
                </a-button>

                <a-button
                  v-else
                  html-type="button"
                  type="default"
                  class="min-w-100"

                  @click="addAnswer(0)"
                >
                  {{ $t('module.answer.button_answer') }}
                </a-button>
              </div>
            </div>
            <a-divider />
            <div class="p-4">
              <p class="text-content">
                {{ $t('module.answer.text_complete') }}
              </p>
              <a-row
                type="flex"
                :gutter="30"
                class="info-question"
              >
                <a-col
                  :span="24"
                  :md="24"
                >
                  <a-form-model-item
                    :label="$t('module.question.status')"
                    prop="status"
                  >
                    <div
                      v-for="item in STATUS_QUESTION"
                      :key="item.value"
                    >
                      <div v-if="item.value === STATUS_QUESTION_VALUE.confirm">
                        {{ item.label }}
                      </div>
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col
                  :span="24"
                  :md="24"
                  class="container-answer"
                >
                  <a-form-model-item
                    prop="answer"
                  >
                    <div v-if="ckeditorReady">
                      <ckeditor
                        v-model="answer.answer_final"
                        :editor="editor"
                        :config="editorConfig"
                        @ready="onReady"
                      />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="text-center p-3">
                <a-button
                  v-if="version"
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
                  @click="addAnswer(1)"
                >
                  {{ $t('module.answer.button_complete') }}
                </a-button>
                <a-button
                  v-else
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  @click="addAnswer(1)"
                >
                  {{ $t('module.answer.button_complete') }}
                </a-button>
              </div>
            </div>
          </a-form-model>
          <a-button
            html-type="button"
            type="primary"
            ghost
            @click="gotoCopyUrl()"
          >
            {{ $t('common.copy_url') }}
          </a-button>
          <a-button
            v-if="!showLogHistory"
            html-type="button"
            type="primary"
            ghost
            @click="showLogHistory = !showLogHistory"
          >
            {{ $t('Xem lịch sử') }}
          </a-button>
          <a-button
            v-if="showLogHistory"
            html-type="button"
            type="primary"
            ghost
            @click="showLogHistory = !showLogHistory"
          >
            {{ $t('Đóng lịch sử') }}
          </a-button>
        </div>
        <a-divider />
        <div
          v-if="showLogHistory"
          class="log-history p-4 mb-5"
        >
          <div
            v-for="item in qaLogData"
            :key="item.id"
          >
            <qa-log-history :log-item="item" />
          </div>
        </div>
      </div>
      <div v-else class="p-4">
        <a-empty
          description="Không có dữ liệu"
        />
      </div>
    </a-spin>
    <QuestionForm :id="currentId" ref="modalAddQuestion" :copy-value="true" @save="saveQuestion" @cancel="closeQuestion" />
  </a-modal>
</template>

<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import ModalDetailReplyEdit from './ModalDetailReplyEdit.vue'
import AddTaskComponent from './AddTaskComponent.vue'
import DataForm from '~/mixins/data-form'
import QuestionForm from '~/components/templates/question/QuestionForm'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import {
  CATEGORY_QUESTION,
  STATUS_QUESTION,
  CKEDITOR_TOOLBAR_SETTING,
  FORMAT_DATE_TIME,
  STATUS_QUESTION_VALUE,
  USE_FLG_VALUE,
  LOCK_FLG_VALUE,
  SORT
} from '~/constants'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import LifeCycleTable from '~/components/templates/question/LifeCycleTable.vue'
import QaLogHistory from '~/components/templates/qaLog/QaLogHistory.vue'

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
  components: { ModalDetailReplyEdit, QuestionForm, AddTaskComponent, LifeCycleTable, QaLogHistory },
  mixins: [DataForm],

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    },
    listMstLifeCycles: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'question',
    currentId: 0,
    functions: [],
    projects: [],
    openModal: false,
    loadModal: false,
    visible: false,
    versionCode: [],
    versionFunctions: [],
    functionItemData: [],
    answer: {
      status: undefined,
      answer: '',
      answer_final: ''
    },
    CATEGORY_QUESTION,
    FORMAT_DATE_TIME,
    STATUS_QUESTION,
    question: {},
    STATUS_QUESTION_VALUE,
    LOCK_FLG_VALUE,
    ckeditorReady: false,
    USE_FLG_VALUE,
    editor: DecoupledEditor,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    functionLifeCycle: [],
    dataMstLifeCycleManage: [],
    qaLogData: [],
    showLogHistory: false
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
  /**
   * Watcher.
   */
  watch: {
    model(val) {
      this.$set(this.answer, 'status', val.status)
      this.hasAnswerFinal()
    },
    id(val) {
      this.getDetail(val)
      this.getQuestionLogHistory(val)
      this.showLogHistory = false
    }
  },

  mounted() {
    this.hasAnswerFinal()
    this.getQuestionLogHistory(this.id)
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
          await this.getVersionFunctionLifeCycle(model.project_id, model.function_id, model.version_code, id)
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
     * Get Version Function Life Cycle Data
     *
     * @param projectId
     * @param functionId
     * @param versionCode
     * @param questionId
     */
    async getVersionFunctionLifeCycle(projectId, functionId, versionCode, questionId) {
      try {
        const params = {
          project_id: projectId,
          function_id: functionId,
          version_code: versionCode,
          question_id: questionId
        }
        const { data: { result: { data } } } = await this.$api.versionFunctionLifeCycle.list({ params })
        this.makeMstLifeCycleTable(data, projectId, functionId, versionCode, questionId)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Create row structure for life cycle table component.
     *
     * @param data Data form version_function_life_cycles table.
     * @param projectId Project id.
     * @param functionId Function id.
     * @param versionCode Version code.
     * @param questionId Id of question.
     */
    makeMstLifeCycleTable(data, projectId, functionId, versionCode, questionId) {
      const rowData = this.listMstLifeCycles.map(lifeCycle => ({
        project_id: projectId,
        function_id: functionId,
        version_code: versionCode,
        mst_life_cycle_id: lifeCycle.id,
        mstLifeCycle: {
          id: lifeCycle.id,
          name: lifeCycle.name
        },
        mst_life_cycle_status_id: null,
        question_id: questionId,
        key: lifeCycle.id
      }))
      const result = []
      if (data.length > 0) {
        data.forEach(item => {
          const index = rowData.findIndex(uncheckedItem => uncheckedItem.mst_life_cycle_id === item.mst_life_cycle_id)
          if (index !== -1) {
            rowData[index] = item
          }
        })
      }
      result.push(...rowData)
      this.dataMstLifeCycleManage = result.map((item, index) => {
        return { ...item, index: index + 1 }
      })
    },

    open() {
      this.openModal = true
      this.ckeditorReady = true
      if (this.model.id) {
        this.hasAnswerFinal()
        this.$set(this.answer, 'status', this.model.status)
      }
    },

    close() {
      this.answer = {
        answer: '',
        answer_final: ''
      }
      this.ckeditorReady = false
      this.openModal = false
    },
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        category: this.model.category,
        context: this.model.context,
        created_at: this.model.created_at,
        function_id: this.model.function_id,
        id: this.model.id,
        is_deleted: this.model.is_deleted,
        item_pk: this.model.item_pk,
        project_id: this.model.project_id,
        question: this.model.question,
        status: this.model.status,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code
      }
      return model
    },
    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
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
     * Format date time
     */
    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    hasAnswerFinal() {
      this.answer.answer_final = ''
      if (this.model.id) {
        const firstType1Answer = this.model.answers.find(answer => answer.type === 1)
        if (firstType1Answer) {
          this.answer.answer_final = firstType1Answer.answer
        }
      }
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/qa'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      url.searchParams.set('question_id', this.model.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },

    /**
     * Go to copy question
     * @param id
     */
    gotoCopy() {
      this.currentId = this.model.id
      this.isCopyQuestion = true
      this.$refs.modalAddQuestion.open()
    },

    saveQuestion() {
      this.$fetch()
      this.currentId = 0
      this.$emit('close')
    },

    closeQuestion() {
      this.$fetch()
      this.currentId = 0
    },

    /**
     * Validate before submit
     */
    async addAnswer(type) {
      this.$store.dispatch('setLoading', true)
      try {
        const data = this.answer
        data.type = type
        data.project_id = this.$store.state.project.id
        data.question_id = this.model.id
        if (type === 1) {
          data.status = STATUS_QUESTION_VALUE.confirm
        }
        await this.$api.answer.create(data)
        this.getDetail(this.id)
        await this.getQuestionLogHistory(this.id)
        this.answer = {
          answer: '',
          answer_final: ''
        }
        this.hasAnswerFinal()
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
    },

    /**
     * Trigger when user update reply
     */
    updateReply() {
      this.getDetail(this.id)
      this.getQuestionLogHistory(this.id)
    },

    /**
     * Change Life Cycle Status
     */
    async changeLifeCycleStatus(record) {
      this.$store.dispatch('setLoading', true)
      try {
        if (record.id) {
          await this.$api.versionFunctionLifeCycle.update(record.id, record)
        } else {
          await this.$api.versionFunctionLifeCycle.create(record)
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        await this.getDetail(this.id)
        await this.getQuestionLogHistory(this.id)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Fetch data question log history
     *
     * @param id
     */
    async getQuestionLogHistory(id) {
      try {
        if (id) {
          const params = {
            question_id: id,
            order_by: 'updated_time',
            order_type: SORT.desc
          }
          const { data: { result: { data } } } = await this.$api.qaLog.list({ params })
          this.qaLogData = data
        }
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
:deep() {
  .content-context {
    border-bottom: 1px solid #e8e8e8;
  }
  .title-question {
    border-top: 1px solid #e8e8e8;
  }
  .ck-editor .ck-toolbar {
      z-index: 9999;
    }
  .ant-divider {
    margin: 2px 2px 6px 2px;
  }
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-form-item {
    margin-bottom: 0;
    p {
      margin-bottom: 0;
    }
  }
  .info-question {
    .ant-col-sm-7 {
      width: 20.16666667%;
    }
    .ant-col-sm-17 {
      width: 79.83333333%;
    }

    .container-answer {
      .ant-col-sm-17 {
        width: 100%;
      }
    }
  }
  .ck-editor__editable {
    min-height: 200px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
  .replied-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
  .question-container {
    padding-bottom: 0 !important;
  }
  .text-content {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  .question-info {
    padding-bottom: 0 !important;
  }
  .reply {
    display: flex;
  }
  .replier-name {
    width: 20.16666667%;
    display: block;
  }
  .content-reply {
    width: 79.83333333%;
  }
}
</style>
