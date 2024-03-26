<template>
  <div>
    <a-card v-if="!updateMode" class="mb-4 no-border">
      <template slot="title">
        <a-button
          html-type="button"
          type="primary"
          title="Mở tất cả"
          class="min-w-100"
          @click="expandParent()"
        >
          <div v-if="expandedKeys.length === 0">
            <font-awesome-icon icon="plus-circle" class="mr-1" />
            {{ $t('common.expand_all_node') }}
          </div>
          <div v-else>
            <a-icon type="minus-circle" />
            {{ $t('common.close_all_node') }}
          </div>
        </a-button>
      </template>
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          title="Tạo mới"
          :disabled="version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="createAndUpdateApiParameter()"
        >
          <font-awesome-icon icon="plus-circle" class="mr-1" />
          {{ data.length > 0 ? $t('common.update') : $t('common.create') }}
        </a-button>
        <a-button
          type="primary"
          class="min-w-100"
          :disabled="version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="openUpdateDbMode"
        >
          <a-icon type="diff" />
          {{ $t('module.apiParameterDatasource.add_button') }}
        </a-button>
      </template>

      <div class="tree__menu">
        <a-spin :spinning="loading">
          <a-tree
            :tree-data="data"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            @expand="onExpand"
          >
            <template
              slot="action"
              slot-scope="{ title, key, parent, data_node, datasource }"
            >
              <div
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                class="menu-tree__title"
                @click="showDrawer(key, parent, data_node)"
              >
                <span v-if="datasource">
                  <span>{{ $t(title) + ': ' }} </span>
                  <span
                    :class="{
                      'no-use': hasItemWithZeroUseFlag(
                        data_node.apiParameterDatasources
                      )
                    }"
                  >{{ $t(datasource) }}</span>
                </span>
                <span v-else>
                  {{ $t(title) }}
                </span>
              </div>
              <div v-else class="menu-tree__title">
                <span v-if="datasource">
                  <span>{{ $t(title) + ': ' }} </span>
                  <span
                    :class="{
                      'no-use': hasItemWithZeroUseFlag(
                        data_node.apiParameterDatasources
                      )
                    }"
                  >{{ $t(datasource) }}</span>
                </span>
                <span v-else>
                  {{ $t(title) }}
                </span>
              </div>
            </template>
          </a-tree>
        </a-spin>
      </div>
    </a-card>
    <UpdateModeApiParameterDatasource
      v-if="updateMode"
      :version="version"
      :db-schemas="dbSchemas"
      :db-tables="dbTables"
      :db-columns="dbColumns"
      :db-table-versions="dbTableVersions"
      :model="model"
      @saveDatasource="saveDatasource"
      @closeUpdateDb="updateMode = false"
    />
    <DrawerApiParameter
      v-if="version.id"
      ref="drawerApiParameter"
      :version="version"
      :db-schemas="dbSchemas"
      :db-tables="dbTables"
      :db-columns="dbColumns"
      :db-table-versions="dbTableVersions"
      :is-json="isJson"
      @save="save"
    />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import DrawerApiParameter from './DrawerApiParameter.vue'
import DataTable from '~/mixins/data-table'
import UpdateModeApiParameterDatasource from '~/components/templates/apiParameterDatasource/UpdateModeApiParameterDatasource'
import {
  DATA_TYPE,
  DATA_TYPE_VALUE,
  LOCK_FLG_VALUE,
  USE_FLG_VALUE,
  SORT,
  TYPE_ACTION
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    DrawerApiParameter,
    UpdateModeApiParameterDatasource
  },

  mixins: [DataTable],

  async fetch() {
    this.$store.dispatch('setLoading', true)
    try {
      const params = {
        project_id: this.$store.state.project.id,
        api_id: this.version.api_id,
        version_code: this.version.version_code,
        use_flg: USE_FLG_VALUE.yes,
        not_limit: true,
        order_type: SORT.asc
      }
      const {
        data: {
          result: { data }
        }
      } = await this.repository.list({ params })
      this.model = data
      const recursive = (parentApiParameterPK = null, parentItem = null) => {
        const list = cloneDeep(
          data.filter(
            item => item.parent_api_parameter_pk === parentApiParameterPK
          )
        )

        return list.map(item => {
          const children = recursive(item.api_parameter_pk, item)
          let titleApiParameter = ''
          let datasource = ''

          const dataType = Object.keys(DATA_TYPE_VALUE).find(
            key => DATA_TYPE_VALUE[key] === item.data_type
          )
          if (item.apiParameterDatasources.length > 0) {
            datasource = datasource = item.apiParameterDatasources
              .map(item => {
                const typeActionItem = TYPE_ACTION.find(action => action.value === item.type_action)
                const typeActionLabel = typeActionItem ? typeActionItem.label : ''
                return `(${typeActionLabel})[${item.db_schema.name}].[${item.db_table.name}]${item.db_column ? `.[${item.db_column.name}]` : ''}.[Version: ${item.db_table_version_code}]`
              })
              .join(', ')
          }
          titleApiParameter = `(${dataType}) ${item.name}`

          const apiParameter = {
            key: item.id,
            title: titleApiParameter,
            datasource,
            parent: parentItem,
            data_node: item,
            scopedSlots: {
              title: 'action'
            },
            children
          }

          return apiParameter
        })
      }
      this.data = recursive()
    } catch (error) {
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
    }
  },
  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'apiParameter',
      visible: false,
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code
      },
      innerData: [],
      DATA_TYPE,
      DATA_TYPE_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      SORT,
      showFormEvent: false,
      functionItems: [],
      mstEvents: [],
      functions: [],
      expandedKeys: [],
      autoExpandParent: true,
      dbSchemas: [],
      dbTables: [],
      dbColumns: [],
      dbTableVersions: [],
      isJson: false,
      TYPE_ACTION,
      model: {},
      updateMode: false,
      dataModeUpdate: []
    }
  },
  watch: {
    data(newVal) {
      this.data = newVal
    },

    showFormEvent(newVal) {
      if (!newVal) {
        this.showFormEvent = false
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getDbSchemas()
    this.getDbTables()
    this.getDbTableVersions()
    this.getDbColumns()
  },

  methods: {
    hasItemWithZeroUseFlag(apiParameterDatasources) {
      return apiParameterDatasources.some(item => {
        if (item.db_column !== null) {
          return item.db_column.use_flg === USE_FLG_VALUE.no || item.db_table.use_flg === USE_FLG_VALUE.no
        }
        return item.db_table.use_flg === USE_FLG_VALUE.no
      })
    },
    /**
     * Expand all node
     */
    expandParent() {
      if (this.expandedKeys.length === this.getAllNodeKeys(this.data).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.data)
      }
    },

    /**
     * Get all node key
     */
    getAllNodeKeys(nodes) {
      let keys = []
      for (const node of nodes) {
        keys.push(node.key)
        if (node.children && node.children.length > 0) {
          keys = keys.concat(this.getAllNodeKeys(node.children))
        }
      }
      return keys
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    /**
     * Get list db schema
     */
    async getDbSchemas() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.dbSchema.list({ params })
        this.dbSchemas = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },
    /**
     * Get list db table
     */
    async getDbTables() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          datasource: true
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.dbTable.list({ params })
        this.dbTables = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list db table versions
     */
    async getDbTableVersions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.dbTableVersion.list({ params })
        this.dbTableVersions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list db table
     */
    async getDbColumns() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          datasource: true
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.dbTableColumn.list({ params })
        this.dbColumns = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Show drawer and add api parameter
     */
    addApiParameter() {
      this.$refs.drawerApiParameter.showDrawer(null)
    },

    createAndUpdateApiParameter() {
      this.isJson = true
      if (Object.keys(this.data).length > 0) {
        this.model.is_update = true
        this.$refs.drawerApiParameter.open(this.model)
      } else {
        this.$refs.drawerApiParameter.open(null)
      }
    },

    /**
     * Show drawer and api parameter
     */
    showDrawer(key, parent, data) {
      this.isJson = false
      this.$refs.drawerApiParameter.showDrawer(parent, data)
    },

    save() {
      this.model = {}
      this.$fetch()
    },

    /**
     * Open Update Db Mode
     */
    openUpdateDbMode() {
      this.updateMode = true
    },

    /**
     * On save datasource from mode update db
     */
    saveDatasource() {
      this.updateMode = false
      this.$fetch()
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
  .no-use {
    text-decoration: line-through;
  }
}
</style>
