<template>
  <div>
    <div v-if="delta !== undefined">
      <a-button
        html-type="button"
        type="default"
        class="min-w-100"
        @click="toggleDisplayMode"
      >
        {{ displayMode === 1 ? 'Show Visual' : 'Show Annotated' }}
      </a-button>
      <div
        id="annotated"
        ref="annotated"
        :class="displayMode === 1 ? 'hide' : 'show'"
        v-html="annotatedContent"
      />
      <div
        id="visual"
        ref="visual"
        :class="displayMode === 2 ? 'hide' : 'show'"
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
    delta: {
      type: Object,
      default: () => {}
    },
    left: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visualContent: '',
      annotatedContent: '',
      displayMode: 1
    }
  },
  watch: {
    delta(newVal) {
      this.$nextTick(() => {
        this.displayMode = 1
        this.updateDiffContent()
      })
    }
  },
  mounted() {
    this.updateDiffContent()
  },
  methods: {
    updateDiffContent() {
      const delta = this.delta
      const left = this.left
      const visualEl = this.$refs.visual
      const annotatedEl = this.$refs.annotated
      const jsonDiffFormatters = this.$jsonDiffFormatters
      if (visualEl && annotatedEl) {
        const visualContent = jsonDiffFormatters.html.format(delta, left)
        const annotatedContent = jsonDiffFormatters.annotated.format(
          delta,
          left
        )
        visualEl.innerHTML = visualContent
        annotatedEl.innerHTML = annotatedContent
      }
    },
    toggleDisplayMode() {
      this.displayMode = this.displayMode === 1 ? 2 : 1
      this.updateDiffContent()
    }
  }
}
</script>
<style lang="scss" scoped>
.hide {
  display: none;
}
.show {
  display: block;
}
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
