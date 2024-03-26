<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.testSession') }}
    </template>

    <testSession-form
      :id="id"
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
  components: {
    TestSessionForm
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
      this.$router.push({
        path: '../',
        append: true
      })
    }
  }
}
</script>
