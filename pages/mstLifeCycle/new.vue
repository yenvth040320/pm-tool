<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.mstLifeCycle') }}
    </template>

    <mstLifeCycle-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstLifeCycleForm from '~/components/templates/mstLifeCycle/MstLifeCycleForm'

export default {
  components: { MstLifeCycleForm },
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
