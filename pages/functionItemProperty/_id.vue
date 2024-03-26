<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.functionItemProperty') }}
    </template>

    <functionItemProperty-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FunctionItemPropertyForm from '~/components/templates/functionItemProperty/FunctionItemPropertyForm'

export default {
  components: {
    FunctionItemPropertyForm
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
