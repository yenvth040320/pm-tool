<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionItemWriteDatasource') }}
    </template>

    <functionItemWriteDatasource-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionItemWriteDatasourceForm from '~/components/templates/functionItemWriteDatasource/FunctionItemWriteDatasourceForm'

export default {
  components: { FunctionItemWriteDatasourceForm },
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
