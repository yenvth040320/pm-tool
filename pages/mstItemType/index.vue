<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + $t('module.mstItemType') }}
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
              :label="$t('module.mstItemType.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.mstItemType.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstItemType.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.mstItemType.name_jp')"
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
          slot="default"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in DEFAULT[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.default">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="default_create_item"
          slot-scope="text, record"
        >
          <span>
            {{ MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_INDEX[record.default_create_item] }}
          </span>
        </template>
        <template
          slot="sample_code"
          slot-scope="text, record"
        >
          <a-textarea
            v-if="record.sample_code"
            v-model="record.sample_code"
            :placeholder="$t('module.mstItemType.sample_code')"
            auto-size
            disabled
          />
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.mstItemType') }}
      </template>

      <a-spin :spinning="loading">
        <mstItemType-form
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

import DataTable from '~/mixins/data-table'
import MstItemTypeForm from '~/components/templates/mstItemType/MstItemTypeForm'
import {
  USE_FLG,
  DEFAULT,
  USE_FLG_VALUE,
  SORT,
  MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_INDEX
} from '~/constants'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    MstItemTypeForm,
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
      resource: 'mstItemType',
      visible: false,
      currentId: 0,
      filters: {
        default: this.$route.query.default || '',
        use_flg: this.$route.query.use_flg || '',
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        name: this.$route.query.name || '',
        name_jp: this.$route.query.name_jp || '',
        order: this.$route.query.order || '',
        project_id: this.$route.query.project_id || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      USE_FLG,
      DEFAULT,
      USE_FLG_VALUE,
      SORT,
      MST_ITEM_TYPE_DEFAULT_CREATE_ITEM_INDEX
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstItemType.order'),
          dataIndex: 'order',
          sorter: true,
          width: 100
        },
        {
          title: this.$t('module.mstItemType.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.mstItemType.name_jp'),
          dataIndex: 'name_jp',
          sorter: true
        },
        {
          title: this.$t('module.mstItemType.default'),
          scopedSlots: { customRender: 'default' },
          dataIndex: 'default',
          sorter: true
        },
        {
          title: this.$t('module.mstItemType.default_create_item'),
          scopedSlots: { customRender: 'default_create_item' },
          dataIndex: 'default_create_item'
        },
        {
          title: this.$t('module.mstItemType.sample_code'),
          scopedSlots: { customRender: 'sample_code' },
          width: 500
        },
        {
          title: this.$t('module.mstItemType.use_flg'),
          scopedSlots: { customRender: 'use_flg' },
          dataIndex: 'use_flg',
          sorter: true,
          width: 120
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
  mounted() {},

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
        default: '',
        use_flg: '',
        description: '',
        description_jp: '',
        name: '',
        name_jp: '',
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
<style lang="scss" scoped>
:deep() {
  .ant-input[disabled] {
    background-color: #FFFFFF !important;
    color: #000000;
  }
}
</style>
