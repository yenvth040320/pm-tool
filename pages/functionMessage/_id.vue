<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.functionMessage') }}
    </template>

    <functionMessage-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FunctionMessageForm from '~/components/templates/functionMessage/FunctionMessageForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionMessageForm
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
