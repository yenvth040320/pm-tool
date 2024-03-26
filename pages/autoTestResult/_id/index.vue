<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.autoTestResult.add_test_result') }}
    </template>

    <autoTest-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>
import AutoTestForm from '~/components/templates/autoTestResultDetail/AutoTestForm'

export default {
  /**
   * Declare components.
   */
  components: {
    AutoTestForm
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      id: +this.$route.params.id || 0
    }
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * Go to list
     */
    goBack() {
      this.$router.push({ name: 'autoTestResult' })
    }
  }
}
</script>
