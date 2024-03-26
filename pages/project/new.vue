<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.project') }}
    </template>

    <project-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ProjectForm from '~/components/templates/project/ProjectForm'

export default {
  components: { ProjectForm },
  methods: {
    /**
     * Go to list
     */
    goBack() {
      this.$router.push({
        path: '../',
        append: true
      })
    }
  }
}
</script>
