<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.flowFile') }}
    </template>

    <FlowFile-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FlowFileForm from '~/components/templates/flowFile/FlowFileForm'

export default {
  /**
   * Declare components.
   */
  components: { FlowFileForm },

  /**
   * Methods.
   */
  methods: {
    /**
     * Go to list
     */
    goBack() {
      this.$router.push({
        path: '/flow#tab_file',
        append: true
      })
    }
  }
}
</script>
