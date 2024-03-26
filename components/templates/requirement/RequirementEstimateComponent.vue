<template>
  <a-card class="mb-4 box-content">
    <template slot="title">
      <a-row>
        <a-col :span="12">
          <span>
            {{ '[' + dataFunction?.function?.code + ']: ' + dataFunction?.function?.name + '/version: ' + dataFunction.version_code }}
          </span>
        </a-col>

        <a-col :span="12" />
      </a-row>
    </template>
    <SummaryTableItemAndLogic :data-function="dataFunction" :max-count-record="maxCountRecord " :is-has-permision="isHasPermision" />
    <EstimateMstComponent
      ref="estimateMstComponent"
      :data-function="dataFunction"
      :is-has-permision="isHasPermision"
      @success="$emit('success')"
      @saveDataEstimate="$emit('saveDataEstimate')"
      @save="$emit('save')"
    />
  </a-card>
</template>

<script>
import { APPROVE_STATUS_ANALYTICS } from '~/constants'
import EstimateMstComponent from '~/components/templates/requirement/EstimateMstComponent'
import SummaryTableItemAndLogic from '~/components/templates/requirement/SummaryTableItemAndLogic.vue'
export default {
  components: {
    SummaryTableItemAndLogic,
    EstimateMstComponent
  },

  props: {
    dataFunction: {
      type: [Object],
      default: () => {}
    },
    maxCountRecord: {
      type: [Number, String],
      default: () => 0
    },
    isHasPermision: {
      type: [Boolean],
      default: () => false
    }
  },

  /**
     * Init data for component.
     */
  data: () => ({
    APPROVE_STATUS_ANALYTICS,
    expandedRowKeys: []
  }),
  /**
   * Computed event.
   */
  computed: {
  },

  watch: {

  },

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
  }
  .table-wrap {
  border: 1px solid #4b0303;
  max-height: 750px;
  overflow-y: auto;
  }
  .table_event_item {
    margin-bottoM: 50px;
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
