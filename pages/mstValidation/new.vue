<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstValidation') }}
    </template>

    <mstValidation-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstValidationForm from '~/components/templates/mstValidation/MstValidationForm'

export default {
  components: { MstValidationForm },
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
