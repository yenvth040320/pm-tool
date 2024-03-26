<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionItemReadDatasource') }}
    </template>

    <functionItemReadDatasource-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionItemReadDatasourceForm from '~/components/templates/functionItemReadDatasource/FunctionItemReadDatasourceForm'

export default {
  components: { FunctionItemReadDatasourceForm },
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
