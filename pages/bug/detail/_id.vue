<template>
  <a-card class="mb-4">
    <bug-detail-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>
import BugDetailForm from '~/components/templates/bug/BugDetailForm'

export default {
  /**
   * Declare components.
   */
  components: {
    BugDetailForm
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
      this.$router.push({ name: 'bug' })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .anticon-edit > svg {
    width: 1.5rem;
    height: 1.5rem;
    color: dodgerblue;
    cursor: pointer;
  }
}
:deep() {
  .ant-card-body {
    zoom: 1;
    padding: 5px;
  }
}
</style>
