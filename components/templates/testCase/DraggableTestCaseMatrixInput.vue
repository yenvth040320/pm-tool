<template>
  <Draggable ref="draggable" ghost-class="ghost" tag="tbody" :list="list.matrix.testcaseMatrixInputs" @change="onChange">
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
    this.disableDraggableOnInput()
  },
  methods: {
    disableDraggableOnInput() {
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
      this.data.changePosition(evt.moved, 'testcaseMatrixInputs')
    }
  }
}
</script>
