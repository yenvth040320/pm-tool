<template>
  <a-modal v-model="notifiSelectProject" class="modal-notifi" :mask-closable="false" :centered="true" :cancel-text="$t('common.ok')" @cancel="hiddenModalNotifiProject">
    <p class="text">
      {{ $t('module.project.project_not_selected_yet.error') }}
    </p>
    <div class="select-project">
      <a-select
        v-model="model.project_id"
        :filter-option="filterOption"
        show-search
        allow-clear
        :placeholder="$t('module.project')"
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
    </div>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      notifiSelectProject: false,
      projects: [],
      model: {
        project_id: this.$store.state.project.id !== 0 ? this.$store.state.project.id : undefined
      }
    }
  },

  computed: {
    ...mapState({
      project: 'project'
    }),

    selectedProjectId: {
      get() {
        return this.project.id
      },
      set(newVal) {
        this.model.project_id = newVal
      }
    }
  },

  mounted() {
    if (this.$store.state.project.id === 0) {
      this.notifiSelectProject = true
      this.getProjects()
    }
  },
  methods: {
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

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

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
    },

    hiddenModalNotifiProject() {
      if (this.$store.state.project.id !== 0) {
        location.reload()
        this.notifiSelectProject = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.select-project {
    padding: 1.5em 1.5em 0 1.5em;
}
</style>
