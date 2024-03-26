<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.api.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <a @click="goToApiCategory">{{ $store.state.apiCategory.name }}</a>
        <span>{{ ' / ' + '[' + version.api.code + ']' + ': ' + version.api.name }}</span>
        <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.versionApi.version_tab')">
        <VersionApiForm v-if="version.id" :version="version" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.versionApi.api_info_tab')">
        <api-info-form :version="version" />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.versionApi.api_parameter_tab')">
        <ApiParameter :version="version" />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.versionApi.tab_response')">
        <tab-api-response
          :version="version"
        />
      </a-tab-pane>
      <a-tab-pane key="5" :tab="$t('module.api.tab_function_use')">
        <FunctionUse
          :version="version"
          :function-item-read-datasource="functionItemReadDatasource"
          :function-item-write-datasource="functionItemWriteDatasource"
        />
      </a-tab-pane>
      <a-tab-pane key="6" :tab="$t('module.versionApi.sequence_tab')">
        <tab-sequence :version="version" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import VersionApiForm from '~/components/templates/versionApi/VersionApiForm.vue'
import TabApiResponse from '~/components/templates/versionApi/TabApiResponse'
import ApiParameter from '~/components/templates/apiParameter/ApiParameter.vue'
import ApiInfoForm from '~/components/templates/apiInfo/ApiInfoForm'
import FunctionUse from '~/components/templates/api/FunctionUse.vue'
import TabSequence from '~/components/templates/versionApi/TabSequence.vue'
import { DEFAULT_TITLE } from '~/constants'
export default {
  components: {
    VersionApiForm,
    ApiParameter,
    ApiInfoForm,
    TabApiResponse,
    FunctionUse,
    TabSequence
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      version_code: +this.$route.params.version_code || 0,
      functionEvent: [],
      activeKey: '1',
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: ''
        }
      },
      functionItemReadDatasource: [],
      functionItemWriteDatasource: [],
      functions: [],
      DEFAULT_TITLE
    }
  },
  watch: {
    id(newId) {
      this.getDetail(newId, this.version_code)
    },
    version_code(val) {
      this.getDetail(this.id, val)
    }
  },
  /**
     * Mounted event.
     */
  async mounted() {
    await this.getDetail(this.id, this.version_code)
    this.getListFunctionItemReadDatasource(this.id, this.version_code)
    this.getListFunctionItemWriteDatasource(this.id, this.version_code)
  },

  methods: {
    goToApiCategory() {
      this.$router.push({ name: 'apiCategory' })
    },
    async getListFunctionItemReadDatasource(id, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id && versionCode) {
          const params = {
            api_id: id,
            api_version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.functionItemReadDatasource.list({ params })
          this.functionItemReadDatasource = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async getListFunctionItemWriteDatasource(id, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id && versionCode) {
          const params = {
            api_id: id,
            api_version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.functionItemWriteDatasource.list({ params })
          this.functionItemWriteDatasource = data
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
    async getDetail(id, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id && versionCode) {
          const params = {
            api_id: id,
            version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.versionApi.getDetail({ params })
          this.version = data

          this.$store.dispatch('addProject', {
            id: this.version.project.id,
            name: this.version.project.name
          })
          this.$store.dispatch('addApiCategory', {
            id: this.version.api.api_category.id,
            name: this.version.api.api_category.name
          })
          const tabCheck = window.location.hash.substring(1)
          if (tabCheck === 'tab_version') {
            this.activeKey = '1'
          } else if (tabCheck === 'tab_info') {
            this.activeKey = '2'
          } else if (tabCheck === 'tab_parameter') {
            this.activeKey = '3'
          } else if (tabCheck === 'tab_response') {
            this.activeKey = '4'
          } else if (tabCheck === 'tab_function_use') {
            this.activeKey = '5'
          } else if (tabCheck === 'tab_sequence') {
            this.activeKey = '6'
          }
          if (this.version) {
            document.title = this.version.api.code
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
    handleOK() {
      this.getDetail(this.id, this.version_code)
    },
    changeTab(key) {
      const hash = {
        1: 'tab_version',
        2: 'tab_info',
        3: 'tab_parameter',
        4: 'tab_response',
        5: 'tab_function_use',
        6: 'tab_sequence'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    }
  }
}
</script>
