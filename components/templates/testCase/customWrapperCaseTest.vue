<template>
  <Draggable ghost-class="ghost" tag="tbody" :list="list.caseTests" @change="onChange">
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
  mounted() {},
  methods: {
    onChange(evt) {
      this.data.changePosition(evt.moved, 'caseTests')
    }
  }
}
</script>
