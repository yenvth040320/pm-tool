<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.task') }}
    </template>

    <task-form
      :id="id"
      @save="save"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import TaskForm from '~/components/templates/task/TaskForm'

export default {
  /**
   * Declare components.
   */
  components: {
    TaskForm
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
    },

    save(id) {
      this.$router.push(`/task/detail/${id}`)
    }
  }
}
</script>
