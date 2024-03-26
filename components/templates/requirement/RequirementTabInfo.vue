<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :label-col="{ sm: 6 }"
      :wrapper-col="{ sm: 18 }"
    >
      <a-spin :spinning="loading">
        <a-card class="mb-4 info-card">
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
                  :label="$t('module.requirement.status_request')"
                  prop="status_request"
                >
                  <span>
                    {{ REQUIREMENT_REQUEST_STATUS_INDEX[model.status_request] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.dev_point_et') + ': '"
                  prop="status_processing"
                >
                  <span>
                    {{ Number(model.dev_point_et) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.status_processing')"
                  prop="status_processing"
                >
                  <span>
                    {{ REQUIREMENT_PROCESS_STATUS_INDEX[model.status_processing] }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.com_point_et') + ': '"
                  prop="status_processing"
                >
                  <span>
                    {{ Number(model.com_point_et) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.et_customer_accepted')"
                  prop="et_customer_accepted"
                >
                  <span>
                    {{ Number(model.et_customer_accepted) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.pm_point_et') + ': '"
                  prop="status_processing"
                >
                  <span>
                    {{ Number(model.pm_point_et) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.point_et')"
                  prop="point_et"
                >
                  <span>
                    {{ Number(model.point_et) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>

              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.requirement.et_internal')"
                  prop="point_et"
                >
                  <span>
                    {{ Number(model.et_internal) | fixDecimal }}
                  </span>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.requirement.content')"
                  prop="content"
                  :label-col="{ sm: 3 }"
                  :wrapper-col="{ sm: 21 }"
                >
                  <div>
                    <div v-if="!showInput">
                      <a-icon type="edit" @click="showUpdateInput" />
                    </div>
                    <div v-else>
                      <a-button type="primary" @click="updateContent">
                        {{ $t('common.submit') }}
                      </a-button>
                      <a-button type="button" @click="cancel">
                        {{ $t('common.cancel') }}
                      </a-button>
                    </div>

                    <p v-if="!showInput" v-html="model.content" />
                    <div v-else>
                      <ckeditor
                        v-model="model.content"
                        :editor="editor"
                        :config="editorConfig"
                        @ready="onReady"
                      />
                    </div>
                  </div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-card>
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
                :label="$t('module.requirement.reply')"
                prop="reply"
                :wrapper-col="{ sm: 24 }"
              >
                <ul class="requirement-reply" style="list-style-type:disc">
                  <li
                    v-for="reply in model.replyRequirements"
                    :key="reply.id"
                  >
                    <RequirementReplyEdit
                      :reply="reply"
                      :members="members"
                      @updateReply="updateReply"
                    />
                  </li>
                </ul>
                <div>
                  <ckeditor
                    v-model="model.reply"
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
                  @click="addReply"
                >
                  <a-icon type="plus" />
                </a-button>
              </div>
            </a-col>
          </a-row>
        </div>
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
import RequirementReplyEdit from '~/components/templates/requirement/RequirementReplyEdit'
import {
  API_ROOT_URL,
  FORMAT_DATE_TIME,
  REQUIREMENT_PROCESS_STATUS,
  REQUIREMENT_PROCESS_STATUS_INDEX,
  REQUIREMENT_PROCESS_STATUS_VALUE,
  REQUIREMENT_REQUEST_STATUS,
  REQUIREMENT_REQUEST_STATUS_INDEX,
  REQUIREMENT_REQUEST_STATUS_VALUE,
  REQUIREMENT_TYPE_INDEX,
  CKEDITOR_TOOLBAR_SETTING,
  SORT
} from '~/constants'

export function uploadFn(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const imageUrl = this.$nuxt.$store.$api.requirement.uploadImageContent(formData, {
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
    RequirementReplyEdit
  },

  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  filters: {
    fixDecimal(value) {
      return value.toFixed(2)
    }
  },

  props: {},

  /**
   * Init data for component.
   */
  data: () => ({
    moment,
    resource: 'requirement',
    members: [],
    editor: DecoupledEditor,
    API_ROOT_URL,
    SORT,
    FORMAT_DATE_TIME,
    REQUIREMENT_REQUEST_STATUS,
    REQUIREMENT_PROCESS_STATUS,
    REQUIREMENT_PROCESS_STATUS_VALUE,
    REQUIREMENT_REQUEST_STATUS_VALUE,
    REQUIREMENT_REQUEST_STATUS_INDEX,
    REQUIREMENT_PROCESS_STATUS_INDEX,
    REQUIREMENT_TYPE_INDEX,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    model: {
      project_id: undefined,
      title: undefined,
      content: undefined,
      status_request: undefined,
      status_processing: undefined,
      dev_point_et: undefined,
      pm_point_et: undefined,
      com_point_et: undefined,
      et_internal: undefined,
      et_customer_accepted: undefined,
      test_point_et: undefined,
      point_et: undefined,
      type: undefined,
      replyRequirements: []
    },
    showInput: false
  }),

  /**
   * Computed event.
   */
  computed: {},

  created() {
    this.getMemberOfProject()
    this.$bus.$on('updatePointRequirement', editedData => {
      this.getDetail(this.id)
    })
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
     * show input update description
     */
    showUpdateInput() {
      if (this.model.content === null || this.model.content === undefined) {
        this.model.content = ''
      }
      this.showInput = true
    },

    /**
     * hide ckeditor
     */
    cancel() {
      this.showInput = false
    },

    /**
     * Add Bug Note
     */
    async addReply() {
      try {
        const data = {
          content: this.model.reply,
          created_user: this.$auth.user.id,
          updated_user: this.$auth.user.id
        }
        await this.repository.addReply(this.model.id, data)
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
     * update description of task
     */
    async updateContent() {
      try {
        const data = {
          content: this.model.content
        }
        if (this.model.id) {
          await this.repository.updateRequirement(this.model.id, data)
        }
        this.showInput = false
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        await this.getDetail(this.id)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Trigger when user update reply
     */
    updateReply() {
      this.getDetail(this.id)
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
.requirement-reply {
  margin-left: 18px;
}
.reply-user {
  display: flex;
}
.reply-time {
  margin-left: 2px;
  color: dodgerblue;
  font-style: italic;
}
.ant-form-item {
  margin-bottom: 0px;
}
.update-description {
  float: right;
}
</style>
