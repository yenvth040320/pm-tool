<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.task_meeting') }}
    </template>

    <task-form
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
  components: { TaskForm },

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
