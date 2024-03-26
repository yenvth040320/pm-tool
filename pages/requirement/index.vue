<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.requirement') }}
      </template>

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
              :label="$t('module.requirement.title')"
              prop="title"
            >
              <a-input
                v-model="filters.title"
                :placeholder="$t('module.requirement.title')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.requirement.status_request')"
              prop="status_request"
            >
              <a-select
                v-model="filters.status_request"
                allow-clear
                show-search
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_request')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_REQUEST_STATUS"
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
              :label="$t('module.requirement.status_processing')"
              prop="status_processing"
            >
              <a-select
                v-model="filters.statuses_processing"
                allow-clear
                show-search
                mode="multiple"
                :filter-option="filterOption"
                :placeholder="$t('module.requirement.status_processing')"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_PROCESS_STATUS"
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
              :label="$t('module.requirement.type')"
              prop="type"
            >
              <a-select
                v-model="filters.type"
                :placeholder="$t('module.requirement.type')"
                allow-clear
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in REQUIREMENT_TYPE"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
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
        @change="handleTableChange"
      >
        <template
          slot="ordinal_number"
          slot-scope="text, record, index"
        >
          {{ getIndex(index + 1) }}
        </template>
        <template
          slot="status_request"
          slot-scope="text, record"
        >
          <div>
            {{ REQUIREMENT_REQUEST_STATUS_INDEX[record.status_request] }}
          </div>
        </template>
        <template
          slot="status_processing"
          slot-scope="text, record"
        >
          <div :class="getStatusClass(record)">
            {{ REQUIREMENT_PROCESS_STATUS_INDEX[record.status_processing] }}
          </div>
        </template>
        <template
          slot="type"
          slot-scope="text, record"
        >
          <div>
            {{ REQUIREMENT_TYPE_INDEX[record.type] }}
          </div>
        </template>
        <template
          slot="title_requirement"
          slot-scope="text, record"
        >
          <a target="_blank" :href="`/requirement/detail/${record.id}`">
            {{ record.title }}
          </a>
        </template>
        <template
          slot="dev_point_et"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.dev_point_et) | fixDecimal }}
          </div>
        </template>
        <template
          slot="com_point_et"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.com_point_et) | fixDecimal }}
          </div>
        </template>
        <template
          slot="pm_point_et"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.pm_point_et) | fixDecimal }}
          </div>
        </template>
        <template
          slot="et_internal"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.et_internal) | fixDecimal }}
          </div>
        </template>
        <template
          slot="point_et"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.point_et) | fixDecimal }}
          </div>
        </template>
        <template
          slot="et_customer_accepted"
          slot-scope="text, record"
        >
          <div>
            {{ Number(record.et_customer_accepted) | fixDecimal }}
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="gotoDetail(record.id)"
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
    <!-- end modal-detail -->
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import {
  REQUIREMENT_TYPE,
  CKEDITOR_TOOLBAR_SETTING,
  REQUIREMENT_REQUEST_STATUS,
  REQUIREMENT_PROCESS_STATUS,
  REQUIREMENT_PROCESS_STATUS_VALUE,
  REQUIREMENT_REQUEST_STATUS_VALUE,
  REQUIREMENT_REQUEST_STATUS_INDEX,
  REQUIREMENT_PROCESS_STATUS_INDEX,
  REQUIREMENT_TYPE_INDEX
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {},

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  filters: {
    fixDecimal(value) {
      return value.toFixed(2)
    }
  },

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }

      params.project_id = this.project_id
      params.status_request = this.filters.status_request ?? undefined
      params.statuses_processing = this.filters.statuses_processing ?? undefined
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
      resource: 'requirement',
      visible: false,
      currentId: 0,
      filters: {
        title: this.$route.query.title || '',
        status_request: +this.$route.query.status_request || REQUIREMENT_REQUEST_STATUS_VALUE.open,
        statuses_processing: +this.$route.query.statuses_processing || this.getDefaultProcessingStatus(),
        type: +this.$route.query.type || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      REQUIREMENT_TYPE,
      CKEDITOR_TOOLBAR_SETTING,
      REQUIREMENT_REQUEST_STATUS,
      REQUIREMENT_PROCESS_STATUS,
      REQUIREMENT_PROCESS_STATUS_VALUE,
      REQUIREMENT_REQUEST_STATUS_VALUE,
      REQUIREMENT_REQUEST_STATUS_INDEX,
      REQUIREMENT_PROCESS_STATUS_INDEX,
      REQUIREMENT_TYPE_INDEX,
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0
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
          title: '#',
          scopedSlots: { customRender: 'ordinal_number' },
          dataIndex: 'ordinal_number',
          align: 'center',
          width: 60
        },
        {
          title: this.$t('module.requirement.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'title_requirement' },
          align: 'left'
        },
        {
          title: this.$t('module.requirement.status_request'),
          scopedSlots: { customRender: 'status_request' },
          dataIndex: 'status_request',
          align: 'right'
        },
        {
          title: this.$t('module.requirement.status_processing'),
          scopedSlots: { customRender: 'status_processing' },
          dataIndex: 'status_processing',
          align: 'right'
        },
        {
          title: this.$t('module.requirement.dev_point_et'),
          scopedSlots: { customRender: 'dev_point_et' },
          dataIndex: 'dev_point_et',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.com_point_et'),
          scopedSlots: { customRender: 'com_point_et' },
          dataIndex: 'com_point_et',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.pm_point_et'),
          scopedSlots: { customRender: 'pm_point_et' },
          dataIndex: 'pm_point_et',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.et_internal'),
          scopedSlots: { customRender: 'et_internal' },
          dataIndex: 'et_internal',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.et_customer_accepted'),
          scopedSlots: { customRender: 'et_customer_accepted' },
          dataIndex: 'et_customer_accepted',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.point_et'),
          scopedSlots: { customRender: 'point_et' },
          dataIndex: 'point_et',
          align: 'right',
          sorter: true
        },
        {
          title: this.$t('module.requirement.type'),
          scopedSlots: { customRender: 'type' },
          dataIndex: 'type',
          align: 'left',
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.showDetailProject()
  },

  updated() {
    this.getBackgroundColor()
  },

  /**
   * Methods.
   */
  methods: {
    getDefaultProcessingStatus() {
      const excludedKeys = ['pending', 'deleted']
      const filteredStatuses = Object.keys(REQUIREMENT_PROCESS_STATUS_VALUE)
        .filter(key => !excludedKeys.includes(key))
        .map(key => REQUIREMENT_PROCESS_STATUS_VALUE[key])

      return filteredStatuses
    },
    /**
     * Get No.
     */
    getIndex(index) {
      return (this.pagination.current - 1) * this.pagination.pageSize + index
    },

    /**
     * Get class css by status
     */
    getStatusClass(record) {
      if (record.status_processing === REQUIREMENT_PROCESS_STATUS_VALUE.in_progress) {
        return 'in_progress'
      } else if (record.status_processing === REQUIREMENT_PROCESS_STATUS_VALUE.done) {
        return 'done'
      } else if (record.status_processing === REQUIREMENT_PROCESS_STATUS_VALUE.deleted) {
        return 'red'
      } else if (record.status_processing === REQUIREMENT_PROCESS_STATUS_VALUE.pending) {
        return 'pending'
      }

      return '' // Trường hợp mặc định
    },

    /**
     * Set background of child elements to parent elements
     */
    getBackgroundColor() {
      const done = document.getElementsByClassName('done')
      const inProgress = document.getElementsByClassName('in_progress')
      const red = document.getElementsByClassName('red')
      const pending = document.getElementsByClassName('pending')
      for (let i = 0; i < done.length; i++) {
        done[i].parentElement.style.backgroundColor = '#1890ff'
      }
      for (let i = 0; i < red.length; i++) {
        red[i].parentElement.style.backgroundColor = 'red'
      }
      for (let i = 0; i < inProgress.length; i++) {
        inProgress[i].parentElement.style.backgroundColor = 'gold'
      }
      for (let i = 0; i < pending.length; i++) {
        pending[i].parentElement.style.backgroundColor = '#A9A9A9'
      }
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
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        title: this.$route.query.title || '',
        status_request: undefined,
        statuses_processing: undefined,
        type: undefined
      }

      this.replaceQuery(this.filters)
    },

    /**
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/requirement'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('text.copy_url_successful'))
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

    showDetail(id) {
      this.$router.push({ name: 'requirement-detail-id', params: { id } })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-table-row {
    cursor: pointer;
  }
}
</style>
