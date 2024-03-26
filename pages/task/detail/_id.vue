<template>
  <a-card class="mb-2">
    <template slot="title">
      {{ $t('module.task.detail') }} {{ $t('module.task') }}
    </template>

    <task-detail-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import TaskDetailForm from '~/components/templates/task/TaskDetailForm'

export default {
  /**
     * Declare components.
     */
  components: {
    TaskDetailForm
  },

  /**
     * Init data for component.
     */
  data() {
    return {
      id: +this.$route.params.id || 0,
      task_type: this.$route.query.task_type || ''
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
