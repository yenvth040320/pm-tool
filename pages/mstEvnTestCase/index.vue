<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + $t('module.mstEvnTestCase') }}
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
              :label="$t('module.mstEvnTestCase.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.mstEvnTestCase.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.mstEvnTestCase.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.mstEvnTestCase.name_jp')"
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
          slot="status"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in EVN_TEST_CASE_STATUS[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.status">
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
            v-if="record.status === ENV_STATUS_VALUE.not_use"
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
      <NotificationProjectNotSelectedVue />
    </a-card>
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { EVN_TEST_CASE_STATUS, SORT, ENV_STATUS_VALUE } from '~/constants'
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
      resource: 'mstEvnTestCase',
      visible: false,
      currentId: 0,
      filters: {
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        name: this.$route.query.name || '',
        name_jp: this.$route.query.name_jp || '',
        order: this.$route.query.order || '',
        status: this.$route.query.status || ''
      },
      defaultParams: {
        not_admin: 1
      },
      EVN_TEST_CASE_STATUS,
      SORT,
      ENV_STATUS_VALUE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstEvnTestCase.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.mstEvnTestCase.name_jp'),
          dataIndex: 'name_jp',
          sorter: true
        },
        {
          title: this.$t('module.mstEvnTestCase.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.mstEvnTestCase.status'),
          scopedSlots: { customRender: 'status' },
          dataIndex: 'status'
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
        description: '',
        description_jp: '',
        name: '',
        name_jp: '',
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
