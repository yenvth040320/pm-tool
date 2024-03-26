<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.versionApi') }}
    </template>

    <versionApi-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import VersionApiForm from '~/components/templates/versionApi/VersionApiForm'

export default {
  components: { VersionApiForm },
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
