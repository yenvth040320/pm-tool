<template>
  <a-form-model
    ref="form"
    layout="vertical"
    :model="logic"
    :rules="formRules"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
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
          >
            <a-form-model-item
              :label="$t('module.functionEventLogical')"
            >
              <div>
                {{ parentNodeData }}
              </div>
            </a-form-model-item>
          </a-col>

          <a-col
            v-if="logic.logic_type !== LOGIC_TYPE_VALUE.elseif && logic.logic_type !== LOGIC_TYPE_VALUE.else"
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionEventLogical.logic_type')"
              prop="logic_type"
            >
              <a-select
                v-model="logic.logic_type"
                allow-clear
                :placeholder="$t('module.functionEventLogical.logic_type')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in LOGIC_TYPE_SELECT"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              v-if="logic.logic_type === LOGIC_TYPE_VALUE.goto"
              :label="$t('module.functionEventLogical.function_goto_id')"
              prop="function_goto_id"
            >
              <a-select
                v-model="logic.function_goto_id"
                allow-clear
                :placeholder="$t('module.functionEventLogical.function_goto_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item) in functions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.code + ' - ' +item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-else-if="logic.logic_type === LOGIC_TYPE_VALUE.if || logic.logic_type === LOGIC_TYPE_VALUE.elseif"
              :label="$t('module.functionEventLogical.conditions')"
              prop="conditions"
            >
              <a-input
                v-model="logic.conditions"
                :placeholder="$t('module.functionEventLogical.conditions')"
              />
            </a-form-model-item>
            <a-form-model-item
              v-else-if="logic.logic_type === LOGIC_TYPE_VALUE.else"
              :label="$t('module.functionEventLogical.conditions_parent')"
            >
              <div v-if="logic.parent">
                {{ $t('module.functionEventLogical.if') + ' (' + logic.parent?.conditions + ')' }}
              </div>
              <div v-else>
                {{ $t('module.functionEventLogical.if') + ' (' + dataNode.conditions + ')' }}
              </div>
            </a-form-model-item>
            <a-form-model-item
              v-else
              :label="$t('module.functionEventLogical.logic_detail')"
              prop="logic_detail"
            >
              <a-textarea
                v-model="logic.logic_detail"
                :rows="5"
                :placeholder="$t('module.functionEventLogical.logic_detail')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div v-if="!idLogic || (logic.logic_type !== LOGIC_TYPE_VALUE.else && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes)" class="text-center" title="Huỷ bỏ">
        <a-button :style="{ marginRight: '8px' }" @click="$emit('onClose')">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button type="primary" title="Lưu" @click="handleSubmit(typeLogic)">
          {{ id ? $t('common.edit') : $t('common.add') }}
        </a-button>
      </div>

      <div v-if="logic.id" class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              v-if="logic.logic_type === LOGIC_TYPE_VALUE.if || logic.logic_type === LOGIC_TYPE_VALUE.elseif"
              :label="$t('module.functionEventLogical.conditions_jp')"
              prop="conditions_jp"
            >
              <a-input
                v-model="logic.conditions_jp"
                :placeholder="$t('module.functionEventLogical.conditions_jp')"
              />
            </a-form-model-item>

            <a-form-model-item
              v-else-if="logic.logic_type !== LOGIC_TYPE_VALUE.goto && logic.logic_type !== LOGIC_TYPE_VALUE.else"
              :label="$t('module.functionEventLogical.logic_detail_jp')"
              prop="logic_detail"
            >
              <a-textarea
                v-model="logic.logic_detail_jp"
                :rows="5"
                :placeholder="$t('module.functionEventLogical.logic_detail_jp')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div v-if="logic.id && (logic.logic_type !== LOGIC_TYPE_VALUE.else && logic.logic_type !== LOGIC_TYPE_VALUE.goto && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes)" class="text-center" title="Huỷ bỏ">
        <a-button :style="{ marginRight: '8px' }" @click="$emit('onClose')">
          {{ $t('common.cancel') }}
        </a-button>
        <a-button type="primary" title="Lưu" @click="updateContentJp()">
          {{ $t('module.functionEventLogical.update_logic_jp') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import { USE_FLG_VALUE, LOGIC_TYPE_SELECT, LOGIC_TYPE_VALUE, LOGIC_TYPE, LOCK_FLG_VALUE } from '~/constants'

export default {
  props: {
    dataNode: {
      type: Object,
      default: () => {}
    },
    parent: {
      type: Object,
      default: () => {}
    },
    typeLogic: {
      type: [Number, String, null],
      default: null
    },
    version: {
      type: [Object],
      default: () => {}
    },
    idLogic: {
      type: [Number, String],
      default: 0
    },
    forceUpdate: {
      type: Boolean,
      default: false
    },
    isLogicAfter: {
      type: Boolean,
      default: false
    },
    isLogicBefore: {
      type: Boolean,
      default: false
    },
    functions: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionEventLogical',
      USE_FLG_VALUE,
      LOCK_FLG_VALUE,
      LOGIC_TYPE_SELECT,
      LOGIC_TYPE_VALUE,
      LOGIC_TYPE,
      mst_event_id: undefined,
      currentLogicPk: 1,
      logic: {
        project_id: '',
        function_id: '',
        version_code: '',
        item_pk: undefined,
        event_pk: '',
        logic_detail: '',
        logic_detail_jp: '',
        function_goto_id: undefined,
        conditions: '',
        conditions_jp: '',
        logic_type: this.computedLogicType,
        order: 0
      },
      loading: false,
      id: this.idLogic
    }
  },

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        function_goto_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionEventLogical.function_goto_id') }),
            trigger: ['change', 'blur']
          }
        ],
        conditions: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionEventLogical.conditions') }),
            trigger: ['change', 'blur']
          }
        ],
        logic_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionEventLogical.logic_type') }),
            trigger: ['change', 'blur']
          }
        ],
        logic_detail: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionEventLogical.logic_detail') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    },
    computedLogicType() {
      return this.typeLogic !== null ? this.typeLogic : LOGIC_TYPE_VALUE.sequence
    },
    parentNodeData() {
      return this.findParentDataWithNullParent(this.parent)
    }
  },
  watch: {
    idLogic(newVal) {
      this.id = newVal
      this.getDetail(newVal)
      if (newVal === 0) {
        this.resetLogic()
      }
    },
    typeLogic(val) {
      this.typeLogic = val
      this.resetLogic()
    },
    logic: {
      handler: 'checkChildrenForLogicType',
      deep: true // Theo dõi sự thay đổi đệ quy trong các thuộc tính con của `logic`
    }
  },

  /**
   * Mounted event.
   */
  async mounted() {
    await this.getDetail(this.idLogic)
    if (this.forceUpdate) {
      this.logic.logic_type = this.computedLogicType
    }
    this.checkChildrenForLogicType()
  },

  /**
   * List of methods.
   */
  methods: {
    checkChildrenForLogicType() {
      if (this.logic && this.logic.children) {
        const data = this.logic.children.some(child => child.logic_type === LOGIC_TYPE_VALUE.else)
        this.$emit('disableButton', data)
      }
    },
    findParentDataWithNullParent(node) {
      if (node) {
        if (node.parent && node.parent.parent === null) {
          return node.parent.title
        }
        if (node.parent !== null) {
          return this.findParentDataWithNullParent(node.parent)
        } else {
          return node.title
        }
      } else {
        return this.dataNode?.functionItem?.name + ': On => ' + this.dataNode?.mstEvent?.name
      }
    },
    resetLogic() {
      this.logic = {
        item_pk: undefined,
        event_pk: '',
        logic_detail: '',
        logic_detail_jp: '',
        function_goto_id: undefined,
        conditions: '',
        conditions_jp: '',
        logic_type: this.computedLogicType,
        order: 0
      }
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.loading = true

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        if (id) {
          const { data: { result: { data } } } = await this.$api.functionEventLogical.show(id)
          this.logic = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loading = false
      }
    },

    /**
      * Validate before submit
      */
    handleSubmit(type) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            if (type !== null) {
              this.logic.logic_type = type
            }

            const data = {
              project_id: this.$store.state.project.id,
              function_id: this.version.function_id,
              version_code: this.version.version_code,
              item_pk: this.dataNode.item_pk,
              event_pk: this.dataNode.event_pk,
              logic_type: this.logic.logic_type,
              logic_detail: this.logic.logic_detail,
              logic_detail_jp: this.logic.logic_detail_jp,
              conditions: this.logic.conditions,
              conditions_jp: this.logic.conditions_jp,
              function_goto_id: this.logic.function_goto_id
            }

            if (this.id) {
              data.logic_pk = this.logic.logic_pk
              await this.$api.functionEventLogical.update(this.id, data)
            } else {
              if (this.dataNode.functionEventLogical) {
                data.parent_logic_pk = 0
              } else if (this.isLogicAfter || this.isLogicBefore) {
                data.parent_logic_pk = this.dataNode.parent_logic_pk
                data.isLogicAfter = this.isLogicAfter
                data.isLogicBefore = this.isLogicBefore
                data.logic_current = this.dataNode.logic_pk
              } else {
                data.parent_logic_pk = this.dataNode.logic_pk
              }
              await this.$api.functionEventLogical.create(data)
            }
            this.resetLogic()
            this.$emit('onClose')
            this.$emit('save')
            this.$notification.success({
              message: this.$t('text.successfully')
            })
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.loading = false
          }
        }
      })
    },

    /**
      * Validate before submit
      */
    updateContentJp() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            const data = {
              logic_detail_jp: this.logic.logic_detail_jp,
              conditions_jp: this.logic.conditions_jp
            }

            if (this.id) {
              await this.$api.functionEventLogical.updateContentJp(this.id, data)
            }
            this.resetLogic()
            this.$emit('onClose')
            this.$emit('save')
            this.$notification.success({
              message: this.$t('text.successfully')
            })
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.loading = false
          }
        }
      })
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
