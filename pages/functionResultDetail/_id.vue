<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.functionResultDetail') }}
    </template>

    <functionResultDetail-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FunctionResultDetailForm from '~/components/templates/functionResultDetail/FunctionResultDetailForm'

export default {
  components: {
    FunctionResultDetailForm
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
