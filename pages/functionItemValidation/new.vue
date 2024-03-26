<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionItemValidation') }}
    </template>

    <functionItemValidation-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionItemValidationForm from '~/components/templates/functionItemValidation/FunctionItemValidationForm'

export default {
  components: { FunctionItemValidationForm },
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
