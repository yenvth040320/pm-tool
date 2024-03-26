<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.bug') + '#' + id }}
    </template>

    <bug-internal-form
      :id="id"
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
  components: {
    BugInternalForm
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
