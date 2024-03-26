<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.testSession') }}
    </template>

    <testSession-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import TestSessionForm from '~/components/templates/testSession/TestSessionForm'

export default {
  /**
   * Declare components.
   */
  components: { TestSessionForm },

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
