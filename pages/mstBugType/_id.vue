<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.edit') }} {{ $t('module.mstBugType') }}
    </template>
    <mstBugType-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>
import MstBugTypeForm from '~/components/templates/mstBugType/MstBugTypeForm'

export default {
  /**
   * Declare components.
   */
  components: {
    MstBugTypeForm
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      id: +this.$route.params.id || 0
    }
  },

  /**
   * Methods.
   */
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
