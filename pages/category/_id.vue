<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + $t('common.edit') + ' ' + $t('module.category') }}
    </template>

    <category-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import CategoryForm from '~/components/templates/category/CategoryForm'

export default {
  components: {
    CategoryForm
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
