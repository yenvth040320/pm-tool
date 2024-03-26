<template>
  <a-modal
    :visible="openModal"
    :width="1280"
    :footer="null"
    @cancel="close"
  >
    <template slot="title">
      <span v-if="copyValue === true">
        {{ $t('module.question.create') }}
      </span>
      <span v-else>
        {{ id ? $t('module.question.edit') : $t('module.question.create') }}
      </span>
    </template>
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
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
                      :label="$t('module.question.function_id')"
                      prop="function_id"
                    >
                      <a-select
                        v-model="model.function_id"
                        :placeholder="$t('module.question.function_id')"
                        show-search
                        :filter-option="filterOption"
                        @change="changeFunction()"
                      >
                        <a-select-option
                          v-for="(item, i) in functions"
                          :key="i"
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
                      :label="$t('module.question.version_code')"
                      prop="version_code"
                    >
                      <a-select
                        v-model="model.version_code"
                        :placeholder="$t('module.question.version_code')"
                        show-search
                        :filter-option="filterOption"
                        @change="changeVersionFunction()"
                      >
                        <a-select-option
                          v-for="(item, index) in versionFunctions"
                          :key="index"
                          :value="item.version_code"
                        >
                          {{ item.version_code }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>

                  <a-col
                    :span="24"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.question.item_pk')"
                      prop="item_pk"
                    >
                      <a-select
                        v-model="model.item_pk"
                        :placeholder="$t('module.question.item_pk')"
                        show-search
                        :filter-option="filterOption"
                      >
                        <a-select-option
                          v-for="(item, index) in functionItemData"
                          :key="index"
                          :value="item.item_pk"
                        >
                          {{ item.item_num }}: {{ item.name + ' (' + item.mstItemType.name + ')' }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>

                  <a-col
                    :span="24"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.question.category')"
                      prop="category"
                    >
                      <a-select
                        v-model="model.category"
                        :placeholder="$t('module.question.category')"
                        show-search
                        :filter-option="filterOption"
                      >
                        <a-select-option
                          v-for="(item, index) in CATEGORY_QUESTION"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
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
                  >
                    <a-form-model-item
                      :label="$t('module.question.title')"
                      prop="title"
                    >
                      <a-input
                        v-model="model.title"
                        :placeholder="$t('module.question.title')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :span="24"
                    :md="24"
                  >
                    <a-form-model-item
                      :label="$t('module.question.context')"
                      prop="context"
                    >
                      <div v-if="ckeditorReady">
                        <ckeditor
                          v-model="model.context"
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
                      :label="$t('module.question.question')"
                      prop="question"
                    >
                      <div v-if="ckeditorReady">
                        <ckeditor
                          v-model="model.question"
                          :editor="editor"
                          :config="editorConfig"
                          @ready="onReady"
                        />
                      </div>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </div>
              <div class="text-center p-3">
                <a-button
                  v-if="version"
                  html-type="submit"
                  type="primary"
                  class="min-w-100"
                  :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
                >
                  {{ id ? $t('common.update') : $t('common.create') }}
                </a-button>
                <a-button
                  v-else
                  html-type="submit"
                  type="primary"
                  class="min-w-100"
                >
                  <span v-if="copyValue === true">
                    {{ $t('common.create') }}
                  </span>
                  <span v-else>
                    {{ id ? $t('common.update') : $t('common.create') }}
                  </span>
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
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataForm from '~/mixins/data-form'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import { CATEGORY_QUESTION, STATUS_QUESTION, CKEDITOR_TOOLBAR_SETTING, LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'
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
  mixins: [DataForm],

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
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    },
    copyValue: {
      type: Boolean,
      default: false
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'question',
    functions: [],
    projects: [],
    openModal: false,
    loadModal: false,
    visible: false,
    versionCode: [],
    versionFunctions: [],
    functionItemData: [],
    functionItem: {},
    CATEGORY_QUESTION,
    ckeditorReady: false,
    LOCK_FLG_VALUE,
    USE_FLG_VALUE,
    STATUS_QUESTION,
    editor: DecoupledEditor,
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
        category: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.category') }),
            trigger: ['change', 'blur']
          }
        ],
        context: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.context') }),
            trigger: ['change', 'blur']
          }
        ],
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.title') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.item_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        question: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.question') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.question.version_code') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  watch: {
    'model.function_id': 'getListVersion',
    'model.version_code': 'getListFunctionItem'
  },

  /**
   * Mounted event.
   */
  mounted() {
  },

  /**
   * List of methods.
   */
  methods: {
    open(data, func, category) {
      this.model = {
        question: '',
        context: ''
      }
      if (category) {
        this.$set(this.model, 'category', category)
      }
      this.functionItem = cloneDeep(data)
      this.functionTarget = cloneDeep(func)
      this.openModal = true
      this.ckeditorReady = true
      this.getListFunctions()
    },

    close() {
      this.openModal = false
      this.ckeditorReady = false
      this.$emit('cancel')
    },

    changeFunction() {
      this.$set(this.model, 'version_code', undefined)
      this.$set(this.model, 'item_pk', undefined)
    },

    changeVersionFunction() {
      this.$set(this.model, 'item_pk', undefined)
    },

    async getListFunctions() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.function.getListFunction({ params })
        this.functions = data
        if (this.version && this.version.id) {
          this.$set(this.model, 'function_id', this.version.function_id)
          if (this.functionItem) {
            this.$set(this.model, 'item_pk', this.functionItem.item_pk)
          }
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async getListVersion() {
      try {
        if (this.model.function_id) {
          const params = {
            function_id: this.model.function_id,
            project_id: this.$store.state.project.id,
            order_by: 'version_code',
            order_type: 0,
            isNotHasItem: true
          }
          const { data: { result: { data } } } = await this.$api.versionFunction.getListVersion({ params })
          this.versionFunctions = data
          if (this.version && this.version.function_id === this.model.function_id) {
            this.$set(this.model, 'version_code', this.version.version_code)
          } else if (this.versionFunctions.length > 0) {
            this.$set(this.model, 'version_code', this.versionFunctions[0].version_code)
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListFunctionItem() {
      try {
        if (this.model.function_id && this.model.version_code) {
          const params = {
            function_id: this.model.function_id,
            version_code: this.model.version_code
          }
          const { data: { result: { data } } } = await this.$api.functionItem.getListFunctionItem({ params })
          this.functionItemData = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
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
        category: this.model.category,
        context: this.model.context,
        created_at: this.model.created_at,
        function_id: this.model.function_id,
        title: this.model.title,
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
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            if (this.model.id) {
              if (this.copyValue) {
                await this.repository.create(data)
              } else {
                await this.repository.update(this.model.id, data)
              }
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
            this.$emit('success')
            this.close()
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
  .ck-editor__editable {
    min-height: 200px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
  .info-question {
    .ant-col-sm-7 {
      width: 14.3%;
    }
    .ant-col-sm-17 {
      width: 85.7%;
    }
  }
}
</style>
