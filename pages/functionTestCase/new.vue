<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionTestCase') }}
    </template>

    <functionTestCase-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionTestCaseForm from '~/components/templates/functionTestCase/FunctionTestCaseForm'

export default {
  components: { FunctionTestCaseForm },
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
