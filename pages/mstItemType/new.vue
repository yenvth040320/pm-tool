<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstItemType') }}
    </template>

    <mstItemType-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstItemTypeForm from '~/components/templates/mstItemType/MstItemTypeForm'

export default {
  components: { MstItemTypeForm },
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
