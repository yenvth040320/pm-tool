<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.kpi') }}
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
              :label="$t('module.kpi.user_id')"
              prop="user_id"
            >
              <a-select
                v-model="filters.user_id"
                :placeholder="$t('module.user')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in users"
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
              :label="$t('module.kpi.start_date')"
              prop="start_date"
            >
              <a-date-picker
                v-model="filters.start_date"
                :placeholder="$t('module.kpi.start_date')"
                format="YYYY/MM/DD"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.kpi.end_date')"
              prop="end_date"
            >
              <a-date-picker
                v-model="filters.end_date"
                :placeholder="$t('module.kpi.end_date')"
                format="YYYY/MM/DD"
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
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.user?.name }}
          </div>
        </template>
        <template
          slot="kpi_per_hour"
          slot-scope="text, record"
        >
          <div>
            {{ record.kpi_per_hour.toFixed(2) }}
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
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>
          <a-button
            v-if="record.end_date && parseEndDate(record.end_date) < lastMonth"
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
      :width="980"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.kpi') }}
      </template>

      <a-spin :spinning="loading">
        <kpi-form
          :id="currentId"
          :kpis="data"
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
import KpiForm from '~/components/templates/kpi/KpiForm'

export default {
  /**
   * Declare components.
   */
  components: {
    KpiForm
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

      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
    } catch (_) {
      if (_.message === 'Permission denied!') {
        this.$router.push('/')
      } else {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'kpi',
      visible: false,
      currentId: 0,
      filters: {
        user_id: this.$route.query.user_id || undefined,
        kpi_per_hour: this.$route.query.kpi_per_hour || '',
        start_date: this.$route.query.start_date || '',
        end_date: this.$route.query.end_date || ''
      },
      defaultParams: {
        not_admin: 1
      },
      users: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 60
        },
        {
          title: this.$t('module.kpi.user_id'),
          dataIndex: 'user_id',
          scopedSlots: { customRender: 'user_id' },
          sorter: true
        },
        {
          title: this.$t('module.kpi.kpi_per_hour'),
          dataIndex: 'kpi_per_hour',
          scopedSlots: { customRender: 'kpi_per_hour' },
          sorter: true
        },
        {
          title: this.$t('module.kpi.start_date'),
          dataIndex: 'start_date',
          sorter: true
        },
        {
          title: this.$t('module.kpi.end_date'),
          dataIndex: 'end_date',
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },

    lastMonth() {
      const currentDate = new Date()
      currentDate.setMonth(currentDate.getMonth() - 1)
      return currentDate
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getUsers()
  },

  /**
   * Methods.
   */
  methods: {
    parseEndDate(endDate) {
      return new Date(endDate)
    },

    /**
     * Filter search option
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
     * List User.
     */
    async getUsers() {
      try {
        const params = {
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.user.list({ params })
        this.users = data
      } catch (_) {
        if (_.message === 'Permission denied!') {
          this.$router.push('/')
        }
      }
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
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
        user_id: undefined,
        kpi_per_hour: '',
        start_date: '',
        end_date: ''
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      if (this.filters.start_date) {
        this.filters.start_date = moment(this.filters.start_date).format('YYYY-MM-DD')
      }
      if (this.filters.end_date) {
        this.filters.end_date = moment(this.filters.end_date).format('YYYY-MM-DD')
      }
      this.replaceQuery(this.filters)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-form-item-children {
    .ant-calendar-picker {
      width: 100% !important
    }
  }
}
</style>
