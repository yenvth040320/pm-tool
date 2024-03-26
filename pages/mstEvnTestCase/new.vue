<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstEvnTestCase') }}
    </template>

    <mstEvnTestCase-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstEvnTestCaseForm from '~/components/templates/mstEvnTestCase/MstEvnTestCaseForm'

export default {
  components: { MstEvnTestCaseForm },
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
