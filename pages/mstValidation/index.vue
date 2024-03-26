<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + $t('module.mstValidation') }}
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
              :label="$t('module.mstValidation.format_content_check')"
              prop="format_content_check"
            >
              <a-input
                v-model="filters.format_content_check"
                :placeholder="$t('module.mstValidation.format_content_check')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_content_check_jp')"
              prop="format_content_check_jp"
            >
              <a-input
                v-model="filters.format_content_check_jp"
                :placeholder="$t('module.mstValidation.format_content_check_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_expect_result')"
              prop="format_expect_result"
            >
              <a-input
                v-model="filters.format_expect_result"
                :placeholder="$t('module.mstValidation.format_expect_result')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.format_expect_result_jp')"
              prop="format_expect_result_jp"
            >
              <a-input
                v-model="filters.format_expect_result_jp"
                :placeholder="$t('module.mstValidation.format_expect_result_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstValidation.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="filters.mst_item_type_id"
                :placeholder="$t('module.mstItemType')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemTypes"
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
        @change="handleTableChange"
      >
        <template
          slot="mst_item_property_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemProperty?.name }}
          </div>
        </template>
        <template
          slot="mst_item_type_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemType?.name }}
          </div>
        </template>
        <template
          slot="use_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
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
            v-if="record.use_flg === USE_FLG_VALUE.no"
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

      <NotificationProjectNotSelectedVue />
      <!-- end main-table -->
    </a-card>
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { USE_FLG_VALUE, USE_FLG, SORT } from '~/constants'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'

export default {
  /**
   * Declare components.
   */
  components: { NotificationProjectNotSelectedVue },

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
      resource: 'mstValidation',
      visible: false,
      currentId: 0,
      filters: {
        format_content_check: this.$route.query.format_content_check || '',
        format_content_check_jp: this.$route.query.format_content_check_jp || '',
        format_expect_result: this.$route.query.format_expect_result || '',
        format_expect_result_jp: this.$route.query.format_expect_result_jp || '',
        mst_item_property_id: this.$route.query.mst_item_property_id || undefined,
        mst_item_type_id: this.$route.query.mst_item_type_id || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      mstItemPropertys: [],
      mstItemTypes: [],
      projects: [],
      USE_FLG_VALUE,
      USE_FLG,
      SORT
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstValidation.mst_item_type_id'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' },
          sorter: true
        },
        {
          title: this.$t('module.mstValidation.mst_item_property_id'),
          dataIndex: 'mst_item_property_id',
          scopedSlots: { customRender: 'mst_item_property_id' },
          sorter: true
        },

        {
          title: this.$t('module.mstValidation.format_content_check'),
          dataIndex: 'format_content_check'
        },
        {
          title: this.$t('module.mstValidation.format_content_check_jp'),
          dataIndex: 'format_content_check_jp'
        },
        {
          title: this.$t('module.mstValidation.format_expect_result'),
          dataIndex: 'format_expect_result'
        },
        {
          title: this.$t('module.mstValidation.format_expect_result_jp'),
          dataIndex: 'format_expect_result_jp'
        },
        {
          title: this.$t('module.mstValidation.use_flg'),
          scopedSlots: { customRender: 'use_flg' },
          dataIndex: 'use_flg'
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
    this.getMstItemTypes()
  },

  methods: {
    /**
     * List MstItemType
     */
    async getMstItemTypes() {
      const params = {
        project_id: this.$store.state.project.id,
        order_type: SORT.asc,
        use_flg: USE_FLG_VALUE.yes,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.mstItemType.list({ params })
      this.mstItemTypes = data
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
        use_flg: '',
        format_content_check: '',
        format_content_check_jp: '',
        format_expect_result: '',
        format_expect_result_jp: '',
        mst_item_property_id: '',
        mst_item_type_id: undefined,
        order: '',
        project_id: ''
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    }
  }
}
</script>
