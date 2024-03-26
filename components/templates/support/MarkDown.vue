<template>
  <div id="content" />
</template>
<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
export default {
  props: {
    fileName: {
      type: String,
      default: ''
    }
  },

  watch: {
    fileName() {
      this.initMdContent()
    }
  },

  mounted() {
    this.initMdContent()
  },

  methods: {
    initMdContent() {
      if (this.fileName) {
        fetch(`/md/${this.fileName}.md`)
          .then(response => response.text())
          .then(text => {
            const markdownContent = document.getElementById('content')
            markdownContent.innerHTML = marked.parse(text, {
              langPrefix: 'hljs language-',
              highlight(code, lang, info) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext'
                return hljs.highlight(code, { language }).value
              }
            })
          })
          .catch(() => {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          })
      }
    }
  }
}
</script>
<style src="~/assets/scss/md.scss" lang="scss" scoped></style>
