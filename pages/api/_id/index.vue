<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + this.$store.state.apiCategory.name + ' / ' + $t('common.edit') + ' ' + $t('module.api') }}
    </template>

    <api-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import ApiForm from '~/components/templates/api/ApiForm'

export default {
  components: {
    ApiForm
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
