<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.apiInfo') }}
    </template>

    <apiInfo-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ApiInfoForm from '~/components/templates/apiInfo/ApiInfoForm'

export default {
  components: { ApiInfoForm },
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
