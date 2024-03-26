<template>
  <a-modal
    :visible="openModal"
    :width="980"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-tree
            :key="treeKey"
            v-model="checkedKeys"
            draggable
            :expanded-keys.sync="expandedKeys"
            :load-data="onLoadData"
            :tree-data="treeData"
          >
            <template slot="title" slot-scope="{ id, type, property_type, class_id, tree_id, name }">
              <div class="title-tree" @dblclick="showDiagram(id, type, property_type, class_id, tree_id, name)">
                <div class="title">
                  {{ name }}
                </div>
              </div>
            </template>
          </a-tree>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { PROPERTY_TYPE_VALUE } from '~/constants'

export default {
  mixins: [DataForm],

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

  props: {
  },

  /**
     * Init data for component.
     */
  data: () => ({
    resource: 'question',
    openModal: false,
    loadModal: false,
    visible: false,
    treeData: [],
    checkedKeys: [],
    selectedKeys: [],
    branch_id: 0,
    expandedKeys: [],
    treeKey: 0,
    PROPERTY_TYPE_VALUE,
    model: {
      tree_id: undefined,
      class_id: undefined,
      class_property_id: undefined,
      path_name: '',
      class_name: '',
      property_name: ''
    }
  }),

  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
      }
    }
  },

  /**
     * Mounted event.
     */
  mounted() {
  },

  /**
     * List of methods.
     */
  methods: {
    async open(branchId) {
      this.branch_id = branchId
      this.treeData = []
      await this.getListTree(branchId)
      this.openModal = true
    },

    close() {
      this.openModal = false
    },

    async getListTree(branchId) {
      this.treeKey = this.generateRandomSixDigitNumber()
      const params = {
        project_id: this.$store.state.project.id,
        branch_id: branchId,
        order_by: 'sort',
        order_type: 1,
        all: true,
        parent_id: 0
      }
      const { data: { result: { data } } } = await this.$api.tree.list({ params })
      this.treeData = data
    },

    generateRandomSixDigitNumber() {
      return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    },

    showDiagram(id, type, propertyType, classId, treeId, name) {
      if (type === 'properties') {
        if (propertyType === PROPERTY_TYPE_VALUE.function) {
          this.model.class_id = classId
          this.model.class_property_id = id.toString().match(/\d+/)[0]
          this.model.property_name = name
        }
      }
      if (this.model.tree_id !== undefined && this.model.class_id !== undefined && this.model.class_property_id !== undefined) {
        this.$emit('choose-function', this.model)
      }
    },

    async onLoadData(treeNode) {
      this.model = {
        tree_id: undefined,
        class_id: undefined,
        class_property_id: undefined,
        path_name: this.model.path_name,
        class_name: this.model.class_name,
        property_name: this.model.property_name
      }
      if (treeNode.dataRef.type === 'properties') {
        return
      }
      if (treeNode.dataRef.children) {
        this.treeData = [...this.treeData]
        return
      }
      if (treeNode.dataRef.tree_id) {
        this.model.class_name = treeNode.dataRef.name
        this.model.tree_id = treeNode.dataRef.tree_id
        const params = {
          class_id: +treeNode.dataRef.id.toString().match(/\d+/)[0],
          project_id: this.$store.state.project.id || undefined,
          order_by: 'sort',
          order_type: 1,
          all: true
        }
        const { data: { result: { data } } } = await this.$api.classProperties.list({ params })
        treeNode.dataRef.children = data
        this.treeData = [...this.treeData]
      } else {
        this.model.path_name = treeNode.dataRef.path_name
        try {
          const params = {
            parent_id: treeNode.dataRef.id,
            project_id: this.$store.state.project.id || undefined,
            order_by: 'sort',
            order_type: 1,
            all: true
          }

          const [result1, result2] = await Promise.all([
            this.getListClass(treeNode.dataRef.id),
            await this.$api.tree.list({ params })
          ])

          const mergedResult = [...result1.data.result.data, ...result2.data.result.data]
          const data = mergedResult.sort((a, b) => a.sort - b.sort)
          treeNode.dataRef.children = data
          this.treeData = [...this.treeData]
        } catch (error) {
          console.warn(error)
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      }
    },

    async getListClass(treeId) {
      try {
        const params = {
          tree_id: treeId,
          project_id: this.$store.state.project.id || undefined,
          order_by: 'sort',
          order_type: 1,
          all: true
        }

        return await this.$api.classes.list({ params })
      } catch (error) {

      }
    },

    /**
       * Get model
       *
       * @returns {Object}
       */
    getModel() {
      const model = {
        category: this.model.category,
        context: this.model.context,
        created_at: this.model.created_at,
        function_id: this.model.function_id,
        title: this.model.title,
        id: this.model.id,
        is_deleted: this.model.is_deleted,
        item_pk: this.model.item_pk,
        project_id: this.model.project_id,
        question: this.model.question,
        status: this.model.status,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code
      }

      return model
    },

    /**
       * Filter in select box
       */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
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
