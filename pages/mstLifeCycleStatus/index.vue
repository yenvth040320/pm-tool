<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.mstLifeCycleStatus') }}
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
              :label="$t('module.mstLifeCycleStatus.mst_life_cycle_id')"
              prop="mst_life_cycle_id"
            >
              <a-select
                v-model="filters.mst_life_cycle_id"
                :placeholder="$t('module.mstLifeCycle')"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in mstLifeCycles"
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
              :label="$t('module.mstLifeCycleStatus.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.mstLifeCycleStatus.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.closed')"
              prop="closed"
            >
              <a-select
                v-model="filters.closed"
                :placeholder="$t('module.mstLifeCycleStatus.closed')"
              >
                <a-select-option
                  v-for="(item, index) in LIFE_CYCLE_STATUS_CLOSED"
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
              :label="$t('module.mstLifeCycleStatus.color')"
              prop="color"
            >
              <a-input
                v-model="filters.color"
                :placeholder="$t('module.mstLifeCycleStatus.color')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstLifeCycleStatus.default')"
              prop="default"
            >
              <a-select
                v-model="filters.default"
                :placeholder="$t('module.mstLifeCycleStatus.default')"
              >
                <a-select-option
                  v-for="(item, index) in LIFE_CYCLE_STATUS_DEFAULT"
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
        @change="handleTableChange"
      >
        <template
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
          </div>
        </template>
        <template
          slot="mst_life_cycle_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstLifeCycle.name }}
          </div>
        </template>
        <template
          slot="use_flg"
          slot-scope="text, item"
        >
          <div
            v-for="(use, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="use.value === item.use_flg">
              {{ use.label }}
            </div>
          </div>
        </template>
        <template
          slot="closed"
          slot-scope="text, item"
        >
          <div
            v-for="(use, index) in LIFE_CYCLE_STATUS_CLOSED"
            :key="index"
          >
            <div v-if="use.value === item.closed">
              {{ use.label }}
            </div>
          </div>
        </template>
        <template
          slot="default"
          slot-scope="text, item"
        >
          <div
            v-for="(use, index) in LIFE_CYCLE_STATUS_DEFAULT"
            :key="index"
          >
            <div v-if="use.value === item.default">
              {{ use.label }}
            </div>
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
            v-if="record.default === LIFE_CYCLE_STATUS_DEFAULT_VALUE.no"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.mstLifeCycleStatus') }}
      </template>

      <a-spin :spinning="loading">
        <mstLifeCycleStatus-form
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

import DataTable from '~/mixins/data-table'
import MstLifeCycleStatusForm from '~/components/templates/mstLifeCycleStatus/MstLifeCycleStatusForm'
import {
  LIFE_CYCLE_STATUS_CLOSED,
  LIFE_CYCLE_STATUS_CLOSED_VALUE,
  LIFE_CYCLE_STATUS_DEFAULT,
  LIFE_CYCLE_STATUS_DEFAULT_VALUE,
  SORT,
  USE_FLG
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    MstLifeCycleStatusForm
  },

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

      params.project_id = this.$store.state.project.id
      params.order_type = SORT.asc

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
      resource: 'mstLifeCycleStatus',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || undefined,
        mst_life_cycle_id: +this.$route.query.mst_life_cycle_id || undefined,
        name: this.$route.query.name || '',
        closed: +this.$route.query.closed || undefined,
        color: this.$route.query.color || '',
        default: +this.$route.query.default || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      mstLifeCycles: [],
      LIFE_CYCLE_STATUS_CLOSED,
      LIFE_CYCLE_STATUS_CLOSED_VALUE,
      LIFE_CYCLE_STATUS_DEFAULT,
      LIFE_CYCLE_STATUS_DEFAULT_VALUE,
      USE_FLG
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstLifeCycleStatus.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' }
        },
        {
          title: this.$t('module.mstLifeCycleStatus.mst_life_cycle_id'),
          dataIndex: 'mst_life_cycle_id',
          scopedSlots: { customRender: 'mst_life_cycle_id' }
        },
        {
          title: this.$t('module.mstLifeCycleStatus.name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('module.mstLifeCycleStatus.color'),
          dataIndex: 'color'
        },
        {
          title: this.$t('module.mstLifeCycleStatus.closed'),
          dataIndex: 'closed',
          scopedSlots: { customRender: 'closed' }
        },
        {
          title: this.$t('module.mstLifeCycleStatus.use_flg'),
          dataIndex: 'use_flg',
          scopedSlots: { customRender: 'use_flg' }
        },
        {
          title: this.$t('module.mstLifeCycleStatus.default'),
          dataIndex: 'default',
          scopedSlots: { customRender: 'default' }
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
    this.getMstLifeCycles()
  },

  methods: {
    /**
     * List MstLifeCycle.
     */
    async getMstLifeCycles() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
        project_id: '',
        mst_life_cycle_id: '',
        name: '',
        name_jp: '',
        description: '',
        description_jp: '',
        closed: '',
        order: '',
        color: '',
        use_flg: '',
        default: ''
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
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>
