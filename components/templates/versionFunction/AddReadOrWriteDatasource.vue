<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-form-model
          ref="form"
          :model="filters"
          :label-col="{ sm: 8 }"
          :wrapper-col="{ sm: 16 }"
          layout="inline"
          class="mb-4 form-search"
          @submit.prevent="search"
        >
          <a-form-model-item
            :label="$t('module.functionItemReadDatasource.api_id')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.functionItemReadDatasource.api_id')
              }),
              trigger: ['change', 'blur']
            }"
            prop="api_id"
            class="api"
          >
            <a-select
              v-model="filters.api_id"
              :placeholder="$t('module.functionItemReadDatasource.api_id')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeApi"
            >
              <a-select-option
                v-for="(item, i) in apis"
                :key="i"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('module.functionItemReadDatasource.api_version_code')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.functionItemReadDatasource.api_version_code')
              }),
              trigger: ['change', 'blur']
            }"
            prop="api_version_code"
            class="api-version-code"
          >
            <a-select
              v-model="filters.api_version_code"
              :placeholder="
                $t('module.functionItemReadDatasource.api_version_code')
              "
              allow-clear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, i) in apiVersions"
                :key="i"
                :value="item.version_code"
              >
                {{ item.version_code }} : {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
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
        </a-form-model>
      </template>
      <a-row
        type="flex"
        :gutter="30"
      >
        <a-col
          :span="15"
          style="max-height: 500px; overflow-y: auto"
        >
          <a-table
            ref="dataSource"
            bordered
            :data-source="functionItemData"
            :row-key="record => record.id"
            :pagination="false"
            :columns="columns"
            :loadinging="loadinging"
            :custom-row="customRow"
            :row-class-name="rowClassName"
            class="main-table"
          >
            <template slot="name" slot-scope="text, record">
              <span>
                {{ record.name }}
              </span>
            </template>
            <template slot="read_datasource" slot-scope="text, record">
              <div>
                <span
                  v-for="(item, index) in record.functionItemReadDatasources"
                  :key="index"
                >
                  <div :class="getRowClass(item?.api_response, item?.api_response_datasource)" @dblclick="removeReadDatasource(record, item)">
                    {{ '['+ item?.api?.name + ']' + '/' + (item?.api_response?.path ? item?.api_response?.path : item?.api_response?.name) }}({{ 'Version: ' + item?.api_version_code }})

                    <span v-if="item.api_response_datasource && Object.keys(item.api_response_datasource).length > 0">
                      {{ 'DB:/[' + item.api_response_datasource.db_schema?.name + '].' + '[' + item?.api_response_datasource?.db_table?.name + '].' + '[' + item?.api_response_datasource?.db_column?.name + ']' + '.[Version: ' + item?.api_response_datasource.db_table_version_code + ']' }}
                    </span>
                  </div>
                </span>
              </div>
            </template>
            <template slot="write_datasource" slot-scope="text, record">
              <div>
                <span
                  v-for="(item, index) in record.functionItemWriteDatasources"
                  :key="index"
                >
                  <div :class="getRowClass(item?.api_parameter, item?.api_parameter_datasource)" @dblclick="removeWriteDatasource(record, item)">
                    {{ '['+ item?.api?.name + ']' + '/' + (item?.api_parameter?.path ? item?.api_parameter?.path : item?.api_parameter?.name) }}({{ 'Version: ' + item?.api_version_code }})
                    <span v-if="item.api_parameter_datasource && Object.keys(item.api_parameter_datasource).length > 0">
                      {{ 'DB' + ' (' +
                        (TYPE_ACTION.find(action => action.value === item?.api_parameter_datasource?.type_action)?.label || '') +
                        ')' + ':/[' + item?.api_parameter_datasource?.db_schema?.name + '].' + '[' + item?.api_parameter_datasource?.db_table?.name + '].' + '[' + item?.api_parameter_datasource?.db_column?.name + ']' + '.[Version: ' + item?.api_parameter_datasource.db_table_version_code + ']' }}
                    </span>
                  </div>
                </span>
              </div>
            </template>
          </a-table>
        </a-col>
        <a-col
          :span="9"
          style="max-height: 500px; overflow-y: auto"
        >
          <a-table
            ref="dataSource"
            bordered
            :data-source="apiInfo"
            :row-key="record => record.id"
            :pagination="false"
            :columns="columnApi"
            :loadinging="loadinging"
            :row-class-name="rowClassName"
            class="main-table"
          >
            <template slot="api_parameter" slot-scope="text, record">
              <div v-if="Object.keys(record.apiParameter).length > 0" :class="record.apiParameter.isSelected === true ? 'selected' : ''" @click="selectParameter(record.apiParameter)" @dblclick="insertParameter(record.apiParameter)">
                <span>
                  {{ '['+ record.apiParameter?.api?.name + ']' + '/' + (record.apiParameter?.path ? record.apiParameter?.path : record.apiParameter.name) }}({{ 'Version: ' + record.apiParameter?.version_code }})
                </span>
                <span v-if="record.apiParameter.apiParameterDatasources && record.apiParameter.apiParameterDatasources.length > 0">
                  <span v-if="record.apiParameter?.apiParameterDatasources[0].dbSchema.use_flg === USE_FLG_VALUE.yes && record.apiParameter?.apiParameterDatasources[0].dbColumn.use_flg === USE_FLG_VALUE.yes">
                    {{ 'DB' + ' (' +
                      (TYPE_ACTION.find(action => action.value === record.apiParameter?.apiParameterDatasources[0]?.type_action)?.label || '') +
                      ')' + ':/[' + record.apiParameter?.apiParameterDatasources[0].dbSchema?.name +'].' + '[' + record.apiParameter?.apiParameterDatasources[0].dbTable?.name +'].' + '[' + record.apiParameter?.apiParameterDatasources[0].dbColumn?.name +']' + '.[Version: ' + record.apiParameter?.apiParameterDatasources[0].db_table_version_code + ']' }}
                  </span>
                </span>
              </div>
            </template>

            <template slot="api_response" slot-scope="text, record">
              <div v-if="Object.keys(record.apiResponse).length > 0" :class="record.apiResponse.isSelected === true ? 'selected' : ''" @click="selectResponse(record.apiResponse)" @dblclick="insertResponse(record.apiResponse)">
                <span>
                  {{ '['+ record.apiResponse?.api?.name + ']' + '/' + (record.apiResponse?.path ? record.apiResponse?.path : record.apiResponse?.name) }}({{ 'Version: ' + record.apiResponse?.version_code }})
                </span>

                <span v-if="record.apiResponse.apiResponseDatasources && record.apiResponse.apiResponseDatasources.length > 0">
                  <span v-if="record.apiResponse?.apiResponseDatasources[0].dbSchema.use_flg === USE_FLG_VALUE.yes && record.apiResponse?.apiResponseDatasources[0].dbColumn.use_flg === USE_FLG_VALUE.yes">
                    {{ 'DB:/[' + record.apiResponse?.apiResponseDatasources[0].dbSchema?.name +'].' +'[' + record.apiResponse?.apiResponseDatasources[0].dbTable?.name +'].' + '[' + record.apiResponse?.apiResponseDatasources[0].dbColumn?.name +']' + '.[Version: ' + record.apiResponse?.apiResponseDatasources[0].dbTable_version_code + ']' }}
                  </span>
                </span>
              </div>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <div class="mt-4 text-center">
        <a-button type="primary" title="Cập nhật" @click="updateDatasource">
          {{ $t('common.update') }}
        </a-button>
        <a-button type="default" title="Hủy" @click="$emit('closeUpdateDatasource')">
          {{ $t('common.cancel') }}
        </a-button>
      </div>
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
  USE_FLG_VALUE,
  TYPE_ACTION
} from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
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
    },
    apis: {
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
      filters: {
        api_id: undefined,
        api_version_code: undefined
      },
      apiVersions: [],
      apiParameters: [],
      apiResponses: [],
      apiInfo: [],
      functionItemData: this.functionItems,
      selectedParameter: 0,
      selectedResponse: 0,
      selectedRow: 0,
      dataChange: {
        dataInsertWriteDatasource: [],
        dataDeleteWriteDatasource: [],
        dataInsertReadDatasource: [],
        dataDeleteReadDatasource: []
      },
      changedData: []
    }
  },
  computed: {
    ...mapState({
      loadinging: 'loadinging'
    }),

    columnApi() {
      return this.headerApi.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    header() {
      return [
        {
          title: this.$t('module.functionItem.item_num'),
          dataIndex: 'item_num',
          scopedSlots: { customRender: 'item_num' },
          width: '10%'
        },
        {
          title: this.$t('module.functionItemReadDatasource.item_pk'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '15%'
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
    },
    headerApi() {
      return [
        {
          title: this.$t('module.tab_datasource.api_parameter'),
          width: '50%',
          scopedSlots: { customRender: 'api_parameter' }
        },
        {
          title: this.$t('module.tab_datasource.api_response'),
          width: '50%',
          scopedSlots: { customRender: 'api_response' }
        }
      ]
    }
  },
  watch: {
    functionItems: {
      immediate: true,
      handler(newVal) {
        this.updateFunctionItemData(newVal)
      }
    }
  },

  /**
     * Mounted event.
     */
  mounted() {
  },

  methods: {
    /**
     * Get list test case validation
     */
    updateFunctionItemData(newVal) {
      this.functionItemData = newVal.filter(record =>
        record.use_flg === USE_FLG_VALUE.yes).map(item => {
        return { ...item, isSelected: false }
      })
    },
    changeApi() {
      const api = this.apis.find(item => item.id === this.filters.api_id)
      if (api) {
        this.apiVersions = api.version
        if (this.apiVersions.length > 0) {
          this.filters.api_version_code = this.apiVersions[0].version_code
        }
      } else {
        this.apiVersions = []
        this.filters.api_version_code = undefined
      }
    },
    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
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

      return isApiDisabled || isDatasourceDisabled ? 'no-use' : ''
    },

    /**
     * Search data.
     */
    async search() {
      this.apiInfo = []
      const selectedApiId = this.filters.api_id
      const selectedApiVersionCode = this.filters.api_version_code
      const filteredApi = this.apis.find(api => api.id === selectedApiId)

      if (filteredApi) {
        try {
          const params = {
            not_limit: true,
            project_id: this.$store.state.project.id,
            api_id: selectedApiId,
            version_code: selectedApiVersionCode,
            isDatasource: true,
            use_flg: USE_FLG_VALUE.yes
          }
          const { data: { result: { data } } } = await this.$api.apiParameter.list({ params })
          this.apiParameters = data
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }

        try {
          const params = {
            not_limit: true,
            project_id: this.$store.state.project.id,
            api_id: selectedApiId,
            version_code: selectedApiVersionCode,
            isDatasource: true,
            use_flg: USE_FLG_VALUE.yes
          }
          const { data: { result: { data } } } = await this.$api.apiResponse.list({ params })
          this.apiResponses = data
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }

        const newDataParameter = []
        const newDataResponse = []
        if (this.apiParameters.length > 0) {
          const newItems = this.apiParameters.flatMap(param =>
            param.apiParameterDatasources && param.apiParameterDatasources.length > 0
              ? param.apiParameterDatasources.map(datasource => ({ ...param, apiParameterDatasources: [datasource] }))
              : param
          )
          newDataParameter.push(...newItems)
        }

        if (this.apiResponses.length > 0) {
          const newResponses = this.apiResponses.flatMap(response =>
            response.apiResponseDatasources && response.apiResponseDatasources.length > 0
              ? response.apiResponseDatasources.map(datasource => ({ ...response, apiResponseDatasources: [datasource] }))
              : response
          )
          newDataResponse.push(...newResponses)
        }

        const maxLength = Math.max(newDataParameter.length, newDataResponse.length)
        while (newDataParameter.length < maxLength) {
          newDataParameter.push({})
        }
        while (newDataResponse.length < maxLength) {
          newDataResponse.push({})
        }

        for (let i = 0; i < newDataParameter.length; i++) {
          const apiParameter = newDataParameter[i]
          const apiResponse = newDataResponse[i]
          if (Object.keys(apiParameter).length > 0) {
            apiParameter.isSelected = false
          }
          if (Object.keys(apiResponse).length > 0) {
            apiResponse.isSelected = false
          }

          this.apiInfo.push({ apiParameter, apiResponse })
        }
      }
    },
    selectParameter(record) {
      const previousSelectedParameter = this.apiInfo.find(item => item.apiParameter.isSelected === true)

      if (previousSelectedParameter && (previousSelectedParameter.apiParameter.id !== record.id || (previousSelectedParameter.apiParameter?.apiParameterDatasources[0]?.api_parameter_datasource_pk !== record?.apiParameterDatasources[0]?.apiParameterDatasources))) {
        previousSelectedParameter.apiParameter.isSelected = false
      }

      record.isSelected = true
      this.selectedParameter = record.id
      this.$forceUpdate()
    },

    insertParameter(record) {
      if (this.selectedRow !== 0) {
        const foundRecord = this.functionItemData.find(item => item.id === this.selectedRow)
        let apiParameterDatasourceData = {}
        if (record.apiParameterDatasources && record.apiParameterDatasources.length > 0) {
          apiParameterDatasourceData = record.apiParameterDatasources[0]
        }
        let dataSource = {}
        if (Object.keys(apiParameterDatasourceData).length > 0) {
          dataSource = {
            ...apiParameterDatasourceData,
            db_schema: apiParameterDatasourceData.dbSchema,
            db_table: apiParameterDatasourceData.dbTable,
            db_column: apiParameterDatasourceData.dbColumn
          }
        }
        const dataPush = {
          api: record.api,
          api_parameter: {
            id: record.id,
            api_parameter_pk: record.api_parameter_pk,
            name: record.name,
            name_jp: record.name_jp,
            path: record.path,
            use_flg: record.use_flg
          },
          api_version_code: record.version_code,

          api_parameter_datasource: dataSource
        }
        if (foundRecord) {
          if (foundRecord.functionItemWriteDatasources && foundRecord.functionItemWriteDatasources.length > 0) {
            const isDuplicated = foundRecord.functionItemWriteDatasources.some(item =>
              JSON.stringify(item) === JSON.stringify(dataPush)
            )

            if (!isDuplicated) {
              foundRecord.functionItemWriteDatasources.push(dataPush)
            }
          } else {
            foundRecord.functionItemWriteDatasources = [dataPush]
          }

          const uniqueValues = []
          foundRecord.functionItemWriteDatasources.forEach(item => {
            if (!item.id) {
              if (item.api_parameter_datasource && Object.keys(item.api_parameter_datasource).length > 0) {
                uniqueValues.push({
                  api_id: item.api_parameter_datasource.api_id,
                  api_version_code: item.api_version_code,
                  api_parameter_pk: item.api_parameter_datasource.api_parameter_pk,
                  api_parameter_datasource_pk: item.api_parameter_datasource.api_parameter_datasource_pk
                })
              } else {
                uniqueValues.push({
                  api_id: item.api.id,
                  api_version_code: item.api_version_code,
                  api_parameter_pk: item.api_parameter.api_parameter_pk,
                  api_parameter_datasource_pk: undefined
                })
              }
            }
          })
          const dataSource = [...uniqueValues]

          if (!this.dataChange.dataInsertWriteDatasource) {
            this.dataChange.dataInsertWriteDatasource = []
          }
          const existingRecordIndex = this.dataChange.dataInsertWriteDatasource.findIndex(item =>
            item.project_id === this.$store.state.project.id &&
        item.function_id === this.version.function_id &&
        item.version_code === this.version.version_code &&
        item.item_pk === foundRecord.item_pk
          )
          if (existingRecordIndex === -1) {
            this.dataChange.dataInsertWriteDatasource.push({
              project_id: this.$store.state.project.id,
              function_id: this.version.function_id,
              version_code: this.version.version_code,
              item_pk: foundRecord.item_pk,
              functionItemWriteDatasources: dataSource
            })
          } else {
            this.dataChange.dataInsertWriteDatasource[existingRecordIndex].functionItemWriteDatasources = dataSource
          }
          this.changedData.push(foundRecord)
        }
      }
    },

    /**
     * Clear datasource on double click column
     */
    removeWriteDatasource(record, itemToRemove) {
      this.selectedParameter = 0
      this.selectedResponse = 0
      const index = record.functionItemWriteDatasources.indexOf(itemToRemove)
      if (itemToRemove.id) {
        if (index > -1) {
          // Remove item from record.functionItemWriteDatasources
          record.functionItemWriteDatasources.splice(index, 1)
          this.dataChange.dataDeleteWriteDatasource.push(itemToRemove)
        }
      } else if (index > -1) {
        record.functionItemWriteDatasources.splice(index, 1)
        let filteredRecords = {}
        if (this.dataChange.dataInsertWriteDatasource && this.dataChange.dataInsertWriteDatasource.length > 0) {
          filteredRecords = this.dataChange.dataInsertWriteDatasource.find(item =>
            item.project_id === record.project_id &&
        item.function_id === record.function_id &&
        item.version_code === record.version_code &&
        item.item_pk === record.item_pk
          )
          if (filteredRecords && filteredRecords.functionItemWriteDatasources) {
            const indexInsert = filteredRecords.functionItemWriteDatasources.findIndex(item =>
              item.api_id === itemToRemove?.api.id &&
        item.api_version_code === itemToRemove.api_version_code &&
        item.api_parameter_pk === itemToRemove?.api_parameter.api_parameter_pk &&
        item.api_parameter_datasource_pk === itemToRemove?.api_parameter_datasource.api_parameter_datasource_pk
            )
            if (indexInsert > -1) {
              filteredRecords.functionItemWriteDatasources.splice(indexInsert, 1)
            }
          }
        }
      }
      this.changedData.push(record)
    },

    selectResponse(record) {
      const previousSelectedResponse = this.apiInfo.find(item => item.apiResponse.isSelected === true)

      if (previousSelectedResponse && (previousSelectedResponse.apiResponse.id !== record.id || previousSelectedResponse.apiResponse?.apiResponseDatasources[0]?.api_response_datasource_pk !== record?.apiResponseDatasources[0]?.api_response_datasource_pk)) {
        previousSelectedResponse.apiResponse.isSelected = false
      }

      record.isSelected = true
      this.selectedResponse = record.id
      this.$forceUpdate()
    },

    insertResponse(record) {
      if (this.selectedRow !== 0) {
        const foundRecord = this.functionItemData.find(item => item.id === this.selectedRow)
        let apiResponseDatasourceData = {}
        if (record.apiResponseDatasources && record.apiResponseDatasources.length > 0) {
          apiResponseDatasourceData = record.apiResponseDatasources[0]
        }
        let dataSource = {}
        if (Object.keys(apiResponseDatasourceData).length > 0) {
          dataSource = {
            ...apiResponseDatasourceData,
            db_schema: apiResponseDatasourceData.dbSchema,
            db_table: apiResponseDatasourceData.dbTable,
            db_column: apiResponseDatasourceData.dbColumn
          }
        }
        const dataPush = {
          api: record.api,
          api_response: {
            id: record.id,
            api_response_pk: record.api_response_pk,
            name: record.name,
            name_jp: record.name_jp,
            path: record.path,
            use_flg: record.use_flg
          },
          api_version_code: record.version_code,
          api_response_datasource: dataSource
        }

        if (foundRecord) {
          if (foundRecord.functionItemReadDatasources && foundRecord.functionItemReadDatasources.length > 0) {
            const isDuplicated = foundRecord.functionItemReadDatasources.some(item =>
              JSON.stringify(item) === JSON.stringify(dataPush)
            )

            if (!isDuplicated) {
              foundRecord.functionItemReadDatasources.push(dataPush)
            }
          } else {
            foundRecord.functionItemReadDatasources = [dataPush]
          }

          const uniqueValues = []
          foundRecord.functionItemReadDatasources.forEach(item => {
            if (!item.id) {
              if (item.api_response_datasource && Object.keys(item.api_response_datasource).length > 0) {
                uniqueValues.push({
                  api_id: item.api.id,
                  api_version_code: item.api_version_code,
                  api_response_pk: item.api_response.api_response_pk,
                  api_response_datasource_pk: item.api_response_datasource.api_response_datasource_pk
                })
              } else {
                uniqueValues.push({
                  api_id: item.api.id,
                  api_version_code: item.api_version_code,
                  api_response_pk: item.api_response.api_response_pk,
                  api_response_datasource_pk: undefined
                })
              }
            }
          })
          const dataSource = [...uniqueValues]

          if (!this.dataChange.dataInsertReadDatasource) {
            this.dataChange.dataInsertReadDatasource = []
          }
          const existingRecordIndex = this.dataChange.dataInsertReadDatasource.findIndex(item =>
            item.project_id === this.$store.state.project.id &&
        item.function_id === this.version.function_id &&
        item.version_code === this.version.version_code &&
        item.item_pk === foundRecord.item_pk
          )

          if (existingRecordIndex === -1) {
            this.dataChange.dataInsertReadDatasource.push({
              project_id: this.$store.state.project.id,
              function_id: this.version.function_id,
              version_code: this.version.version_code,
              item_pk: foundRecord.item_pk,
              functionItemReadDatasources: dataSource
            })
          } else {
            this.dataChange.dataInsertReadDatasource[existingRecordIndex].functionItemReadDatasources = dataSource
          }
          this.changedData.push(foundRecord)
        }
      }
    },

    /**
     * Clear datasource on double click column
     */
    removeReadDatasource(record, itemToRemove) {
      this.selectedParameter = 0
      this.selectedResponse = 0
      const index = record.functionItemReadDatasources.indexOf(itemToRemove)
      if (itemToRemove.id) {
        if (index > -1) {
          record.functionItemReadDatasources.splice(index, 1)
          this.dataChange.dataDeleteReadDatasource.push(itemToRemove)
        }
      } else if (index > -1) {
        record.functionItemReadDatasources.splice(index, 1)
        let filteredRecords = {}
        if (this.dataChange.dataInsertReadDatasource && this.dataChange.dataInsertReadDatasource.length > 0) {
          filteredRecords = this.dataChange.dataInsertReadDatasource.find(item =>
            item.project_id === record.project_id &&
        item.function_id === record.function_id &&
        item.version_code === record.version_code &&
        item.item_pk === record.item_pk
          )
          if (filteredRecords && filteredRecords.functionItemReadDatasources) {
            const indexInsert = filteredRecords.functionItemReadDatasources.findIndex(item =>
              item.api_id === itemToRemove?.api.id &&
          item.api_version_code === itemToRemove.api_version_code &&
          item.api_response_pk === itemToRemove?.api_response.api_response_pk &&
          item.api_response_datasource_pk === itemToRemove?.api_response_datasource.api_response_datasource_pk
            )
            if (indexInsert > -1) {
              filteredRecords.functionItemReadDatasources.splice(indexInsert, 1)
            }
          }
        }
      }
      this.changedData.push(record)
    },

    /**
     * Custom css class for row
     */
    rowClassName(record) {
      if (this.changedData.some(item => item.id === record.id) && record.id !== this.selectedRow) {
        return 'changed-row'
      } else if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Custom row event of table column left
     */
    customRow(record) {
      return {
        on: {
          click: () => {
            if (this.selectedRow !== 0 && this.functionItemData.some(item => item.isSelected === true)) {
              this.functionItemData.find(item => item.id === this.selectedRow).isSelected = false
            }
            this.selectedRow = record.id
            record.isSelected = true
          }
        }
      }
    },

    /**
     * Submit full data
     */
    async updateDatasource() {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.function.multiUpdate(this.dataChange)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save')
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
    .api {
        width: 360px;
    }
    .api-version-code {
        width: 360px;
    }
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: transparent;
    }
     .ant-table-tbody {
      .selected {
        background-color: rgb(1,247,1) !important;
      }
      .changed-row {
        background-color: yellow;
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
    .selected {
      background-color: rgb(1,247,1) !important;
    }
  }
  </style>
