<template>
  <div>
    <a-spin :spinning="spin">
      <div class="main-container">
        <div v-for="(matrix, index) in dataTestcaseMatrix" :key="index" class="testcase-matrix">
          <TestCaseMatrixDetail
            v-if="index === selectedMatrixIndex"
            :matrix="matrix"
            :index="index"
            :testcase-matrixs="dataTestcaseMatrix"
            :spin="spin"
            @saveMatrixResult="$emit('saveMatrixResult')"
            @changeSpin="$emit('changeSpin')"
            @copy="copy"
            @selectMatrix="selectedMatrixIndex = $event"
          />
          <TestCaseMatrixComponentVue
            v-if="selectedMatrixIndex === -1"
            :matrix="matrix"
            :index="index"
            :testcase-matrixs="dataTestcaseMatrix"
            :spin="spin"
            @saveMatrixResult="$emit('saveMatrixResult')"
            @changeSpin="$emit('changeSpin')"
            @copy="copy"
            @selectMatrix="selectedMatrixIndex = $event"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import {
} from '~/constants'
import TestCaseMatrixComponentVue from '~/components/templates/testCase/TestCaseMatrixComponent.vue'
import TestCaseMatrixDetail from '~/components/templates/testCase/TestCaseMatrixDetail.vue'
export default {
  components: {
    TestCaseMatrixComponentVue,
    TestCaseMatrixDetail
  },
  props: {
    spin: {
      type: Boolean,
      default: false
    },
    dataTestcaseMatrix: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code,
      currentGroupType: null,
      displayedGroups: [],
      selectedMatrixIndex: -1
    }
  },
  computed: {
  },
  watch: {},
  created() {},
  methods: {
    copy(record, index) {
      this.$emit('copy', record, index)
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ {
  .ant-table-tbody {
    .disabled-row {
      pointer-events: none;
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
}
</style>
