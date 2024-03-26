<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.bug') + '#' + id }}
    </template>

    <bug-form
      :id="id"
      :ckeditor-ready="ckeditorReady"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>
import BugForm from '~/components/templates/bug/BugForm'

export default {
  /**
   * Declare components.
   */
  components: {
    BugForm
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
