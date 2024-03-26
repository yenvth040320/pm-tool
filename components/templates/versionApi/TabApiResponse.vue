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
      </template>
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          title="Thêm mới"
          class="min-w-100"
          :disabled="version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="createAndUpdateApiResponse()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ listApiResponse.length > 0 ? $t('common.update') : $t('common.create') }}
        </a-button>
        <a-button
          type="primary"
          class="min-w-100"
          :disabled="version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="openUpdateDbMode"
        >
          <a-icon type="diff" />
          {{ $t('module.apiResponseDatasource.add_button') }}
        </a-button>
      </template>

      <div class="tree__menu">
        <a-spin :spinning="spin">
          <a-tree
            :tree-data="listApiResponse"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            @expand="onExpand"
          >
            <template
              slot="action"
              slot-scope="{ title, key, parent, data_node, datasource }"
            >
              <i
                class="icon"
                :class="{'icon-open': expandedKeys, 'icon-close': !expandedKeys}"
                @click.stop
              />

              <div v-if="version.lock_flg === LOCK_FLG_VALUE.no" class="menu-tree__title" @click="showDrawer(key, parent, data_node)">
                <span v-if="datasource">
                  <span>{{ $t(title) + ': ' }} </span>
                  <span :class="{'no-use': hasItemWithZeroUseFlag(data_node.apiResponseDatasources)}">{{ $t(datasource) }}</span>
                </span>
                <span v-else>
                  {{ $t(title) }}
                </span>
              </div>
              <div v-else class="menu-tree__title">
                <span v-if="datasource">
                  <span>{{ $t(title) + ': ' }} </span>
                  <span :class="{'no-use': hasItemWithZeroUseFlag(data_node.apiResponseDatasources)}">{{ $t(datasource) }}</span>
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
    <UpdateApiResponseDatasource
      v-if="updateMode"
      ref="updateApiResponseDatasource"
      :version="version"
      :model="model"
      @saveDatasource="saveDatasource"
      @closeUpdateDb="updateMode = false"
    />
    <tab-response-add-modal
      ref="addResponseModal"
      :version="version"
      :is-json="isJson"
      @saveNewParent="saveNewParent"
    />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { LOCK_FLG_VALUE, DATA_TYPE_VALUE, SORT, USE_FLG_VALUE } from '~/constants'
import TabResponseAddModal from '~/components/templates/versionApi/TabResponseAddModal'
import UpdateApiResponseDatasource from '~/components/templates/apiResponseDatasource/UpdateApiResponseDatasource'

export default {
  /**
   * Declare components.
   */
  components: {
    TabResponseAddModal,
    UpdateApiResponseDatasource
  },
  /**
   * Fetch event.
   */
  async fetch() {
    this.spin = true
    try {
      const params = {
        project_id: this.$store.state.project.id,
        api_id: this.version.api_id,
        version_code: this.version.version_code,
        not_limit: true,
        order_type: SORT.asc,
        use_flg: USE_FLG_VALUE.yes
      }
      const { data: { result: { data } } } = await this.$api.apiResponse.list({ params })
      this.model = data
      // build tree

      const recursive = (parentPK = null) => {
        const list = cloneDeep(data.filter(item => item.parent_api_response_pk === parentPK))

        return list.map(item => {
          const children = recursive(item.api_response_pk)
          let title = ''
          let datasource = ''
          const dataType = Object.keys(DATA_TYPE_VALUE).find(key => DATA_TYPE_VALUE[key] === item.data_type)
          if (item.apiResponseDatasources.length > 0) {
            datasource = item.apiResponseDatasources.map(item => `[${item.db_schema.name}].[${item.db_table.name}]${item.db_column ? `.[${item.db_column.name}]` : ''}.[Version: ${item.db_table_version_code}]`).join(', ')
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
      this.listApiResponse = recursive()
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.spin = false
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
      visible: false,
      defaultParams: {
        project_id: this.$store.state.project.id,
        api_id: this.version.api_id,
        version_code: this.version.version_code
      },
      id: +this.$route.params.id || 0,
      version_code: +this.$route.params.version_code || 0,
      LOCK_FLG_VALUE,
      DATA_TYPE_VALUE,
      SORT,
      USE_FLG_VALUE,
      listApiResponse: [],
      expandedKeys: [],
      autoExpandParent: true,
      spin: false,
      model: [],
      isJson: false,
      updateMode: false,
      dataModeUpdate: []
    }
  },
  watch: {
    data(newVal) {
      this.data = newVal
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  methods: {
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
      if (this.expandedKeys.length === this.getAllNodeKeys(this.listApiResponse).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.listApiResponse)
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
     * Add new response
     */
    addNewResponse() {
      this.$refs.addResponseModal.open(null)
    },

    createAndUpdateApiResponse() {
      if (Object.keys(this.model).length > 0) {
        this.model.is_update = true
        this.$refs.addResponseModal.showDrawer(this.model)
      } else {
        this.$refs.addResponseModal.showDrawer(null)
      }
      this.isJson = true
    },

    showDrawer(key, parent, data) {
      this.$refs.addResponseModal.open(parent, data)
      this.isJson = false
    },

    saveNewParent() {
      this.model = {}
      this.$refs.addResponseModal.onClose()
      this.$fetch()
    },

    /**
     * On save datasource from mode update db
     */
    saveDatasource() {
      this.updateMode = false
      this.$fetch()
    },

    /**
     * Open Update Db Mode
     */
    openUpdateDbMode() {
      this.updateMode = true
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
