<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('module.manage_member') }}
    </template>

    <project-manage-form
      :id="id"
      @goBack="goBack"
      @save="goBack"
    />
  </a-card>
</template>
<script>

import ProjectManageForm from '~/components/templates/project/ProjectManageForm'

export default {
  components: {
    ProjectManageForm
  },
  data() {
    return {
      id: this.$route.params.id || 0
    }
  },
  mounted() {
  },

  methods: {
    /**
     * Go to list
     */
    goBack() {
      this.$router.back()
    }
  }
}
</script>
