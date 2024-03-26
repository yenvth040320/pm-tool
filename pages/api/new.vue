<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + this.$store.state.apiCategory.name + ' / ' + $t('common.create') + ' ' + $t('module.api') }}
    </template>

    <api-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiForm from '~/components/templates/api/ApiForm'

export default {
  components: { ApiForm },
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
