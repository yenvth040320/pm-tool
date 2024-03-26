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
        <a-form-model
          ref="form"
          :model="model"
          layout="vertical"
          @submit.prevent="handleSubmit"
        >
          <a-row :gutter="16">
            <a-col :span="12">
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
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
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
                  @change="clearComponentTable"
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
            <a-col :span="12">
              <a-button
                class="list-component"
                type="primary"
                @click="listComponentClone()"
              >
                {{
                  $t(
                    'module.design_frontend.component.merge_branch.list_component'
                  )
                }}
              </a-button>
            </a-col>
          </a-row>

          <a-table
            :columns="columns"
            :row-key="record => record.id"
            :data-source="data"
            :scroll="{ x: 400 }"
            :loading="loadingTable"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
          />

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
              :title="$t('module.design_frontend.component.merge_branch')"
            >
              {{ $t('module.design_frontend.component.merge_branch') }}
            </a-button>
          </div>
        </a-form-model>
      </a-spin>
    </a-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { LOCK_FLG_VALUE, SORT, TYPE_SOURCE_CODE } from '~/constants'

export default {
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
      data: [],
      componentIds: [],
      visible: false,
      LOCK_FLG_VALUE,
      TYPE_SOURCE_CODE,
      selectedRowKeys: [],
      model: {
        source_code_id: null,
        branch_id: null,
        path_id: null,
        component_id: null,
        component_name: null,
        x_start: 0,
        y_start: 0,
        x_end: 0,
        y_end: 0,
        function_image_id: null,
        function_id: null,
        functionItems: [],
        versionCode: this.versionCode,
        functionId: this.functionId,
        functionItemPk: this.version.function.latest_version
      },
      sourceCodes: [],
      branches: [],
      paths: [],
      components: [],
      categories: [],
      resource: 'component',
      showValidate: false,
      checkExist: false,
      project_id: this.$store.state.project.id,
      loadingTable: false
    }
  },

  computed: {
    header() {
      return [
        {
          title: this.$t(
            'module.design_frontend.component.component_child.name'
          ),
          dataIndex: 'component_name'
        },
        {
          title: this.$t('module.design_frontend.component.branch_path'),
          dataIndex: 'component_path'
        },
        {
          title: this.$t('module.design_frontend.component.branch'),
          dataIndex: 'branch_name'
        }
      ]
    },

    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (
          this.$route.query.order_by === item.dataIndex &&
          this.$route.query.order_type
        ) {
          item.sortOrder =
            +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    rowSelection() {
      return {}
    },

    ...mapState({
      loading: 'loading'
    })
  },
  watch: {
    'model.source_code_id'() {
      this.getBranches()
    }
  },
  /**
   * Mounted event.
   */
  mounted() {
    this.getSourceCodes()
  },
  methods: {
    /**
     * Clear component table.
     */
    clearComponentTable() {
      this.selectedRowKeys = []
      this.data = null
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.componentIds = []
      selectedRowKeys.forEach(element => {
        this.componentIds.push(element)
      })
    },
    /**
     * List component clone.
     */
    listComponentClone() {
      try {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.loadingTable = true
            const params = {
              version_code: this.version.version_code,
              branch_id: this.model.branch_id,
              function_id: this.functionId
            }

            const {
              data: {
                result: { data }
              }
            } = await this.$api.component.listComponentFlowBranch({ params })
            this.data = data
          }
        })
      } catch (_) {
        console.log(_)
      } finally {
        this.loadingTable = false
      }
    },

    /**
     * Get parent level 1 of trees.
     */
    async getSourceCodes() {
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          all: true,
          type_id: this.TYPE_SOURCE_CODE[0].value
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
      this.$emit('save')
    },

    /**
     * Saves the changes by emitting a 'save' event.
     */
    close() {
      this.visible = false
    },

    /**
     * Closes the drawer and resets variables.
     */
    onClose() {
      this.clearComponentTable()
      this.visible = false
      this.$emit('close', this.model)
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const dataBody = {
              component_ids: [...new Set(this.componentIds)],
              branch_id: this.model.branch_id,
              create_user_id: this.$auth.user.id
            }

            await this.$api.component.mergeComponent(dataBody)

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.onClose()
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
.list-component {
  margin: 6%;
}
</style>
