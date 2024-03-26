<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionResultDetail') }}
    </template>

    <functionResultDetail-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionResultDetailForm from '~/components/templates/functionResultDetail/FunctionResultDetailForm'

export default {
  components: { FunctionResultDetailForm },
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
