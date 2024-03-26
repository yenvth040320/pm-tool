<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.autoTestResult.add_test_result') }}
    </template>

    <autoTest-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import AutoTestForm from '~/components/templates/autoTestResultDetail/AutoTestForm'

export default {
  components: { AutoTestForm },
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
