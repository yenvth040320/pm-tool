<template>
  <a-card class="mb-4">
    <template slot="title">
      <span>{{ $store.state.project.name + ' / ' }}</span>
      {{ $t('module.flow') }}
    </template>

    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.flow')">
        <ViewFlow :flows="flows" @save="save" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.flowFile')">
        <TabFlowFile :flow="flow" @save="save" />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.flowHistory')">
        <FlowHistoryForm />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import ViewFlow from '~/components/templates/flow/ViewFlow.vue'
import FlowHistoryForm from '~/components/templates/flowHistory/FlowHistoryForm.vue'
import TabFlowFile from '~/components/templates/flow/TabFlowFile'

export default {
  /**
   * Declare components.
   */
  components: {
    ViewFlow,
    FlowHistoryForm,
    TabFlowFile
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      activeKey: '1',
      flows: [],
      flow: {}
    }
  },

  /**
   * Computed event.
   */
  computed: {
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getFlows()
    const tabCheck = window.location.hash.substring(1)
    if (tabCheck === 'tab_flow') {
      this.activeKey = '1'
    } else if (tabCheck === 'tab_file') {
      this.activeKey = '2'
    } else if (tabCheck === 'tab_history') {
      this.activeKey = '3'
    }
  },

  /**
   * Methods.
   */
  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_flow',
        2: 'tab_file',
        3: 'tab_history'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    async getFlows() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }

        const { data: { result: { data } } } = await this.$api.flow.list({ params })

        this.flows = data
        if (this.flows.length > 0) {
          this.flow = this.flows[0]
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },
    save() {
      this.getFlows()
    }
  }
}
</script>
