<template>
  <div class="modal-container">
    <div class="replier-name">
      <p>{{ item.created_user.name }}</p>
      <p>{{ item.created_at ? getDateTime(item.created_at) : '' }}</p>
      <div class="icons-wrapper">
        <a-icon type="edit" @click="edit" />
      </div>
    </div>
    <div v-if="editable" class="content-reply ck ck-content">
      <div v-if="readyEditor">
        <ckeditor
          v-model="item.answer"
          :editor="editor"
          :config="editorConfig"
          @ready="onReady"
        />
      </div>
      <div class="p-3">
        <a-button
          html-type="button"
          type="primary"
          class="min-w-100"
          @click="updateRecord(item.id)"
        >
          {{ $t('common.save') }}
        </a-button>
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="cancelEdit"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </div>
    <div v-else class="content-reply ck ck-content">
      <div class="note-content" v-html="item.answer" />
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import { CKEDITOR_TOOLBAR_SETTING, FORMAT_DATE_TIME } from '~/constants'

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
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      value: this.text,
      editable: false,
      editorConfig: {
        extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
        language: 'vi',
        toolbar: CKEDITOR_TOOLBAR_SETTING
      },
      editor: DecoupledEditor,
      FORMAT_DATE_TIME,
      moment,
      readyEditor: false
    }
  },

  watch: {},

  methods: {
    onReady(editor) {
      // Note: Using DecoupledEditor then Insert the toolbar by manual before the editable area.
      setTimeout(() => {
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        )
      }, 100)
    },

    cancelEdit() {
      this.editable = false
      this.readyEditor = false
      this.$emit('updateReply')
    },

    edit() {
      this.editable = true
      this.readyEditor = true
    },

    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    async updateRecord(id) {
      try {
        const data = {
          project_id: this.item.project_id,
          answer: this.item.answer,
          question_id: this.item.question_id,
          is_deleted: 0
        }
        await this.$api.answer.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('updateReply')
        this.editable = false
        this.readyEditor = false
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .modal-container {
    position: relative;
    width: 100%;
    display: flex;
  }
  /deep/ {
    .replier-name {
    width: 20.16666667%;
    display: block;
  }
  .content-reply {
    width: 79.83333333%;
  }

  .anticon-edit > svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .icons-wrapper {
    top: 0;
    right: 0;
  }
}
</style>
