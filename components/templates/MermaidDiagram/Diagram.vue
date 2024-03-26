<template>
  <div class="container">
    <div class="mermaid-wrapper">
      <div
        :id="type"
        :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`, transformOrigin: `${zoomOriginX}px ${zoomOriginY}px` }"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @wheel="zoomAndPan"
      />
    </div>
    <div v-if="mermaidCode !== ''" class="btn-group mt-4">
      <a-button
        html-type="button"
        type="primary"
        ghost
        @click="zoomOut()"
      >
        <a-icon type="minus-circle" />
      </a-button>
      <a-button
        html-type="button"
        type="primary"
        ghost
        @click="resetZoom()"
      >
        Reset
      </a-button>
      <a-button
        html-type="button"
        type="primary"
        ghost
        @click="zoomIn()"
      >
        <a-icon type="plus-circle" />
      </a-button>
    </div>
  </div>
</template>

<script>
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs'
import { mapState } from 'vuex'
export default {
  props: {
  },

  data() {
    return {
      mermaidCode: '',
      type: '',
      zoomLevel: 1,
      zoomOriginX: 0,
      zoomOriginY: 0,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      translateX: 0,
      translateY: 0
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    })
  },

  watch: {
  },

  created() {
    mermaid.initialize({ startOnLoad: false })
  },

  mounted() {
  },

  methods: {
    /**
     * Render mermaid code to diagram
     *
     * @param val Mermaid code.
     * @param type Unique id for each diagram.
     */
    async render(val, type) {
      await this.setData(val, type)
      const mermaidElement = document.getElementById(this.type)
      mermaidElement.innerHTML = this.mermaidCode
      mermaidElement.removeAttribute('data-processed')
      mermaid.init(undefined, mermaidElement)
    },

    /**
     * Set data
     *
     * @param val Mermaid code.
     * @param type Unique id for each diagram.
     */
    setData(val, type) {
      this.mermaidCode = val
      this.type = type
    },

    /**
     * Zoom out diagram
     */
    zoomOut() {
      this.zoomLevel -= 0.05
    },

    /**
     * Reset zoom diagram
     */
    resetZoom() {
      this.zoomLevel = 1
      this.translateX = 0
      this.translateY = 0
      this.isDragging = false
    },

    /**
     * Zoom in diagram
     */
    zoomIn() {
      this.zoomLevel += 0.05
    },

    /**
     * Start drag diagram
     *
     * @param event
     */
    startDrag(event) {
      this.isDragging = true
      this.lastX = event.clientX
      this.lastY = event.clientY
    },

    /**
     * On dragging diagram
     *
     * @param event
     */
    drag(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.lastX
        const deltaY = event.clientY - this.lastY

        this.translateX += deltaX
        this.translateY += deltaY

        this.lastX = event.clientX
        this.lastY = event.clientY
      }
    },

    /**
     * End drag diagram
     */
    endDrag() {
      this.isDragging = false
    },

    /**
     * Mouse wheel event
     *
     * @param event
     */
    zoomAndPan(event) {
      event.preventDefault()
      if (event.deltaY > 0) {
        this.zoomOut()
      } else if (event.deltaY < 0) {
        this.zoomIn()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mermaid-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.container {
  min-height: 100px;
}
</style>
