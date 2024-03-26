<template>
  <a-layout-header>
    <div class="header--left">
      <a
        href="javascript:void(0)"
        class="btn__header--collapse"
        @click="toggleIsCollapsed"
      >
        <a-icon :type="isCollapsed ? 'menu-unfold' : 'menu-fold'" />
      </a>
    </div>

    <div class="header--right pr-4">
      <a-select
        v-model="model.project_id"
        :placeholder="$t('module.project')"
        :filter-option="filterOption"
        show-search
        @change="setProject(model.project_id)"
      >
        <a-select-option
          v-for="(item, index) in projects"
          :key="index"
          :value="item.id"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-dropdown
        overlay-class-name="dropdown__account"
        :trigger="['click']"
      >
        <a
          class="link__dropdown"
          @click.prevent
        >
          <font-awesome-icon
            icon="user-cog"
            class="font-awesome--large"
          />
        </a>

        <a-menu slot="overlay">
          <a-menu-item
            key="0"
            class="menu__profile"
          >
            {{ $auth.user ? $auth.user.email : '' }}
          </a-menu-item>
          <a-menu-item key="1">
            <a
              href="javascript:void(0)"
              @click="logout()"
            >
              <font-awesome-icon icon="sign-out-alt" />&nbsp;
              {{ $t('common.logout') }}
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { SET_IS_SIDEBAR_COLLAPSED } from '~/constants/mutation-types'

export default {
  data() {
    return {
      projects: [],
      model: {
        project_id: this.$store.state.project.id !== 0 ? this.$store.state.project.id : undefined
      }
    }
  },

  computed: {
    ...mapState({
      isSidebarCollapsed: 'isSidebarCollapsed',
      project: 'project'
    }),

    selectedProjectId: {
      get() {
        return this.project.id
      },
      set(newVal) {
        this.model.project_id = newVal
      }
    },

    isCollapsed: {
      get() {
        return this.isSidebarCollapsed
      },
      set(value) {
        this.setIsSidebarCollapsed(value)
      }
    },

    currentLocaleISO() {
      const locale = this.$i18n.locales.find(item => item.code === this.$i18n.locale)
      return locale ? locale.iso : 'en-US'
    }
  },
  watch: {
    '$route.path': {
      handler(newPath, oldPath) {
        if (newPath.includes('project')) {
          this.collapsed = true
          this.getProjects()
        }
      },
      immediate: true
    },
    'model.project_id'(newVal) {
      this.selectedProjectId = newVal
    },
    selectedProjectId(newVal) {
      this.model.project_id = newVal
    }
  },

  async created() {
    await this.getProjects()
    this.checkProjectId()
    this.$on('projectAdded', this.getProjects)
  },

  methods: {
    ...mapMutations({
      setIsSidebarCollapsed: SET_IS_SIDEBAR_COLLAPSED
    }),

    setProject(projectId) {
      const project = this.projects.find(item => item.id === projectId)
      this.$store.dispatch('addProject', {
        id: project.id,
        name: project.name
      })
      this.$store.dispatch('addCategory', {
        id: 0,
        name: ''
      })
      this.$store.dispatch('addApiCategory', {
        id: 0,
        name: ''
      })
      this.$store.dispatch('addDbSchema', {
        id: 0,
        name: ''
      })
      location.reload()
    },

    async getProjects() {
      try {
        const params = {}
        const { data: { result: { data } } } = await this.$api.project.getWorkingPrj({ params })
        this.projects = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async checkProjectId() {
      const projectId = this.$store.state.project.id
      if (projectId) {
        try {
          const params = {}
          const { data: { result: { data } } } = await this.$api.project.getWorkingPrj({ params })
          this.projects = data

          const projectIdExists = this.projects.some(project => project.id === projectId)

          if (!projectIdExists) {
            this.$notification.error({
              message: this.$t('text.not_in_project')
            })
            this.logout()
          }
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      }
    },

    /**
     * Logout user
     */
    async logout() {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$auth.logout()

        await localStorage.clear()
        this.$store.dispatch('resetData')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Toggle collapsed status
     */
    toggleIsCollapsed() {
      this.isCollapsed = !this.isCollapsed
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>

<style scoped lang="scss">
.dropdown__locale {
  min-width: 51px;
  .ant-dropdown-menu {
    border: 1px solid #d8dbe0;
  }
  .ant-dropdown-menu-item {
    text-align: center;
  }
}

.dropdown__account {
  min-width: 160px;
  .ant-dropdown-menu {
    border: 1px solid #d8dbe0;
    padding-top: 0;
  }
}

.menu__profile {
  background: #ebedef;
  text-align: center;
  cursor: default;
  pointer-events: none;
}

.ant-layout-header {
  display: flex;
  justify-content: space-between;
  line-height: 1.5;
  background: #fff;
  padding: 0;
  .header--left {
    display: flex;
    align-items: center;
  }
  .btn__header--collapse {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    padding: 0 24px;
    cursor: pointer;
    color: #4c4c4c;
    transition: all 0.4s ease;
    &:hover {
      color: $primary-color;
    }
  }
  .header--right {
    min-width: 300px;
    display: flex;
    align-items: center;
    > * {
      margin-left: 10px;
    }
    .link__dropdown {
      display: inline-block;
      vertical-align: middle;
      padding: 5px;
      color: #4c4c4c;
      &:hover {
        color: $primary-color;
      }
    }
    .font-awesome--large {
      font-size: 25px;
    }
  }
}
</style>
