<template>
  <div>
    <div class="reply-user">
      <div>
        {{ members.find(x => x.id === reply.updated_user)?.name }}
      </div>
      <div
        class="reply-time"
      >
        {{ moment(reply.updated_at).format(FORMAT_DATE_TIME) }}
      </div>
      <div
        class="reply-edit"
      >
        <a-icon type="edit" @click="edit" />
      </div>
      <div
        class="note-delete"
      >
        <a-icon type="delete" @click="confirmToDelete(reply.id)" />
      </div>
    </div>
    <div v-if="editable">
      <div v-if="readyEditor">
        <ckeditor
          v-model="reply.content"
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
    <div v-else>
      <div class="note-content" v-html="reply.content" />
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
    reply: {
      type: Object,
      default: () => {}
    },
    members: {
      type: Array,
      default: () => []
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
    },

    edit() {
      this.editable = true
      this.readyEditor = true
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.replyRequirement.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('updateReply')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async updateRecord(id) {
      try {
        const data = {
          content: this.reply.content,
          updated_user: this.$auth.user.id
        }
        await this.$api.replyRequirement.update(id, data)

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
</style>
