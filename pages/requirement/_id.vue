<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.requirement') }}
    </template>

    <requirement-form
      :id="id"
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
  components: {
    RequirementForm
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
