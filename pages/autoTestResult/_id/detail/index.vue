<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="autoTestResult ">
        <span class="link" @click="gotoListTestResult">{{ autoTestResult.test_result }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.autoTestResult.result_passed')">
        <AutoTestResultDetail v-if="resultPassed.length > 0" :test-result-detail="resultPassed" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.autoTestResult.result_failed')">
        <AutoTestResultDetail v-if="resultFailed.length > 0" :test-result-detail="resultFailed" />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.autoTestResult.result_timedOut')">
        <AutoTestResultDetail v-if="resultTimedOut.length > 0" :test-result-detail="resultTimedOut" />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.autoTestResult.result_skipped')">
        <AutoTestResultDetail v-if="resultSkipped.length > 0" :test-result-detail="resultSkipped" />
      </a-tab-pane>
      <a-tab-pane key="5" :tab="$t('module.autoTestResult.result_interrupted')">
        <AutoTestResultDetail v-if="resultInterrupted.length > 0" :test-result-detail="resultInterrupted" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { DEFAULT_TITLE } from '~/constants'
import AutoTestResultDetail from '~/components/templates/autoTestResultDetail/AutoTestResultDetail.vue'
export default {
  components: {
    AutoTestResultDetail
  },
  data() {
    return {
      id: +this.$route.params.id || 0,
      activeKey: '1',
      autoTestResult: {},
      resultPassed: [],
      resultFailed: [],
      resultTimedOut: [],
      resultSkipped: [],
      resultInterrupted: []
    }
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  watch: {
    id(newId) {
      this.getDetail(newId)
    }
  },

  /**
       * Mounted event.
       */
  mounted() {
    this.getDetail(this.id)
  },

  methods: {
    /**
         * Get item detail
         *
         */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        if (id) {
          const { data: { result: { data } } } = await this.$api.autoTestResult.show(id)
          this.autoTestResult = data
          this.resultPassed = this.autoTestResult.autoTestResultDetail.filter(
            record => record.status === 'passed'
          )
          this.resultFailed = this.autoTestResult.autoTestResultDetail.filter(
            record => record.status === 'failed'
          )
          this.resultTimedOut = this.autoTestResult.autoTestResultDetail.filter(
            record => record.status === 'timedOut'
          )
          this.resultSkipped = this.autoTestResult.autoTestResultDetail.filter(
            record => record.status === 'skipped'
          )
          this.resultInterrupted = this.autoTestResult.autoTestResultDetail.filter(
            record => record.status === 'interrupted'
          )
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    handleOK() {
      this.getDetail(this.id)
    },
    save() {
      this.getFunctionResultDetail()
    },

    gotoListTestResult() {
      this.$router.push('/autoTestResult')
    },

    changeTab(key) {
      const hash = {
        1: 'result_passed',
        2: 'result_failed',
        3: 'result_timedOut',
        4: 'result_skipped',
        5: 'result_interrupted'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    replaceQuery(data) {
      const query = {}
      const newQuery = {
        ...this.$route.query,
        ...data
      }
      Object.entries(newQuery).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          query[key] = value
        }
      })

      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
        this.getFunctionTestCases()
      } else {
        this.$router.push({ query })
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .link {
    cursor: pointer;
  }
  </style>
