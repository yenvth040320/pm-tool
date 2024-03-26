<template>
  <div class="task-container">
    <a-card class="no-border task_main">
      <template slot="extra">
        <a-button
          v-if="!isStart"
          html-type="button"
          type="primary"
          title="Tạo mới"
          @click="gotoStart()"
        >
          {{ $t('module.question.schedule') }}
        </a-button>
        <a-button
          v-if="isStart"
          html-type="button"
          type="default"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          title="Tạo mới"
          :disabled="!isStart"
          @click="gotoAddTask()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.question.add_task') }}
        </a-button>
      </template>
      <a-table
        v-if="tasks.length > 0"
        bordered
        :columns="columns"
        :row-key="getRowKey"
        :data-source="tasks"
        :pagination="false"
        :loading="loading"
      >
        <template slot="name" slot-scope="text, record">
          <a-form-model-item
            v-if="isStart && (!record.id || (record.id && record.status === TASK_STATUS_VALUE.new))"
            :key="`task.` + tasks.indexOf(record) + `.title`"
            :prop="`task.` + tasks.indexOf(record) + `.title`"
            :wrapper-col="{ xs: 24 }"
            :rules="[
              {
                validator: (rule, value, callback) => checkRequiredTitle(rule, value, callback, record),
                message: $t('validation.required', { field: $t('module.question.title') }),
                trigger: ['change', 'blur'],
              }
            ]"
          >
            <a-input
              v-model="record.title"
              class="title-task"
            />
          </a-form-model-item>
          <a v-else :href="`/task/detail/${record.id}`" target="_blank" style="color:#0077c0;">
            {{ record.title }}
          </a>
        </template>
        <template slot="requirement_id" slot-scope="text, record">
          <a-form-model-item
            v-if="isStart && (!record.id || (record.id && record.status === TASK_STATUS_VALUE.new))"
            :key="`task.` + tasks.indexOf(record) + `.requirement_id`"
            :prop="`task.` + tasks.indexOf(record) + `.requirement_id`"
            :wrapper-col="{ xs: 24 }"
            :rules="[
              {
                validator: (rule, value, callback) => checkRequiredRequirement(rule, value, callback, record),
                message: $t('validation.required', { field: $t('module.task.requirement_id') }),
                trigger: ['change', 'blur'],
              }
            ]"
          >
            <a-select
              v-model="record.requirement_id"
              :placeholder="$t('module.task.requirement_id')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, index) in requirements"
                :key="index"
                :value="item.id"
              >
                {{ item.title }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <span v-else>
            {{ requirements.find(x => x.id === record.requirement_id)?.title }}
          </span>
        </template>

        <template slot="et_point" slot-scope="text, record">
          <a-form-model-item
            v-if="isStart && (!record.id || (record.id && record.status === TASK_STATUS_VALUE.new))"
            :key="`task.` + tasks.indexOf(record) + `.et_point`"
            :prop="`task.` + tasks.indexOf(record) + `.et_point`"
            :wrapper-col="{ xs: 24 }"
            :rules="[
              {
                validator: (rule, value, callback) => checkRequiredEtTime(rule, value, callback, record),
                message: $t('module.task.et_point_exceed'),
                trigger: ['change', 'blur'],
              }
            ]"
          >
            <a-input
              v-model="record.et_point"
              class="title-task"
            />
          </a-form-model-item>
          <span v-else>
            {{ record.et_point }}
          </span>
        </template>

        <template
          slot="member_id"
          slot-scope="text, record"
        >
          <a-form-model-item
            :key="`task.` + tasks.indexOf(record) + `.member_id`"
            :prop="`task.` + tasks.indexOf(record) + `.member_id`"
          >
            <div
              v-if="isStart && (!record.id || (record.id && record.status === TASK_STATUS_VALUE.new))"
            >
              <a-select
                v-model="record.member_id"
                :placeholder="$t('module.task.member_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
            </div>
            <div
              v-else
            >
              {{ members.find(x => x.id === record.member_id)?.name }}
            </div>
          </a-form-model-item>
        </template>
        <template
          slot="status"
          slot-scope="text, record"
        >
          {{ TASK_STATUS_OPTION[record.status] }}
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            v-if="isStart && !record.id"
            type="primary"
            html-type="button"
            size="small"
            title="Thêm mới"
            @click="saveTask(record)"
          >
            <font-awesome-icon
              icon="save"
              class="anticon"
            />
          </a-button>
          <a-button
            v-else-if="isStart && record.id && record.status === TASK_STATUS_VALUE.new"
            html-type="button"
            type="primary"
            size="small"
            title="Cập nhật"
            @click="updateTask(record)"
          >
            <font-awesome-icon
              icon="pencil-alt"
              class="anticon"
            />
          </a-button>
          <a-button
            v-if="isStart && record.status === TASK_STATUS_VALUE.new"
            html-type="button"
            size="small"
            type="danger"
            title="Xoá"
            @click="removeRow(record)"
          >
            <a-icon type="delete" />
          </a-button>
        </template>
      </a-table>
      <div v-if="isStart" class="text-center p-3">
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import { FORMAT_DATE_TIME, TASK_TYPE_VALUE, FLG_QA, TASK_STATUS_VALUE, SORT, TASK_STATUS_OPTION } from '~/constants'

export default {
  mixins: [DataTable],

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      FORMAT_DATE_TIME,
      moment,
      TASK_TYPE_VALUE,
      TASK_STATUS_VALUE,
      TASK_STATUS_OPTION,
      FLG_QA,
      tasks: [],
      mstLifeCycle: null,
      requirements: [],
      disabledDateTimes: disableHours => { },
      stepHours: 1,
      stepMinutes: 15,
      members: [],
      SORT,
      isStart: false
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
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('module.task.requirement_id'),
          dataIndex: 'requirement_id',
          scopedSlots: { customRender: 'requirement_id' },
          width: 200
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
          width: 160
        },
        {
          title: this.$t('module.task.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 80
        },
        {
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    }
  },

  watch: {
    'model.id'() {
      this.getListTask()
    }
  },

  mounted() {
    this.getListTask()
    this.getMemberOfProject()
    this.getMstLifeCycleQA()
    this.getListRequirement()
  },

  methods: {
    /**
     * Get list tasks
     */
    async getListTask() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          project_id: this.$store.state.project.id,
          question_id: this.model.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc,
          isTabQA: true
        }

        const { data: { result: { data } } } = await this.$api.task.list({ params })
        data.forEach(task => {
          if (task.taskOwners && task.taskOwners.length > 0) {
            if (task.task_type === TASK_TYPE_VALUE.project) {
              task.member_id = task.taskOwners[0].member_id
            }
          }
          task.et_point = Number(task.et_point).toFixed(2)
        })
        this.tasks = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get member in project
     */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.$store.state.project.id
        }

        const { data: { result: { data } } } = await this.$api.user.getGroupMembers({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListRequirement() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.requirement.list({ params })
        this.requirements = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstLifeCycle
     */
    async getMstLifeCycleQA() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          isQA: true,
          flag_qa: FLG_QA.yes,
          first: true,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycle = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    gotoStart() {
      this.isStart = true
    },

    cancel() {
      this.isStart = false
      this.tasks = this.tasks.filter(task => task.id !== undefined)
    },

    gotoAddTask() {
      let lastTaskData = null
      if (this.tasks.length > 0) {
        lastTaskData = this.tasks[this.tasks.length - 1]
      }
      const data = {
        project_id: this.$store.state.project.id,
        task_type: TASK_TYPE_VALUE.project,
        function_id: this.model.function_id,
        version_code: this.model.version_code,
        question_id: this.model.id,
        requirement_id: lastTaskData ? lastTaskData.requirement_id : undefined,
        mst_life_cycle_id: this.mstLifeCycle !== null ? this.mstLifeCycle.id : undefined,
        et_point: lastTaskData ? lastTaskData.et_point : 0,
        status: 0,
        member_id: lastTaskData ? lastTaskData.member_id : undefined,
        start_datetime: '',
        end_datetime: '',
        title: lastTaskData ? lastTaskData.title : ''
      }
      this.tasks.push(data)
    },

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
    },

    removeRow(record) {
      if (record.id) {
        this.confirmToDelete(record.id)
      } else {
        const index = this.tasks.findIndex(task => task === record)
        if (index !== -1) {
          this.tasks.splice(index, 1)
        }
      }
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.task.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getListTask()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Validate required title
     */
    checkRequiredTitle(rule, value, callback, item) {
      if (item.title === '') {
        this.$antdvalidate.checkRequired(rule, value, callback, item.title)
      } else {
        callback()
      }
    },

    /**
     * Validate required requirement
     */
    checkRequiredRequirement(rule, value, callback, item) {
      if (item.requirement_id === undefined) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.requirement_id)
      } else {
        callback()
      }
    },

    /**
     * Validate required function item
     */
    checkRequiredEtTime(rule, value, callback, item) {
      if (item.et_point < 0 || item.et_point > 4) {
        callback(new Error('Et_time cannot be 0.'))
      } else {
        callback()
      }
    },

    async saveTask(record) {
      if (record) {
        if (record.title !== '' || record.requirement_id !== undefined) {
          try {
            const data = { ...record }

            await this.$api.task.saveTask(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.getListTask()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          }
        } else {
          this.$notification.error({
            message: this.$t('module.question.required_title')
          })
        }
      }
    },

    async updateTask(record) {
      try {
        if (record.id) {
          await this.$api.task.update(record.id, record)
          this.$notification.success({
            message: this.$t('text.successfully')
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Filter select box
     *
     * @param input
     * @param option
     *
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>

<style lang="scss" scoped>
:deep() {
  .task_main {
    .ant-card-body {
      padding: 0px;
    }
  }
  .ant-calendar-picker {
    min-width: 100px;
  }
  .ant-table-thead > tr > th {
    background: #d7f7dd;
    border-bottom: 1px solid #000000D9;
  }
  .ant-table-tbody > tr > td {
    border-right: 1px solid #000000D9;
  }
  .ant-table-bordered .ant-table-header > table, .ant-table-bordered .ant-table-body > table, .ant-table-bordered .ant-table-fixed-left table, .ant-table-bordered .ant-table-fixed-right table {
    border: 1px solid #000000D9;
  }
  .ant-table-bordered .ant-table-thead > tr > th, .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid #000000D9;
  }
  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #000000D9;
  }
}
</style>
