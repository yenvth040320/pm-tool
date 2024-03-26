<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + $t('common.create') + ' ' + $t('module.category') }}
    </template>

    <category-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import CategoryForm from '~/components/templates/category/CategoryForm'

export default {
  components: { CategoryForm },

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
