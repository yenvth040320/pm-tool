<template>
  <div class="detail-task">
    <TaskDetailMeetingForm v-if="model.task_type === TASK_TYPE_VALUE.meeting" :id="id" :model="model" @save="save" @success="success" />
    <TaskDetailProjectForm v-else-if="model.task_type === TASK_TYPE_VALUE.project" :id="id" :model="model" @save="save" @success="success" />
    <TaskDetailManagerForm v-else-if="model.task_type === TASK_TYPE_VALUE.manager" :id="id" :model="model" @save="save" @success="success" />
  </div>
</template>

<script>
import TaskDetailMeetingForm from '~/components/templates/task/TaskDetailMeetingForm'
import TaskDetailProjectForm from '~/components/templates/task/TaskDetailProjectForm'
import TaskDetailManagerForm from '~/components/templates/task/TaskDetailManagerForm'
import { TASK_TYPE, TASK_TYPE_VALUE, TASK_STATUS, TASK_APPROVE_STATUS, FORMAT_DATE_TIME, TASK_STATUS_VALUE, TASK_APPROVE_STATUS_VALUE } from '~/constants'
import DataForm from '~/mixins/data-form'

export default {
  /**
   * Declare components.
   */
  components: {
    TaskDetailMeetingForm,
    TaskDetailProjectForm,
    TaskDetailManagerForm
  },
  /**
   * Declare mixins.
   */
  mixins: [DataForm],

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'task',
    TASK_TYPE,
    TASK_STATUS,
    TASK_APPROVE_STATUS,
    FORMAT_DATE_TIME,
    TASK_STATUS_VALUE,
    TASK_APPROVE_STATUS_VALUE,
    TASK_TYPE_VALUE,
    totalWorkHours: 0
  }),

  /**
   * Computed event.
   */
  computed: {

  },

  /**
   * Mounted event.
   */
  mounted() {
  },

  /**
   * List of methods.
   */
  methods: {
    save() {
      this.getDetail(this.id)
    },
    success() {
      this.$router.push('/task')
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
}
.btn-update {
  float: right;
}
.btn-delete {
  float: right;
  margin-left: 5px;
}
</style>
