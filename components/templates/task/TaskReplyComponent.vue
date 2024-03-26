<template>
  <div>
    <div class="reply-user">
      <div>
        {{ reply.replier.name }}
      </div>
      <div
        class="reply-time"
      >
        {{ reply.reply_datetime ? getDateTime(reply.reply_datetime) : '' }}
      </div>
      <div
        v-if="$auth.user.id === reply.user_id && task.status !== TASK_STATUS_VALUE.done"
        class="reply-edit"
      >
        <a-icon type="edit" @click="edit" />
      </div>
    </div>
    <div v-if="editable && $auth.user.id === reply.user_id && task.status !== TASK_STATUS_VALUE.done">
      <div v-if="readyEditor">
        <ckeditor
          v-model="reply.description"
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
          @click="updateRecord(reply.id)"
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
      <span v-html="reply.description" />
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import { CKEDITOR_TOOLBAR_SETTING, FORMAT_DATE_TIME, TASK_STATUS_VALUE } from '~/constants'

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
    reply: {
      type: Object,
      default: () => {}
    },
    task: {
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
      readyEditor: false,
      TASK_STATUS_VALUE
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
    },

    edit() {
      this.editable = true
      this.readyEditor = true
    },

    /**
     * Format date time
     */
    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    async updateRecord(id) {
      try {
        const data = { ...this.reply }
        delete data.replier
        await this.$api.taskReply.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.editable = false
        this.readyEditor = false

        this.$emit('updateReply')
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
  /deep/ {
    .anticon-delete > svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 5px;
    }
    .anticon-edit > svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 5px;
    }
  }
  .reply-edit {
    margin-left: 4px;
  }
  .reply-user {
    display: flex;
  }
  .reply-time {
    margin-left: 5px;
    color: dodgerblue;
    font-style: italic;
  }
.ck-editor__editable {
    min-height: 200px;
    background-color: #fff;
}
.ck.ck-editor__editable_inline {
  border: 1px solid var(--ck-color-toolbar-border);
}
  </style>
