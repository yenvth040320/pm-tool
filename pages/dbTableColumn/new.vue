<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.dbTableColumn') }}
    </template>

    <dbTableColumn-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import DbTableColumnForm from '~/components/templates/dbTableColumn/DbTableColumnForm'

export default {
  components: { DbTableColumnForm },
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
