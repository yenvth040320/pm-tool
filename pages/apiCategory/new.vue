<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + $t('common.create') + ' ' + $t('module.apiCategory') }}
    </template>

    <apiCategory-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiCategoryForm from '~/components/templates/apiCategory/ApiCategoryForm'

export default {
  components: { ApiCategoryForm },
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
