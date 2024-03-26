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
          v-if="dataNode.functionEventLogical"
          type="primary"
          title="Tạo mới"
          html-type="button"
          class="button"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="addLogicParent()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEvent.add_logic') }}
        </a-button>
        <a-button
          v-if="!dataNode.functionEventLogical && dataNode.logic_type !== LOGIC_TYPE_VALUE.sequence && dataNode.logic_type !== LOGIC_TYPE_VALUE.goto"
          type="primary"
          html-type="button"
          class="button"
          title="Tạo logic con"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="addLogicChild()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEvent.add_logic') }}
        </a-button>
        <a-button
          v-if="!dataNode.functionEventLogical && dataNode.logic_type === LOGIC_TYPE_VALUE.if"
          type="primary"
          title="Tạo logic elseif"
          html-type="button"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          class="button"
          @click="addLogicElseIf()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEventLogical.add_elseif') }}
        </a-button>
        <a-button
          v-if="!dataNode.functionEventLogical && dataNode.logic_type === LOGIC_TYPE_VALUE.if"
          type="primary"
          html-type="button"
          :disabled="disableElse || loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          class="button"
          title="Tạo logic else"
          @click="addLogicElse()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEventLogical.add_else') }}
        </a-button>
        <a-button
          v-if="dataNode.logic_type !== LOGIC_TYPE_VALUE.sequence && dataNode.logic_type !== LOGIC_TYPE_VALUE.goto && dataNode.logic_type !== LOGIC_TYPE_VALUE.else"
          type="primary"
          html-type="button"
          title="Cập nhật"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          class="button"
          @click="update()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.update') }} {{ formCurrent }}
        </a-button>
        <a-button
          v-if="dataNode.id"
          html-type="button"
          type="danger"
          title="Xoá"
          class="button"
          size="small"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="confirmToDelete(dataNode.id)"
        >
          <font-awesome-icon icon="trash-alt" class="mr-1" />
          {{ $t('Xoá') }}
        </a-button>
        <a-button
          v-if="dataNode.logic_type === LOGIC_TYPE_VALUE.sequence || dataNode.logic_type === LOGIC_TYPE_VALUE.goto || dataNode.logic_type === LOGIC_TYPE_VALUE.if"
          type="primary"
          html-type="button"
          title="Thêm logic sau logic hiện tại"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          class="button"
          @click="addLogicAfter()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEventLogical.add_logic_after_current_logic') }}
        </a-button>
        <a-button
          v-if="dataNode.logic_type === LOGIC_TYPE_VALUE.sequence || dataNode.logic_type === LOGIC_TYPE_VALUE.goto || dataNode.logic_type === LOGIC_TYPE_VALUE.if"
          type="primary"
          html-type="button"
          title="Thêm logic trước logic hiện tại"
          :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          class="button"
          @click="addLogicBefore()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionEventLogical.add_logic_before_current_logic') }}
        </a-button>
      </div>
      <div v-if="internalShowFormEvent">
        <FunctionEvent
          :id="idEvent"
          ref="formEvent"
          :data-node="dataNode"
          :version="version"
          :function-items="functionItems"
          :mst-events="mstEvents"
          :functions="functions"
          @onClose="onClose"
          @save="save"
        />
      </div>
      <div v-else>
        <FunctionEventLogicalForm
          :data-node="dataNode"
          :parent="parent"
          :type-logic="typeLogic"
          :version="version"
          :force-update="forceUpdate"
          :id-logic="idLogic"
          :functions="functions"
          :is-logic-after="isLogicAfter"
          :is-logic-before="isLogicBefore"
          @disableButton="disableButton"
          @onClose="onClose"
          @save="save"
        />
      </div>
    </a-drawer>
  </div>
</template>
<script>
import FunctionEventLogicalForm from '../functionEventLogical/FunctionEventLogicalForm.vue'
import FunctionEvent from './FunctionEvent.vue'
import { USE_FLG_VALUE, LOGIC_TYPE_VALUE, LOGIC_TYPE_SELECT, LOCK_FLG_VALUE } from '~/constants'

export default {
  components: {
    FunctionEvent,
    FunctionEventLogicalForm
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
    functionItems: {
      type: [Array],
      default: () => []
    },
    mstEvents: {
      type: [Array],
      default: () => []
    },
    functions: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      resource: 'functionEvent',
      USE_FLG_VALUE,
      LOCK_FLG_VALUE,
      LOGIC_TYPE_VALUE,
      LOGIC_TYPE_SELECT,
      internalShowFormEvent: this.showFormEvent,
      dataNode: {},
      idLogic: 0,
      idEvent: 0,
      loading: false,
      typeLogic: null,
      forceUpdate: false,
      drawerTitle: '',
      formCurrent: '',
      parent: {},
      disableElse: false,
      isLogicAfter: false,
      isLogicBefore: false
    }
  },
  /**
   * Computed event.
   */
  computed: {
  },
  watch: {
    showFormEvent(newVal) {
      this.internalShowFormEvent = newVal
      this.setDrawerTitle()
    }
  },
  /**
   * Mounted event.
   */
  mounted() {
    this.setDrawerTitle()
  },
  methods: {
    /**
     * Set title
     */
    setDrawerTitle() {
      if (this.internalShowFormEvent) {
        this.drawerTitle = this.$t('module.functionEvent')
        this.formCurrent = this.$t('module.functionEvent.event_pk')
      } else {
        this.drawerTitle = this.$t('module.functionEventLogical')
        this.formCurrent = this.$t('module.functionEventLogical.logic_pk')
      }
    },
    disableButton(data) {
      this.disableElse = data
    },

    /**
     * Shows the drawer and sets the data for editing.
     */
    showDrawer(parent, data) {
      if (data) {
        if (data.functionEventLogical) {
          this.idEvent = data.id
        } else {
          this.idLogic = data.id
        }
        this.dataNode = data
        this.parent = parent
      } else {
        this.idEvent = 0
        this.dataNode = {}
        this.initialModel = {}
      }
      this.visible = true
    },

    /**
     * Saves the changes by emitting a 'save' event.
     */
    save() {
      this.$emit('save')
    },

    /**
     * Closes the drawer and resets variables.
     */
    onClose() {
      this.visible = false
      this.internalShowFormEvent = false
      this.isLogicAfter = false
      this.isLogicBefore = false
      this.idLogic = 0
      this.$emit('close')
    },

    /**
     * Adds a parent logic node.
     */
    addLogicParent() {
      this.typeLogic = null
      this.internalShowFormEvent = false
      this.forceUpdate = true
      this.setDrawerTitle()
    },

    /**
     * Adds a child logic node.
     */
    addLogicChild() {
      this.typeLogic = null
      this.idLogic = 0
    },
    /**
     * Adds an "else if" logic node.
     */
    addLogicElseIf() {
      this.typeLogic = LOGIC_TYPE_VALUE.elseif
      this.idLogic = 0
    },

    /**
     * Adds an "else" logic node.
     */
    addLogicElse() {
      this.typeLogic = LOGIC_TYPE_VALUE.else
      this.idLogic = 0
    },
    addLogicAfter() {
      this.typeLogic = null
      this.isLogicAfter = true
      this.idLogic = 0
    },
    addLogicBefore() {
      this.typeLogic = null
      this.isLogicBefore = true
      this.idLogic = 0
    },

    /**
     * Updates the form based on the current data node.
     */
    update() {
      if (this.dataNode.functionEventLogical) {
        this.internalShowFormEvent = true
      } else {
        this.idLogic = this.dataNode.id
      }
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
        if (this.dataNode.functionEventLogical) {
          await this.$api.functionEvent.delete(id)
        } else {
          await this.$api.functionEventLogical.delete(id)
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
      .button {
        margin: 5px;
      }
    }
  }
  </style>
