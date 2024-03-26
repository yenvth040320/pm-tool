<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>

        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoCopyUrl()"
        >
          {{ $t('common.copy_url') }}
        </a-button>
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.q&a.function')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_id"
                :placeholder="$t('module.q&a.function')"
                show-search
                allow-clear
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in functions"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.code }} - {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.question.title')"
              prop="keyword"
            >
              <a-input
                v-model="filters.title"
                :placeholder="$t('module.question.title')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.question.created_user')"
              prop="created_user"
            >
              <a-select
                v-model="filters.created_user"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.question.created_user')"
              >
                <a-select-option
                  v-for="member in members"
                  :key="member.id"
                  :value="member.id"
                >
                  {{ member.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.question.status')"
              prop="status"
            >
              <a-select
                v-model="filters.status"
                :placeholder="$t('module.question.status')"
                show-search
                allow-clear
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in STATUS_QUESTION"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.question.category')"
              prop="category"
            >
              <a-select
                v-model="filters.category"
                :placeholder="$t('module.question.category')"
                show-search
                allow-clear
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in CATEGORY_QUESTION"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('Công đoạn')"
              prop="mst_life_cycle_id"
            >
              <a-select
                v-model="filters.mst_life_cycle_id"
                :placeholder="$t('Công đoạn')"
                show-search
                allow-clear
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in listMstLifeCycles"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('Trạng thái công đoạn')"
              prop="mst_life_cycle_status_id"
            >
              <a-select
                v-model="filters.mst_life_cycle_status_id"
                :placeholder="$t('Trạng thái công đoạn')"
                show-search
                allow-clear
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in mstLifeCycleStatus"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

                &nbsp;
            <a-button
              html-type="button"
              type="default"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        :custom-row="customRow"
        :row-class-name="rowClassName"
        @change="handleTableChange"
      >
        <template
          slot="item_num"
          slot-scope="text, record"
        >
          <div>
            {{ record.functionItem.item_num }}
          </div>
        </template>
        <template
          slot="item_name"
          slot-scope="text, record"
        >
          <a @click="gotoItem(record)">
            {{ record.functionItem.name }} ({{ record.functionItem.mst_item_type.name }})
          </a>
        </template>

        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            [{{ record.function.code }}]: {{ record.function.name }}/version: {{ record.version_code }}
          </div>
        </template>

        <template
          slot="task_id"
          slot-scope="text, record"
        >
          <span v-for="(task, index) in record.tasks" :key="index">
            <a :href="`/task/detail/${task.id}`" target="_blank" style="color:#0077c0;" class="link__detail-task">{{ task.id }}</a>
            <span v-if="index !== record.tasks.length - 1">, </span>
          </span>
        </template>

        <template
          slot="status"
          slot-scope="text, record"
        >
          <div
            v-for="item in STATUS_QUESTION"
            :key="item.value"
          >
            <div v-if="item.value === record.status">
              {{ item.label }}
            </div>
          </div>
        </template>

        <template
          slot="category"
          slot-scope="text, record"
        >
          <div
            v-for="item in CATEGORY_QUESTION"
            :key="item.value"
          >
            <div v-if="item.value === record.category">
              {{ item.label }}
            </div>
          </div>
        </template>

        <template
          slot="context"
          slot-scope="text, record"
        >
          <span v-html="record.context" />
        </template>

        <template
          slot="question"
          slot-scope="text, record"
        >
          <span v-html="record.question" />
        </template>

        <template
          slot="answer"
          slot-scope="text, record"
        >
          <div
            v-for="item in record.answers"
            :key="item.id"
          >
            <div v-if="item.type === 1">
              <span v-html="item.answer" />
            </div>
          </div>
        </template>

        <template
          slot="created_at"
          slot-scope="text, record"
        >
          <div>
            {{ record.created_at ? getDateTime(record.created_at) : '' }}
          </div>
        </template>

        <template
          slot="created_user"
          slot-scope="text, record"
        >
          <div>
            {{ record?.createdUser?.name }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <div style="display: flex; gap: 4px">
            <a-button
              html-type="button"
              type="primary"
              size="large"
              :disabled="loading || record.functionItem.use_flg === USE_FLG_VALUE.no"
              @click="showDetail(record.id)"
            >
              <font-awesome-icon icon="eye" />
            </a-button>
            <a-button
              html-type="button"
              type="primary"
              size="large"
              :disabled="loading || record.functionItem.use_flg === USE_FLG_VALUE.no"
              @click="gotoCopy(record.id)"
            >
              <font-awesome-icon icon="copy" />
            </a-button>
            <div>
              <a-button
                html-type="button"
                type="primary"
                size="small"
                :disabled="loading || record.functionItem.use_flg === USE_FLG_VALUE.no"
                @click="gotoDetail(record.id)"
              >
                <font-awesome-icon icon="pencil-alt" />
              </a-button>
              <a-button
                html-type="button"
                type="danger"
                size="small"
                :disabled="loading || record.functionItem.use_flg === USE_FLG_VALUE.no"
                @click="confirmToDelete(record.id)"
              >
                <font-awesome-icon icon="trash-alt" />
              </a-button>
            </div>
          </div>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <QuestionForm :id="currentId" ref="modalAddQuestion" :copy-value="isCopyQuestion" @save="saveQuestion" @cancel="closeQuestion" />
    <ModalDetailQuestion :id="idQuestion" ref="modalDetailQuestion" :list-mst-life-cycles="listMstLifeCycles" @close="close" />
    <!-- end modal-detail -->
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import QuestionForm from '~/components/templates/question/QuestionForm'
import ModalDetailQuestion from '~/components/templates/question/ModalDetailQuestion.vue'
import { STATUS_QUESTION, CATEGORY_QUESTION, FORMAT_DATE_TIME, CATEGORY_QUESTION_VALUE, USE_FLG_VALUE, SORT } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    QuestionForm,
    ModalDetailQuestion
  },

  mixins: [
    DataTable
  ],
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      params.project_id = this.project_id
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }

      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
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
  data() {
    return {
      resource: 'question',
      visible: false,
      currentId: 0,
      idQuestion: +this.$route.query.question_id || 0,
      isCopyQuestion: false,
      filters: {
        status: this.$route.query.status || undefined,
        category: this.$route.query.category || undefined,
        title: this.$route.query.title || '',
        function_id: +this.$route.query.function_id || undefined,
        created_user: +this.$route.query.created_user || undefined,
        mst_life_cycle_id: +this.$route.query.mst_life_cycle_id || undefined,
        mst_life_cycle_status_id: +this.$route.query.mst_life_cycle_status_id || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      project: {},
      STATUS_QUESTION,
      CATEGORY_QUESTION,
      FORMAT_DATE_TIME,
      CATEGORY_QUESTION_VALUE,
      USE_FLG_VALUE,
      SORT,
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
      members: [],
      listMstLifeCycles: [],
      mstLifeCycleStatus: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.question.item_num'),
          dataIndex: 'item_num',
          scopedSlots: { customRender: 'item_num' },
          width: 80
        },
        {
          title: this.$t('module.question.item_name'),
          dataIndex: 'item_name',
          scopedSlots: { customRender: 'item_name' },
          sorter: true,
          width: 130
        },
        {
          title: this.$t('module.question.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.question.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true,
          width: 130
        },
        {
          title: this.$t('module.question.category'),
          dataIndex: 'category',
          scopedSlots: { customRender: 'category' },
          sorter: true,
          width: 150
        },
        {
          title: this.$t('module.question.title'),
          dataIndex: 'title',
          sorter: true
        },
        {
          title: this.$t('module.question.task_id'),
          dataIndex: 'task_id',
          scopedSlots: { customRender: 'task_id' },
          sorter: true,
          width: 120
        },
        {
          title: this.$t('module.question.created_user'),
          dataIndex: 'created_user',
          scopedSlots: { customRender: 'created_user' },
          sorter: true,
          width: 150
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 200
        }
      ]
    }
  },

  watch: {
    'filters.mst_life_cycle_id'() {
      this.changeMstLifeCycle()
    }
  },

  created() {
    this.getMemberOfProject()
    this.getListFunctions()
    this.getMstLifeCycles()
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.showDetailProject()
    this.showDetail(this.idQuestion)
  },

  methods: {
    /**
     * Go to new
     */
    gotoNew() {
      this.$refs.modalAddQuestion.open()
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    gotoDetail(id) {
      this.currentId = id
      this.isCopyQuestion = false
      this.$refs.modalAddQuestion.open()
    },

    gotoCopy(id) {
      this.currentId = id
      this.isCopyQuestion = true
      this.$refs.modalAddQuestion.open()
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      if (id !== 0) {
        this.idQuestion = id
        this.$refs.modalDetailQuestion.open()
      }
    },

    /**
     * Close dialog.
     *
     * @param {boolean} fetch - fetch status.
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        category: undefined,
        title: '',
        function_id: undefined,
        status: undefined,
        created_user: undefined,
        mst_life_cycle_id: undefined,
        mst_life_cycle_status_id: undefined
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
    },

    /**
     * Custom row event of table column
     */
    customRow(record) {
      return {
        on: {
          dblclick: () => {
            this.showDetail(record.id)
          }
        }
      }
    },

    async showDetailProject() {
      try {
        if (this.project_id !== this.$store.state.project.id) {
          const { data: { result: { data } } } = await this.$api.project.show(this.project_id)
          this.project = data
          this.$store.dispatch('addProject', {
            id: this.project_id,
            name: this.project.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Format date time
     */
    getDateTime(datetime) {
      return moment(datetime).format(FORMAT_DATE_TIME)
    },

    saveQuestion() {
      this.$fetch()
      this.currentId = 0
    },

    close() {
      this.idQuestion = 0
      this.$fetch()
      this.$refs.modalDetailQuestion.close()
    },

    closeQuestion() {
      this.$fetch()
      this.currentId = 0
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Custom css row not use
     */
    rowClassName(record) {
      if (record.functionItem.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    async getListFunctions() {
      try {
        const params = {
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.function.getListFunction({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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

    /**
     * Get List Mst LifeCycles
     */
    async getMstLifeCycles() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_by: 'wbs',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.listForQaDetail({ params })
        this.listMstLifeCycles = data
        this.setLifeCycleStatus()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Goto item
     */
    gotoItem(record) {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = `/function/${record.function_id}/version/${record.version_code}`
      const url = new URL(host + path)
      url.searchParams.set('function_item_num', record.functionItem.item_num)
      url.hash = 'tab_items'
      const newUrl = url.href

      window.open(newUrl, '_blank')
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/qa'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },

    /**
     * On Changing Mst LifeCycle -> set status of mst life cycle
     */
    changeMstLifeCycle() {
      this.mstLifeCycleStatus = []
      this.filters.mst_life_cycle_status_id = undefined
      this.setLifeCycleStatus()
    },

    /**
     * Set Life Cycle Status
     */
    setLifeCycleStatus() {
      if (this.filters.mst_life_cycle_id) {
        const selectedMstLifeCycles = this.listMstLifeCycles.find(item => item.id === this.filters.mst_life_cycle_id)
        if (selectedMstLifeCycles) {
          this.mstLifeCycleStatus = selectedMstLifeCycles.mst_life_cycle_statuses
        }
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  :deep() {
    .ant-table-tbody {
      .disabled-row {
        background-color: rgba(217, 217, 217, 0.5);
        td {
          text-decoration: line-through;
        }
      }
    }
    .ant-table-row {
      cursor: pointer;
    }
    .link__detail-task {
      display: inline-block;
    }
  }
  </style>
