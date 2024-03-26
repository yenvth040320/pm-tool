<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.flow') }}
    </template>

    <flow-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FlowForm from '~/components/templates/flow/FlowForm'

export default {
  /**
   * Declare components.
   */
  components: { FlowForm },

  /**
   * Methods.
   */
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
