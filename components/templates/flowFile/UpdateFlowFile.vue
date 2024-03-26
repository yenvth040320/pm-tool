<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
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
              :label="$t('module.flowFile.title')"
              prop="title"
            >
              <a-input
                v-model="model.title"
                :placeholder="$t('module.flowFile.title')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :id="'image'"
            >
              <span class="image__item">
                {{ $t('module.flowFile.image_url') }}
              </span>
              <FileForm
                :image-item="image_url"
                @getImage="getImage"
                @clearError="error = false"
              />
              <div
                v-if="error"
                class="errors-wrap"
              >
                <span class="message-error"> {{ message }}</span>
              </div>
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
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { API_ROOT_URL } from '~/constants/index'
import FileForm from '~/components/templates/flowFile/FileForm.vue'
export default {
  components: { FileForm },
  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  props: {
    flow: {
      type: [Object],
      default: () => {}
    }
  },

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

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'flowFile',
    loadingImage: false,
    error: false,
    message: '',
    image_url: '',
    API_ROOT_URL,
    flowFile: [],
    previewVisible: false,
    previewImage: '',
    fileList: [],
    item_id: ''
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        title: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.flowFile.title') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.flowFile.title'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        image_url: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.flowFile.image_url') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
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
    /**
     * Get image
     */
    getImage(url) {
      this.model.image_url = url
      const field = this.$refs.form.fields.find(item => item.id === 'image')
      if (field) {
        field.onFieldChange()
        field.validate()
      }
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        flow_id: this.model.flow_id,
        title: this.model.title,
        image_url: this.model.image_url
      }

      return model
    },

    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.image_url = data.image_url
      this.model = data
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)
          try {
            const data = this.getModel()
            if (data.image_url === undefined) {
              this.error = true
              this.message = this.$t('validation.required_image')
              return
            }
            const data2 = new FormData()
            data2.append('title', data.title)
            data2.append('project_id', this.$store.state.project.id)
            data2.append('flow_id', this.flow.id)
            data2.append('image_url', data.image_url)
            if (this.model.id) {
              data2.append('id', this.model.id)
              await this.repository.updateItem(this.model.id, data2, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
              this.$notification.success({
                message: this.$t('text.successfully')
              })
            } else {
              await this.repository.create(data2, {
                headers: {
                  'Content-type': 'multipart/form-data'
                }
              })
              this.$notification.success({
                message: this.$t('text.successfully')
              })
            }
            this.$bus.$emit('updateFlowFile')
            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        } else if (!this.model.image_url) {
          this.error = true
          this.message = this.$t('validation.required_image')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-list-item-actions {
        .anticon-eye-o {
        display: none;
      }
      }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
.errors-wrap {
  position: absolute;
  bottom: -30px;
  left: 0;
  .message-error {
    color: #f5222d;
  }
}
</style>
