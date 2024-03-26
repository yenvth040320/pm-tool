<template>
  <div>
    <div v-if="check !== undefined">
      <div
        id="visual"
        ref="visual"
        v-html="visualContent"
      />
    </div>
    <div v-else class="no-diff">
      {{ $t('Không có sự thay đổi') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visualContent: '',
      check: {}
    }
  },
  watch: {
    task(newVal) {
      this.$nextTick(() => {
        this.updateDiffContent()
      })
    }
  },
  mounted() {
    this.updateDiffContent()
  },
  methods: {
    updateDiffContent() {
      const propertiesToRemove = ['id', 'updated_at', 'created_at']

      const jsonBeforeParsed = this.removeProperties(this.task.json_before, propertiesToRemove)
      const jsonAfterParsed = this.removeProperties(this.task.json_after, propertiesToRemove)
      const delta = this.$jsonDiff.diff(jsonBeforeParsed, jsonAfterParsed)
      this.check = delta
      const left = jsonBeforeParsed
      const visualEl = this.$refs.visual
      const jsonDiffFormatters = this.$jsonDiffFormatters
      if (visualEl) {
        const visualContent = jsonDiffFormatters.html.format(delta, left)
        visualEl.innerHTML = visualContent
        jsonDiffFormatters.html.hideUnchanged()
      }
    },
    removeProperties(jsonString, propertiesToRemove) {
      const jsonObject = JSON.parse(jsonString)

      propertiesToRemove.forEach(property => {
        delete jsonObject[property]
      })

      return jsonObject
    }
  }
}
</script>
  <style lang="scss" scoped>

  :deep() {
    .jsondiffpatch-delta {
      width: 100%;
    }
    .jsondiffpatch-annotated-delta {
      width: 100% !important;
      overflow-y: scroll !important;
    }
  }
  .no-diff {
    text-align: center;
    font-weight: 700;
    font-size: 18px;
  }
  </style>
