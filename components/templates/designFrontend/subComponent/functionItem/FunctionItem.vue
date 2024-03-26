<template>
  <div>
    <table class="table table-wrap" style="width: 100%">
      <thead class="thead-dark">
        <tr>
          <th scope="col">
            No
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.function_item.name') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.function_item.reference') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.action') }}
          </th>
        </tr>
      </thead>
      <tr
        v-for="(functionItem, index) in model.functionItems"
        :key="index"
        class="tbody"
      >
        <td>
          {{ index + 1 }}
        </td>
        <td>
          <a-form-model-item
            ref="itemNameInput"
            :prop="'functionItems.' + index + '.item_name'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.design_frontend.component.function_item.name')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-input v-model="functionItem.item_name" />
          </a-form-model-item>
        </td>
        <td>
          <div v-for="(item, functionItemIndex) in functionItem.component_item_function" :key="functionItemIndex">
            {{ `[${item.function.code}] : ${item.function.name} (${item.name ? item?.name : item.function_item?.name})` }}
            <br />
            <h3 v-if="item.function_item?.function_item_read_datasources.length > 0">
              {{ $t('module.tab_datasource.api_response') }}
            </h3>
            <div
              v-for="(i, ind) in item.function_item?.function_item_read_datasources"
              :key="ind"
            >
              <div
                :class="getRowClass(i?.api_response, i?.api_response_datasource)"
              >
                {{ '['+ i?.api?.name + ']' + '/' + (i?.api_response?.path ? i?.api_response?.path : i?.api_response?.name) }}({{ 'Version: ' + i?.api_version_code }})
                <p v-if="i.api_response_datasource">
                  {{ 'DB:/[' + i?.api_response_datasource?.db_schema.name +'].' +'[' + i?.api_response_datasource?.db_table.name +'].' + '[' + i?.api_response_datasource?.db_column.name +']' + '.[Version: ' + i?.api_response_datasource.db_table_version_code + ']' }}
                </p>
              </div>
            </div>
            <br />
            <h3 v-if="item.function_item?.function_item_write_datasources.length > 0">
              {{ $t('module.tab_datasource.api_parameter') }}
            </h3>
            <div
              v-for="(i, ind) in item.function_item?.function_item_write_datasources"
              :key="ind"
            >
              <div
                :class="getRowClass(i?.api_parameter, i?.api_parameter_datasource)"
              >
                {{ '['+ i?.api?.name + ']' + '/' + (i?.api_parameter?.path ? i?.api_parameter?.path : i?.api_parameter?.name) }}({{ 'Version: ' + i?.api_version_code }})
                <p v-if="i.api_parameter_datasource">
                  {{ 'DB' + ' (' +
                    (TYPE_ACTION.find(action => action.value === i?.api_parameter_datasource?.type_action)?.label || '') +
                    ')' + ':/[' + i?.api_parameter_datasource?.db_schema.name +'].' + '[' + i?.api_parameter_datasource?.db_table.name +'].' + '[' + i?.api_parameter_datasource?.db_column.name +']' + '.[Version: ' + i?.api_parameter_datasource.db_table_version_code + ']' }}
                </p>
              </div>
            </div>
            <a-divider v-if="functionItemIndex !== functionItem.component_item_function.length - 1" />
          </div>
        </td>
        <td>
          <a @click="referenceItem(index + 1)">Tham chiếu</a>
        </td>
        <td class="icon-remove">
          <a-icon type="minus" class="icon icon-minus" @click="removeRow(index)" />
        </td>
      </tr>
    </table>
    <div>
      <a-icon type="plus" class="icon icon-plus alight-item-icon" @click="addRow" />
    </div>

    <!-- Modal reference item -->
    <a-modal
      v-model="referenceVisible"
      title="Popup thiết lập tham chiếu hạng mục"
      :width="700"
      :footer="false"
    >
      <reference-item
        ref="refReferenceItem"
        :function-items="model.functionItems"
        :categories="categories"
        :version="version"
        :index="index"
        @save="save"
        @close="close"
      />
    </a-modal>
  </div>
</template>
<script>
import ReferenceItem from './ReferenceItem.vue'
import { USE_FLG_VALUE, TYPE_ACTION } from '~/constants'
export default {
  components: { ReferenceItem },
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    model: {
      type: [Object],
      default: () => []
    },
    categories: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      USE_FLG_VALUE,
      TYPE_ACTION,
      referenceVisible: false,
      index: 0,
      filters: {
        category_id: this.$route.query.category_id || '',
        function_id: this.$route.query.function_id || '',
        item_name: this.$route.query.item_name || ''
      },
      component_item_function: [],
      showDisabledRows: true
    }
  },
  computed: {},

  methods: {
    referenceItem(index) {
      this.index = index
      this.referenceVisible = true
    },

    save(componentItemFunction, index) {
      this.component_item_function = componentItemFunction
      this.model.functionItems[index - 1].component_item_function = []
      this.model.functionItems[index - 1].component_item_function = this.component_item_function
      // set name item default
      this.setDefaultItemName(index)
      this.close()
    },

    /**
     * Set Default Item Name on saving reference
     *
     * @param index Index of row
     */
    setDefaultItemName(index) {
      if (!this.model.functionItems[index - 1].item_name) {
        this.$set(this.model.functionItems[index - 1], 'item_name', this.component_item_function[this.component_item_function.length - 1].name)
        if (this.$refs.itemNameInput[index - 1]) {
          this.$refs.itemNameInput[index - 1].clearValidate()
        }
      }
    },

    close() {
      this.referenceVisible = false
    },

    addRow() {
      this.$emit('addRow', 'functionItems')
    },

    removeRow(index) {
      this.$emit('removeRow', 'functionItems', index)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 10px 10px;
  word-wrap: break-word;
}
.thead-dark {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
td {
  border: 1px solid #e8e8e8;
  padding: 10px 10px;
  word-wrap: break-word;
  word-break: break-all;
  transition: background 0.3s;
  cursor: pointer;
}
.icon-remove {
  width: 10px !important;
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
  .icon-minus {
    color: red;
    font-size: 20px;
  }
}
.icon-plus {
  color: rgb(34, 182, 227);
  :hover {
    cursor: pointer;
  }
  display: flex;
  justify-content: end;
  margin-right: 35px;
  margin-top: 10px;
  font-size: 20px;
}
/deep/ {
  .disable-item {
    display: none;
  }
  .no-use {
    text-decoration: line-through;
  }
  .ant-divider-horizontal {
    margin: 10px 0;
  }
}
h3, p {
  margin-bottom: 0;
}
</style>
