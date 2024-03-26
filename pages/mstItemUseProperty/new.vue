<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.mstItemUseProperty') }}
    </template>

    <mstItemUseProperty-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstItemUsePropertyForm from '~/components/templates/mstItemUseProperty/MstItemUsePropertyForm'

export default {
  components: { MstItemUsePropertyForm },
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
