<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + $t('common.create') + ' ' + $t('module.dbSchema') }}
    </template>

    <dbSchema-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import DbSchemaForm from '~/components/templates/dbSchema/DbSchemaForm'

export default {
  components: { DbSchemaForm },
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
