<template>
  <a-card class="mb-4 no-border">
    <requirement-detail-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>
import RequirementDetailForm from '~/components/templates/requirement/RequirementDetailForm'

export default {
  /**
       * Declare components.
       */
  components: {
    RequirementDetailForm
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
