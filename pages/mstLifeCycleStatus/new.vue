<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.mstLifeCycleStatus') }}
    </template>

    <mstLifeCycleStatus-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstLifeCycleStatusForm from '~/components/templates/mstLifeCycleStatus/MstLifeCycleStatusForm'

export default {
  components: { MstLifeCycleStatusForm },
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
