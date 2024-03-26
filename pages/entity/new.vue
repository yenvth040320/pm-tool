<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.add') }} {{ $t('module.entity') }}
    </template>

    <entity-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import EntityForm from '~/components/templates/entity/EntityForm'

export default {
  /**
   * Declare components.
   */
  components: { EntityForm },

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
