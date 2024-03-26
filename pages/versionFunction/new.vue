<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.versionFunction') }}
    </template>

    <versionFunction-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import VersionFunctionForm from '~/components/templates/versionFunction/VersionFunctionForm'

export default {
  components: { VersionFunctionForm },
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
