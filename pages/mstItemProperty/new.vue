<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstItemProperty') }}
    </template>

    <mstItemProperty-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstItemPropertyForm from '~/components/templates/mstItemProperty/MstItemPropertyForm'

export default {
  components: { MstItemPropertyForm },
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
