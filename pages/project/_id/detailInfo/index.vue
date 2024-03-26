<template>
  <a-card class="mb-4">
    <template slot="title">
      <span>{{ $store.state.project.name }}</span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.project.tab_overview')">
        {{ $t('module.project.tab_overview') }}
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.project.tab_manager_point')">
        <TabManagerPointEt v-if="project.id" :project="project" @save="save" />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.project.tab_project_personnel')">
        <project-manage-form
          :id="id"
          @goBack="goBack"
          @save="goBack"
        />
      </a-tab-pane>
      <a-tab-pane key="5" :tab="$t('module.project.tab_group_member')">
        <TabGroupMember />
      </a-tab-pane>
      <a-tab-pane key="6" :tab="$t('module.project.tab_support_dev')">
        <tab-support-dev ref="tabSupportDev" />
      </a-tab-pane>
      <a-tab-pane key="8" :tab="$t('module.tab_check_list.title')">
        <tab-checklist />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import { DEFAULT_TITLE } from '~/constants'
import TabManagerPointEt from '~/components/templates/project/TabManagerPointEt.vue'
import ProjectManageForm from '~/components/templates/project/ProjectManageForm'
import TabSupportDev from '~/components/templates/project/TabSupportDev'
import TabGroupMember from '~/components/templates/project/TabGroupMember'
import TabChecklist from '~/components/templates/project/TabChecklist'

export default {
  components: {
    TabManagerPointEt,
    ProjectManageForm,
    TabSupportDev,
    TabGroupMember,
    TabChecklist
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      activeKey: '1',
      DEFAULT_TITLE,
      project: {},
      mstLifeCycles: [],
      functions: [],
      users: [],
      mstLifeCycleStatus: [],
      categories: []
    }
  },
  watch: {
    id(newId) {
      this.getDetail(newId)
    }
  },

  async created() {
    await this.getDetail(this.id)
    await Promise.all([
      this.getProjectUser(),
      this.getCategories()
    ])
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
          const { data: { result: { data } } } = await this.$api.project.show(id)
          this.project = data
          this.$store.dispatch('addProject', {
            id: this.project.id,
            name: this.project.name
          })
          const tabCheck = window.location.hash.substring(1)
          if (tabCheck === 'tab_overview') {
            this.activeKey = '1'
          } else if (tabCheck === 'tab_manager_point') {
            this.activeKey = '2'
          } else if (tabCheck === 'tab_project_personnel') {
            this.activeKey = '4'
          } else if (tabCheck === 'tab_group_member') {
            this.activeKey = '5'
          } else if (tabCheck === 'tab_support_dev') {
            this.activeKey = '6'
          } else if (tabCheck === 'tab_checklist') {
            this.activeKey = '8'
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
    },

    handleOK() {
      this.getDetail(this.id)
    },
    save(projectId) {
      this.getDetail(projectId)
    },

    changeTab(key) {
      const hash = {
        1: 'tab_overview',
        2: 'tab_manager_point',
        4: 'tab_project_personnel',
        5: 'tab_group_member',
        6: 'tab_support_dev',
        8: 'tab_checklist'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    goBack() {
      this.$router.back()
    }
  }
}
</script>
  <style lang="scss" scoped>
  .goto-testcase {
    font-weight: 700;
    font-size: 16px;
  }
  .excel-btn {
    background-color: rgb(49,190,125);
  }
  .button-wrap {
    display: flex;
    .export-btn {
      margin-right: 10px;
    }
  }
  </style>
