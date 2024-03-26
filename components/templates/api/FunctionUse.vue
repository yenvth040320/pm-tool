<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
      </template>
      <a-table
        ref="dataSourceTable"
        bordered
        :data-source="functionUse"
        :row-key="record => record.id"
        :pagination="false"
        :row-class-name="rowClassName"
        :columns="columns"
        :loadinging="loadinging"
        class="main-table"
      >
        <template slot="function" slot-scope="text, record">
          {{ record.code }}: {{ record.name }}
        </template>

        <template slot="api_parameter" slot-scope="text, record">
          <div v-if="record.apiParameter.length > 0" class="detail-datasource">
            <span v-for="(item, index) in record.apiParameter" :key="index">

              <NuxtLink :to="`/function/${record.id}/version/${item.version_code}?function_item_id=${item.functionItemId}#tab_datasources`">
                <div
                  :class="
                    getRowClass(item.use_flg_parameter, item.use_flg_item)"
                >

                  {{ '[' + item.functionItem + ']' }}: {{ item.path }}
                </div>
              </NuxtLink>
            </span>
          </div>
        </template>

        <template slot="api_response" slot-scope="text, record">
          <div v-if="record.apiResponse.length > 0" class="detail-datasource">
            <span v-for="(item, index) in record.apiResponse" :key="index">
              <NuxtLink :to="`/function/${record.id}/version/${item.version_code}?function_item_id=${item.functionItemId}#tab_datasources`">
                <div
                  :class="getRowClass(item.use_flg_response, item.use_flg_item)"
                >
                  {{ '[' + item.functionItem + ']' }}: {{ item.path }}
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
  components: {
  },
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
    functionItemReadDatasource: {
      type: [Array],
      default: () => []
    },
    functionItemWriteDatasource: {
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
      functionUse: []
    }
  },
  computed: {
    ...mapState({
      loadinging: 'loadinging'
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
          title: this.$t('module.function'),
          dataIndex: 'function',
          scopedSlots: { customRender: 'function' },
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
  watch: {
    functionItemReadDatasource(newVal) {
      this.handleData()
    },
    functionItemWriteDatasource(newVal) {
      this.handleData()
    }
  },

  /**
     * Mounted event.
     */
  mounted() {
    this.handleData()
  },

  methods: {
    handleData() {
      const mergedFunctions = []
      if (this.functionItemReadDatasource.length > 0) {
        this.functionItemReadDatasource.forEach(record => {
          const functionId = record.function_id
          const existingFunction = mergedFunctions.find(func => func && func.id === functionId)

          if (existingFunction) {
            existingFunction.apiResponse.push({
              functionItem: record?.functionItem?.name,
              functionItemId: record?.functionItem?.id,
              path: record?.apiResponse?.path,
              version_code: record?.functionItem?.version_code,
              use_flg_response: record?.apiResponse?.use_flg,
              use_flg_item: record?.functionItem?.use_flg
            })
          } else {
            mergedFunctions.push({
              id: functionId,
              name: record?.function.name,
              code: record?.function.code,
              apiResponse: [
                {
                  functionItem: record?.functionItem?.name,
                  functionItemId: record?.functionItem?.id,
                  path: record?.apiResponse?.path,
                  version_code: record?.functionItem?.version_code,
                  use_flg_response: record?.apiResponse?.use_flg,
                  use_flg_item: record?.functionItem?.use_flg
                }
              ],
              apiParameter: []
            })
          }
        })
      }

      if (this.functionItemWriteDatasource.length > 0) {
        this.functionItemWriteDatasource.forEach(record => {
          const functionId = record.function_id
          const existingFunction = mergedFunctions.find(func => func && func.id === functionId)

          if (existingFunction) {
            existingFunction.apiParameter.push({
              functionItem: record?.functionItem?.name,
              functionItemId: record?.functionItem?.id,
              path: record?.apiParameter?.path,
              version_code: record?.functionItem?.version_code,
              use_flg_response: record?.apiParameter?.use_flg,
              use_flg_item: record?.functionItem?.use_flg
            })
          } else {
            mergedFunctions.push({
              id: functionId,
              name: record?.function?.name,
              code: record?.function?.code,
              apiResponse: [],
              apiParameter: [
                {
                  functionItem: record?.functionItem?.name,
                  functionItemId: record?.functionItem?.id,
                  path: record?.apiParameter?.path,
                  version_code: record?.functionItem?.version_code,
                  use_flg_parameter: record?.apiParameter?.use_flg,
                  use_flg_item: record?.functionItem?.use_flg
                }
              ]
            })
          }
        })
      }

      this.functionUse = mergedFunctions
      this.functionUse = this.functionUse.map((item, index) => {
        return { ...item, index: index + 1 }
      })
    },
    onChangeSwitch() {
      this.showDisabledRows = this.checkSwitch
    },

    /**
       * Set table class
       *
       * @param {array} record
       */
    rowClassName(record) {
      const parameterDisabled = record.apiParameter.every(
        item => item.use_flg_parameter === USE_FLG_VALUE.no ||
            item.use_flg_item === USE_FLG_VALUE.no
      )

      const responseDisabled = record.apiResponse.every(
        item => item.use_flg_response === USE_FLG_VALUE.no ||
            item.use_flg_item === USE_FLG_VALUE.no
      )

      const isDisabled = parameterDisabled && responseDisabled

      return this.showDisabledRows ? (isDisabled ? 'hide-row' : null) : (isDisabled ? 'disabled-row' : null)
    },

    getRowClass(item, functionItem) {
      const isApiDisabled = item === USE_FLG_VALUE.no
      const isFunctionItemDisabled = functionItem === USE_FLG_VALUE.no

      if (this.showDisabledRows) {
        return isApiDisabled || isFunctionItemDisabled ? 'disable-item' : ''
      }
      return isApiDisabled || isFunctionItemDisabled ? 'no-use' : ''
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
  .disable-item {
    display: none;
  }
  .no-use {
    text-decoration: line-through;
  }
  .hide-row {
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
