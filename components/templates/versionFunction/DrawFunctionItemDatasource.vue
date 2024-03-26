<template>
  <div>
    <a-drawer
      :title="drawerTitle"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <div v-if="dataNode.id" class="action">
        <a-button
          v-if="dataNode.data_type === DATA_TYPE_VALUE.object || dataNode.data_type === DATA_TYPE_VALUE.array"
          type="primary"
          html-type="button"
          @click="addApiParameterChild()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.api.add_api_parameter') }}
        </a-button>
        <a-button
          v-if="dataNode.data_type === DATA_TYPE_VALUE.object || dataNode.data_type === DATA_TYPE_VALUE.array"
          type="primary"
          html-type="button"
          @click="update()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.api.update_api_parameter') }}
        </a-button>
        <a-button
          html-type="button"
          type="danger"
          size="small"
          :disabled="loading"
          @click="confirmToDelete(dataNode.id)"
        >
          <font-awesome-icon icon="trash-alt" class="mr-1" />
          {{ $t('Xoá') }}
        </a-button>
      </div>
      <div>
        <div>
          <FunctionItemReadDatasourceForm />
          <FunctionItemWriteDatasourceForm />
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import FunctionItemReadDatasourceForm from '~/components/templates/functionItemReadDatasource/FunctionItemReadDatasourceForm'
import FunctionItemWriteDatasourceForm from '~/components/templates/functionItemWriteDatasource/FunctionItemWriteDatasourceForm'
import { USE_FLG_VALUE, LOGIC_TYPE_VALUE, LOGIC_TYPE_SELECT, DATA_TYPE_VALUE } from '~/constants'

export default {
  components: {
    FunctionItemReadDatasourceForm,
    FunctionItemWriteDatasourceForm
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
      disableElse: false
    }
  },
  /**
       * Computed event.
       */
  computed: {
  },
  watch: {
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
      this.$emit('save')
      this.onClose()
    },

    /**
         * Closes the drawer and resets variables.
         */
    onClose() {
      this.visible = false
      this.id = 0
      this.$emit('close')
    },

    /**
         * Updates the form based on the current data node.
         */
    update() {
      this.id = this.dataNode.id
    },

    /**
         * Confirm to delete
         *
         * @param {Number} id
         */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id)
      })
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
