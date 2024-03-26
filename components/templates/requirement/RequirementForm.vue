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
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.requirement.type')"
              prop="type"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <a-radio-group
                v-model="model.type"
              >
                <a-radio
                  v-for="type in REQUIREMENT_TYPE"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.requirement.title')"
              prop="title"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <a-textarea
                id="requirement_title"
                v-model="model.title"
                :placeholder="$t('module.requirement.title')"
                auto-size
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.requirement.content')"
              prop="content"
              :label-col="{ sm: 2 }"
              :wrapper-col="{ sm: 22 }"
            >
              <div v-if="ckeditorReady">
                <ckeditor
                  v-model="model.content"
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
              :label="$t('module.requirement.status_request')"
              prop="status_request"
            >
              <a-select
                id="requirement_status_request"
                v-model="model.status_request"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_request')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_REQUEST_STATUS"
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
              v-if="!model.id"
              :label="$t('module.requirement.status_processing')"
              prop="status_processing"
            >
              <a-select
                id="requirement_status_processing"
                v-model="model.status_processing"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_processing')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_PROCESS_STATUS.slice(0, 1)"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-else
              :label="$t('module.requirement.status_processing')"
              prop="status_processing"
            >
              <a-select
                id="requirement_status_processing"
                v-model="model.status_processing"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_processing')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_PROCESS_STATUS"
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
              :label="$t('module.requirement.et_customer_accepted')"
              prop="et_customer_accepted"
            >
              <a-input-number
                id="requirement_et_customer_accepted"
                v-model="model.et_customer_accepted"
                :step="0.01"
                :min="0"
                @keypress.native="preventAlphabetCharacterInput($event)"
                @change="handleChangeCustomerAcceptedEt"
              />
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
              <a-input-number
                id="requirement_point_et"
                v-model="model.point_et"
                :step="0.01"
                :min="0"
                @keypress.native="preventAlphabetCharacterInput($event)"
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
    </a-spin>
  </a-form-model>
</template>

<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataForm from '~/mixins/data-form'
import {
  REQUIREMENT_TYPE,
  CKEDITOR_TOOLBAR_SETTING,
  REQUIREMENT_REQUEST_STATUS,
  REQUIREMENT_PROCESS_STATUS,
  REQUIREMENT_PROCESS_STATUS_VALUE,
  REQUIREMENT_REQUEST_STATUS_VALUE,
  REQUIREMENT_TYPE_VALUE
} from '~/constants'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'

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
  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'requirement',
    REQUIREMENT_TYPE,
    REQUIREMENT_REQUEST_STATUS,
    REQUIREMENT_PROCESS_STATUS,
    REQUIREMENT_PROCESS_STATUS_VALUE,
    REQUIREMENT_REQUEST_STATUS_VALUE,
    REQUIREMENT_TYPE_VALUE,
    editorConfig: {
      extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
      language: 'vi',
      toolbar: CKEDITOR_TOOLBAR_SETTING
    },
    editor: DecoupledEditor,
    ckeditorReady: true
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
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.title') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.requirement.title'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        content: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.content') }),
            trigger: ['change', 'blur']
          }
        ],
        status_request: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.status_request') }),
            trigger: ['change', 'blur']
          }
        ],
        status_processing: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.status_processing') }),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.type') }),
            trigger: ['change', 'blur']
          }
        ]
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
  mounted() {},

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
    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
      if (!this.model.id) {
        this.$set(this.model, 'status_request', REQUIREMENT_REQUEST_STATUS_VALUE.open)
        this.$set(this.model, 'status_processing', REQUIREMENT_PROCESS_STATUS_VALUE.new)
        this.$set(this.model, 'type', REQUIREMENT_TYPE_VALUE.customer)
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
        title: this.model.title,
        content: this.model.content,
        status_request: this.model.status_request,
        status_processing: this.model.status_processing,
        dev_point_et: this.model.dev_point_et,
        pm_point_et: this.model.pm_point_et,
        com_point_et: this.model.com_point_et,
        test_point_et: this.model.test_point_et,
        et_internal: this.model.et_internal,
        et_customer_accepted: this.model.et_customer_accepted,
        point_et: this.model.point_et,
        type: this.model.type,
        is_deleted: this.model.is_deleted
      }

      return model
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
     * On change customer accepted et input
     */
    handleChangeCustomerAcceptedEt() {
      this.model.point_et = this.model.et_customer_accepted * 8 * 20
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
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              data.project_id = this.$store.state.project.id
              await this.repository.create(data)
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
  .ant-input-number {
    width: 100%;
  }
}
</style>
