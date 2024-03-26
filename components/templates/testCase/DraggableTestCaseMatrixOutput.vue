<template>
  <Draggable ref="draggable" ghost-class="ghost" tag="tbody" :list="list.matrix.testcaseMatrixOutputs" @change="onChange">
    <slot />
  </Draggable>
</template>
<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  inject: ['data', 'list'],

  data() {
    return {
      dragging: false
    }
  },
  mounted() {
    this.disableDraggableOnOutput()
  },
  methods: {
    disableDraggableOnOutput() {
      const inputs = document.querySelectorAll('textarea, input')
      if (inputs) {
        inputs.forEach(input => {
          input.addEventListener('mousedown', () => {
            this.$refs.draggable.disabled = true
          })
          input.addEventListener('mouseup', () => {
            this.$refs.draggable.disabled = false
          })
        })
      }
    },
    onChange(evt) {
      this.data.changePosition(evt.moved, 'testcaseMatrixOutputs')
    }
  }
}
</script>
