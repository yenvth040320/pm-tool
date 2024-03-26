<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstTestCaseCommon') }}
    </template>

    <mstTestCaseCommon-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstTestCaseCommonForm from '~/components/templates/mstTestCaseCommon/MstTestCaseCommonForm'

export default {
  components: { MstTestCaseCommonForm },
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
