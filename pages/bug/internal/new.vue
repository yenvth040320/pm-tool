<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('module.bug.internal.create') }}
    </template>

    <bug-internal-form
      :ckeditor-ready="ckeditorReady"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import BugInternalForm from '~/components/templates/bug/BugInternalForm'

export default {
  /**
   * Declare components.
   */
  components: { BugInternalForm },

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
        path: '/bug',
        append: true
      })
    }
  }
}
</script>
