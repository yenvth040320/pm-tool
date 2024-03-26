<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ version.version_code && version.dbTable.name ? this.$store.state.project.name + ' / ' + this.$store.state.dbSchema.name + ' / ' + version.dbTable.name + ' / ' + 'Version: ' + version.version_code : '' }}
    </template>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" :tab="$t('module.dbTableVersion.tab_version')">
        <DbTableVersionForm v-if="version.id" :version="version" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.dbTableVersion.tab_column')">
        <tab-column
          :version="version"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import DbTableVersionForm from '~/components/templates/dbTableVersion/DbTableVersionForm'
import TabColumn from '~/components/templates/dbTableVersion/TabColumn'
export default {
  components: {
    DbTableVersionForm,
    TabColumn
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
          const { data: { result: { data } } } = await this.$api.dbTableVersion.show(id)
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
