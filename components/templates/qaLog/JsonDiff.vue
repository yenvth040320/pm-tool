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
    logItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visualContent: '',
      check: {}
    }
  },
  watch: {
    logItem(newVal) {
      this.$nextTick(() => {
        this.convertDiffContent()
      })
    }
  },

  mounted() {
    this.convertDiffContent()
  },

  methods: {
    /**
     * Convert json diff to lib content
     */
    convertDiffContent() {
      const jsonBefore = JSON.parse(this.logItem.json_before)
      const jsonAfter = JSON.parse(this.logItem.json_after)
      const delta = this.$jsonDiff.diff(jsonBefore, jsonAfter)
      this.check = delta
      const left = jsonBefore
      const visualEl = this.$refs.visual
      const jsonDiffFormatters = this.$jsonDiffFormatters
      if (visualEl) {
        const visualContent = jsonDiffFormatters.html.format(delta, left)
        visualEl.innerHTML = visualContent
        jsonDiffFormatters.html.hideUnchanged()
      }
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
