<template>
  <div>
    <a-drawer
      :title="
        model.id
          ? $t('module.design_frontend.component.update')
          : $t('module.design_frontend.component.add')
      "
      :width="1000"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-spin :spinning="loading">
        <div v-if="!id">
          {{ $t('module.design_frontend.component.reuse_component') }}:
          <a-checkbox v-model="useComponent" @change="onChangeUseComponent" />
        </div>
        <a-form-model
          ref="form"
          :model="model"
          layout="vertical"
          @submit.prevent="handleSubmit"
        >
          <a-row :gutter="16">
            <a-col v-if="useComponent || id" :span="8">
              <a-form-model-item
                :label="$t('module.design_frontend.component.tree')"
                prop="source_code_id"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.design_frontend.component.tree')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="model.source_code_id"
                  mode="single"
                  :placeholder="$t('module.design_frontend.component.tree')"
                  :disabled="loading"
                  show-search
                  :filter-option="filterOption"
                  allow-clear
                >
                  <a-select-option
                    v-for="(item, index) in sourceCodes"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="useComponent || id" :span="8">
              <a-form-model-item
                :label="$t('module.design_frontend.component.branch')"
                prop="branch_id"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.design_frontend.component.branch')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="model.branch_id"
                  mode="single"
                  :placeholder="$t('module.design_frontend.component.branch')"
                  :disabled="loading"
                  show-search
                  :filter-option="filterOption"
                  allow-clear
                >
                  <a-select-option
                    v-for="(item, index) in branches"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col v-if="useComponent || id" :span="4">
              <a-form-model-item
                :label="$t('module.design_frontend.component')"
                prop="component_id"
                :rules="{
                  required: !id ? true : false,
                  message: $t('validation.required', {
                    field: $t('module.design_frontend.component.branch')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="model.component_id"
                  mode="single"
                  :placeholder="$t('module.design_frontend.component')"
                  :disabled="loading"
                  show-search
                  :filter-option="filterOption"
                  allow-clear
                >
                  <a-select-option
                    v-for="(item, index) in components"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.component_name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="id" :span="4">
              <a-button type="primary" class="btn-copy" @click="copyComponent">
                {{ $t('common.copy_component') }}
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col v-if="id" :span="16">
              <a-form-model-item
                :label="$t('module.design_frontend.component.branch_path')"
                prop="path_id"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.design_frontend.component.branch_path')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="model.path_id"
                  mode="single"
                  :placeholder="
                    $t('module.design_frontend.component.branch_path')
                  "
                  :disabled="loading"
                  show-search
                  :filter-option="filterOption"
                  allow-clear
                >
                  <a-select-option
                    v-for="(item, index) in paths"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.namespace }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col v-if="!useComponent || id" :span="8">
              <a-form-model-item
                v-model="model.component_name"
                :disabled="model.component_id !== null ? true : false"
                :label="$t('module.design_frontend.component.name')"
                prop="component_name"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.design_frontend.component.name')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-input v-model="model.component_name" />
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col v-if="!useComponent || id" :span="24">
              <a-form-model-item
                v-model="model.storybook_url"
                :label="$t('module.design_frontend.component.storybook_url')"
                prop="storybook_url"
              >
                <a-input v-model="model.storybook_url" />
              </a-form-model-item>
            </a-col>
          </a-row>

          <div v-if="id" class="component-detail">
            <!-- Fuction item -->
            <h4>{{ $t('module.design_frontend.component.function_item') }}</h4>
            <function-item
              :model="model"
              :version-code="versionCode"
              :version="version"
              :categories="categories"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Data -->
            <h4>{{ $t('module.design_frontend.component.data') }}</h4>
            <data-component
              :model="model"
              :version-code="versionCode"
              :categories="categories"
              :model-type="modelType"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Props -->
            <h4>{{ $t('module.design_frontend.component.props') }}</h4>
            <props-component
              :model="model"
              :version-code="versionCode"
              :categories="categories"
              :model-type="modelType"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Functions -->
            <h4>{{ $t('module.design_frontend.component.functions') }}</h4>
            <functions-component
              :model="model"
              :version-code="versionCode"
              :categories="categories"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- component child -->
            <h4>
              {{ $t('module.design_frontend.component.component_child') }}
            </h4>
            <component-child-component
              :model="model"
              :version-code="versionCode"
              :categories="categories"
              :components="components"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Emit component -->
            <h4>
              {{ $t('module.design_frontend.component.component_child.emit') }}
            </h4>
            <emit-component
              :model="model"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Event component -->
            <h4>
              {{ $t('module.design_frontend.component.component_child.event') }}
            </h4>
            <event-component
              :model="model"
              @addRow="addRow"
              @removeRow="removeRow"
            />

            <!-- Store component -->
            <h4>
              {{ $t('module.design_frontend.component.component_child.store') }}
            </h4>
            <store-component
              :model="model"
              @addRow="addRow"
              @removeRow="removeRow"
            />
          </div>
          <div
            :style="{
              position: 'absolute',
              right: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1
            }"
          >
            <a-button
              v-if="version.design_lock_flg === LOCK_FLG_VALUE.no"
              :style="{ marginRight: '8px' }"
              title="Huỷ bỏ"
              @click="onClose"
            >
              {{ $t('common.cancel') }}
            </a-button>
            <a-button
              v-if="version.design_lock_flg === LOCK_FLG_VALUE.no"
              html-type="submit"
              type="primary"
              :title="model.id ? 'Cập nhật' : 'Tạo mới'"
            >
              {{ model.id ? $t('common.update') : $t('common.create') }}
            </a-button>
            <a-button
              v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && id"
              title="Delete"
              :style="{ marginRight: '8px' }"
              class="delete-button"
              @click="deleteComponent"
            >
              {{ $t('common.clear') }}
            </a-button>
          </div>
        </a-form-model>
      </a-spin>
    </a-drawer>
  </div>
</template>
<script>
import {
  LOCK_FLG_VALUE,
  SORT,
  TYPE_SOURCE_CODE,
  EVENT_COMPONENT,
  TYPE_MODEL
} from '~/constants'
import DataForm from '~/mixins/data-form'
import FunctionItem from '~/components/templates/designFrontend/subComponent/functionItem/FunctionItem.vue'
import DataComponent from '~/components/templates/designFrontend/subComponent/Data.vue'
import EmitComponent from '~/components/templates/designFrontend/subComponent/Emit.vue'
import EventComponent from '~/components/templates/designFrontend/subComponent/Event.vue'
import StoreComponent from '~/components/templates/designFrontend/subComponent/Store.vue'
import PropsComponent from '~/components/templates/designFrontend/subComponent/Props.vue'
import FunctionsComponent from '~/components/templates/designFrontend/subComponent/Functions.vue'
import ComponentChildComponent from '~/components/templates/designFrontend/subComponent/ChildComponent/ChildComponent.vue'

export default {
  components: {
    FunctionItem,
    DataComponent,
    PropsComponent,
    FunctionsComponent,
    ComponentChildComponent,
    EmitComponent,
    EventComponent,
    StoreComponent
  },
  mixins: [DataForm],
  props: {
    versionCode: {
      type: [Number],
      default: 0
    },
    functionId: {
      type: [Number],
      default: 0
    },
    functionItem: {
      type: [Array],
      default: () => []
    },
    version: {
      type: [Object],
      default: () => {}
    }
  },

  data() {
    return {
      resource: 'componentFunctionMapping',
      visible: false,
      LOCK_FLG_VALUE,
      TYPE_SOURCE_CODE,
      EVENT_COMPONENT,
      model: {
        source_code_id: null,
        branch_id: null,
        path_id: null,
        component_id: null,
        component_name: null,
        storybook_url: null,
        x_start: 0,
        y_start: 0,
        x_end: 0,
        y_end: 0,
        function_image_id: null,
        function_id: null,
        functionItems: [],
        datum: [],
        props: [],
        functions: [],
        componentChilds: [],
        componentEmits: [],
        componentEvents: [],
        componentStores: [],
        componentItems: [],
        versionCode: this.versionCode,
        functionId: this.functionId,
        functionItemPk: this.version.function.latest_version,
        copy_flag: false
      },
      sourceCodes: [],
      branches: [],
      paths: [],
      components: [],
      categories: [],
      useComponent: false,
      showValidate: false,
      checkExist: false,
      items: [],
      project_id: this.$store.state.project.id,
      modelType: [],
      TYPE_MODEL
    }
  },

  computed: {},
  watch: {
    'model.source_code_id'() {
      this.getBranches()
      this.listModel()
    },
    'model.branch_id'() {
      this.listModel()
      this.getPaths()
      this.getComponents()
    }
  },
  /**
   * Mounted event.
   */
  mounted() {
    this.getSourceCodes()
    this.getCategories()
    this.listModel()
  },
  methods: {
    async listModel() {
      try {
        if (!this.model.branch_id || !this.model.source_code_id) {
          this.reNameLabelModelType()
          return
        }
        this.$store.dispatch('setLoading', true)
        const params = {
          limit: 100,
          model_source_code_id: this.model.source_code_id,
          branch_id: this.model.branch_id
        }
        const {
          data: {
            result: { data }
          }
        } = await this.$api.model.list({ params })
        this.modelType = data
        this.reNameLabelModelType()
      } catch (_) {
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    reNameLabelModelType() {
      TYPE_MODEL.forEach(element => {
        const defaultModel = {
          model_name: element.label
        }
        this.modelType.unshift(defaultModel)
      })
    },

    /**
     * Copy component information
     */
    copyComponent() {
      if (this.model.component_id === null || this.model.component_id === '') {
        this.$notification.error({
          message: this.$t('Vui lòng chọn component')
        })
        return
      }
      this.model.copy_flag = true
      this.getDetail(this.model.component_id, true)
    },

    /**
     * Delete component and relationship component.
     */
    deleteComponent() {
      this.$confirm({
        title: 'Confirm',
        content: this.$t('common.confirm'),
        okText: this.$t('common.clear'),
        cancelText: this.$t('common.cancel'),
        onOk: async () => {
          if (this.model.id) {
            this.$store.dispatch('setLoading', true)
            await this.$api.component.deleteComponentRelationship(this.model.id)
            this.$store.dispatch('setLoading', false)
            this.onClose()
            this.$emit('deleteComponent')
          }
        }
      })
    },

    async getSourceCodes() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          type_id: this.TYPE_SOURCE_CODE[0].value,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.sourceCode.list({ params })
        this.sourceCodes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getBranches() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.model.source_code_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            source_code_id: this.model.source_code_id,
            all: true
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.branch.list({ params })
          this.branches = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getPaths() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.model.source_code_id && this.model.branch_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            source_code_id: this.model.source_code_id,
            branch_id: this.model.branch_id,
            all: true,
            type: 2
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.tree.list({ params })
          this.paths = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getComponents() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.model.branch_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            branch_id: this.model.branch_id,
            // version_code: this.versionCode,
            all: true,
            notId: this.model.id
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.component.list({ params })
          this.components = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getCategories() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.category.list({ params })
        this.categories = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    addRow(ref) {
      let newData = null
      switch (ref) {
        case EVENT_COMPONENT.functionItems:
          newData = {
            key: this.$moment().unix(),
            item_name: '',
            function_item_pk: '',
            component_item_function: []
          }
          break
        case EVENT_COMPONENT.datum:
          newData = {
            data_name: '',
            data_type: '',
            default_value: '',
            description: ''
          }
          break
        case EVENT_COMPONENT.props:
          newData = {
            props_name: '',
            props_type: '',
            default_value: '',
            description: ''
          }
          break
        case EVENT_COMPONENT.functions:
          newData = {
            key: this.$moment().unix(),
            function_name: '',
            params: '',
            return: '',
            description: ''
          }
          break
        case EVENT_COMPONENT.componentChilds:
          newData = {
            component_id: '',
            props: [],
            emits: [],
            description: ''
          }
          break
        case EVENT_COMPONENT.componentEmits:
          newData = {
            component_id: '',
            data_callback: '',
            description: '',
            emit_name: ''
          }
          break
        case EVENT_COMPONENT.componentEvents:
          newData = {
            component_id: '',
            component_function_id: '',
            component_item_id: '',
            description: '',
            id_fake: 0,
            event: ''
          }
          break
        case EVENT_COMPONENT.componentStores:
          newData = {
            component_id: '',
            function_name: '',
            description: '',
            store: ''
          }
          break
        default:
          newData = null
      }

      if (newData !== null) {
        this.model[ref].push(newData)
      }
    },

    removeRow(ref, index) {
      this.model[ref].splice(index, 1)
    },
    onChangeUseComponent(e) {
      this.useComponent = e.target.checked
      this.model.source_code_id = null
      this.model.branch_id = null
      this.model.path_id = null
      this.model.component_name = null
      this.model.storybook_url = null
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id, keyCopy) {
      if (id !== 0) {
        this.$store.dispatch('setLoading', true)
        try {
          const data = await this.$api.component.show(id)
          const newData = data.data.result.data
          this.model.id = keyCopy ? this.model.id : newData?.id
          this.model.source_code_id = newData?.tree_id
          this.model.branch_id = newData?.branch_id
          this.model.path_id = newData?.path_id
          this.model.component_name = keyCopy
            ? this.model.component_name
            : newData?.component_name
          this.model.storybook_url = keyCopy
            ? this.model.storybook_url
            : newData?.storybook_url
          this.model.project_id = newData?.project_id
          this.model.functionItems = newData?.functionItems
          this.model.datum = newData?.datum
          this.model.props = newData?.props
          this.model.functions = newData?.functions
          this.model.componentEmits = newData?.emits
          this.model.componentChilds = newData?.componentChilds
          this.model.componentEvents = newData?.events
          this.model.componentStores = newData?.stores

          this.getPaths()
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        } finally {
          this.$store.dispatch('setLoading', false)
        }
      }
    },

    /**
     * Shows the drawer and sets the data for editing.
     */
    open(val, startX, startY, endX, endY, imageId, rectId) {
      this.visible = true
      if (val) {
        this.model.id = 0
        this.model.source_code_id = null
        this.model.branch_id = null
        this.model.path_id = null
        this.model.component_id = null
        this.model.component_name = null
        this.model.storybook_url = null
        this.model.x_start = startX
        this.model.y_start = startY
        this.model.x_end = endX
        this.model.y_end = endY
        this.model.function_image_id = imageId
        this.model.rect_id = rectId
        this.model.project_id = this.project_id
        this.model.version_code = this.versionCode
        this.model.function_id = this.version.function_id
      }
    },

    /**
     * Saves the changes by emitting a 'save' event.
     */
    save() {
      this.$refs.form.clearValidate()
      this.$emit('save')
    },

    /**
     * Closes the drawer and resets variables.
     */
    onClose() {
      this.visible = false
      this.$refs.form.clearValidate()
      this.$emit('close')
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            this.$confirm({
              title: 'Confirm',
              content: this.$t(data.id ? 'common.confirm_update' : 'common.confirm_create'),
              okText: this.$t(data.id ? 'common.edit' : 'common.add'),
              cancelText: this.$t('common.cancel'),
              onOk: async () => {
                if (data.id) {
                  await this.$api.component.update(data.id, data)
                  this.model.copy_flag = false
                } else if (this.useComponent) {
                  // Clone component
                  await this.$api.componentFunctionMapping.create(data)
                } else {
                  // Create component
                  await this.$api.component.create(data)
                }
                this.useComponent = false
                this.$emit('save')
                this.visible = false
                this.$notification.success({
                  message: this.$t('text.successfully')
                })
              }
            })
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

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
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
  .ant-form-item-required::before {
    // display: none;
  }
  .ant-form-item-required::after {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
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

.delete-button {
  background: #f5222d;
}
.btn-copy {
  margin-top: 29px !important;
}
.component-detail {
  margin-bottom: 30px !important;
}
</style>
