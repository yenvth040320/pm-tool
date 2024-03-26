<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ version.version_code && version.function.name ? this.$store.state.project.name + ' / ' + this.$store.state.category.name + ' / ' + version.function.name + ' / ' + 'Version: ' + version.version_code : '' }}
    </template>
    <a-tabs default-active-key="1">
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
export default {
  components: {
    TestCaseValidator,
    TestCaseLogic,
    TabTestcaseCommon
  },
  data() {
    return {
      id: +this.$route.params.id || 0,
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: ''
        }
      },
      mstItemProperty: [],
      functionItem: [],
      functionTestCase: [],
      mstValidations: [],
      functionEvents: []
    }
  },
  watch: {
    id(newId) {
      this.getDetail(newId)
    },
    '$route.query': 'getFunctionTestCases'
  },
  /**
     * Mounted event.
     */
  async mounted() {
    await this.getDetail(this.id)
    this.getFunctionItem()
    this.getMstItemProperty()
    this.getMstValidations()
    this.getFunctionEvents()
    this.getFunctionTestCases()
  },

  methods: {
    /**
       * Get item detail
       *
       * @param {Number} id
       */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id) {
          const { data: { result: { data } } } = await this.$api.versionFunction.show(id)
          this.version = data
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
      const params = {
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code,
        not_limit: true
      }

      const { data: { result: { data } } } = await this.$api.functionItem.list({ params })
      this.functionItem = data
    },

    /**
       * Get list mstItemProperty
       */
    async getMstItemProperty() {
      const params = {
        project_id: this.$store.state.project.id,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.mstItemProperty.list({ params })
      this.mstItemProperty = data
    },

    /**
       * Get list mstValidation
       */
    async getMstValidations() {
      const params = {
        project_id: this.$store.state.project.id,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.mstValidation.list({ params })
      this.mstValidations = data
    },

    /**
       * Get list functionEvent
       */
    async getFunctionEvents() {
      const params = {
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.functionEvent.list({ params })
      this.functionEvents = data
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
