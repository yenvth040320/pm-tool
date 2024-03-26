<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="title">
        <a-button
          html-type="button"
          type="primary"
          title="Mở tất cả"
          class="min-w-100"
          @click="expandParent()"
        >
          <div v-if="expandedKeys.length === 0">
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('common.expand_all_node') }}
          </div>
          <div v-else>
            <a-icon type="minus-circle" />
            {{ $t('common.close_all_node') }}
          </div>
        </a-button>
        <a-form-model
          ref="form"
          :model="filters"
          layout="inline"
          class="mb-4 form-search"
          @submit.prevent="search"
        >
          <a-form-model-item
            :label="$t('module.apiResponse.schema')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.schema')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="filters.db_schema_id"
              :placeholder="$t('module.apiResponse.schema')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeSchema"
            >
              <a-select-option
                v-for="(item, i) in listSchema"
                :key="i"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            :label="$t('module.apiResponse.dbTable')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.dbTable')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="filters.db_table_id"
              :placeholder="$t('module.apiResponse.dbTable')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeTable"
            >
              <a-select-option
                v-for="(item, i) in filterTable"
                :key="i"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            :label="$t('module.apiResponse.version')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.version')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="filters.db_table_version_code"
              :placeholder="$t('module.apiResponse.version')"
              allow-clear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, i) in filterTableVersion"
                :key="i"
                :value="item.version_code"
              >
                {{ item.version_code }}: {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-button
            html-type="submit"
            type="primary"
            title="Thêm mới"
            class="min-w-100 search-btn"
          >
            <a-icon type="search" />
            {{ $t('common.search') }}
          </a-button>
        </a-form-model>
      </template>
      <a-row class="main-row">
        <a-col :span="19" style="max-height: 500px; overflow-y: auto">
          <div class="tree__menu">
            <a-spin :spinning="spin">
              <a-tree
                :tree-data="dataModeUpdate"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                :selected-keys="selectedKeys"
                @expand="onExpand"
                @select="onSelect"
              >
                <template
                  slot="action"
                  slot-scope="{ title, key, data_node, datasource }"
                >
                  <i
                    class="icon"
                    :class="{'icon-open': expandedKeys, 'icon-close': !expandedKeys}"
                    @click.stop
                  />

                  <div
                    v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                    class="menu-tree__title"
                    :class="changedTree.includes(key) && key !== selectedKeys[0] ? 'changed-row' : ''"
                  >
                    <span v-if="datasource.length > 0">
                      <span>{{ $t(title) + ': ' }} </span>
                      <span :class="{'no-use': hasItemWithZeroUseFlag(data_node.apiResponseDatasources)}">
                        <span v-for="(source, indexSource) in datasource" :key="indexSource">
                          {{ `[${source.db_schema.name}].[${source.db_table.name}]${source.db_column ? `.[${source.db_column.name}]` : ''}.[Version: ${source.db_table_version_code}]` }}
                          <a-icon type="close-square" @dblclick="clearDatasource(key, source)" />
                          <span v-if="indexSource !== datasource.length - 1">,</span>
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      {{ $t(title) }}
                    </span>
                  </div>
                </template>
              </a-tree>
            </a-spin>
          </div>
        </a-col>
        <a-col :span="5" style="max-height: 500px; overflow-y: auto">
          <a-table
            v-if="filterColumn.length > 0"
            :columns="columns"
            :row-key="record => record.id"
            :data-source="filterColumn"
            :pagination="false"
            :loading="loading"
            :custom-row="customRow"
            :row-class-name="rowClassName"
          />
        </a-col>
      </a-row>
      <div class="mt-4 text-center">
        <a-button type="primary" title="Cập nhật" @click="updateResponse">
          {{ $t('common.update') }}
        </a-button>
        <a-button type="default" title="Hủy" @click="$emit('closeUpdateDb')">
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import { LOCK_FLG_VALUE, DATA_TYPE_VALUE, SORT, USE_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {},

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    model: {
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
      defaultParams: {
        project_id: this.$store.state.project.id
      },
      id: +this.$route.params.id || 0,
      versionCode: +this.$route.params.version_code || 0,
      LOCK_FLG_VALUE,
      DATA_TYPE_VALUE,
      SORT,
      USE_FLG_VALUE,
      expandedKeys: [],
      autoExpandParent: true,
      spin: false,
      filters: {
        db_schema_id: undefined,
        db_table_id: undefined,
        db_table_version_code: undefined
      },
      dbTables: [],
      dbColumns: [],
      dbTableVersion: [],
      filterTable: [],
      filterColumn: [],
      filterTableVersion: [],
      listSchema: [],
      selectedKeys: [],
      selectedRow: 0,
      data: {
        dataInsert: [],
        dataDelete: []
      },
      changedTree: [],
      dataModeUpdate: []
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    }),

    header() {
      return [
        {
          title: this.$t('module.dbTableColumn.name'),
          dataIndex: 'name',
          width: 140
        },
        {
          title: this.$t('module.dbTableColumn.description'),
          dataIndex: 'description',
          width: 140
        }
      ]
    },

    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    }
  },

  watch: {
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getListSchema()
    this.getListDbTable()
    this.getListDbColumn()
    this.getDbVersion()
    this.buildTree()
  },

  methods: {
    buildTree() {
      const recursive = (parentPK = null) => {
        const list = cloneDeep(this.model.filter(item => item.parent_api_response_pk === parentPK))

        return list.map(item => {
          const children = recursive(item.api_response_pk)
          let title = ''
          let datasource = []
          const dataType = Object.keys(DATA_TYPE_VALUE).find(key => DATA_TYPE_VALUE[key] === item.data_type)
          if (item.apiResponseDatasources.length > 0) {
            datasource = item.apiResponseDatasources
          }
          title = `(${dataType}) ${item.name}`

          const response = {
            key: item.id,
            title,
            datasource,
            value: item.parent_api_response_pk,
            data_node: item,
            scopedSlots: {
              title: 'action'
            },
            children
          }
          return response
        })
      }
      this.dataModeUpdate = recursive()
    },

    /**
     * Item use flg = 0
     */
    hasItemWithZeroUseFlag(apiResponseDatasources) {
      return apiResponseDatasources.some(item => {
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
      if (this.expandedKeys.length === this.getAllNodeKeys(this.dataModeUpdate).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.dataModeUpdate)
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

    /**
     * On expand tree
     */
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    /**
     * Search in select option
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Get list schema
     */
    async getListSchema() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.dbSchema.list({ params })
        this.listSchema = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list db table
     */
    async getListDbTable() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          datasource: true,
          use_flg: USE_FLG_VALUE.yes
        }
        const { data: { result: { data } } } = await this.$api.dbTable.list({ params })
        this.dbTables = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list column
     */
    async getListDbColumn() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id,
          order_by: 'id',
          order_type: SORT.asc,
          datasource: true,
          use_flg: USE_FLG_VALUE.yes
        }
        const { data: { result: { data } } } = await this.$api.dbTableColumn.list({ params })
        this.dbColumns = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list version
     */
    async getDbVersion() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.dbTableVersion.list({ params })
        this.dbTableVersion = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Trigger when change schema select input
     */
    changeSchema() {
      this.filters.db_table_id = undefined
      this.filterTable = []
      this.filters.db_table_version_code = undefined
      this.filterTableVersion = []
      this.filterTable = this.dbTables.filter(item => item.db_schema_id === this.filters.db_schema_id && item.use_flg === USE_FLG_VALUE.yes)
    },

    /**
     * Trigger when change db table select input
     */
    changeTable() {
      this.filters.db_table_version_code = undefined
      this.filterTableVersion = []
      this.filterTableVersion = this.dbTableVersion.filter(item => item.db_table_id === this.filters.db_table_id)
      if (this.filterTableVersion.length > 0) {
        this.filters.db_table_version_code = this.filterTableVersion[0].version_code
      }
    },

    /**
     * Search table column left
     */
    search() {
      this.filterColumn = this.dbColumns.filter(item => item.db_table_id === this.filters.db_table_id &&
          item.version_code === this.filters.db_table_version_code &&
          item.use_flg === USE_FLG_VALUE.yes).map(item => {
        return { ...item, isSelected: false }
      })
      this.filterColumn = this.filterColumn.sort((a, b) => a.id - b.id)
    },

    /**
     * Clear datasource on double click row tree
     */
    clearDatasource(key, source) {
      const foundRecord = this.findRecordByKey(this.dataModeUpdate, key)
      if (foundRecord && foundRecord.datasource.length > 0) {
        // delete datasource has id in db
        if (source.id) {
          const index = foundRecord.datasource.findIndex(item => item.id === source.id)
          if (index > -1) {
            foundRecord.datasource.splice(index, 1)
            this.data.dataDelete.push(source.id)
          }
        } else {
          // delete datasource that user click on table
          const index = foundRecord.datasource.findIndex(item => item.db_table_version_code === source.db_table_version_code &&
              item.api_response_pk === source.api_response_pk &&
              item.db_table_id === source.db_table_id &&
              item.db_schema_id === source.db_schema_id &&
              item.db_table_column_pk === source.db_table_column_pk
          )
          if (index > -1) {
            foundRecord.datasource.splice(index, 1)
            const indexInsert = this.data.dataInsert.findIndex(item => item.db_table_version_code === source.db_table_version_code &&
                item.api_response_pk === source.api_response_pk &&
                item.db_table_id === source.db_table_id &&
                item.db_schema_id === source.db_schema_id &&
                item.db_table_column_pk === source.db_table_column_pk
            )
            if (indexInsert > -1) {
              this.data.dataInsert.splice(indexInsert, 1)
            }
          }
        }
        this.changedTree.push(foundRecord.key)
      }
    },

    /**
     * Select row tree event
     */
    onSelect(keys, event) {
      this.selectedKeys = keys
    },

    /**
     * Custom row event of table column left
     */
    customRow(record) {
      return {
        on: {
          click: () => {
            if (this.selectedRow !== 0 && this.filterColumn.some(col => col.isSelected === true)) {
              this.filterColumn.find(item => item.id === this.selectedRow).isSelected = false
            }
            this.selectedRow = record.id
            record.isSelected = true
          },
          dblclick: () => {
            if (this.selectedKeys.length > 0) {
              const selectedKey = this.selectedKeys[0]
              const foundRecord = this.findRecordByKey(this.dataModeUpdate, selectedKey)
              const schema = this.listSchema.find(item => item.id === record.dbTable.db_schema_id)
              const dbTable = record.dbTable
              const versionTableCode = this.dbTableVersion.find(item => item.version_code === record.version_code && item.db_table_id === record.db_table_id)
              if (foundRecord &&
                  foundRecord.data_node.data_type !== DATA_TYPE_VALUE.array &&
                  foundRecord.data_node.data_type !== DATA_TYPE_VALUE.null &&
                  !foundRecord.data_node.apiResponseDatasources.some(res => res.db_table_id === dbTable.id &&
                      res.db_schema_id === schema.id &&
                      res.db_table_column_pk === record.db_table_column_pk &&
                      res.db_table_version_code === versionTableCode.version_code
                  ) &&
                  !this.data.dataInsert.some(i => i.db_table_id === dbTable.id &&
                      i.db_schema_id === schema.id &&
                      i.db_table_column_pk === record.db_table_column_pk &&
                      i.db_table_version_code === versionTableCode.version_code &&
                      i.api_response_pk === foundRecord.data_node.api_response_pk
                  )
              ) {
                foundRecord.datasource.push({
                  db_schema: schema,
                  db_table: dbTable,
                  db_column: foundRecord.data_node.data_type !== DATA_TYPE_VALUE.object ? record : null,
                  db_table_version_code: versionTableCode.version_code,
                  api_response_pk: foundRecord.data_node.api_response_pk,
                  db_table_id: dbTable.id,
                  db_schema_id: schema.id,
                  db_table_column_pk: foundRecord.data_node.data_type !== DATA_TYPE_VALUE.object ? record.db_table_column_pk : null
                })
                this.data.dataInsert.push({
                  project_id: this.$store.state.project.id,
                  api_id: this.id,
                  version_code: this.versionCode,
                  api_response_pk: foundRecord.data_node.api_response_pk,
                  db_table_id: dbTable.id,
                  db_schema_id: schema.id,
                  db_table_column_pk: foundRecord.data_node.data_type !== DATA_TYPE_VALUE.object ? record.db_table_column_pk : null,
                  db_table_version_code: versionTableCode.version_code
                })
                this.changedTree.push(foundRecord.key)
                this.selectedKeys = []
              }
            }
          }
        }
      }
    },

    /**
     * Custom css class for row
     */
    rowClassName(record) {
      if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Find record of tree by key
     */
    findRecordByKey(records, key) {
      for (const record of records) {
        if (record.key === key) {
          return record
        } else {
          const foundChild = this.findRecordByKey(record.children, key)
          if (foundChild) {
            return foundChild
          }
        }
      }
      return null
    },

    /**
     * Submit full data
     */
    async updateResponse() {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.apiResponseDatasource.multiUpdate(this.data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveDatasource')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .tree__menu {
    [role="treeitem"] {
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
      span[draggable="true"] {
        line-height: 24px;
      }
      .ant-tree-title {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
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
    background-color: rgb(1,247,1) !important;
  }
  .ant-tree li .ant-tree-node-content-wrapper .changed-row {
    background-color: yellow;
  }
  .no-use {
    text-decoration: line-through;
  }
  .ant-card-head-title {
    display: flex;
    justify-content: space-between;
    max-height: 80px;
  }
  .ant-form-item-control-wrapper {
    width: 150px;
  }
   .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: transparent;
    }
  .ant-table-tbody {
    .selected {
      background-color: rgb(1,247,1) !important;
    }
    > tr {
      cursor: pointer;
      &:hover {
      }
    }
    .selected:hover {
      background-color: #01f701 !important;
    }
  }
}
.form-search {
  min-width: 700px;
}
.search-btn {
  margin-top: 4px;
}
</style>
