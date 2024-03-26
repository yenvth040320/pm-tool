<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.dbTableForeignKey') }}
    </template>

    <dbTableForeignKey-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import DbTableForeignKeyForm from '~/components/templates/dbTableForeignKey/DbTableForeignKeyForm'

export default {
  components: { DbTableForeignKeyForm },
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
