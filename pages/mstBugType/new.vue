<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.create') }} {{ $t('module.mstBugType') }}
    </template>

    <mstBugType-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MstBugTypeForm from '~/components/templates/mstBugType/MstBugTypeForm'

export default {
  components: { MstBugTypeForm },
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
