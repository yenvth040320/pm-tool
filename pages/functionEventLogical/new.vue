<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionEventLogical') }}
    </template>

    <functionEventLogical-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionEventLogicalForm from '~/components/templates/functionEventLogical/FunctionEventLogicalForm'

export default {
  components: { FunctionEventLogicalForm },
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
