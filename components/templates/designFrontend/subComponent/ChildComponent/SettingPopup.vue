<template>
  <a-modal
    v-model="visible"
    :title="
      $t(title)
    "
    :width="700"
    :footer="false"
  >
    <div class="p-4">
      <table class="table table-wrap" style="width: 100%">
        <thead class="thead-dark">
          <tr>
            <th scope="col">
              {{ $t(col1) }}
            </th>
            <th scope="col">
              {{ $t(col2) }}
            </th>
          </tr>
        </thead>
        <tr v-for="(item, index) in data" :key="index" class="tbody">
          <td>
            {{ item.name }}
          </td>
          <td>
            <a-input v-model="item.mapping" />
          </td>
        </tr>
      </table>

      <div class="text-center p-4">
        <a-button
          html-type="button"
          type="default"
          title="Cancel"
          class="min-w-100"
          @click="$emit('close')"
        >
          {{ $t('common.cancel') }}
        </a-button>
        <a-button
          html-type="submit"
          type="primary"
          title="Tìm kiếm"
          class="min-w-100"
          @click="$emit('save')"
        >
          {{ $t('common.ok') }}
        </a-button>
      </div>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: [Boolean],
      default: () => false
    },
    title: {
      type: [String],
      default: () => ''
    },
    data: {
      type: [Array],
      default: () => []
    },
    col1: {
      type: [String],
      default: () => ''
    },
    col2: {
      type: [String],
      default: () => ''
    }
  }
}
</script>
<style scoped lang="scss">
:deep() {
  .ant-form-item label {
    float: left !important;
  }
}
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
