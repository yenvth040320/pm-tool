<template>
  <div>
    <table class="table table-wrap" style="width: 100%">
      <thead class="thead-dark">
        <tr>
          <th scope="col">
            {{ $t('module.design_frontend.component.functions.name') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.functions.params') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.functions.return') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.functions.des') }}
          </th>
        </tr>
      </thead>
      <tr v-for="(item, index) in model.functions" :key="index" class="tbody">
        <td>
          <a-form-model-item
            :prop="'functions.' + index + '.function_name'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.design_frontend.component.functions.name')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-input v-model="item.function_name" />
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item
            :prop="'functions.' + index + '.params'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.design_frontend.component.functions.params')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-input v-model="item.params" />
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item :prop="'functions.' + index + '.return'">
            <a-input v-model="item.return" />
          </a-form-model-item>
        </td>
        <td>
          <a-form-model-item :prop="'functions.' + index + '.description'">
            <a-input v-model="item.description" />
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
import { TYPE_MODEL } from '~/constants'
export default {
  props: {
    items: {
      type: [Array],
      default: () => []
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
      TYPE_MODEL
    }
  },
  computed: {},
  methods: {
    addRow() {
      this.$emit('addRow', 'functions')
    },
    removeRow(index) {
      this.$emit('removeRow', 'functions', index)
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
