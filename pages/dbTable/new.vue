<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + this.$store.state.dbSchema.name + ' / ' + $t('common.create') + ' ' + $t('module.dbTable') }}
    </template>

    <dbTable-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import DbTableForm from '~/components/templates/dbTable/DbTableForm'

export default {
  components: { DbTableForm },
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
