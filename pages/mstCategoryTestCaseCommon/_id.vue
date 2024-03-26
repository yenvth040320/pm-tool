<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.edit') }} {{ $t('module.mstCategoryTestCaseCommon') }}
    </template>

    <mstCategoryTestCaseCommon-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import MstCategoryTestCaseCommonForm from '~/components/templates/mstCategoryTestCaseCommon/MstCategoryTestCaseCommonForm'

export default {
  components: {
    MstCategoryTestCaseCommonForm
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
