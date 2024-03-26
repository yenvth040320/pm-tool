<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + $t('module.mstCategoryTestCaseCommon') }}
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
              :label="$t('module.mstCategoryTestCaseCommon.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.mstCategoryTestCaseCommon.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstCategoryTestCaseCommon.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.mstCategoryTestCaseCommon.order')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstCategoryTestCaseCommon.status')"
              prop="status"
            >
              <a-select
                v-model="filters.status"
                :placeholder="$t('module.mstCategoryTestCaseCommon.status')"
              >
                <a-select-option
                  v-for="(item, index) in CATEGORY_TEST_CASE_STATUS[$nuxt.$i18n.locale]"
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
          slot="status"
          slot-scope="text, record"
        >
          <div v-if="record.status === CATEGORY_TEST_CASE_STATUS_VALUE.use">
            {{ $t('common.use') }}
          </div>
          <div v-if="record.status === CATEGORY_TEST_CASE_STATUS_VALUE.not_use">
            {{ $t('common.not_use') }}
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
            v-if="record.use_flg === CATEGORY_TEST_CASE_STATUS_VALUE.not_use"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.mstCategoryTestCaseCommon') }}
      </template>

      <a-spin :spinning="loading">
        <mstCategoryTestCaseCommon-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <NotificationProjectNotSelectedVue />
    <!-- end modal-detail -->
  </div>
</template>
<script>
import { CATEGORY_TEST_CASE_STATUS, CATEGORY_TEST_CASE_STATUS_VALUE, SORT } from '~/constants'
import DataTable from '~/mixins/data-table'
import MstCategoryTestCaseCommonForm from '~/components/templates/mstCategoryTestCaseCommon/MstCategoryTestCaseCommonForm'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    MstCategoryTestCaseCommonForm,
    NotificationProjectNotSelectedVue
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
      resource: 'mstCategoryTestCaseCommon',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || undefined,
        name: this.$route.query.name || undefined,
        order: this.$route.query.order || undefined,
        status: this.$route.query.status || undefined
      },
      defaultParams: {
        not_admin: 1
      },
      CATEGORY_TEST_CASE_STATUS,
      CATEGORY_TEST_CASE_STATUS_VALUE,
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
          title: this.$t('module.mstCategoryTestCaseCommon.order'),
          dataIndex: 'order',
          sorter: true,
          width: 100
        },
        {
          title: this.$t('module.mstCategoryTestCaseCommon.name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('module.mstCategoryTestCaseCommon.description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('module.mstCategoryTestCaseCommon.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
  },

  methods: {
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
        name: '',
        name_jp: '',
        description: '',
        description_jp: '',
        order: '',
        status: ''
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
