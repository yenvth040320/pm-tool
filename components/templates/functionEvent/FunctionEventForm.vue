<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="title">
        <a-button
          html-type="button"
          type="primary"
          title="Mở tất cả"
          class="min-w-100"
          @click="expandParent()"
        >
          <div v-if="expandedKeys.length === 0">
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('common.expand_all_node') }}
          </div>
          <div v-else>
            <a-icon type="minus-circle" />
            {{ $t('common.close_all_node') }}
          </div>
        </a-button>
        <a-button
          v-if="showLevel"
          html-type="button"
          class="min-w-100 auto-btn"
          @click="autoClassifyLevel()"
        >
          <a-icon type="filter" />
          {{ $t('module.tab_logic.auto_classify_level_btn') }}
        </a-button>
        <a-switch v-if="showLevel" v-model="overWriteLevelFlg" class="switch-btn" />
      </template>
      <template slot="extra">
        <label>{{ $t('module.tab_logic.level_switch_label') }}</label>
        <a-switch v-model="showLevel" class="switch-btn " />
        <label>{{ $t('module.tab_logic.japan_switch_label') }}</label>
        <a-switch v-model="showJP" class="switch-btn" />
        <label>{{ $t('module.tab_logic.logic_switch_label') }}</label>
        <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          title="Thêm event"
          :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="addEvent()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
      </template>

      <div class="tree__menu">
        <a-spin :spinning="loading">
          <a-row
            type="flex"
            :gutter="30"
          >
            <div class="table-wrap">
              <table ref="tabEventTree" class="table table-striped" style="width: 100%;">
                <thead class="thead-dark">
                  <tr>
                    <th v-if="showLevel" scope="col">
                      {{ this.$t('module.mstEventLevel.h_front_end') }}
                    </th>
                    <th v-if="showLevel" scope="col">
                      {{ this.$t('module.mstEventLevel.h_back_end') }}
                    </th>
                    <th scope="col">
                      {{ this.$t('module.functionEventLogical.logic_vn') }}
                    </th>
                    <th v-if="showJP" scope="col">
                      {{ this.$t('module.functionEventLogical.logic_jp') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="function-event">
                  <tr v-for="(event, index) in data" :id="'event_' + event[0].data_node.id" :key="index">
                    <td v-if="showLevel" scope="row">
                      <span v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && !event[0].isDisabled">
                        <a-select
                          v-model="event[0].level_front_end"
                          :placeholder="$t('module.mstEventLevel.h_front_end')"
                          :filter-option="filterOption"
                          show-search
                          @change="changeLevel(event, 'level_front_end', $event)"
                        >
                          <a-select-option
                            v-for="(level, indexLevel) in mstEventLevelData"
                            :key="indexLevel"
                            :value="level.id"
                          >
                            {{ level.name }}
                          </a-select-option>
                        </a-select>
                      </span>
                      <span v-if="version.design_lock_flg === LOCK_FLG_VALUE.yes && !event[0].isDisabled">
                        {{ getLevelName(event[0].level_front_end) }}
                      </span>
                      <span v-if="event[0].isDisabled" style="text-decoration: line-through; pointer-events: none;">
                        {{ getLevelName(event[0].level_front_end) }}
                      </span>
                    </td>
                    <td v-if="showLevel" scope="row">
                      <div>
                        <span v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && !event[0].isDisabled">
                          <a-select
                            v-model="event[0].level_back_end"
                            :placeholder="$t('module.mstEventLevel.h_back_end')"
                            :filter-option="filterOption"
                            show-search
                            @change="changeLevel(event, 'level_back_end', $event)"
                          >
                            <a-select-option
                              v-for="(level, indexLevel) in mstEventLevelData"
                              :key="indexLevel"
                              :value="level.id"
                            >
                              {{ level.name }}
                            </a-select-option>
                          </a-select>
                        </span>
                        <span v-if="version.design_lock_flg === LOCK_FLG_VALUE.yes && !event[0].isDisabled">
                          {{ getLevelName(event[0].level_back_end) }}
                        </span>
                        <span v-if="event[0].isDisabled" style="text-decoration: line-through; pointer-events: none;">
                          {{ getLevelName(event[0].level_back_end) }}
                        </span>
                      </div>
                    </td>
                    <td scope="row">
                      <a-tree
                        :tree-data="event"
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        @expand="onExpand"
                      >
                        <template
                          slot="language"
                          slot-scope="{ key, parent, data_node, title, isDisabled }"
                        >
                          <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no" class="menu-tree__title" :class="{ 'crossed-out': isDisabled }" @click="showDrawer(key, parent, data_node)">
                            <span class="title">{{ $t(title) }}</span>
                          </div>
                          <div v-else class="menu-tree__title" :class="{ 'crossed-out': isDisabled }">
                            <span class="title">{{ $t(title) }}</span>
                          </div>
                        </template>
                      </a-tree>
                    </td>
                    <td v-if="showJP" scope="row">
                      <a-tree
                        :tree-data="event"
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        @expand="onExpand"
                      >
                        <template
                          slot="language"
                          slot-scope="{ key, parent, data_node, title_jp, isDisabled }"
                        >
                          <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="menu-tree__title" :class="{ 'crossed-out': isDisabled }" @click="showDrawer(key, parent, data_node)">
                            <span class="title">{{ $t(title_jp) }}</span>
                          </div>
                          <div v-else class="menu-tree__title" :class="{ 'crossed-out': isDisabled }">
                            <span class="title">{{ $t(title_jp) }}</span>
                          </div>
                        </template>
                      </a-tree>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </a-row>
        </a-spin>
      </div>
    </a-card>
    <DrawerEventLogicVue
      ref="drawerEventLogic"
      :show-form-event="showFormEvent"
      :version="version"
      :function-items="functionItems"
      :mst-events="mstEvents"
      :functions="functions"
      @close="close"
      @save="save"
    />
  </div>
</template>
<script>
import DrawerEventLogicVue from './DrawerEventLogic.vue'
import DataTable from '~/mixins/data-table'
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE, USE_FLG_VALUE, AUTO_LOGIC_TYPE_NOT_IN } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    DrawerEventLogicVue
  },

  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)
    try {
      const params = {
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code,
        isTabLogic: true
      }
      const { data: { result: { data } } } = await this.repository.list({ params })
      const newData = data.map(item => this.formatData(item))

      const tree = []

      const formatNameNode = (dataNodes, type, keyNode, isParentDisabled) => {
        const objNode = {
          title: '',
          title_jp: '',
          key: keyNode,
          children: [],
          parent: null,
          data_node: null,
          isDisabled: isParentDisabled,
          level_front_end: null,
          level_back_end: null,
          scopedSlots: {
            title: 'language'
          }
        }
        if (type === 0) { // data event
          const labelProperty = dataNodes?.functionItem?.function_item_properties.find(
            property => property.mst_item_property.name === 'Label Text'
          )
          let label = ''
          if (labelProperty) {
            if (labelProperty.value_jp !== null) {
              label = labelProperty.value_jp
            } else {
              label = labelProperty.value
            }
          } else {
            label = dataNodes.functionItem.name
          }
          objNode.level_front_end = dataNodes.level_front_end
          objNode.level_back_end = dataNodes.level_back_end
          objNode.title = dataNodes.functionItem.item_num + '. ' + dataNodes.functionItem.name + ': (' + dataNodes.functionItem.mst_item_type.name + ') On => ' + dataNodes.mstEvent.name
          objNode.title_jp = dataNodes.functionItem.item_num + '. ' + label + ': (' + dataNodes.functionItem.mst_item_type.name_jp + ') On => ' + (dataNodes.mstEvent.name_jp !== '' ? dataNodes.mstEvent.name_jp : dataNodes.mstEvent.name)
          if (dataNodes.functionItem.use_flg === 0) {
            objNode.isDisabled = true
          } else {
            objNode.isDisabled = false
          }
        } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.sequence) {
          objNode.title = dataNodes.logic_detail
          objNode.title_jp = dataNodes.logic_detail_jp !== null ? dataNodes.logic_detail_jp : dataNodes.logic_detail
        } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.goto) {
          objNode.title = this.$t('module.functionEventLogical.goto') + ': ' + dataNodes.function_goto?.code + ' - ' + dataNodes.function_goto?.name
          objNode.title_jp = this.$t('module.functionEventLogical.goto') + ': ' + dataNodes.function_goto?.code + ' - ' + (dataNodes.function_goto?.name_jp !== null ? dataNodes.function_goto?.name_jp : dataNodes.function_goto?.name)
        } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.if) {
          objNode.title = this.$t('module.functionEventLogical.if') + ' (' + dataNodes.conditions + ')'
          objNode.title_jp = this.$t('module.functionEventLogical.if') + ' (' + (dataNodes.conditions_jp !== null ? dataNodes.conditions_jp : dataNodes.conditions) + ')'
        } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.elseif) {
          objNode.title = this.$t('module.functionEventLogical.elseif') + ' (' + dataNodes.conditions + ')'
          objNode.title_jp = this.$t('module.functionEventLogical.elseif') + ' (' + (dataNodes.conditions_jp !== null ? dataNodes.conditions_jp : dataNodes.conditions) + ')'
        } else {
          objNode.title = this.$t('module.functionEventLogical.else')
          objNode.title_jp = this.$t('module.functionEventLogical.else')
        }

        return objNode
      }

      const buildNode = (dataNodes, parentNodes, isParentDisabled) => {
        let objNode = null
        if (parentNodes == null) {
          objNode = formatNameNode(dataNodes, 0, dataNodes.event_pk, isParentDisabled)
          objNode.data_node = dataNodes
          if (!this.checkSwitch || !objNode.isDisabled) {
            tree.push(objNode)
          }
        } else {
          objNode = formatNameNode(dataNodes, 1, parentNodes.key + '-' + dataNodes.logic_pk, isParentDisabled)
          objNode.data_node = dataNodes
          objNode.parent = parentNodes
          if (!this.checkSwitch || !objNode.isDisabled) {
            parentNodes.children.push(objNode)
          }
        }

        if (dataNodes.functionItem && dataNodes.functionItem.use_flg === 0) {
          objNode.isDisabled = true
          if (objNode.children) {
            objNode.children.forEach(childNode => {
              childNode.isDisabled = true
            })
          }
        }

        dataNodes.functionEventLogical?.forEach(item => {
          buildNode(item, objNode, objNode.isDisabled)
        })

        dataNodes.children?.forEach(item => {
          if (item.logic_type > LOGIC_TYPE_VALUE.if) {
            buildNode(item, objNode.parent, objNode.isDisabled)
          } else {
            buildNode(item, objNode, objNode.isDisabled)
          }
        })
      }

      const buildTree = nodes => {
        nodes.forEach(item => {
          buildNode(item, null, false)
        })

        return tree
      }

      const treeData = buildTree(newData)
      this.data = treeData.map(item => [item])
    } catch (error) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    }
  },
  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionEvent',
      visible: false,
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code
      },
      innerData: [],
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      AUTO_LOGIC_TYPE_NOT_IN,
      showFormEvent: false,
      mstEvents: [],
      functions: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkSwitch: true,
      dataLevel: [],
      mstEventLevelData: [],
      showLevel: false,
      showJP: false,
      function_id: this.$route.params.id || 0,
      version_code: this.$route.params.version_code || 0,
      overWriteLevelFlg: false
    }
  },
  watch: {
    data(newVal) {
      this.data = newVal
    },

    showFormEvent(newVal) {
      if (!newVal) {
        this.showFormEvent = false
      }
    },
    functionItem(newVal) {
      this.functionItem = newVal
    }
  },

  created() {
    this.$bus.$on('itemEdited', editedData => {
      this.$fetch()
    })
  },

  /**
   * Mounted event.
   */
  mounted() {
    Promise.all([
      this.getMstLevel(),
      this.getMstEvents(),
      this.getFunctions()
    ])
  },

  updated() {
    const tbody = this.$el.querySelector('.function-event')
    const item = tbody.querySelector(`#event_${this.$route.query.function_event_id}`)
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  },
  methods: {
    formatData(item) {
      const formattedItem = { ...item }

      if (item.functionEventLogical) {
        const logicMap = new Map()

        item.functionEventLogical.forEach(logic => {
          logic.children = []
          logic.parentId = logic.parent_logic_pk
          logicMap.set(logic.logic_pk, logic)
        })
        item.functionEventLogical.forEach(logic => {
          const parentLogic = logicMap.get(logic.parentId)
          if (parentLogic) {
            parentLogic.children.push(logic)
          }
        })

        formattedItem.functionEventLogical = item.functionEventLogical.filter(logic => !logic.parentId)
        formattedItem.functionEventLogical.forEach(logic => {
          delete logic.parentId
        })
      }

      return formattedItem
    },

    async getMstLevel() {
      try {
        const mstEvent = await this.$api.mstEventLevel.list()
        this.mstEventLevelData = mstEvent.data.result.data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    onChangeSwitch() {
      this.$fetch()
    },
    /**
     * Expand all node
     */
    expandParent() {
      if (this.expandedKeys.length === this.getAllNodeKeys(this.data).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.data)
      }
    },

    /**
     * Get all node key
     */
    getAllNodeKeys(nodes) {
      let keys = []
      for (const node of nodes) {
        if (Array.isArray(node) && node.length > 0) {
          keys = keys.concat(this.getAllNodeKeys(node))
        } else {
          keys.push(node.key)
          if (node.children && node.children.length > 0) {
            keys = keys.concat(this.getAllNodeKeys(node.children))
          }
        }
      }
      return keys
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    async changeLevel(event, field, value) {
      this.$store.dispatch('setLoading', true)
      try {
        const data = {
          [field]: value
        }
        await this.$api.functionEvent.updateLevel(event[0].data_node.id, data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list functionItem
     */
    async getMstEvents() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstEvent.list({ params })
        this.mstEvents = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list function
     */
    async getFunctions() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          isFunctionGoto: true
        }
        const { data: { result: { data } } } = await this.$api.function.list({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    getLevelName(value) {
      if (this.mstEventLevelData.length > 0) {
        const find = this.mstEventLevelData.find(item => item.id === value)
        if (find) {
          return find.name
        }
      }
    },

    /**
     * Show drawer and add event
     */
    addEvent() {
      this.$refs.drawerEventLogic.showDrawer(null)
      this.showFormEvent = true
    },

    /**
     * Show drawer and add logic
     */
    showDrawer(key, parent, data) {
      this.$refs.drawerEventLogic.showDrawer(parent, data)
      if (data.functionEventLogical) {
        this.showFormEvent = true
      }
    },

    save() {
      this.$fetch()
      this.$emit('save')
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Hide form event
     */
    close() {
      this.showFormEvent = false
    },

    async autoClassifyLevel() {
      this.$store.dispatch('setLoading', true)
      try {
        const dataAuto = []
        this.data.forEach(event => {
          const item = event[0]
          const data = {
            id: item.data_node.id,
            event_pk: item.data_node.event_pk,
            item_pk: item.data_node.item_pk,
            mst_event_id: item.data_node.mst_event_id,
            project_id: this.$store.state.project.id,
            function_id: Number(this.function_id),
            version_code: Number(this.version_code),
            level_front_end: null,
            level_back_end: null
          }
          const mstItemTypeName = item.data_node.functionItem.mstItemType.name
          // Put Logic Valid auto in array to update
          const insertData = (dataAuto, item, data) => {
            if (item.children.length === 1 && item.children[0].data_node.logic_type === LOGIC_TYPE_VALUE.goto) {
              data.level_front_end = this.mstEventLevelData[0].id
              data.level_back_end = this.mstEventLevelData[0].id
              this.pushData(dataAuto, item, data)
            } else if (item.data_node.functionItem.mstItemType.name === 'paginate') {
              data.level_front_end = this.mstEventLevelData[0].id
              data.level_back_end = this.mstEventLevelData[0].id
              this.pushData(dataAuto, item, data)
            } else if (item.data_node.mstEvent.name === 'onload' && !AUTO_LOGIC_TYPE_NOT_IN.includes(mstItemTypeName)) {
              data.level_front_end = this.mstEventLevelData[1].id
              data.level_back_end = this.mstEventLevelData[1].id
              this.pushData(dataAuto, item, data)
            } else if (item.data_node.mstEvent.name === 'onload' && AUTO_LOGIC_TYPE_NOT_IN.includes(mstItemTypeName)) {
              data.level_front_end = this.mstEventLevelData[0].id
              data.level_back_end = this.mstEventLevelData[0].id
              this.pushData(dataAuto, item, data)
            }
          }
          if (!this.overWriteLevelFlg) {
            if (item.level_back_end === null || item.level_front_end === null) {
              insertData(dataAuto, item, data)
            }
          } else if (this.overWriteLevelFlg) {
            insertData(dataAuto, item, data)
          }
        })

        if (dataAuto.length > 0) {
          await this.$api.functionEvent.autoClassifyLevel(dataAuto)
          this.$notification.success({
            message: this.$t('text.successfully')
          })
          this.$fetch()
        } else {
          this.$notification.info({
            message: this.$t('module.tab_logic.auto_classify_level_error_mess')
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    pushData(dataAuto, item, data) {
      // if event has defined one of two levels, keep old level
      if (item.level_back_end === null && item.level_front_end !== null) {
        data.level_front_end = item.level_front_end
      } else if (item.level_front_end === null && item.level_back_end !== null) {
        data.level_back_end = item.level_back_end
      }
      dataAuto.push(data)
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .tree__menu {
    [role="treeitem"] {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .ant-tree-switcher-icon {
        vertical-align: middle;
        font-size: 20px !important;
      }
      .ant-tree-switcher {
        flex: 0 0 auto;
      }
      .ant-tree-node-content-wrapper {
        flex: 1 1 auto;
        height: auto;
      }
      .ant-tree-child-tree {
        flex: 1 1 100%;
        width: 100%;
      }
      span[draggable="true"] {
        line-height: 24px;
      }
      .ant-tree-node-content-wrapper {
        height: auto;
      }
      .ant-tree-title {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        &:active {
            background-clip: #bae7ff;
          }
        .menu-tree__title {
          flex: 1 1 auto;
        }
        .menu-tree__action {
          flex: 0 0 auto;
          width: 90px;
        }
      }
    }
  }
  .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #ffffff;
  }
  .title {
    white-space: pre-line;
    display: block;
  }

  .crossed-out {
    text-decoration: line-through;
  }
  .switch-btn {
    margin-right: 15px;
  }
}
.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 10px 10px;
  word-wrap: break-word;
}
.thead-dark {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  > tr > td {
    border: 1px solid #e8e8e8;
    padding: 10px 10px;
    word-wrap: break-word;
    word-break: break-all;
    transition: background 0.3s;
    cursor: pointer;
  }
}
.table-wrap {
  width: 100%;
  table th:first-child,
  table td:first-child {
    width: 8%;
  }

  table th:nth-child(2),
  table td:nth-child(2) {
    width: 8%;
  }

  table th:nth-child(3),
  table td:nth-child(3) {
    width: 42%;
  }

  table th:nth-child(4),
  table td:nth-child(4) {
    width: 42%;
  }
}
.auto-btn {
  background-color: $warning-color;
}
</style>
