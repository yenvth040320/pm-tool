<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.functionItemReadDatasource') }}
    </template>

    <functionItemReadDatasource-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FunctionItemReadDatasourceForm from '~/components/templates/functionItemReadDatasource/FunctionItemReadDatasourceForm'

export default {
  components: {
    FunctionItemReadDatasourceForm
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
