<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.dbTable.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <a @click="goToSchema">{{ $store.state.dbSchema.name }}</a>
        <span>{{ ' / ' + version.dbTable.name }}</span>
        <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.dbTableVersion.tab_version')">
        <DbTableVersionForm
          v-if="version.id"
          :version="version"
          :entity-list="entityList"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.dbTableVersion.tab_column')">
        <tab-column
          :version="version"
          :entity-list="entityList"
        />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.dbTableVersion.tab_api_use')">
        <tab-api-use
          :version="version"
          :entity-list="entityList"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import DbTableVersionForm from '~/components/templates/dbTableVersion/DbTableVersionForm'
import TabColumn from '~/components/templates/dbTableVersion/TabColumn'
import TabApiUse from '~/components/templates/dbTableVersion/TabApiUse.vue'
import { DEFAULT_TITLE, SORT } from '~/constants'
export default {
  components: {
    DbTableVersionForm,
    TabColumn,
    TabApiUse
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      version_code: +this.$route.params.version_code || 0,
      activeKey: '1',
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: ''
        }
      },
      entityList: []
    }
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
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
  mounted() {
    this.getDetail(this.id, this.version_code)
    this.getEntity()
  },

  methods: {
    goToSchema() {
      this.$router.push({ name: 'dbSchema' })
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
            db_table_id: id,
            version_code: versionCode
          }
          const { data: { result: { data } } } = await this.$api.dbTableVersion.getDetail({ params })
          this.version = data

          this.$store.dispatch('addProject', {
            id: this.version.project.id,
            name: this.version.project.name
          })
          this.$store.dispatch('addDbSchema', {
            id: this.version.dbTable.db_schema.id,
            name: this.version.dbTable.db_schema.name
          })
          const tabCheck = window.location.hash.substring(1)
          if (tabCheck === 'tab_version') {
            this.activeKey = '1'
          } else if (tabCheck === 'tab_structure') {
            this.activeKey = '2'
          } else if (tabCheck === 'tab_api_use') {
            this.activeKey = '3'
          }
          if (this.version) {
            document.title = this.version.dbTable.name
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
        2: 'tab_structure',
        3: 'tab_api_use'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    /**
     * Get list entity
     */
    async getEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entityList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    }
  }
}
</script>
