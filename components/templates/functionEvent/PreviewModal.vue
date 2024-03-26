<template>
  <a-modal
    :visible="openModal"
    :width="900"
    :dialog-style="{ top: '200px' }"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-button
            html-type="button"
            type="primary"
            class="min-w-100"
            title="Mở tất cả"
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
          <div class="tree__menu p-4">
            <a-form-model
              ref="form"
              :model="this"
              :label-col="{ sm: 6 }"
              :wrapper-col="{ sm: 18 }"
              @submit.prevent="confirm"
            >
              <a-tree
                :tree-data="descriptionLogicData"
                :expanded-keys="expandedKeys"
                :auto-expand-parent="autoExpandParent"
                @expand="onExpand"
              />
              <div class="text-center p-3">
                <a-button
                  html-type="submit"
                  type="primary"
                  :disabled="loading"
                  :title="isUpdate ? 'Cập nhật': 'Tạo mới'"
                  class="min-w-100"
                >
                  {{ isUpdate ? $t('common.update') : $t('common.create') }}
                </a-button>

            &nbsp;
                <a-button
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  title="Huỷ bỏ"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </a-button>
              </div>
            </a-form-model>
          </div>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE } from '~/constants'

export default {
  props: {
    versionCode: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      descriptionLogicData: [],
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      expandedKeys: [],
      autoExpandParent: true,
      event: {},
      visible: false,
      isUpdate: false,
      loading: false
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data, event, isUpdate) {
      this.descriptionLogicData = data
      this.openModal = true
      this.event = event
      this.isUpdate = isUpdate
      this.getDataPreview(data)
    },

    getDataPreview(data) {
      const tree = []

      const formatNameNode = (dataNodes, keyNode) => {
        const objNode = {
          title: dataNodes.line,
          key: dataNodes.e_id,
          children: [],
          p_id: dataNodes.p_id,
          function_goto_id: dataNodes.function_goto_id,
          if_p_id: dataNodes.if_p_id,
          tpye_line: dataNodes.tpye_line
        }
        return objNode
      }
      const buildNode = (dataNode, parentNode) => {
        const objNode = formatNameNode(dataNode, parentNode ? parentNode.key + '-' + dataNode.line : dataNode.line)
        if (parentNode) {
          parentNode.children.push(objNode)
        } else {
          tree.push(objNode)
        }
        if (dataNode.block) {
          dataNode.block.forEach(item => {
            buildNode(item, objNode)
          })
        }
      }

      const buildTree = nodes => {
        nodes.forEach(item => {
          buildNode(item, null)
        })
        return tree
      }

      this.descriptionLogicData = buildTree(this.descriptionLogicData)
    },

    /**
     * Expand all node
     */
    expandParent() {
      if (this.expandedKeys.length === this.getAllNodeKeys(this.descriptionLogicData).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.descriptionLogicData)
      }
    },

    /**
     * Get all node key
     */
    getAllNodeKeys(nodes) {
      let keys = []
      for (const node of nodes) {
        keys.push(node.key)
        if (node.children && node.children.length > 0) {
          keys = keys.concat(this.getAllNodeKeys(node.children))
        }
      }
      return keys
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    close() {
      this.openModal = false
    },
    async confirm() {
      this.loading = true
      if (this.event.functionEventLogical && this.event.functionEventLogical.length > 0) {
        const logicPKs = []
        for (const logic of this.event.functionEventLogical) {
          logicPKs.push(logic.logic_pk)
        }
        const params = {
          project_id: this.event.project_id,
          function_id: this.event.function_id,
          version_code: this.event.version_code,
          event_pk: this.event.event_pk,
          logic_pks: logicPKs
        }
        const { data: { result: { data } } } = await this.$api.functionTestCase.list({ params })
        if (data.length > 0) {
          this.$confirm({
            title: this.$t('module.functionEventLogical.confirm_update_logic'),
            okText: this.$t('common.yes'),
            okType: 'danger',
            cancelText: this.$t('common.no'),
            onOk: () => this.handleSubmit()
          })
        } else {
          this.handleSubmit()
        }
      } else {
        this.handleSubmit()
      }
    },
    async handleSubmit() {
      try {
        const keyMap = {}
        let dataLogic = []
        const tree = this.descriptionLogicData
        tree.forEach(function(item) {
          keyMap[item.key] = item
        })

        // Duyệt qua mảng và thêm các mảng elseif và else vào children của đối tượng if tương ứng
        tree.forEach(function(item) {
          if (item.if_p_id > 0) {
            const parent = keyMap[item.if_p_id]
            if (parent) {
              parent.children.push(item)
            }
          }
        })

        // Loại bỏ các phần tử có tiêu đề bắt đầu bằng elseif và else khỏi mảng
        dataLogic = tree.filter(function(item) {
          return !item.title.toLowerCase().startsWith('else')
        })

        const data = this.event
        data.logic = dataLogic
        await this.$api.functionEventLogical.createLogic(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.close()
        setTimeout(() => {
          this.$emit('onClose')
        }, 500)
        this.$emit('save')
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .tree__menu {
    [role="treeitem"] {
      .ant-tree-node-content-wrapper {
        height: auto;
      }
      .ant-tree-title {
        white-space: pre-line;
      }
    }
  }
}
</style>
