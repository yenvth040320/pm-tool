<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="model">
        <span>{{ model.title }}</span>
      </span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.requirement.tab_info')" class="tab-pane">
        <RequirementTabInfo
          :id="id"
          ref="requirementTabInfo"
        />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.requirement.tab_analytic')" class="tab-pane">
        <TabAnalytics :id="id" />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.requirement.tab_estimate')">
        <RequirementEstimate :id="id" :model="model" />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.requirement.tab_schedule')">
        <RequirementTabSchedule
          :id="id"
          ref="requirementTabSchedule"
        />
      </a-tab-pane>
      <a-tab-pane key="5" :tab="$t('module.requirement.tab_chart')">
        <RequirementGanttChart :requirement-ids="[id]" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import TabAnalytics from '~/components/templates/requirement/TabAnalytics.vue'
import RequirementTabInfo from '~/components/templates/requirement/RequirementTabInfo'
import RequirementEstimate from '~/components/templates/requirement/RequirementEstimate'
import RequirementGanttChart from '~/components/templates/requirement/RequirementGanttChart'
import RequirementTabSchedule from '~/components/templates/requirement/RequirementTabSchedule'

export default {
  components: {
    TabAnalytics,
    RequirementTabInfo,
    RequirementEstimate,
    RequirementGanttChart,
    RequirementTabSchedule
  },

  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    activeKey: '1',
    model: {}
  }),

  /**
   * Computed event.
   */
  computed: {
    /**
     * Rules validate when submit form.
     */
    formRules() {
      return {
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

  /**
    * List of methods.
    */
  methods: {
    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        if (id) {
          const { data: { result: { data } } } = await this.$api.requirement.show(id)
          this.model = data
          this.$store.dispatch('addProject', {
            id: this.model.project.id,
            name: this.model.project.name
          })
        }

        const tabCheck = window.location.hash.substring(1)
        if (tabCheck === 'tab_info') {
          this.activeKey = '1'
        } else if (tabCheck === 'tab_analytic') {
          this.activeKey = '2'
        } else if (tabCheck === 'tab_estimate') {
          this.activeKey = '3'
        } else if (tabCheck === 'tab_schedule') {
          this.activeKey = '4'
        } else if (tabCheck === 'tab_chart') {
          this.activeKey = '5'
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    changeTab(key) {
      const hash = {
        1: 'tab_info',
        2: 'tab_analytic',
        3: 'tab_estimate',
        4: 'tab_schedule',
        5: 'tab_chart'
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
<style lang="scss" scoped>
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
}
</style>
