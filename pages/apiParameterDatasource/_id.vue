<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.apiParameterDatasource') }}
    </template>

    <apiParameterDatasource-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import ApiParameterDatasourceForm from '~/components/templates/apiParameterDatasource/ApiParameterDatasourceForm'

export default {
  components: {
    ApiParameterDatasourceForm
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
