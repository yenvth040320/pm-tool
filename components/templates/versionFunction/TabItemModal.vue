<template>
  <div>
    <a-drawer
      :title="model.id ? $t('module.functionItem.update') : $t('module.functionItem.add')"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-spin :spinning="loadModal">
        <a-form-model
          ref="form"
          :model="model"
          layout="vertical"
          @submit.prevent="confirmUpdate"
        >
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item
                :label="$t('module.functionItem.mst_item_type_id')"
                prop="mst_item_type_id"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.functionItem.mst_item_type_id')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="model.mst_item_type_id"
                  mode="single"
                  :placeholder="$t('module.functionItem.mst_item_type_id')"
                  :disabled="loading"
                  show-search
                  :filter-option="filterOption"
                  allow-clear
                >
                  <a-select-option
                    v-for="(type, index) in mstType"
                    :key="index"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item
                :label="$t('module.functionItem.name')"
                prop="name"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.functionItem.name')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-input
                  v-model="model.name"
                  :placeholder="$t('module.apiResponse.name')"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-divider />
          <a-row :gutter="16">
            <a-col v-for="(item, index) in mstProperty" :key="index" :span="12">
              <a-form-model-item>
                <div class="label_wrapper">
                  <label class="title-required">
                    <span>{{ item.name }}</span>
                    <span v-if="item.required" class="required-custom">*</span>
                  </label>
                </div>
                <a-input
                  v-if="item.type_value !== MST_ITEM_TYPE.boolean"
                  :value="getValue(model.functionItemProperties, item)"
                  :placeholder="item.name"
                  @change="handleChange(getValue(model.functionItemProperties, item), item, $event)"
                />
                <a-select
                  v-if="item.type_value === MST_ITEM_TYPE.boolean"
                  :value="getValue(model.functionItemProperties, item)"
                  mode="single"
                  @change="handleChange(getValue(model.functionItemProperties, item), item, $event)"
                >
                  <a-select-option
                    v-for="(type, indx) in BOOLEAN_TYPE[$nuxt.$i18n.locale]"
                    :key="indx"
                    :value="type.value"
                  >
                    {{ type.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div
            :style="{
              position: 'absolute',
              right: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1,
            }"
          >
            <a-button v-if="version.design_lock_flg === LOCK_FLG_VALUE.no" :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="onClose">
              {{ $t('common.cancel') }}
            </a-button>
            <a-button v-if="version.design_lock_flg === LOCK_FLG_VALUE.no" html-type="submit" type="primary" :title="model.id ? 'Cập nhật' : 'Tạo mới'">
              {{ model.id ? $t('common.update') : $t('common.create') }}
            </a-button>
          </div>
        </a-form-model>
      </a-spin>
    </a-drawer>
  </div>
</template>
<script>
import {
  USE_FLG_VALUE,
  MST_ITEM_TYPE,
  BOOLEAN_TYPE,
  REGEX_NUMBER_ONLY,
  LOCK_FLG_VALUE,
  MST_ITEM_TYPE_DEFAULT_VALUE
} from '~/constants'
import DataForm from '~/mixins/data-form'

export default {
  components: {},
  mixins: [DataForm],
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    mstType: {
      type: [Array],
      default: () => []
    },
    mstProperty: {
      type: [Array],
      default: () => []
    },
    requiredProperty: {
      type: [Array],
      default: () => []
    },
    functionItem: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      visible: false,
      USE_FLG_VALUE,
      MST_ITEM_TYPE,
      BOOLEAN_TYPE,
      REGEX_NUMBER_ONLY,
      LOCK_FLG_VALUE,
      MST_ITEM_TYPE_DEFAULT_VALUE,
      loadModal: false,
      model: {
        name: '',
        mst_item_type_id: undefined,
        start_x: 0,
        start_y: 0,
        end_x: 0,
        end_y: 0,
        function_image_id: 0,
        functionItemProperties: []
      },
      resource: 'functionItem',
      showValidate: false,
      checkExist: false
    }
  },

  computed: {},

  /**
   * Mounted event.
   */
  mounted() {},
  methods: {
    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.loadModal = true

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        if (id) {
          const { data: { result: { data } } } = await this.repository.show(id)
          this.model = data
        } else {
          const defaultType = this.mstType.find(type => type.default === MST_ITEM_TYPE_DEFAULT_VALUE.yes)
          this.model = {
            name: '',
            mst_item_type_id: defaultType ? defaultType.id : undefined,
            start_x: 0,
            start_y: 0,
            end_x: 0,
            end_y: 0,
            function_image_id: 0,
            functionItemProperties: []
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadModal = false
      }
    },

    getValue(functionItemProperties, prp) {
      if (functionItemProperties.length > 0) {
        for (const item of functionItemProperties) {
          if (item.mst_item_property_id === prp.id) {
            return item.value
          }
        }
        return undefined
      } else {
        return undefined
      }
    },

    handleChange(before, item, e) {
      let value = null
      if (item.type_value === MST_ITEM_TYPE.boolean) {
        value = e
      } else {
        value = e.target.value
      }
      const data = {
        project_id: this.$store.state.project.id,
        version_code: this.version.version_code,
        function_id: this.version.function_id,
        mst_item_property_id: item.id,
        value
      }
      const index = this.model.functionItemProperties.findIndex(e => e.mst_item_property_id === item.id)
      if (index > -1) {
        this.model.functionItemProperties[index].value = data.value
      } else {
        this.model.functionItemProperties.push(data)
      }
    },

    /**
     * Shows the drawer and sets the data for editing.
     */
    open(val, startX, startY, endX, endY, imageId) {
      this.visible = true
      if (val) {
        const defaultType = this.mstType.find(type => type.default === MST_ITEM_TYPE_DEFAULT_VALUE.yes)
        this.model = {
          name: '',
          mst_item_type_id: defaultType ? defaultType.id : undefined,
          start_x: startX,
          start_y: startY,
          end_x: endX,
          end_y: endY,
          function_image_id: imageId,
          functionItemProperties: []
        }
      }
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
      this.$emit('close')
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
        await this.$api.apiResponse.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveNewParent')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loading = false
      }
    },

    confirmUpdate() {
      if (this.model.id) {
        const index = this.functionItem.findIndex(item => item.id === this.model.id)
        if (index > -1) {
          this.checkExist = this.functionItem[index].functionTestcases.length > 0 || this.functionItem[index].functionItemValidation.length > 0
        } else {
          this.checkExist = false
        }
        if (this.checkExist) {
          this.$confirm({
            title: this.$t('module.functionItemValidation.confirm_update'),
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

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            // check required mst property
            const dataProp = this.model.functionItemProperties.map(e => {
              return e.mst_item_property_id
            })
            const containsRequiredIds = this.requiredProperty.every(item => dataProp.includes(item.id))
            if (containsRequiredIds) {
              const data = this.model
              data.project_id = this.$store.state.project.id
              data.version_code = this.version.version_code
              data.function_id = this.version.function_id
              data.use_flg = USE_FLG_VALUE.yes
              if (this.model.id) {
                await this.$api.functionItem.update(this.model.id, data)
              } else if (!this.model.id) {
                if (data.function_image_id === 0) {
                  if (this.version.images.length > 0) {
                    data.function_image_id = this.version.images[0].id
                  }
                }
                await this.$api.functionItem.create(data)
              }

              this.$notification.success({
                message: this.$t('text.successfully')
              })
              this.visible = false
              this.getDetail(this.id)
              this.$emit('save')
            } else {
              this.showValidate = true
              this.$notification.error({
                message: this.$t('text.validate_data')
              })
            }
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    isRecordValid(data) {
      for (const key in data) {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          return false
        }
      }
      return true
    },

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
  .action {
    .ant-btn-danger {
      height: 31.99px;
      padding: 0 10px;
    }
  }
}
.label_wrapper {
  margin-bottom: 5px;
  .title-required {
    display: flex;
    .required-custom {
      color: #f5222d;
      display: inline-block;
      font-size: 14px;
      margin-right: 4px;
    }
  }
}
.heading-text {
  font-weight: 700;
}
</style>
