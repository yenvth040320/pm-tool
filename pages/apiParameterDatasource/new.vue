<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.apiParameterDatasource') }}
    </template>

    <apiParameterDatasource-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiParameterDatasourceForm from '~/components/templates/apiParameterDatasource/ApiParameterDatasourceForm'

export default {
  components: { ApiParameterDatasourceForm },
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
