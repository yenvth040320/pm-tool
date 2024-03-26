<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.function.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <a @click="goToCategory">{{ $store.state.category.name }}</a>
        <span>{{ ' / ' + '[' + version.function.code + ']' + ': ' + version.function.name }}</span>
        <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.functionTestCase.tab_validator')">
        <TestCaseValidator
          :version="version"
          :function-item="functionItem"
          :mst-item-property="mstItemProperty"
          :function-test-case="functionTestCase"
          @save="save"
          @replaceQuery="replaceQuery"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.functionTestCase.tab_common')">
        <tab-testcase-common
          :version-code="version.version_code"
          :function-id="version.function.id"
          :function-test-case="functionTestCase"
          :version="version"
          @replaceQuery="replaceQuery"
          @save="save"
        />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.functionTestCase.tab_logic')">
        <TestCaseLogic :version="version" :function-events="functionEvents" :function-item="functionItem" :function-test-case="functionTestCase" @save="save" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import TabTestcaseCommon from '~/components/templates/functionTestCase/TabTestcaseCommon'
import TestCaseValidator from '~/components/templates/functionTestCase/TestCaseValidator.vue'
import TestCaseLogic from '~/components/templates/functionTestCase/TestCaseLogic.vue'
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
      functionItem: [],
      functionTestCase: [],
      mstValidations: [],
      functionEvents: [],
      activeKey: '1'
    }
  },
  watch: {
    id(newId) {
      this.getDetail(newId, this.version_code)
    },
    version_code(val) {
      this.getDetail(this.id, val)
    },
    '$route.query': 'getFunctionTestCases'
  },
  /**
   * Mounted event.
   */
  async mounted() {
    await this.getDetail(this.id, this.version_code)

    await Promise.all([
      this.getFunctionItem(),
      this.getMstItemProperty(),
      this.getMstValidations(),
      this.getFunctionEvents(),
      this.getFunctionTestCases()
    ])
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  methods: {
    /**
     * Get item detail
     *
     * @param {Number} id
     * @param {Number} versionCode
     */
    async getDetail(id, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id && versionCode) {
          const params = {
            function_id: id,
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
     * Get list functionItem
     */
    async getFunctionItem() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.functionItem.list({ params })
        this.functionItem = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
     * Get list functionEvent
     */
    async getFunctionEvents() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.functionEvent.list({ params })
        this.functionEvents = data
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
    async getFunctionTestCases() {
      this.$store.dispatch('setLoading', true)
      try {
        const conds = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          not_limit: true
        }
        const params = this.$route.query
        if (conds && typeof conds === 'object') {
          Object.entries(conds).forEach(([key, value]) => {
            params[key] = value
          })
        }

        const { data: { result: { data } } } = await this.$api.functionTestCase.list({ params })

        this.functionTestCase = data
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
      this.getFunctionTestCases()
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
