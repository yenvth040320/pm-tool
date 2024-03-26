<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.task') }}
    </template>

    <multi-create-task-form
      @save="save"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import MultiCreateTaskForm from '~/components/templates/task/MultiCreateTaskForm'

export default {
  /**
   * Declare components.
   */
  components: { MultiCreateTaskForm },

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
      if (id) {
        this.$router.push({ name: 'task', query: { owners: [String(id)] } })
      } else {
        this.$router.push({ name: 'task' })
      }
    }
  }
}
</script>
