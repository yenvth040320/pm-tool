<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          type="primary"
          class="min-w-100"
          @click="addSequenceDiagram()"
        >
          <font-awesome-icon icon="plus-circle" class="mr-1" />
          {{ $t('common.create') }} {{ $t('module.sequenceDiagram') }}
        </a-button>
      </template>
      <template>
        <div>
          <div v-for="item in data" :key="item.id" />
        </div>

        <div v-if="!showSequence && !functionSequence.id" class="table-wrap">
          <table class="table table-striped" style="width: 100%;">
            <tbody>
              <tr v-for="item in data" :key="item.id">
                <td scope="row" class="info-function-item">
                  <span>
                    {{ item?.functionItem?.item_num }} . {{ item.functionItem.name }} On => {{ item.mstEvent.name }}
                  </span>
                </td>
                <td scope="row" class="action">
                  <a-button
                    html-type="button"
                    type="primary"
                    size="large"
                    @click="gotoShowSequence(item)"
                  >
                    <font-awesome-icon icon="eye" />
                  </a-button>

                  <a-button
                    html-type="button"
                    type="primary"
                    size="small"
                    title="Chỉnh sửa"
                    :disabled="loading"
                    @click="addSequenceDiagram(item)"
                  >
                    <font-awesome-icon icon="pencil-alt" />
                  </a-button>
                  <a-button
                    html-type="button"
                    type="danger"
                    size="small"
                    title="Xoá"
                    :disabled="loading"
                    @click="confirmToDelete(item.id)"
                  >
                    <font-awesome-icon icon="trash-alt" />
                  </a-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="tree__menu">
          <p>
            {{ $t('module.function_usecase.actor') }}:
            <span v-for="(actor, index) in functionSequence.actors" :key="index">
              {{ actor.name }}
              <span v-if="index < functionSequence.actors.length - 1">, </span>
            </span>
          </p>
          <p>
            {{ $t('module.api') }}: {{ functionSequence?.api?.code }} - {{ functionSequence?.api?.name }} / {{ functionSequence.api_version_code }}
          </p>
          <span>
            {{ functionSequence.functionItem.item_num }}. {{ functionSequence.functionItem.name }} On => {{ functionSequence.mstEvent.name }}
          </span>
          <a-row
            type="flex"
            :gutter="30"
          >
            <a-col
              :span="24"
              :md="6"
            >
              <a-tree
                v-if="dataEvent && dataEvent.length > 0"
                :tree-data="dataEvent[0]?.children"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                @expand="onExpand"
              >
                <template
                  slot="language"
                  slot-scope="{ title, isDisabled }"
                >
                  <div class="menu-tree__title" :class="{ 'crossed-out': isDisabled }">
                    <span class="title">{{ $t(title) }}</span>
                  </div>
                </template>
              </a-tree>
            </a-col>
            <a-col
              :span="24"
              :md="18"
            >
              <draw-sequence-diagram :item="functionSequence" />
            </a-col>
          </a-row>
          <div class="text-center p-3">
            <a-button
              html-type="button"
              type="primary"
              title="Quay lại"
              @click="goBack()"
            >
              {{ $t('common.back') }}
            </a-button>
          </div>
        </div>
      </template>
    </a-card>
    <CreateSequenceDiagram
      ref="createSequenceDiagram"
      :version="version"
      :function-items="functionItems"
      :mst-events="mstEvents"
      :item-function-sequence="itemFunctionSequence"
      @save="save"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import CreateSequenceDiagram from './CreateSequenceDiagram.vue'
import DataTable from '~/mixins/data-table'
import DrawSequenceDiagram from '~/components/templates/FunctionSequenceDiagram/DrawSequenceDiagram'
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE, USE_FLG_VALUE, AUTO_LOGIC_TYPE_NOT_IN } from '~/constants'
import AnalyticsCode from '~/mixins/analytics-code'

export default {
  /**
   * Declare components.
   */
  components: { CreateSequenceDiagram, DrawSequenceDiagram },
  mixins: [DataTable, AnalyticsCode],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.all = true
      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
    } catch (_) {
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
      resource: 'functionSequenceDiagram',
      visible: false,
      mstEvents: [],
      expandedKeys: [],
      showSequence: false,
      functionSequence: {},
      itemFunctionSequence: {},
      autoExpandParent: true,
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code
      },
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      AUTO_LOGIC_TYPE_NOT_IN,
      dataEvent: []
    }
  },
  computed: {
    ...mapState({
      loading: 'loading'
    })

  },
  watch: {
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getMstEvents()
  },

  updated() {
  },

  methods: {
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
     * Show drawer and add event
     */
    addSequenceDiagram(item) {
      if (item) {
        this.itemFunctionSequence = item
      }
      this.$refs.createSequenceDiagram.showDrawer(item)
    },

    save() {
      this.functionSequence = {}
      this.$fetch()
    },

    async gotoShowSequence(item) {
      this.functionSequence = item
      await this.getListLogic(item)
      this.showSequence = true
    },

    async getListLogic(item) {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: item.function_id,
          version_code: item.version_code,
          item_pk: item.item_pk,
          mst_event_id: item.mst_event_id,
          isTabLogic: true
        }
        const { data: { result: { data } } } = await this.$api.functionEvent.list({ params })
        const newData = data.map(item => this.formatData(item))

        const tree = []

        const formatNameNode = (dataNodes, type, keyNode, isParentDisabled) => {
          const objNode = {
            title: '',
            key: keyNode,
            children: [],
            parent: null,
            data_node: null,
            isDisabled: isParentDisabled
          }
          if (type === 0) {
            objNode.title = dataNodes.functionItem.item_num + '. ' + dataNodes.functionItem.name + ': (' + dataNodes.functionItem.mst_item_type.name + ') On => ' + dataNodes.mstEvent.name
            if (dataNodes.functionItem.use_flg === 0) {
              objNode.isDisabled = true
            } else {
              objNode.isDisabled = false
            }
          } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.sequence) {
            objNode.title = dataNodes.logic_detail
          } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.goto) {
            objNode.title = this.$t('module.functionEventLogical.goto') + ': ' + dataNodes.function_goto?.code + ' - ' + dataNodes.function_goto?.name
          } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.if) {
            objNode.title = this.$t('module.functionEventLogical.if') + ' (' + dataNodes.conditions + ')'
          } else if (dataNodes.logic_type === LOGIC_TYPE_VALUE.elseif) {
            objNode.title = this.$t('module.functionEventLogical.elseif') + ' (' + dataNodes.conditions + ')'
          } else {
            objNode.title = this.$t('module.functionEventLogical.else')
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
        const dataEvent = treeData.map(item => [item])
        this.dataEvent = dataEvent[0]
      } catch (error) {
        console.log(error)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

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

    goBack() {
      this.functionSequence = {}
      this.showSequence = false
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .ant-tree-icon-hide {
    overflow: auto;
  }
  .title {
    white-space: pre-line;
    display: block;
  }

  .crossed-out {
    text-decoration: line-through;
    width: 100%;
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
.info-function-item {
  width: 80%;
}
.menu-tree__title {
  flex: 1 1 auto;
  .title {
    white-space: pre-line;
    display: block;
  }
}
.action {
  width: 20%;
}
.auto-btn {
  background-color: $warning-color;
}
.ant-tree-switcher_close svg {
  transform: rotate(-90deg);
}
.crossed-out {
  text-decoration: line-through;
}

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
</style>
