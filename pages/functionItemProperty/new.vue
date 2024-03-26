<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionItemProperty') }}
    </template>

    <functionItemProperty-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionItemPropertyForm from '~/components/templates/functionItemProperty/FunctionItemPropertyForm'

export default {
  components: { FunctionItemPropertyForm },
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
