<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.dbTableForeignKey') }}
    </template>

    <dbTableForeignKey-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import DbTableForeignKeyForm from '~/components/templates/dbTableForeignKey/DbTableForeignKeyForm'

export default {
  components: {
    DbTableForeignKeyForm
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
