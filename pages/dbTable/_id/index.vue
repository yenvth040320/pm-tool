<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ this.$store.state.project.name + ' / ' + this.$store.state.dbSchema.name + ' / ' + $t('common.edit') + ' ' + $t('module.dbTable') }}
    </template>

    <dbTable-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import DbTableForm from '~/components/templates/dbTable/DbTableForm'

export default {
  components: {
    DbTableForm
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
