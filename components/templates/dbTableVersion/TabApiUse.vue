<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="title">
        <label>{{ $t('module.dbTable.entity_id') + ': ' }}</label>
        <span>{{ entityList.find(item => item.id === dbTable.entity_id)?.name }}</span>
      </template>
      <template slot="extra">
        <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
      </template>
      <a-table
        ref="dataSourceTable"
        bordered
        :data-source="hasData ? dbTableColumns : []"
        :row-key="record => record.id"
        :pagination="false"
        :row-class-name="rowClassName"
        :columns="columns"
        class="main-table"
      >
        <template slot="column" slot-scope="text, record">
          <div :class="record.use_flg === USE_FLG_VALUE.no ? 'no-use' : ''">
            {{ record.name }}
          </div>
        </template>

        <template slot="api_parameter" slot-scope="text, record">
          <div v-if="record.apiParameterDatasources.length > 0" class="detail-datasource">
            <span v-for="(item, index) in record.apiParameterDatasources" :key="index">
              <NuxtLink :to="`/api/${item.api_id}/version/${item.version_code}#tab_parameter`">
                <div :class="getRowClass(item.api, item.api_parameter)">
                  {{ item.api?.name }}{{ item.api_parameter?.path ? '/' + item.api_parameter?.path : '' }}
                </div>
              </NuxtLink>
            </span>
          </div>
        </template>

        <template slot="api_response" slot-scope="text, record">
          <div v-if="record.apiResponseDatasources.length > 0" class="detail-datasource">
            <span v-for="(item, index) in record.apiResponseDatasources" :key="index">
              <NuxtLink :to="`/api/${item.api_id}/version/${item.version_code}#tab_parameter`">
                <div :class="getRowClass(item.api, item.api_response)">
                  {{ item.api?.name }}{{ item.api_response.path ? '/' + item.api_response?.path : '' }}
                </div>
              </NuxtLink>
            </span>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DataTable from '~/mixins/data-table'
import {
  DATA_TYPE,
  DATA_TYPE_VALUE,
  LOCK_FLG_VALUE,
  USE_FLG_VALUE
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {},

  mixins: [DataTable],
  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    entityList: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      visible: false,
      DATA_TYPE,
      DATA_TYPE_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      hasData: false,
      checkSwitch: true,
      showDisabledRows: true,
      functionUse: [],
      dbTableColumns: [],
      dbTable: {}
    }
  },
  computed: {
    ...mapState({
      loading: 'loading'
    }),

    header() {
      return [
        {
          title: this.$t('module.api.order'),
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: '5%'
        },
        {
          title: this.$t('module.dbTableColumn'),
          dataIndex: 'function',
          scopedSlots: { customRender: 'column' },
          width: '20%'
        },
        {
          title: this.$t('module.versionApi.api_parameter_tab'),
          width: '35%',
          scopedSlots: { customRender: 'api_parameter' }
        },
        {
          title: this.$t('module.versionApi.tab_response'),
          width: '35%',
          scopedSlots: { customRender: 'api_response' }
        }
      ]
    }
  },

  watch: {},

  created() {
    this.$bus.$on('columnEdited', editedData => {
      this.getDbTableColumns()
    })
  },

  /**
   * Mounted event.
   */
  async mounted() {
    await this.getDbTableColumns()
    this.checkReadAndWriteDataSource()
  },

  methods: {
    onChangeSwitch() {
      this.showDisabledRows = this.checkSwitch
    },

    async getDbTableColumns() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = this.$route.query
        params.project_id = this.$store.state.project.id
        params.db_table_id = this.version.db_table_id
        params.version_code = this.version.version_code

        const { data: { result: { data } } } = await this.$api.dbTableColumn.list({ params })
        this.dbTableColumns = data
        this.dbTableColumns = this.dbTableColumns.map((item, index) => {
          return { ...item, index: index + 1 }
        })
        if (this.dbTableColumns.length > 0) {
          if (this.dbTableColumns[0].dbTable) {
            this.dbTable = this.dbTableColumns[0].dbTable
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    checkReadAndWriteDataSource() {
      const data = this.dbTableColumns.some(
        item =>
          item.apiParameterDatasources.length > 0 ||
          item.apiResponseDatasources.length > 0
      )
      if (data) {
        this.hasData = true
      } else {
        this.hasData = false
      }
    },

    /**
     * Set table class
     *
     * @param {array} record
     */
    rowClassName(record) {
      const allParameterDatasourcesDisabled = record.apiParameterDatasources.every(
        item => item?.api_parameter?.use_flg === USE_FLG_VALUE.no ||
        item?.api?.use_flg === USE_FLG_VALUE.no
      )

      const allResponseDatasourcesDisabled = record.apiResponseDatasources.every(
        item => item?.api_response?.use_flg === USE_FLG_VALUE.no ||
        item?.api?.use_flg === USE_FLG_VALUE.no
      )

      const isDisabled = record.use_flg === USE_FLG_VALUE.no || (allParameterDatasourcesDisabled && allResponseDatasourcesDisabled)
      const isHideRow = record.apiParameterDatasources.length === 0 && record.apiResponseDatasources.length === 0

      return this.showDisabledRows ? (isHideRow || isDisabled ? 'hide-row' : null) : (isHideRow ? 'hide-row' : isDisabled ? 'disabled-row' : null)
    },

    getRowClass(api, item) {
      if (api && item) {
        const isApiDisabled = api.use_flg === USE_FLG_VALUE.no
        const isItemDisabled = item.use_flg === USE_FLG_VALUE.no

        if (this.showDisabledRows) {
          return isApiDisabled || isItemDisabled ? 'disable-item' : ''
        }
        return isApiDisabled || isItemDisabled ? 'no-use' : ''
      }
    }
  }
}
</script>

  <style scoped lang="scss">
  :deep() {
    .tree__menu {
      [role='treeitem'] {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .ant-tree-switcher-icon {
          vertical-align: middle;
          font-size: 20px !important;
        }
        .ant-tree-switcher {
          flex: 0 0 auto;
        }
        .ant-tree-node-content-wrapper {
          flex: 1 1 auto;
          height: auto;
        }
        .ant-tree-child-tree {
          flex: 1 1 100%;
          width: 100%;
        }
        span[draggable='true'] {
          line-height: 24px;
        }
        .ant-tree-title {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          &:active {
            background-clip: #bae7ff;
          }
          .menu-tree__title {
            flex: 1 1 auto;
          }
          .menu-tree__action {
            flex: 0 0 auto;
            width: 90px;
          }
        }
      }
    }
    .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
      background-color: #ffffff;
    }
    .detail-datasource {
      cursor: pointer;
    }
    .no-use {
      text-decoration: line-through;
    }
    .hide-row {
      display: none;
    }
    .disable-item {
      display: none;
    }
  }
  .switch-btn {
    margin-right: 15px;
  }
  :deep() {
    .ant-table-tbody {
      .disabled-row {
        background-color: rgba(217, 217, 217, 0.5);
      }
    }
  }
  </style>
