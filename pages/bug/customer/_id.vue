<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.bug') + '#' + id }}
    </template>

    <bug-customer-form
      :id="id"
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
  components: {
    BugCustomerForm
  },

  /**
     * Init data for component.
     */
  data() {
    return {
      id: +this.$route.params.id || 0,
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
      this.$router.push({ name: 'bug-detail-id', params: { id: this.id } })
    }
  }
}
</script>
