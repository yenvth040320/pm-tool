<template>
  <a-form-model
    ref="form"
    :model="model"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loadingImage">
      <div class="p-4">
        <a-upload
          ref="upload"
          v-model="funtionImage"
          list-type="picture-card"
          class="upload-img"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :remove="handleRemove"
          :class="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no ? 'only-read' : ''"
          @change="handleChange"
        >
          <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="plus-img">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </div>
      <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          :title="version.images.length !== 0 ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ version.images.length !== 0 ? $t('common.update') : $t('common.create') }}
        </a-button>
      </div>
    </a-spin>
    <image-preview-modal ref="filePreview" @changeImage="replaceImage" @close="selectFileId = null" />
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { USE_FLG, USE_FLG_VALUE, API_ROOT_URL, LOCK_FLG_VALUE } from '~/constants'
import ImagePreviewModal from '~/components/templates/functionImage/ImagePreviewModal'

export default {
  components: { ImagePreviewModal },
  mixins: [DataForm],
  props: {
    versionId: {
      type: [Number, String],
      default: 0
    },
    version: {
      type: [Object],
      default: () => {}
    },
    functionItem: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'functionImage',
    funtionImage: [],
    USE_FLG,
    USE_FLG_VALUE,
    fileList: [],
    previewVisible: false,
    previewImage: '',
    API_ROOT_URL,
    loadingImage: false,
    LOCK_FLG_VALUE,
    selectFileId: 0,
    file: {}
  }),

  watch: {
    version(newValue) {
      this.funtionImage = newValue.images
      this.fileList = []
      this.fileList = this.funtionImage.map(item => ({
        uid: item.id,
        url: API_ROOT_URL + item.image_path,
        name: item.image_path
      }))
    },

    functionItem(newValue) {
      this.functionItem = newValue
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    if (this.version) {
      this.funtionImage = this.version.images
      this.fileList = []
      this.fileList = this.funtionImage.map(item => ({
        uid: item.id,
        url: API_ROOT_URL + item.image_path,
        name: item.image_path
      }))
    }
  },

  /**
   * List of methods.
   */
  methods: {
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },

    /**
     * Change File
     */
    handleChange({ file, fileList }) {
      if (this.selectFileId) {
        this.confirmChangeImage(file)
      } else {
        this.fileList = fileList
        this.funtionImage = this.fileList
      }
    },
    /**
     * Close preview
     */
    handleCancel() {
      this.previewVisible = false
    },

    /**
     * Remove delete image
     */
    handleRemove(file) {
      if (file.originFileObj) {
        return true
      } else {
        this.selectFileId = file.uid
        const isHasItem = this.functionItem.some(item => item.function_image_id === file.uid)
        if (isHasItem) {
          this.$confirm({
            title: this.$t('text.confirm_to_change_image'),
            okText: this.$t('common.yes'),
            okType: 'danger',
            cancelText: this.$t('common.no'),
            onOk: () => this.changeImage(),
            onCancel: () => { this.selectFileId = null }
          })
          return false
        } else {
          this.$confirm({
            title: this.$t('text.confirm_to_delete_image'),
            okText: this.$t('common.yes'),
            okType: 'danger',
            cancelText: this.$t('common.no'),
            onOk: () => this.deleteImage(file.uid),
            onCancel: () => { this.selectFileId = null }
          })
          return false
        }
      }
    },

    changeImage() {
      const inputFile = this.$refs.upload.$el.querySelector('input[type="file"]')
      inputFile.click()
    },

    /**
     * Cancel update
     */
    cancel() {
      this.$emit('save')
    },

    /**
     * Check before upload file
     */
    beforeUpload(file) {
      const isJpgOrPng = file.type.startsWith('image/')
      if (isJpgOrPng) {
        return isJpgOrPng
      } else {
        this.$notification.error({
          message: this.$t('module.functionImage.upload_file.failed')
        })
        return new Promise((resolve, reject) => {
          reject(file)
        })
      }
    },

    /**
     * submit form
     */
    async handleSubmit() {
      this.loadingImage = true
      try {
        const data = new FormData()
        data.append('project_id', this.$store.state.project.id)
        data.append('function_id', this.version.function_id)
        data.append('version_code', this.version.version_code)
        data.append('use_flg', USE_FLG_VALUE.yes)
        if (this.fileList.length > 0) {
          this.fileList.forEach(file => {
            if (file.originFileObj) {
              data.append('file[]', file.originFileObj)
            } else {
              data.append('image[]', JSON.stringify(file))
            }
          })
        }

        await this.repository.upload(data, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        await this.$emit('handleOK')

        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadingImage = false
      }
    },

    /**
     * Replace Image
     */
    async replaceImage() {
      this.loadingImage = true
      try {
        const data = new FormData()
        if (this.file && this.selectFileId) {
          data.append('delete', this.selectFileId)
          data.append('file[]', this.file.originFileObj)
        }
        this.$refs.filePreview.close()
        await this.$api.functionImage.replaceImage(data, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        })
        this.$emit('handleOK')

        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadingImage = false
      }
    },

    async confirmChangeImage(file) {
      const url = await this.getBase64(file.originFileObj)
      if (url) {
        this.$refs.filePreview.open(url)
        this.file = file
      }
    },

    async deleteImage(uid) {
      this.loadingImage = true
      try {
        const data = new FormData()
        if (this.file && this.selectFileId) {
          data.append('delete', this.selectFileId)
          data.append('file[]', this.file.originFileObj)
        }

        await this.$api.functionImage.delete(uid)
        this.$emit('handleOK')
        this.selectFileId = null

        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadingImage = false
      }
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
  .ant-upload-select-picture-card {
    width: 200px;
    margin: auto;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  .image-function {
   padding: 20px;
  }
  .ant-modal {
    width: 50% !important;
  }
  .upload-img {
    display: flex;
    flex-direction: column
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    span {
      .ant-upload-list-item {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .ant-upload-list-item-list-type-picture-card {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.content {
  padding: 20px;
}
.only-read {
  :deep {
    .anticon-delete {
      display: none;
    }
  }
}
</style>
