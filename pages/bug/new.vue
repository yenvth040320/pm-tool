<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('module.bug.customer.create') }}
    </template>

    <bug-customer-form
      :ckeditor-ready="ckeditorReady"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import BugCustomerForm from '~/components/templates/bug/BugCustomerForm'

export default {
  /**
   * Declare components.
   */
  components: { BugCustomerForm },

  /**
   * Init data for component.
   */
  data() {
    return {
      ckeditorReady: true
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
