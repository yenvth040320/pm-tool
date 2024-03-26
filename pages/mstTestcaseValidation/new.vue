<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstTestcaseValidation') }}
    </template>

    <mstTestcaseValidation-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstTestcaseValidationForm from '~/components/templates/mstTestcaseValidation/MstTestcaseValidationForm'

export default {
  components: { MstTestcaseValidationForm },
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
