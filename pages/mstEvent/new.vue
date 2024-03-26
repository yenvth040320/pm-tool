<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstEvent') }}
    </template>

    <mstEvent-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstEventForm from '~/components/templates/mstEvent/MstEventForm'

export default {
  components: { MstEventForm },
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
