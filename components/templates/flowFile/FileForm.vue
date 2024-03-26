<template>
  <div class="image-item">
    <a-upload
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img
        v-if="file_url && !loading && isImageFile(file_url)"
        :src="file_url"
        alt="avatar"
      />
      <span v-else-if="file_url && !loading && !isImageFile(file_url)">
        <a-icon type="picture" />
      </span>
      <div v-if="!id && !isImageFile(file_url)" class="file-name">
        {{ selectedFile ? selectedFile.name : '' }}
      </div>
      <div v-else-if="!isImageFile(file_url)" class="file-name">
        {{ selectedFile ? selectedFile.name : extractFileName(file_url) }}
      </div>

      <div v-if="!file_url">
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
  </div>
</template>
<script>
import { API_ROOT_URL } from '~/constants/index'
export default {
  data() {
    return {
      loading: false,
      file_url: this.path,
      API_ROOT_URL,
      flowFile: [],
      selectedFile: null,
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  props: {
    path: {
      type: String || Object,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    path(val) {
      this.file_url = API_ROOT_URL + this.path
    }
  },

  methods: {
    beforeUpload(file) {
      this.selectedFile = file
      return true
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },

    handleChange(info) {
      this.$emit('clearError')

      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.file_url = imageUrl
          this.loading = false
        })
      }
      const url = info.file.originFileObj
      this.$emit('getFile', url)
    },

    isImageFile(url) {
      if (this.id) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
        const extension = url.substring(url.lastIndexOf('.')).toLowerCase()
        return imageExtensions.includes(extension)
      } else {
        const imagePrefixes = ['data:image/jpeg', 'data:image/png', 'data:image/gif', 'data:image/bmp']
        const prefix = url.substring(0, url.indexOf(';'))
        return imagePrefixes.includes(prefix)
      }
    },
    extractFileName(path) {
      const parts = path.split('/')
      return parts[parts.length - 1]
    }
  }
}
</script>
  <style lang="less" scoped>
    .image-item {
      padding-top: 5px;
    }
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
  </style>
