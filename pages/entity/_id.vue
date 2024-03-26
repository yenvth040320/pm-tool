<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.entity') }}
    </template>

    <entity-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import EntityForm from '~/components/templates/entity/EntityForm'

export default {
  /**
   * Declare components.
   */
  components: {
    EntityForm
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
