<template>
  <div>
    <table class="table table-wrap" style="width: 100%">
      <thead class="thead-dark">
        <tr>
          <th scope="col" style="width: 20%">
            {{ $t('module.design_frontend.component.event.category') }}
          </th>
          <th scope="col" style="width: 20%">
            {{ $t('module.design_frontend.component.event.list_event') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.functions') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.data.des') }}
          </th>
        </tr>
      </thead>
      <tr v-for="(data, index) in model.componentEvents" :key="index" class="tbody">
        <td>
          <a-form-model-item
            :prop="'componentEvents.' + index + '.component_item_id'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.design_frontend.component.event.category')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="data.component_item_id"
              mode="single"
              show-search
              :filter-option="filterOption"
              allow-clear
            >
              <a-select-option
                v-for="(item, index) in model.functionItems"
                :key="index"
                :value="item.id ? item.id : item.key"
              >
                {{ item.item_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item :prop="'componentEvents.' + index + '.event'">
            <a-select
              v-model="data.event"
              mode="single"
              show-search
              :filter-option="filterOption"
              allow-clear
            >
              <a-select-option
                v-for="(item, index) in Event"
                :key="index"
                :value="item.label"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item
            :prop="'componentEvents.' + index + '.component_function_id'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.design_frontend.component.functions')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="data.component_function_id"
              mode="single"
              show-search
              :filter-option="filterOption"
              allow-clear
            >
              <a-select-option
                v-for="(item, index) in model.functions"
                :key="index"
                :value="item.id ? item.id : item.key"
              >
                {{ item.function_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item :prop="'componentEvents.' + index + '.description'">
            <a-input v-model="data.description" />
          </a-form-model-item>
        </td>
        <td class="icon-remove">
          <a-icon
            type="minus"
            class="icon icon-minus"
            @click="removeRow(index)"
          />
        </td>
      </tr>
    </table>
    <div>
      <a-icon type="plus" class="icon icon-plus" @click="addRow" />
    </div>
  </div>
</template>
<script>
import { Event } from '~/constants'
export default {
  props: {
    model: {
      type: [Object],
      default: () => []
    }
  },
  data() {
    return {
      Event
    }
  },
  computed: {},
  methods: {
    addRow() {
      this.$emit('addRow', 'componentEvents')
    },

    removeRow(index) {
      this.$emit('removeRow', 'componentEvents', index)
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
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
  </style>
