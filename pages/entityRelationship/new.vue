<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.entityRelationship') }}
    </template>

    <entityRelationship-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import EntityRelationshipForm from '~/components/templates/entityRelationship/EntityRelationshipForm'

export default {
  /**
   * Declare components.
   */
  components: { EntityRelationshipForm },

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
