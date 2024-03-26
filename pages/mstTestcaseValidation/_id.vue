<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.edit') }} {{ $t('module.mstTestcaseValidation') }}
    </template>

    <mstTestcaseValidation-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import MstTestcaseValidationForm from '~/components/templates/mstTestcaseValidation/MstTestcaseValidationForm'

export default {
  components: {
    MstTestcaseValidationForm
  },

  data() {
    return {
      id: +this.$route.params.id || 0
    }
  },

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
