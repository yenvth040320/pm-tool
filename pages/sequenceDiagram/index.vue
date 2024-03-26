<template>
  <a-card class="mb-4">
    <template slot="title">
      <span>{{ $store.state.project.name }}</span>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.sequenceDiagram.tree_folder')">
        <TabTreeFolder @change-tab="handleChangeTabAndPassId" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.sequenceDiagram.diagram')">
        <TabDiagram :id="classPropertyId" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import TabTreeFolder from '~/components/templates/sequenceDiagram/TabTreeFolder.vue'
import TabDiagram from '~/components/templates/sequenceDiagram/TabDiagram.vue'

export default {
  components: {
    TabTreeFolder,
    TabDiagram
  },

  data() {
    return {
      activeKey: '1',
      classPropertyId: 0
    }
  },
  watch: {
  },
  /**
   * Mounted event.
   */
  mounted() {
    const tabCheck = window.location.hash.substring(1)
    if (tabCheck === 'tab_tree_folder') {
      this.activeKey = '1'
    } else if (tabCheck === 'tab_diagram') {
      this.activeKey = '2'
    }
  },

  methods: {
    changeTab(key) {
      const hash = {
        1: 'tab_tree_folder',
        2: 'tab_diagram'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },
    handleChangeTabAndPassId(id) {
      const idWithoutPrefix = id.slice(10)
      const idInteger = parseInt(idWithoutPrefix, 10)
      this.classPropertyId = idInteger
      this.activeKey = '2'
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
/deep/ {
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0 0 0;
  }
}
</style>
