<template>
  <div>
    <a-spin :spinning="spin">
      <div class="main-container">
        <div v-for="(matrix, index) in dataTestcaseResult" :key="index" class="testcase-matrix">
          <TestcaseMatrixResultComponent :matrix="matrix" :index="index" :spin="spin" :data-testcase-result="dataTestcaseResult" :members="members" />
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import TestcaseMatrixResultComponent from '~/components/templates/functionResult/TestcaseMatrixResultComponent.vue'
import {
  SORT
} from '~/constants'
export default {
  components: {
    TestcaseMatrixResultComponent
  },
  props: {
    spin: {
      type: Boolean,
      default: false
    },
    dataTestcaseResult: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      moment,
      project_id: this.$store.state.project.id,
      function_id: Number(this.$route.params.id),
      version_code: Number(this.$route.params.version_code),
      function_result_id: Number(this.$route.params.function_result_id),
      members: [],
      visible: false,
      currentId: 0,
      loading: false,
      ckeditorReady: false,
      bugTitle: '',
      bugCondition: '',
      SORT
    }
  },
  computed: {
  },
  watch: {},
  created() {
    this.getMemberOfProject()
  },
  methods: {
    /**
       * Get member in project
       *
       * @returns {Promise<void>}
       */
    async getMemberOfProject() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          belong_to_project: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.user.getGroupMembers({ params })
        this.members = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ {
  .custom-index-header {
    border-top-left-radius: 0 !important;
    color: #000000a6 !important;
    background-color: transparent !important;
    font-weight: normal;
  }
  .testcase-matrix {
    margin-bottom: 20px;
  }
}
</style>
