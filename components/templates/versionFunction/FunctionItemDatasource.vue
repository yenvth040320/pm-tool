<template>
  <div>
    <div v-if="!addReadOrWrite">
      <a-card class="mb-4 no-border">
        <template slot="extra">
          <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
          <a-button
            html-type="submit"
            type="primary"
            class="min-w-100"
            :disabled="version.code_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="addReadDatasource()"
          >
            <font-awesome-icon icon="plus-circle" class="mr-1" />
            {{ $t('common.create') }}
            {{ $t('module.functionItemReadDatasource') }}
          </a-button>
          <a-button
            html-type="submit"
            type="primary"
            class="min-w-100"
            :disabled="version.code_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="addWriteDatasource()"
          >
            <font-awesome-icon icon="plus-circle" class="mr-1" />
            {{ $t('common.create') }}
            {{ $t('module.functionItemWriteDatasource') }}
          </a-button>

          <a-button
            html-type="submit"
            type="primary"
            class="min-w-100"
            :disabled="version.code_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="addReadOrWriteDatasource()"
          >
            <font-awesome-icon icon="plus-circle" class="mr-1" />
            {{ $t('common.update') }}/
            {{ $t('common.create') }}
          </a-button>
        </template>
        <a-table
          ref="dataSourceTable"
          bordered
          :data-source="hasData ? functionItems : []"
          :row-key="record => record.id"
          :pagination="false"
          :row-class-name="rowClassName"
          :columns="columns"
          :loadinging="loadinging"
          class="main-table"
        >
          <template
            slot="item_num"
            slot-scope="text, record"
          >
            <a-icon type="link" @click="copyItem(record.id)" />
            {{ record.item_num }}
          </template>
          <template slot="name" slot-scope="text, record">
            <span :class="record.use_flg === USE_FLG_VALUE.no ? 'no-use' : ''">
              {{ record.name }}
            </span>
          </template>
          <template slot="read_datasource" slot-scope="text, record">
            <div
              v-if="record.functionItemReadDatasources.length > 0 &&
                record.use_flg === USE_FLG_VALUE.yes &&
                version.code_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
              class="detail-datasource"
              @click="showDrawerReadDatasource(record.id)"
            >
              <span
                v-for="(item, index) in record.functionItemReadDatasources"
                :key="index"
              >

                <div :class="getRowClass(item?.api_response, item?.api_response_datasource)">
                  {{ '['+ item?.api?.name + ']' + '/' + (item?.api_response?.path ? item?.api_response?.path : item?.api_response?.name) }}({{ 'Version: ' + item?.api_version_code }})

                  <span v-if="item.api_response_datasource">
                    {{ 'DB:/[' + item?.api_response_datasource?.db_schema.name +'].' +'[' + item?.api_response_datasource?.db_table.name +'].' + '[' + item?.api_response_datasource?.db_column.name +']' + '.[Version: ' + item?.api_response_datasource.db_table_version_code + ']' }}
                  </span>
                </div>
              </span>
            </div>
            <div v-else>
              <span
                v-for="(item, index) in record.functionItemReadDatasources"
                :key="index"
              >
                <div :class="getRowClass(item?.api_response, item?.api_response_datasource)">
                  {{ '['+ item?.api?.name + ']' + '/' + (item?.api_response?.path ? item?.api_response?.path : item?.api_response?.name) }}({{ 'Version: ' + item?.api_version_code }})

                  <span v-if="item.api_response_datasource">
                    {{ 'DB:/[' + item?.api_response_datasource?.db_schema.name + '].' + '[' + item?.api_response_datasource?.db_table.name + '].' + '[' + item?.api_response_datasource?.db_column.name + ']' + '.[Version: ' + item?.api_response_datasource.db_table_version_code + ']' }}
                  </span>
                </div>
              </span>
            </div>
          </template>
          <template slot="write_datasource" slot-scope="text, record">
            <div
              v-if="record.functionItemWriteDatasources.length > 0 &&
                record.use_flg === USE_FLG_VALUE.yes &&
                version.code_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
              class="detail-datasource"
              @click="showDrawerWriteDatasource(record.id)"
            >
              <span
                v-for="(item, index) in record.functionItemWriteDatasources"
                :key="index"
              >
                <div :class="getRowClass(item?.api_parameter, item?.api_parameter_datasource)">
                  {{ '['+ item?.api?.name + ']' + '/' + (item?.api_parameter?.path ? item?.api_parameter?.path : item?.api_parameter?.name) }}({{ 'Version: ' + item?.api_version_code }})

                  <span v-if="item.api_parameter_datasource">
                    {{ 'DB' + ' (' +
                      (TYPE_ACTION.find(action => action.value === item?.api_parameter_datasource?.type_action)?.label || '') +
                      ')' + ':/[' + item?.api_parameter_datasource?.db_schema.name +'].' + '[' + item?.api_parameter_datasource?.db_table.name +'].' + '[' + item?.api_parameter_datasource?.db_column.name +']' + '.[Version: ' + item?.api_parameter_datasource.db_table_version_code + ']' }}
                  </span>
                </div>
              </span>
            </div>
            <div v-else>
              <span
                v-for="(item, index) in record.functionItemWriteDatasources"
                :key="index"
              >
                <div :class="getRowClass(item?.api_parameter, item?.api_parameter_datasource)">
                  {{ '['+ item?.api?.name + ']' + '/' + (item?.api_parameter?.path ? item?.api_parameter?.path : item?.api_parameter?.name) }}({{ 'Version: ' + item?.api_version_code }})
                  <span v-if="item.api_parameter_datasource">
                    {{ 'DB' + ' (' +
                      (TYPE_ACTION.find(action => action.value === item?.api_parameter_datasource?.type_action)?.label || '') +
                      ')' + ':/[' + item?.api_parameter_datasource?.db_schema.name + '].' + '[' + item?.api_parameter_datasource?.db_table.name + '].' + '[' + item?.api_parameter_datasource?.db_column.name + ']' + '.[Version: ' + item?.api_parameter_datasource.db_table_version_code + ']' }}
                  </span>
                </div>
              </span>
            </div>
          </template>
        </a-table>
      </a-card>
      <DrawReadDatasource
        v-if="version.id"
        ref="drawerReadDatasource"
        :version="version"
        :function-items="functionItems"
        :apis="apis"
        @success="success"
        @save="save"
      />
      <DrawWriteDatasource
        v-if="version.id"
        ref="drawerWriteDatasource"
        :version="version"
        :function-items="functionItems"
        :apis="apis"
        @success="success"
        @save="save"
      />
    </div>
    <div v-else>
      <AddReadOrWriteDatasource
        :version="version"
        :function-items="functionItems"
        :apis="apis"
        @saveDatasource="saveDatasource"
        @closeUpdateDatasource="addReadOrWrite = false"
        @save="save"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DrawReadDatasource from './DrawReadDatasource.vue'
import DrawWriteDatasource from './DrawWriteDatasource.vue'
import AddReadOrWriteDatasource from './AddReadOrWriteDatasource.vue'
import DataTable from '~/mixins/data-table'
import {
  DATA_TYPE,
  DATA_TYPE_VALUE,
  LOCK_FLG_VALUE,
  USE_FLG_VALUE,
  TYPE_ACTION
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    DrawReadDatasource,
    DrawWriteDatasource,
    AddReadOrWriteDatasource
  },
  mixins: [DataTable],

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
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
      DATA_TYPE,
      DATA_TYPE_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      hasData: false,
      checkSwitch: true,
      showDisabledRows: true,
      TYPE_ACTION,
      addReadOrWrite: false,
      apis: []
    }
  },
  computed: {
    ...mapState({
      loadinging: 'loadinging'
    }),

    header() {
      return [
        {
          title: this.$t('module.functionItem.item_num'),
          dataIndex: 'item_num',
          scopedSlots: { customRender: 'item_num' },
          width: '5%'
        },
        {
          title: this.$t('module.functionItemReadDatasource.item_pk'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '20%'
        },
        {
          title: this.$t('module.tab_datasource.api_parameter'),
          width: '35%',
          scopedSlots: { customRender: 'write_datasource' }
        },
        {
          title: this.$t('module.tab_datasource.api_response'),
          width: '35%',
          scopedSlots: { customRender: 'read_datasource' }
        }
      ]
    }
  },
  watch: {
    functionItems(newValue) {
      this.checkReadAndWriteDataSource()
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getApi()
    this.checkReadAndWriteDataSource()
  },

  updated() {
    if (this.$refs.dataSourceTable) {
      const table = this.$refs.dataSourceTable.$el
      const tbody = table.querySelector('.ant-table-tbody')
      const item = tbody.querySelector(`[data-row-key="${this.$route.query.function_item_id}"]`)
      if (item) {
        item.scrollIntoView()
      }
    }
  },

  methods: {
    /**
     * Get full data api
     */
    async getApi() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.use_flg = USE_FLG_VALUE.yes
        params.isDatasource = true
        params.not_limit = true
        const {
          data: {
            result: { data }
          }
        } = await this.$api.api.list({ params })
        this.apis = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    addReadOrWriteDatasource() {
      this.addReadOrWrite = true
    },
    checkReadAndWriteDataSource() {
      const data = this.functionItems.some(
        item =>
          item.functionItemReadDatasources.length > 0 ||
          item.functionItemWriteDatasources.length > 0
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
      const readDisabled = record.functionItemReadDatasources.every(
        item => item?.api_response?.use_flg === USE_FLG_VALUE.no ||
            item?.api_response_datasource?.use_flg === USE_FLG_VALUE.no
      )
      const writeDisabled = record.functionItemWriteDatasources.every(
        item => item?.api_parameter?.use_flg === USE_FLG_VALUE.no ||
            item?.api_parameter_datasource?.use_flg === USE_FLG_VALUE.no
      )

      const isDisabled = record.use_flg === USE_FLG_VALUE.no || (readDisabled && writeDisabled)

      const isHideRow = record.functionItemReadDatasources.length === 0 && record.functionItemWriteDatasources.length === 0

      return this.showDisabledRows ? (isHideRow || isDisabled ? 'hide-row' : null) : (isHideRow ? 'hide-row' : isDisabled ? 'disabled-row' : null)
    },

    getRowClass(item, datasource) {
      let isApiDisabled = false
      let isDatasourceDisabled = false
      if (item) {
        isApiDisabled = item.use_flg === USE_FLG_VALUE.no
      }
      if (datasource) {
        isDatasourceDisabled = datasource.use_flg === USE_FLG_VALUE.no
      }

      if (this.showDisabledRows) {
        return isApiDisabled || isDatasourceDisabled ? 'disable-item' : ''
      }
      return isApiDisabled || isDatasourceDisabled ? 'no-use' : ''
    },

    addReadDatasource() {
      this.$refs.drawerReadDatasource.showDrawer()
    },

    addWriteDatasource() {
      this.$refs.drawerWriteDatasource.showDrawer()
    },

    /**
     * Show drawer and api parameter
     */
    showDrawerReadDatasource(id) {
      this.$refs.drawerReadDatasource.showDrawer(id)
    },

    showDrawerWriteDatasource(id) {
      this.$refs.drawerWriteDatasource.showDrawer(id)
    },
    success() {
      this.$emit('success')
    },
    onChangeSwitch() {
      this.$emit('save', this.checkSwitch)
      this.showDisabledRows = this.checkSwitch
    },
    save() {
      this.$emit('save', this.checkSwitch)
    },

    /**
     * Copy Url
     */
    copyItem(itemId) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_item_id', itemId)
      url.hash = 'tab_datasources'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },
    saveDatasource() {
      this.addReadOrWrite = false
      this.$emit('success')
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
