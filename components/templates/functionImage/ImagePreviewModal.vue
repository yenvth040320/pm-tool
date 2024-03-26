<template>
  <a-modal :visible="openModal" :centered="true" :closable="false" @cancel="close" @ok="$emit('changeImage')">
    <div class="content">
      <img class="media" :src="url" alt="" />
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      openModal: false,
      url: ''
    }
  },

  methods: {
    /**
     * Open modal
     */
    open(url) {
      this.url = ''
      this.openModal = true
      this.url = url
      this.$forceUpdate()
    },

    /**
     * Close modal
     */
    close() {
      this.openModal = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .ant-modal {
    width: 520px !important;
    max-width: 520px;
  }
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.media {
  width: 80%;
  height: 80%;
}
</style>
