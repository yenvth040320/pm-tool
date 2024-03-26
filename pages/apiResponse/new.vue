<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.apiResponse') }}
    </template>

    <apiResponse-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiResponseForm from '~/components/templates/apiResponse/ApiResponseForm'

export default {
  components: { ApiResponseForm },
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
