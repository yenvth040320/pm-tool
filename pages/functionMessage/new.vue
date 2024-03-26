<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionMessage') }}
    </template>

    <functionMessage-form
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
  components: { FunctionMessageForm },

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
