<template>
  <a-card class="mb-4">
    <template slot="title">
      <span>{{ $store.state.project.name }}</span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.lifeCycle.tab_process')">
        <TabProcess :mst-life-cycles="mstLifeCycles" :functions="functions" :users="users" :categories="categories" @save="saveDataProcess" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.lifeCycle.tab_schedule')">
        <tab-schedule
          :mst-life-cycles="mstLifeCycles"
          :users="users"
          :categories="categories"
        />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import TabSchedule from '~/components/templates/project/TabSchedule'
import TabProcess from '~/components/templates/project/TabProcess.vue'

export default {
  components: {
    TabSchedule,
    TabProcess
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      activeKey: '1',
      mstLifeCycles: [],
      functions: [],
      users: [],
      mstLifeCycleStatus: [],
      functionSchedule: [],
      categories: []
    }
  },
  watch: {},

  /**
   * Mounted event.
   */
  mounted() {
    this.setTab()
    this.getMstLifeCycles()
    this.getFunctions()
    this.getProjectUser()
    this.getCategories()
  },

  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_process',
        2: 'tab_schedule'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    async getMstLifeCycles() {
      try {
        const params = {
          project_id: this.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getFunctions() {
      try {
        const params = {
          project_id: this.id,
          not_limit: true,
          is_process: true
        }
        const { data: { result: { data } } } = await this.$api.function.getDataTabProcess({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getProjectUser() {
      try {
        if (this.id) {
          const { data: { result: { data } } } = await this.$api.project.show(this.id)
          const uniqueUsersMap = new Map()

          data.users.forEach(user => {
            if (!uniqueUsersMap.has(user.id)) {
              uniqueUsersMap.set(user.id, {
                id: user.id,
                name: user.name
              })
            }
          })
          this.users = Array.from(uniqueUsersMap.values())
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    setTab() {
      const tabCheck = window.location.hash.substring(1)
      if (tabCheck === 'tab_process') {
        this.activeKey = '1'
      } else if (tabCheck === 'tab_schedule') {
        this.activeKey = '2'
      }
    },

    saveDataProcess() {
      this.getFunctions()
    },

    async getCategories() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.category.list({ params })
        this.categories = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goto-testcase {
  font-weight: 700;
  font-size: 16px;
}
.button-wrap {
  display: flex;
  .export-btn {
    margin-right: 10px;
  }
}
</style>
