<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="expandParent"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.erGroup.expand_all_node') }}
        </a-button>
      </template>
      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          @click="openAddGroupModal"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.erGroup.new') }}
        </a-button>
      </template>
      <a-col
        :span="12"
        :md="12"
      >
        <a-tree
          :tree-data="listErGroup"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
        >
          <template
            slot="tree_parent"
            slot-scope="{ key, parent, data_node, title }"
          >
            <span @click="openAddNewErToGroupModal(data_node.id)">
              {{ title }}
            </span>
          </template>
        </a-tree>
      </a-col>
    </a-card>
    <er-group-form ref="erGroupCreateForm" @save="saveNewGroup" />
    <er-group-add-entity-form :id="currentId" ref="erGroupAddEntityForm" @save="saveNewGroup" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ErGroupForm from '~/components/templates/erGroup/ErGroupForm'
import ErGroupAddEntityForm from '~/components/templates/erGroup/ErGroupAddEntityForm'
export default {
  components: {
    ErGroupForm,
    ErGroupAddEntityForm
  },

  /**
   * Init data for component.
   */
  data: () => ({
    listErGroup: [],
    expandedKeys: [],
    currentId: 0,
    autoExpandParent: true
  }),

  /**
   * Computed event.
   */
  computed: {
    ...mapState({
      loading: 'loading'
    })
  },

  created() {
    this.fetchDataErGroup()
  },

  mounted() {
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        name: this.model.name,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    /**
     * Fetch data Er Group
     */
    async fetchDataErGroup() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          project_id: this.$store.state.project.id,
          show_entity: true
        }
        const { data: { result: { data } } } = await this.$api.erGroup.list({ params })
        this.listErGroup = []
        if (data.length > 0) {
          data.forEach(item => {
            const objNode = {
              title: '',
              key: '',
              children: [],
              parent: null,
              data_node: null,
              scopedSlots: {
                title: 'tree_parent'
              }
            }
            objNode.title = item.name
            objNode.key = 'group_' + item.id
            objNode.parent = 0
            objNode.data_node = item
            item.entities.forEach(childEntity => {
              const childNode = {
                title: childEntity.name,
                key: 'child_' + childEntity.id,
                children: [],
                parent: objNode.data_node.id,
                data_node: childEntity,
                scopedSlots: {
                  title: 'tree_children'
                }
              }
              objNode.children.push(childNode)
            })
            this.listErGroup.push(objNode)
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

    /**
     * Open modal add new er group
     */
    openAddGroupModal() {
      this.$refs.erGroupCreateForm.open()
    },

    /**
     * On saving new er group
     */
    saveNewGroup() {
      this.fetchDataErGroup()
    },

    openAddNewErToGroupModal(id) {
      this.currentId = id
      this.$refs.erGroupAddEntityForm.open()
    },

    /**
     * Expand all node
     */
    expandParent() {
      if (this.expandedKeys.length === this.getAllNodeKeys(this.listErGroup).length) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeKeys(this.listErGroup)
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
