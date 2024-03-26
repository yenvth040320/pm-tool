<template>
  <div>
    <a-drawer
      :title="drawerTitle"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div>
        <div>
          <ApiParameterForm
            v-if="version.id"
            :id="id"
            :data-node="dataNode"
            :parent="parent"
            :version="version"
            :db-schemas="dbSchemas"
            :db-tables="dbTables"
            :db-columns="dbColumns"
            :db-table-versions="dbTableVersions"
            :is-parameter-json="isParameterJson"
            :list-api-parameters="listApiParameters"
            @save="save"
            @onClose="onClose"
          />
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import ApiParameterForm from './ApiParameterForm.vue'
import { USE_FLG_VALUE, LOGIC_TYPE_VALUE, LOGIC_TYPE_SELECT, DATA_TYPE_VALUE } from '~/constants'

export default {
  components: {
    ApiParameterForm
  },
  props: {
    showFormEvent: {
      type: Boolean,
      default: false
    },
    version: {
      type: [Object],
      default: () => {}
    },
    dbSchemas: {
      type: [Array],
      default: () => []
    },
    dbTables: {
      type: [Array],
      default: () => []
    },
    dbColumns: {
      type: [Array],
      default: () => []
    },
    dbTableVersions: {
      type: [Array],
      default: () => []
    },
    isJson: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      resource: 'apiParameter',
      USE_FLG_VALUE,
      LOGIC_TYPE_VALUE,
      LOGIC_TYPE_SELECT,
      DATA_TYPE_VALUE,
      internalShowFormEvent: this.showFormEvent,
      dataNode: {},
      id: 0,
      loading: false,
      typeLogic: null,
      forceUpdate: false,
      drawerTitle: '',
      formCurrent: '',
      parent: {},
      disableElse: false,
      isParameterJson: this.isJson,
      listApiParameters: []
    }
  },
  /**
     * Computed event.
     */
  computed: {
  },
  watch: {
    isJson(newVal) {
      this.isParameterJson = newVal
    }
  },
  /**
     * Mounted event.
     */
  mounted() {
  },
  methods: {
    /**
       * Shows the drawer and sets the data for editing.
       */
    open(data) {
      this.id = 0
      this.dataNode = {}
      this.parent = {}
      if (data) {
        this.listApiParameters = data
        this.drawerTitle = this.$t('common.update') + ' ' + this.$t('module.apiParameter')
      } else {
        this.listApiParameters = []
        this.drawerTitle = this.$t('common.create') + ' ' + this.$t('module.apiParameter')
      }
      this.visible = true
    },
    /**
       * Shows the drawer and sets the data for editing.
       */
    showDrawer(parent, data) {
      if (data) {
        this.id = data.id
        this.dataNode = data
        this.parent = parent
        this.drawerTitle = this.$t('common.update') + ' ' + this.$t('module.apiParameter')
      } else {
        this.drawerTitle = this.$t('common.create') + ' ' + this.$t('module.apiParameter')
        this.id = 0
        this.dataNode = {}
        this.parent = {}
      }
      this.visible = true
    },

    /**
     * Add api parameter
     */
    addApiParameterChild() {
      this.id = 0
    },

    /**
       * Saves the changes by emitting a 'save' event.
       */
    save() {
      this.onClose()
      this.$emit('save')
    },

    /**
       * Closes the drawer and resets variables.
       */
    onClose() {
      this.visible = false
      this.listApiParameters = []
      this.id = 0
    },

    /**
       * Updates the form based on the current data node.
       */
    update() {
      this.id = this.dataNode.id
    },

    /**
       * Delete record
       *
       * @param {Number} id
       */
    async deleteRecord(id) {
      this.loading = true

      try {
        if (id) {
          await this.$api.apiParameter.delete(id)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.onClose()
        this.$emit('save')
      } catch (_) {
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
    :deep() {
      .ant-form-item {
          margin-bottom: 24px;
      }
      .action {
        .ant-btn-danger {
          height: 31.99px;
          padding: 0 10px;
        }
      }
    }
    </style>
