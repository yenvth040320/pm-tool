<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.function.name && functionResult.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <a @click="goToCategory">{{ $store.state.category.name }}</a>
        <span>{{ ' / ' + '[' + version.function.code + ']' + ': ' + version.function.name }}</span>
        <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
        <span>{{ ' / ' + functionResult.name }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.functionTestCase.tab_validator')">
        <TestCaseValidator
          :version="version"
          :mst-item-property="mstItemProperty"
          :function-result-details="functionResultDetails"
          @save="save"
          @replaceQuery="replaceQuery"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.functionTestCase.tab_common')">
        <tab-testcase-common
          :version-code="version.version_code"
          :function-id="version.function.id"
          :function-result-details="functionResultDetails"
          :version="version"
          @replaceQuery="replaceQuery"
          @save="save"
        />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.functionTestCase.tab_logic')">
        <TestCaseLogic
          :version="version"
          :function-result-details="functionResultDetails"
          @save="save"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>

import TabTestcaseCommon from '~/components/templates/functionResultDetail/TabTestcaseCommon'
import TestCaseValidator from '~/components/templates/functionResultDetail/TestCaseValidator.vue'
import TestCaseLogic from '~/components/templates/functionResultDetail/TestCaseLogic.vue'
import { DEFAULT_TITLE } from '~/constants'
export default {
  components: {
    TestCaseValidator,
    TestCaseLogic,
    TabTestcaseCommon
  },
  data() {
    return {
      id: +this.$route.params.id || 0,
      function_id: +this.$route.params.function_id || 0,
      version_code: +this.$route.params.version_code || 0,
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: '',
          category: {
            id: 0,
            name: ''
          }
        }
      },
      mstItemProperty: [],
      functionResultDetails: [],
      mstValidations: [],
      activeKey: '1',
      functionResult: {}
    }
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  watch: {
    id(newId) {
      this.getDetail(newId)
    },
    version_code(val) {
      this.getDetailVersion(this.function_id, val)
    },
    function_id(val) {
      this.getDetailVersion(val, this.version_code)
    },
    '$route.query': 'getFunctionTestCases'
  },

  /**
   * Mounted event.
   */
  async mounted() {
    await this.getDetailVersion(this.function_id, this.version_code)
    await this.getDetail(this.id)

    await Promise.all([
      this.getMstItemProperty(),
      this.getMstValidations(),
      this.getFunctionResultDetail()
    ])
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
          const { data: { result: { data } } } = await this.$api.functionResult.show(id)
          this.functionResult = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * Get item detail
     *
     * @param {Number} id
     * @param {Number} versionCode
     */
    async getDetailVersion(functionId, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (functionId && versionCode) {
          const params = {
            function_id: functionId,
            version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.versionFunction.getDetail({ params })
          this.version = data
          this.$store.dispatch('addProject', {
            id: this.version.project.id,
            name: this.version.project.name
          })
          this.$store.dispatch('addCategory', {
            id: this.version.function.category.id,
            name: this.version.function.category.name
          })
          const tabCheck = window.location.hash.substring(1)
          if (tabCheck === 'test_case_validator') {
            this.activeKey = '1'
          } else if (tabCheck === 'test_case_common') {
            this.activeKey = '2'
          } else if (tabCheck === 'test_case_logic') {
            this.activeKey = '3'
          }
          if (this.version) {
            document.title = this.version.function.code
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list mstItemProperty
     */
    async getMstItemProperty() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstItemProperty.list({ params })
        this.mstItemProperty = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list mstValidation
     */
    async getMstValidations() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstValidation.list({ params })
        this.mstValidations = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get function image validation
     *
     * @param {Number} id
     */
    async getFunctionResultDetail() {
      this.$store.dispatch('setLoading', true)
      try {
        const conds = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          function_result_id: this.id,
          not_limit: true
        }
        const params = this.$route.query
        if (conds && typeof conds === 'object') {
          Object.entries(conds).forEach(([key, value]) => {
            params[key] = value
          })
        }

        const { data: { result: { data } } } = await this.$api.functionResultDetail.list({ params })

        this.functionResultDetails = data
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

    changeTab(key) {
      const hash = {
        1: 'test_case_validator',
        2: 'test_case_common',
        3: 'test_case_logic'
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
    },

    goToCategory() {
      this.$router.push({ name: 'function' })
    }
  }
}
</script>
