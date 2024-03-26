<template>
  <div>
    <a-collapse default-active-key="0">
      <template #expandIcon="props">
        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="Những hạng mục và sự kiện bị ảnh hưởng">
        <a-row class="table_event_item">
          <a-col :span="12">
            <table class="table table-wrap" style="width: 100%">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    {{ $t('module.requirement.estimate.item_pk') }}
                  </th>
                </tr>
              </thead>
              <tr v-for="(item, index) in dataFunction.requirement_function_items" :key="index" class="tbody">
                <td scope="col">
                  <a :href="`/function/${item.function_id}/version/${item.version_code}?function_item_num=${item.function_item.item_num}#tab_items`" target="_blank">
                    {{ item.function_item.item_num }}. {{ item.function_item.name +': (' + item.function_item.mst_item_type.name + ')' }}
                  </a>
                </td>
              </tr>
              <template v-if="dataFunction.requirement_function_items?.length < maxCountRecord">
                <tr v-for="i in maxCountRecord - dataFunction.requirement_function_items?.length" :key="`empty-${i}`">
                  <td />
                </tr>
              </template>
            </table>
          </a-col>
          <a-col :span="12">
            <table class="table table-wrap" style="width: 100%">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    {{ $t('module.requirement.estimate.logic') }}
                  </th>
                </tr>
              </thead>
              <tr v-for="(item, index) in dataFunction.requirement_function_events" :key="index" class="tbody">
                <td scope="col">
                  <a :href="`/function/${item.function_id}/version/${item.version_code}?function_event_id=${item.function_event.id}#tab_logics`" target="_blank">
                    {{ item.function_event.function_item.item_num + '. ' + item.function_event.function_item.name + ': (' + item.function_event.function_item.mst_item_type.name + ') On => ' + item.function_event.mst_event.name }}
                  </a>
                </td>
              </tr>
              <template v-if="dataFunction.requirement_function_events?.length < maxCountRecord">
                <tr v-for="i in maxCountRecord - dataFunction.requirement_function_events?.length" :key="`empty-${i}`">
                  <td />
                </tr>
              </template>
            </table>
          </a-col>
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import { APPROVE_STATUS_ANALYTICS } from '~/constants'
export default {
  components: {},
  props: {
    dataFunction: {
      type: [Object],
      default: () => {}
    },
    maxCountRecord: {
      type: [Number, String],
      default: () => 0
    }
  },

  /**
       * Init data for component.
       */
  data: () => ({
    APPROVE_STATUS_ANALYTICS
  }),

  /**
        * List of methods.
        */
  methods: {
  }
}
</script>
<style lang="scss" scoped>
:deep() {
    .ant-form-item-label {
    text-align: left;
    font-weight: 500;
    }
    .ant-collapse {
      margin-bottom: 24px;
    }
}
.table-wrap {
border: 1px solid #4b0303;
max-height: 750px;
overflow-y: auto;
}
.box-content {
    border: 1px solid #4b0303;
}
.title-joint-work {
    margin-top: 50px;
    margin-bottom: 30px;
}
th {
    text-align: center;
    border: 1px solid #4b0303;
    padding: 10px 10px;
    }
td {
    border: 1px solid #4b0303;
    padding: 10px 10px;
    height: 50px;
}
tr {
    height: 50px;
}
</style>
