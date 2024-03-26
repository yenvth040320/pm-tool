<template>
  <a-table
    v-if="fixBugTasks.length > 0"
    bordered
    :columns="columns"
    :row-key="getRowKey"
    :data-source="fixBugTasks"
    :pagination="false"
    :loading="loading"
  >
    <template slot="title" slot-scope="text, record">
      <span>
        <a target="_blank" :href="`/task/detail/${record?.id}`">
          {{ record?.title }}
        </a>
      </span>
    </template>

    <template slot="et_point" slot-scope="text, record">
      <span>
        {{ record?.et_point }}
      </span>
    </template>

    <template
      slot="member_id"
      slot-scope="text, record"
    >
      <span>
        {{ members.find(x => x.id === record?.member_id)?.name }}
      </span>
    </template>
    <template
      slot="status"
      slot-scope="text, record"
    >
      {{ TASK_STATUS_OPTION[record?.status] }}
    </template>
  </a-table>
</template>
<script>
import DataTable from '~/mixins/data-table'
import { TASK_STATUS_OPTION } from '~/constants'

export default {
  mixins: [DataTable],

  async fetch() {
    try {
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    }
  },

  props: {
    members: {
      type: Array,
      default: () => []
    },
    fixBugTasks: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      TASK_STATUS_OPTION
    }
  },
  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: this.$t('module.task.et_point'),
          dataIndex: 'et_point',
          scopedSlots: { customRender: 'et_point' },
          align: 'center',
          width: 100
        },
        {
          title: this.$t('module.task.member_id'),
          dataIndex: 'member_id',
          scopedSlots: { customRender: 'member_id' },
          width: 320
        },
        {
          title: this.$t('module.task.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 120
        }
      ]
    }
  },

  methods: {
    /**
     * Get row key
     */
    getRowKey(record, index) {
      if (record.key) {
        return record.key
      }
      if (record.id) {
        return record.id
      }
      return `temp-row-key-${index}`
    }
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .ant-table.ant-table-bordered .ant-table-title {
    border: none;
    padding: 0;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 10px 10px;
  }
}
</style>
