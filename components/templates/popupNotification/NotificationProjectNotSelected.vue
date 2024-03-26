<template>
  <a-modal v-model="notifiSelectProject" class="modal-notifi" :centered="true" :cancel-text="$t('common.ok')" @cancel="hiddenModalNotifiProject">
    <p class="text">
      {{ $t('module.project.project_not_selected_yet.error') }}
    </p>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      notifiSelectProject: false
    }
  },
  mounted() {
    if (this.$store.state.project.id === 0) {
      this.notifiSelectProject = true
    }
  },
  methods: {
    hiddenModalNotifiProject() {
      this.$router.push('/project')
      this.notifiSelectProject = false
    }
  }
}
</script>
