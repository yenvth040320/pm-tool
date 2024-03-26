<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstCategoryTestCaseCommon') }}
    </template>

    <mstCategoryTestCaseCommon-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstCategoryTestCaseCommonForm from '~/components/templates/mstCategoryTestCaseCommon/MstCategoryTestCaseCommonForm'

export default {
  components: { MstCategoryTestCaseCommonForm },
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
