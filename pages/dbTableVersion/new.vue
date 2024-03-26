<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.dbTableVersion') }}
    </template>

    <dbTableVersion-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import DbTableVersionForm from '~/components/templates/dbTableVersion/DbTableVersionForm'

export default {
  components: { DbTableVersionForm },
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
