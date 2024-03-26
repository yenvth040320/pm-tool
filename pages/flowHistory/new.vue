<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.flowHistory') }}
    </template>

    <flowHistory-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FlowHistoryForm from '~/components/templates/flowHistory/FlowHistoryForm'

export default {
  /**
   * Declare components.
   */
  components: { FlowHistoryForm },

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
