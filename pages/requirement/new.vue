<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.requirement') }}
    </template>

    <requirement-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import RequirementForm from '~/components/templates/requirement/RequirementForm'

export default {
  /**
     * Declare components.
     */
  components: { RequirementForm },

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
