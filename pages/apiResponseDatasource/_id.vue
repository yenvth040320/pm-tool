<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.apiResponseDatasource') }}
    </template>

    <apiResponseDatasource-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import ApiResponseDatasourceForm from '~/components/templates/apiResponseDatasource/ApiResponseDatasourceForm'

export default {
  components: {
    ApiResponseDatasourceForm
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
