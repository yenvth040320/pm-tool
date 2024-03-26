<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          title="Tạo mới"
          class="min-w-100"
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
      </template>

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
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="lg"
            title="Cập nhật"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="lg"
            title="Xoá"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.apiInfo') }}
      </template>

      <a-spin :spinning="loading">
        <apiInfo-form
          :id="currentId"
          :version="version"
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
import ApiInfoForm from '~/components/templates/apiInfo/ApiInfoForm'
import { USE_FLG, USE_FLG_VALUE } from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
    ApiInfoForm
  },

  mixins: [
    DataTable
  ],
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  /**
     * Init data for component.
     */
  data() {
    return {
      resource: 'apiInfo',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || undefined,
        api_id: this.$route.query.api_id || undefined,
        version_code: this.$route.query.version_code || undefined,
        schemes: this.$route.query.schemes || '',
        host: this.$route.query.host || '',
        base_path: this.$route.query.base_path || '',
        paths: this.$route.query.paths || '',
        operation: this.$route.query.operation || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      apis: [],
      USE_FLG,
      USE_FLG_VALUE
    }
  },

  /**
     * Computed event.
     */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.apiInfo.schemes'),
          dataIndex: 'schemes',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.host'),
          dataIndex: 'host',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.base_path'),
          dataIndex: 'base_path',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.paths'),
          dataIndex: 'paths',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.operation'),
          dataIndex: 'operation',
          sorter: true
        },
        {
          title: this.$t('module.apiInfo.use_flg'),
          dataIndex: 'use_flg',
          scopedSlots: { customRender: 'use_flg' },
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
     * Go to new
     */
    gotoNew() {
      this.currentId = 0
      this.visible = true
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetail(id) {
      this.currentId = id
      this.visible = true
    },

    /**
       * On clear form search.
       */
    reset() {
      this.filters = {
        project_id: '',
        api_id: '',
        version_code: '',
        schemes: '',
        host: '',
        base_path: '',
        paths: '',
        operation: ''
      }
      this.search()
    },

    /**
       * Search data.
       */
    search() {
      this.replaceQuery(this.filters)
    }
  }
}
</script>
