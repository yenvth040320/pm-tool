<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.functionEvent') }}
    </template>

    <functionEvent-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionEventForm from '~/components/templates/functionEvent/FunctionEventForm'

export default {
  components: { FunctionEventForm },
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
