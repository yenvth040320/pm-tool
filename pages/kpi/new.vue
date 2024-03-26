<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.kpi') }}
    </template>

    <kpi-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import KpiForm from '~/components/templates/kpi/KpiForm'

export default {
  /**
   * Declare components.
   */
  components: { KpiForm },

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
