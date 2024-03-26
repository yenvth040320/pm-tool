<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.modelFrontend') }}
    </template>

    <model-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import ModelForm from '~/components/templates/model/ModelForm'

export default {
  components: {
    ModelForm
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
