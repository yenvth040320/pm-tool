<template>
  <a-modal :visible="openModal" :footer="null" :centered="true" @cancel="close">
    <div class="content">
      <video v-if="isVideo" class="media" :src="url" autoplay controls />
      <img v-if="!isVideo" class="media" :src="url" alt="" />
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      openModal: false,
      url: '',
      isVideo: false
    }
  },

  methods: {
    /**
     * Open modal
     */
    open(url, isVideo) {
      this.url = ''
      this.openModal = true
      this.isVideo = isVideo
      this.url = url
      this.$forceUpdate()
    },

    /**
     * Close modal
     */
    close() {
      this.openModal = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .ant-modal {
    width: 40% !important;
    max-width: 40%;
  }
}
.content {
  margin-top: 20px;
  width: 100%;
  height: 100%;
}

.media {
  width: 100%;
  height: 90%;
}
</style>
