<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ version.version_code && version.api.name ? this.$store.state.project.name + ' / ' + this.$store.state.apiCategory.name + ' / ' + version.api.name + ' / ' + 'Version: ' + version.version_code : '' }}
    </template>
    <a-tabs default-active-key="1">
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
    </a-tabs>
  </a-card>
</template>

<script>
import VersionApiForm from '~/components/templates/versionApi/VersionApiForm.vue'
import TabApiResponse from '~/components/templates/versionApi/TabApiResponse'
import ApiParameter from '~/components/templates/apiParameter/ApiParameter.vue'
import ApiInfoForm from '~/components/templates/apiInfo/ApiInfoForm'
export default {
  components: {
    VersionApiForm,
    ApiParameter,
    ApiInfoForm,
    TabApiResponse
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      functionEvent: [],
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: ''
        }
      }
    }
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
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id) {
          const { data: { result: { data } } } = await this.$api.versionApi.show(id)
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
    handleOK() {
      this.getDetail(this.id)
    }
  }
}
</script>
