<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.functionItemWriteDatasource') }}
    </template>

    <functionItemWriteDatasource-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FunctionItemWriteDatasourceForm from '~/components/templates/functionItemWriteDatasource/FunctionItemWriteDatasourceForm'

export default {
  components: {
    FunctionItemWriteDatasourceForm
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
