<template>
  <a-card class="mb-4">
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.entityRelationship')">
        <tab-relation />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.entityHistory')">
        <tab-history />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.erGroup')">
        <tab-er-group />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.erGroup.entity_diagram')">
        <tab-diagram />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>

import TabRelation from '~/components/templates/entityRelationship/TabRelation'
import TabHistory from '~/components/templates/entityRelationship/TabHistory'
import TabErGroup from '~/components/templates/erGroup/TabErGroup'
import TabDiagram from '~/components/templates/erGroup/TabDiagram'
export default {
  components: {
    TabHistory,
    TabRelation,
    TabErGroup,
    TabDiagram
  },

  data() {
    return {
      activeKey: '1'
    }
  },

  beforeDestroy() {},

  watch: {},

  /**
   * Mounted event.
   */
  mounted() {
    this.setTab()
  },

  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_relation',
        2: 'tab_history',
        3: 'tab_er_group',
        4: 'tab_diagram'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    setTab() {
      const tabCheck = window.location.hash.substring(1)
      if (tabCheck === 'tab_relation') {
        this.activeKey = '1'
      } else if (tabCheck === 'tab_history') {
        this.activeKey = '2'
      } else if (tabCheck === 'tab_er_group') {
        this.activeKey = '3'
      } else if (tabCheck === 'tab_diagram') {
        this.activeKey = '4'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
