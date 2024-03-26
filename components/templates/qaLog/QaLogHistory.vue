<template>
  <div>
    <div class="info-log">
      <div>
        {{ logItem?.updatedUser?.name }}
      </div>
      <div
        class="time-change"
      >
        {{ logItem.updated_time }}
      </div>
    </div>
    <div>
      <a-tag :color="getColorAction(logItem.action)">
        {{ logItem.action }} {{ QA_TYPE_LOG[logItem.type_log] }}
      </a-tag>
    </div>
    <json-diff :log-item="logItem" />
  </div>
</template>

<script>
import { QA_TYPE_LOG } from '~/constants'
import JsonDiff from '~/components/templates/qaLog/JsonDiff.vue'

export default {
  components: {
    JsonDiff
  },

  props: {
    logItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      QA_TYPE_LOG
    }
  },

  methods: {
    /**
     * Get Color of Action
     *
     * @param action
     * @returns {string}
     */
    getColorAction(action) {
      if (action === 'Thêm mới') {
        return '#87d068'
      } else if (action === 'Cập nhật') {
        return '#2db7f5'
      } else if (action === 'Chốt') {
        return '#f50'
      } else {
        return '#000000'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info-log {
  display: flex;
}
.time-change {
  margin-left: 5px;
  color: dodgerblue;
  font-style: italic;
}
</style>
