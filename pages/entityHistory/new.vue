<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.entityHistory') }}
    </template>

    <entityHistory-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import EntityHistoryForm from '~/components/templates/entityHistory/EntityHistoryForm'

export default {
  /**
   * Declare components.
   */
  components: { EntityHistoryForm },

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
