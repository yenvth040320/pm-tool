<template>
  <a-card class="mb-4">
    <template slot="title">
      <font-awesome-icon icon="pencil-alt" />
      {{ $t('common.edit') }} {{ $t('module.modelFrontend') }}
    </template>

    <model-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import ModelForm from '~/components/templates/model/ModelForm'

export default {
  components: {
    ModelForm
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
