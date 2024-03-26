<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.mstTestcaseValidation') }}
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
              :label="$t('module.mstTestcaseValidation.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.mstTestcaseValidation.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="filters.mst_item_type_id"
                :placeholder="$t('module.mstItemType')"
                :filter-option="filterOption"
                show-search
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
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="filters.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
                :filter-option="filterOption"
                show-search
              >
                <a-select-option
                  v-for="(item, index) in mstItemProperties"
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
              :label="$t('module.mstTestcaseValidation.format_content_check')"
              prop="format_content_check"
            >
              <a-input
                v-model="filters.format_content_check"
                :placeholder="$t('module.mstTestcaseValidation.format_content_check')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstTestcaseValidation.format_expect_result')"
              prop="format_expect_result"
            >
              <a-input
                v-model="filters.format_expect_result"
                :placeholder="$t('module.mstTestcaseValidation.format_expect_result')"
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
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project?.name }}
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
          slot="mst_item_property_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemProperty?.name }}
          </div>
        </template>
        <template
          slot="status"
          slot-scope="text, record"
        >
          <div v-if="record.status === MST_TEST_CASE_VALIDATION_STATUS_VALUE.use">
            {{ $t('common.use') }}
          </div>
          <div v-if="record.status === MST_TEST_CASE_VALIDATION_STATUS_VALUE.not_use">
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
            v-if="record.status === MST_TEST_CASE_VALIDATION_STATUS_VALUE.not_use"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.mstTestcaseValidation') }}
      </template>

      <a-spin :spinning="loading">
        <mstTestcaseValidation-form
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
import MstTestcaseValidationForm from '~/components/templates/mstTestcaseValidation/MstTestcaseValidationForm'
import { SORT, MST_TEST_CASE_VALIDATION_STATUS_VALUE, USE_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    MstTestcaseValidationForm
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
      resource: 'mstTestcaseValidation',
      visible: false,
      currentId: 0,
      filters: {
        project_id: +this.$route.query.project_id || undefined,
        name: this.$route.query.name || '',
        mst_item_type_id: +this.$route.query.mst_item_type_id || undefined,
        mst_item_property_id: +this.$route.query.mst_item_property_id || undefined,
        format_content_check: this.$route.query.format_content_check || '',
        format_content_check_jp: this.$route.query.format_content_check_jp || '',
        format_expect_result: this.$route.query.format_expect_result || '',
        format_expect_result_jp: this.$route.query.format_expect_result_jp || '',
        order: this.$route.query.order || '',
        status: this.$route.query.status || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      mstItemTypes: [],
      mstItemProperties: [],
      MST_TEST_CASE_VALIDATION_STATUS_VALUE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstTestcaseValidation.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' }
        },
        {
          title: this.$t('module.mstTestcaseValidation.name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('module.mstTestcaseValidation.mst_item_type_id'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' }
        },
        {
          title: this.$t('module.mstTestcaseValidation.mst_item_property_id'),
          dataIndex: 'mst_item_property_id',
          scopedSlots: { customRender: 'mst_item_property_id' }
        },
        {
          title: this.$t('module.mstTestcaseValidation.format_content_check'),
          dataIndex: 'format_content_check'
        },
        {
          title: this.$t('module.mstTestcaseValidation.format_expect_result'),
          dataIndex: 'format_expect_result'
        },
        {
          title: this.$t('module.mstTestcaseValidation.status'),
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
    this.getMstItemTypes()
    this.getMstItemPropertys()
  },

  methods: {
    /**
     * List MstItemType.
     */
    async getMstItemTypes() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id,
          use_flg: USE_FLG_VALUE.yes,
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.mstItemType.list({ params })
        this.mstItemTypes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstItemProperty.
     */
    async getMstItemPropertys() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id,
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.mstItemProperty.list({ params })
        this.mstItemProperties = data
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
        name: '',
        mst_item_type_id: '',
        mst_item_property_id: '',
        format_content_check: '',
        format_content_check_jp: '',
        format_expect_result: '',
        format_expect_result_jp: '',
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
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>
