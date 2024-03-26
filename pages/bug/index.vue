<template>
  <div>
    <a-card class="mb-4">
      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          @click="gotoNewBugCustomer()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.bug.customer.create') }}
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          @click="gotoNewBugInternal()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.bug.internal.create') }}
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

      <a-collapse default-active-key="1">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" header="Tìm kiếm">
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
                  :label="$t('module.category')"
                  prop="category_id"
                >
                  <a-select
                    v-model="filters.category_function"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.category')"
                  >
                    <a-select-option
                      v-for="(item, index) in categories"
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
                  :label="$t('module.bug.function_id')"
                  prop="function_id"
                >
                  <a-select
                    v-model="filters.function_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.function_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in functions"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.code }}: {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.mst_bug_type_id')"
                  prop="mst_bug_type_id"
                >
                  <a-select
                    v-model="filters.mst_bug_type_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.mst_bug_type_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in mstBugTypes"
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
                  :label="$t('module.bug.create_user_id')"
                  prop="create_user_id"
                >
                  <a-select
                    v-model="filters.create_user_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.create_user_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in members"
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
                  :label="$t('module.bug.test_session_id')"
                  prop="test_session_id"
                >
                  <a-select
                    v-model="filters.test_session_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.test_session_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in testSessions"
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
                  :label="$t('module.bug.category')"
                  prop="category"
                >
                  <a-select
                    v-model="filters.category"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.category')"
                  >
                    <a-select-option
                      v-for="(cate, index) in BUG_CATEGORY"
                      :key="index"
                      :value="cate.value"
                    >
                      {{ cate.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.requirement_id')"
                  prop="requirement_id"
                >
                  <a-select
                    v-model="filters.requirement_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.requirement_id')"
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
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.functionResult.mst_evn_test_case_id')"
                  prop="mst_evn_test_case_id"
                >
                  <a-select
                    v-model="filters.mst_evn_test_case_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.functionResult.mst_evn_test_case_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in mstEvnTestCases"
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
                  :label="$t('module.bug.title')"
                  prop="title"
                >
                  <a-input
                    v-model="filters.title"
                    :placeholder="$t('module.bug.title')"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.assignee')"
                  prop="assignee"
                >
                  <a-select
                    v-model="filters.assignee"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.assignee')"
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
                  :label="$t('module.bug.status')"
                  prop="status"
                >
                  <a-select
                    v-model="filters.status"
                    allow-clear
                    show-search
                    mode="multiple"
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.status')"
                  >
                    <a-select-option
                      v-for="(item, index) in BUG_STATUS"
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
                  :label="$t('module.bug.priority')"
                  prop="priority"
                >
                  <a-select
                    v-model="filters.priority"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.priority')"
                  >
                    <a-select-option
                      v-for="(item, index) in BUG_PRIORITY"
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
                  :label="$t('module.bug.start_date')"
                  prop="start_date"
                >
                  <a-date-picker
                    v-model="filters.start_date"
                    :placeholder="$t('module.bug.start_date')"
                    format="YYYY/MM/DD"
                    style="width:100%"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.end_date')"
                  prop="end_date"
                >
                  <a-date-picker
                    v-model="filters.end_date"
                    :placeholder="$t('module.bug.end_date')"
                    format="YYYY/MM/DD"
                    style="width:100%"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="12"
              >
                <a-form-model-item
                  :label="$t('module.bug.created_at')"
                  prop="created_at"
                >
                  <a-date-picker
                    v-model="filters.created_at"
                    :placeholder="$t('module.bug.created_at')"
                    format="YYYY/MM/DD"
                    style="width:100%"
                  />
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
        </a-collapse-panel>
      </a-collapse>
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        class="pt-3"
        @change="handleTableChange"
      >
        <template
          slot="ordinal_number"
          slot-scope="text, record, index"
        >
          {{ getIndex(index + 1) }}
        </template>
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function ? record.function.code + ': ' + record.function.name : '' }}
          </div>
        </template>
        <template
          slot="test_session_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.functionResult?.test_session?.name }}
          </div>
        </template>
        <template
          slot="title_bug"
          slot-scope="text, record"
        >
          <a :href="`/bug/detail/${record.id}`" target="_blank">
            {{ record.title }}
          </a>
        </template>
        <template
          slot="category"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in BUG_CATEGORY" :key="index">
            <span v-if="record.category === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="status"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in BUG_STATUS" :key="index">
            <span v-if="record.status === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="priority"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in BUG_PRIORITY" :key="index">
            <span v-if="record.priority === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="assignee"
          slot-scope="text, record"
        >
          <div>
            {{ record?.assigneeUser?.name }}
          </div>
        </template>
        <template
          slot="create_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.createUser?.name }}
          </div>
        </template>
        <template
          slot="start_date"
          slot-scope="text, record"
        >
          <div>
            {{ getFormattedDatetime(record.start_date) }}
          </div>
        </template>
        <template
          slot="end_date"
          slot-scope="text, record"
        >
          <div>
            {{ getFormattedDatetime(record.end_date) }}
          </div>
        </template>
        <template
          slot="created_at"
          slot-scope="text, record"
        >
          <div>
            {{ getFormattedDatetime(record.created_at) }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            v-if="record.category === BUG_CATEGORY_VALUE.customer"
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetailBugCustomer(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            v-else
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetailBugInternal(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.bug') }}
      </template>

      <a-spin :spinning="loading">
        <bug-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import BugForm from '~/components/templates/bug/BugForm'
import {
  BUG_STATUS,
  BUG_PRIORITY,
  BUG_DONE_PERCENT,
  BUG_STATUS_VALUE,
  BUG_PRIORITY_VALUE,
  SORT,
  BUG_CATEGORY,
  BUG_CATEGORY_VALUE
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    BugForm
  },

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }

      if (params.status && typeof params.status === 'string') {
        params.status = [params.status]
      }
      params.project_id = this.project_id
      params.status = this.filters.status ?? undefined
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
      resource: 'bug',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
        test_session_id: +this.$route.query.test_session_id || undefined,
        mst_evn_test_case_id: +this.$route.query.mst_evn_test_case_id || undefined,
        requirement_id: +this.$route.query.requirement_id || undefined,
        category: +this.$route.query.category || undefined,
        title: +this.$route.query.title || '',
        status: Array.isArray(this.$route.query.status) && this.$route.query.status.length > 0
          ? this.$route.query.status.map(status => +status)
          : (this.$route.query.status ? [+this.$route.query.status] : this.getDefaultStatus()),
        priority: +this.$route.query.priority || undefined,
        assignee: +this.$route.query.assignee || undefined,
        start_date: this.$route.query.start_date || null,
        end_date: this.$route.query.end_date || null,
        category_function: +this.$route.query.category_function || undefined,
        function_id: +this.$route.query.function_id || undefined,
        mst_bug_type_id: +this.$route.query.mst_bug_type_id || undefined,
        create_user_id: +this.$route.query.create_user_id || undefined,
        created_at: this.$route.query.created_at || null
      },
      defaultParams: {
        not_admin: 1,
        project_id: +this.$route.query.project_id || this.$store.state.project.id || 0
      },
      testSessions: [],
      requirements: [],
      mstEvnTestCases: [],
      members: [],
      functions: [],
      project: {},
      categories: [],
      mstBugTypes: [],
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
      SORT,
      BUG_STATUS,
      BUG_PRIORITY,
      BUG_DONE_PERCENT,
      BUG_STATUS_VALUE,
      BUG_PRIORITY_VALUE,
      BUG_CATEGORY,
      BUG_CATEGORY_VALUE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    /**
     * Declare header columns.
     */
    header() {
      return [
        {
          title: this.$t('common.ordinal_number'),
          dataIndex: 'ordinal_number',
          scopedSlots: { customRender: 'ordinal_number' },
          align: 'center',
          width: 60
        },
        {
          title: this.$t('module.bug.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.bug.category'),
          dataIndex: 'category',
          scopedSlots: { customRender: 'category' },
          sorter: true
        },
        {
          title: this.$t('module.bug.test_session_id'),
          dataIndex: 'test_session_id',
          scopedSlots: { customRender: 'test_session_id' },
          sorter: true
        },
        {
          title: this.$t('module.bug.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_bug' }
        },
        {
          title: this.$t('module.bug.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true,
          width: 150
        },
        {
          title: this.$t('module.bug.priority'),
          dataIndex: 'priority',
          scopedSlots: { customRender: 'priority' },
          sorter: true,
          width: 120
        },
        {
          title: this.$t('module.bug.assignee'),
          dataIndex: 'assignee',
          scopedSlots: { customRender: 'assignee' },
          sorter: true
        },
        {
          title: this.$t('module.bug.create_user_id'),
          scopedSlots: { customRender: 'create_user_id' }
        },
        {
          title: this.$t('module.bug.start_date'),
          dataIndex: 'start_date',
          scopedSlots: { customRender: 'start_date' },
          sorter: true,
          width: 120
        },
        {
          title: this.$t('module.bug.end_date'),
          dataIndex: 'end_date',
          scopedSlots: { customRender: 'end_date' },
          sorter: true,
          width: 120
        },
        {
          title: this.$t('module.bug.created_at'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
          sorter: true,
          width: 120
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 120
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getTestSessions()
    this.showDetailProject()
    this.getMstEvnTestCases()
    this.getMemberOfProject()
    this.getListRequirement()
    this.getCategories()
    this.getFunctions()
    this.getMstBugType()
  },

  /**
   * Methods.
   */
  methods: {
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

    async getCategories() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.category.list({ params })
        this.categories = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * List Function.
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.functionResult.getFunctionList({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Mst bug type
     */
    async getMstBugType() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstBugType.list({ params })
        this.mstBugTypes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstEvnTestCase
     */
    async getMstEvnTestCases() {
      try {
        const params = {
          project_id: this.project_id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstEvnTestCase.list({ params })
        this.mstEvnTestCases = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get member in project
     *
     * @returns {Promise<void>}
     */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.user.getListUser({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get No.
     */
    getIndex(index) {
      return (this.pagination.current - 1) * this.pagination.pageSize + index
    },

    getDefaultStatus() {
      const excludedKeys = ['deleted', 'closed']
      const filteredStatuses = Object.keys(BUG_STATUS_VALUE)
        .filter(key => !excludedKeys.includes(key))
        .map(key => BUG_STATUS_VALUE[key])

      return filteredStatuses
    },

    /**
     * List FunctionResult.
     */
    async getFunctionResults() {
      try {
        const params = {
          not_limit: true,
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.functionResult.list({ params })
        this.functionResults = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
    * List test session
     */
    async getTestSessions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          tab_bug: true
        }
        const { data: { result: { data } } } = await this.$api.testSession.list({ params })
        this.testSessions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    getFormattedDatetime(datetime) {
      return datetime ? moment(datetime).format('DD/MM/YYYY') : ''
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/bug'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetailBugCustomer(id) {
      this.$router.push(`/${this.resource}/customer/${id}`)
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetailBugInternal(id) {
      this.$router.push(`/${this.resource}/internal/${id}`)
    },

    /**
     * Go to new bug customer
     */
    gotoNewBugCustomer() {
      this.$router.push(`/${this.resource}/customer/new`)
    },

    /**
     * Go to new bug internal
     */
    gotoNewBugInternal() {
      this.$router.push(`/${this.resource}/internal/new`)
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.$router.push(`/bug/detail/${id}`)
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
        mst_evn_test_case_id: undefined,
        test_session_id: undefined,
        requirement_id: undefined,
        category: undefined,
        title: '',
        status: undefined,
        priority: '',
        assignee: '',
        start_date: null,
        end_date: null,
        category_function: undefined,
        function_id: undefined,
        mst_bug_type_id: undefined,
        create_user_id: undefined,
        created_at: null
      }

      this.replaceQuery(this.filters)
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      if (this.filters.start_date) {
        this.filters.start_date = moment(this.filters.start_date).format('YYYY/MM/DD')
      }
      if (this.filters.end_date) {
        this.filters.end_date = moment(this.filters.end_date).format('YYYY/MM/DD')
      }
      if (this.filters.created_at) {
        this.filters.created_at = moment(this.filters.created_at).format('YYYY/MM/DD')
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Filter select box
     *
     * @param input
     * @param option
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
