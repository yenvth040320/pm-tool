<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="this.$store.state.category.id !== 0">
        {{ this.$store.state.project.name + ' / ' + this.$store.state.category.name + ' / ' + $t('common.create') + ' ' + $t('module.function') }}
      </span>
      <span v-else>
        {{ this.$store.state.project.name + ' / ' + $t('common.create') + ' ' + $t('module.function') }}
      </span>
    </template>

    <function-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import FunctionForm from '~/components/templates/function/FunctionForm'

export default {
  components: { FunctionForm },
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
