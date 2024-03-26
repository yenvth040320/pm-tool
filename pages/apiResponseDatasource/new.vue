<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.apiResponseDatasource') }}
    </template>

    <apiResponseDatasource-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiResponseDatasourceForm from '~/components/templates/apiResponseDatasource/ApiResponseDatasourceForm'

export default {
  components: { ApiResponseDatasourceForm },
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
