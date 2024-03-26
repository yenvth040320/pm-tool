<template>
  <div>
    <a-form-model
      ref="form"
      :model="model"
      :label-col="{ sm: 2 }"
      :wrapper-col="{ sm: 22 }"
      @submit.prevent="handleSubmit"
    >
      <a-spin :spinning="loading">
        <div class="p-4">
          <a-row
            type="flex"
            :gutter="30"
          >
            <a-col
              :span="24"
              :md="24"
              :xxl="24"
            >
              <a-form-model-item
                :label="$t('module.function.description')"
                prop="description"
              >
                <a-textarea
                  v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                  v-model="model.description"
                  :rows="5"
                  :placeholder="$t('module.function.description')"
                />
                <div v-else>
                  {{ model.description }}
                </div>
                <a-button
                  v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                  html-type="submit"
                  type="primary"
                  :title="id ? 'Cập nhật' : 'Tạo mới'"
                  class="min-w-100 update"
                >
                  {{ id ? $t('common.update') : $t('common.create') }}
                </a-button>
              </a-form-model-item>
              <a-form-model-item
                :label="$t('module.function.short_name')"
                prop="short_name"
              >
                <a-input
                  v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                  v-model="model.short_name"
                  :rows="5"
                  :placeholder="$t('module.function.short_name')"
                />
                <div v-else>
                  {{ model.short_name }}
                </div>
                <a-button
                  v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
                  html-type="submit"
                  type="primary"
                  :title="id ? 'Cập nhật' : 'Tạo mới'"
                  class="min-w-100 update"
                >
                  {{ id ? $t('common.update') : $t('common.create') }}
                </a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-spin>
    </a-form-model>
    <div class="layout">
      <div class="heading-text pb-4">
        {{ $t('module.versionFunction.layout_tab') }}
      </div>
      <a-upload
        v-model="funtionImage"
        list-type="picture-card"
        class="upload-img only-read"
        :file-list="fileList"
      />
    </div>
    <div class="container-detail">
      <div class="heading-text pb-4">
        {{ $t('module.function.detail') }}
      </div>
      <a-table
        ref="mainTable"
        bordered
        :data-source="functionItemData"
        :row-key="record => record.id"
        :pagination="false"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: 1080 }"
        class="main-table"
      >
        <template
          slot="item_num"
          slot-scope="text, record"
        >
          <a-icon type="link" @click="copyItem(record.id)" />
          {{ record.item_num }}
        </template>
        <template
          slot="mst_item_type_id"
          slot-scope="text, record"
        >
          <span>
            {{ record.mstItemType ? record.mstItemType.name : '' }}
          </span>
        </template>
        <template
          slot="property"
          slot-scope="text, record"
        >
          <div v-if="record.functionItemProperties.length > 0">
            <span v-for="(item, index) in record.functionItemProperties" :key="index">
              <span v-if="index !== record.functionItemProperties.length - 1">{{ item?.mst_item_property?.name + ': ' + item.value + ', ' }}</span>
              <span v-else>{{ item?.mst_item_property?.name + ': ' + item.value }}</span>
            </span>
          </div>
        </template>
        <template
          slot="validation"
          slot-scope="text, record"
        >
          <div v-if="record.functionItemValidation.length > 0">
            <div v-for="(item, index) in record.functionItemValidation" :key="index">
              <p v-if="item.mst_item_property_id">
                {{ item?.mst_item_property?.name + ': ' + item.content_check }}
              </p>
              <p v-else>
                {{ item.content_check }}
              </p>
            </div>
          </div>
        </template>
        <template
          slot="logic"
          slot-scope="text, record"
        >
          <div v-if="record.functionEvent.length > 0" class="tree__menu">
            <a-tree
              :tree-data="treeData(record.functionEvent)"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              @expand="onExpand"
            >
              <template
                slot="action"
                slot-scope="{ title, key }"
              >
                <div class="menu-tree__title" @click="onExpand(key, title, true)">
                  <span class="title">{{ $t(title) }}</span>
                </div>
              </template>
            </a-tree>
          </div>
        </template>
      </a-table>
    </div>
    <div class="container-detail pt-4">
      <div class="heading-text pb-4">
        {{ $t('module.api.list') }}
      </div>
      <a-table
        bordered
        :data-source="apiUsed"
        :row-key="record => record.id"
        :pagination="false"
        :columns="apiColumns"
        :loading="loading"
        :scroll="{ x: 1080 }"
        class="main-table"
      >
        <template
          slot="api_category"
          slot-scope="text, record"
        >
          <span>
            {{ record.apiCategory?.name }}
          </span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { USE_FLG, USE_FLG_VALUE, API_ROOT_URL, LOCK_FLG_VALUE, SORT, LOGIC_TYPE_VALUE } from '~/constants'

export default {
  mixins: [DataForm],
  props: {
    versionId: {
      type: [Number, String],
      default: 0
    },
    version: {
      type: [Object],
      default: () => {}
    },
    functionItem: {
      type: [Array],
      default: () => []
    },
    mstType: {
      type: [Array],
      default: () => []
    },
    mstProperty: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'function',
    category: {},
    project: {},
    USE_FLG,
    USE_FLG_VALUE,
    fileList: [],
    API_ROOT_URL,
    funtionImage: [],
    LOCK_FLG_VALUE,
    functionItemProperties: [],
    SORT,
    LOGIC_TYPE_VALUE,
    autoExpandParent: true,
    expandedKeys: [],
    currentVersion: {},
    functionItemData: [],
    apiUsed: []
  }),

  /**
   * Computed event.
   */
  computed: {
    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    header() {
      return [
        {
          title: this.$t('module.functionItem.item_num'),
          dataIndex: 'item_num',
          scopedSlots: { customRender: 'item_num' },
          width: 80,
          align: 'center'
        },
        {
          title: this.$t('module.functionItem.mst_item_type_id'),
          scopedSlots: { customRender: 'mst_item_type_id' },
          dataIndex: 'mst_item_type_id',
          align: 'left',
          width: 100
        },
        {
          title: this.$t('module.functionItem.name'),
          dataIndex: 'name',
          width: 150
        },
        {
          title: this.$t('module.functionItem.property'),
          scopedSlots: { customRender: 'property' }
        },
        {
          title: this.$t('module.functionItemValidation'),
          dataIndex: 'validation',
          scopedSlots: { customRender: 'validation' }
        },
        {
          title: this.$t('module.functionEventLogical.logic_pk'),
          dataIndex: 'logic',
          scopedSlots: { customRender: 'logic' }
        }
      ]
    },
    apiColumns() {
      return this.headerApi.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },
    headerApi() {
      return [
        {
          title: this.$t('module.api.numerical_order'),
          width: 80,
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$t('module.apiCategory'),
          scopedSlots: { customRender: 'api_category' }
        },
        {
          title: this.$t('module.api.code'),
          dataIndex: 'code'
        },
        {
          title: this.$t('module.api.api_name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        }
      ]
    }
  },

  watch: {
    'version.images': {
      handler(newValue) {
        this.funtionImage = newValue
        this.fileList = newValue.map(item => ({
          uid: item.id,
          url: API_ROOT_URL + item.image_path,
          name: item.image_path
        }))
      },
      deep: true
    },
    functionItem: {
      immediate: true,
      handler(newVal) {
        this.getFunctionItemData(newVal)
      }
    },
    mstType(newVal) {
      this.mstType = newVal
    },
    mstProperty(newVal) {
      this.mstProperty = newVal
    }
  },

  created() {
  },

  /**
   * Mounted event.
   */
  mounted() {
    if (this.version) {
      this.funtionImage = this.version.images
      this.fileList = []
      this.fileList = this.funtionImage.map(item => ({
        uid: item.id,
        url: API_ROOT_URL + item.image_path,
        name: item.image_path
      }))
    }
    this.getApiUsed()
  },

  updated() {
    const table = this.$refs.mainTable.$el
    const tbody = table.querySelector('.ant-table-tbody')
    const item = tbody.querySelector(`[data-row-key="${this.$route.query.function_item_id}"]`)
    if (item) {
      item.scrollIntoView()
    }
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get api used
     */
    async getApiUsed() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.version_code = this.version.version_code
        params.function_id = this.version.function_id
        params.isApiUse = true
        params.not_limit = true
        const {
          data: {
            result: { data }
          }
        } = await this.$api.api.listApiUsed({ params })
        this.apiUsed = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },
    /**
     * Get function item data.
     */
    getFunctionItemData(newVal) {
      this.functionItemData = newVal.filter(record => record.use_flg === USE_FLG_VALUE.yes)
    },
    formatData(item) {
      const formattedItem = { ...item }

      if (item.functionEventLogical) {
        const logicMap = new Map() // Sử dụng Map để lưu trữ đối tượng logic theo logic_pk

        // Xây dựng Map cho các đối tượng logic
        item.functionEventLogical.forEach(logic => {
          logic.children = [] // Khởi tạo mảng children rỗng
          logic.parent = null // Khởi tạo parent là null
          logicMap.set(logic.logic_pk, logic)
        })

        // Liên kết các đối tượng con và cha với nhau
        item.functionEventLogical.forEach(logic => {
          const parentLogic = logicMap.get(logic.parent_logic_pk)
          if (parentLogic) {
            parentLogic.children.push(logic) // Thêm logic vào mảng children của parent
            logic.parent = parentLogic // Gán parent cho logic
          }
        })

        // Lọc ra các đối tượng gốc (không có parent) để trả về dưới dạng cây dữ liệu
        formattedItem.functionEventLogical = item.functionEventLogical.filter(logic => !logic.parent)
      }

      return formattedItem
    },
    /**
     * Tree data
     */
    treeData(data) {
      const newData = data.map(item => this.formatData(item))

      const tree = []

      const formatNameNode = (dataNodes, type, keyNode) => {
        const objNode = {
          title: '',
          key: keyNode,
          children: [],
          parent: null,
          data_node: null,
          scopedSlots: {
            title: 'action'
          }
        }
        if (type === 0) { // data event
          objNode.title = dataNodes.function_item.name + ': On => ' + dataNodes.mst_event.name
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

      const buildNode = (dataNodes, parentNodes) => {
        let objNode = null
        if (parentNodes == null) {
          objNode = formatNameNode(dataNodes, 0, dataNodes.event_pk)
          objNode.data_node = dataNodes
          tree.push(objNode)
          dataNodes.function_event_logicals?.forEach(item => {
            buildNode(item, objNode)
          })
        } else {
          objNode = formatNameNode(dataNodes, 1, parentNodes.key + '-' + dataNodes.logic_pk)
          objNode.data_node = dataNodes
          objNode.parent = parentNodes
          parentNodes.children.push(objNode)
          dataNodes.children?.forEach(item => {
            if (item.logic_type > LOGIC_TYPE_VALUE.if) {
              buildNode(item, objNode.parent)
            } else {
              buildNode(item, objNode)
            }
          })
        }
      }

      const buildTree = nodes => {
        nodes.forEach(item => {
          buildNode(item, null)
        })

        return tree
      }

      return buildTree(newData)
    },

    /**
     * Expand all node
     */
    expandParent(data) {
      if (this.expandedKeys.length === this.getAllNodeKeys(data).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(data)
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

    onExpand(expandedKeys, title, click) {
      if (click) {
        const expandedIndex = this.expandedKeys.indexOf(expandedKeys)
        if (expandedIndex > -1) {
          // Dòng đã được mở rộng, thu gọn nó
          this.expandedKeys.splice(expandedIndex, 1)
        } else {
          // Dòng chưa được mở rộng, mở rộng nó
          this.expandedKeys.push(expandedKeys)
        }
      } else {
        this.expandedKeys = expandedKeys
      }

      this.autoExpandParent = false
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        category_id: this.$store.state.category.id,
        description: this.model.description,
        id: this.model.id,
        name: this.model.name,
        short_name: this.model.short_name
      }

      return model
    },

    /**
     * Copy Url
     */
    copyItem(itemId) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_item_id', itemId)
      url.hash = 'tab_info'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            if (this.model.id) {
              await this.repository.updateDescription(this.model.id, data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .tree__menu {
    [role="treeitem"] {
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
  .ant-upload-list-item-info::before {
    background: transparent;
  }
  .ant-upload-list-item-actions,
  .ant-upload-list-item-actions a {
    width: 100%;
    height: 100%;
    display: block;
  }
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-col {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  textarea {
    resize: none;
  }
  .upload-img {
    display: flex;
    flex-direction: column
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    span {
      .ant-upload-list-item {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .ant-upload-list-item-list-type-picture-card {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.only-read {
  :deep() {
    .anticon-delete {
      display: none;
    }
  }
}
.data-logic {
  text-align: justify;
  position: relative;
}
.heading-text {
  font-weight: 700;
  margin-left: 9px;
}
.expand-node {
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}
.title {
  white-space: pre-line;
  display: block;
}
.button-wrap {
  text-align: right;
}
.excel-btn {
  background-color: rgb(49,190,125);
}
</style>
