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
        <a-form-model
          ref="form"
          :model="model"
          :rules="formRules"
          layout="vertical"
          @submit.prevent="handleSubmit"
        >
          <div class="p-4">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-model-item
                  :label="$t('module.functionItemReadDatasource.item_pk')"
                  prop="item_pk"
                >
                  <a-select
                    v-model="model.item_pk"
                    mode="single"
                    :placeholder="$t('module.functionItemReadDatasource.item_pk')"
                    :disabled="loading"
                    show-search
                    :filter-option="filterOption"
                    allow-clear
                  >
                    <a-select-option
                      v-for="(item, index) in functionItems"
                      :key="index"
                      :value="item.item_pk"
                    >
                      {{ item.item_num }}: {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-divider />

            <div class="heading-text pb-3">
              {{ $t('module.functionItemReadDatasource.reference_api') }}
            </div>
            <div
              v-for="(read, index) in model.functionItemReadDatasources"
              :key="index"
            >
              <div class="delete-btn pb-4">
                <a-button
                  type="danger"
                  title="Xoá"
                  @click="deleteDatasource(index, read.id)"
                >
                  <a-icon type="delete" />
                </a-button>
              </div>
              <a-form-model-item
                :label="$t('module.functionItemReadDatasource.api_id')"
                :prop="'functionItemReadDatasources.' + index + '.api_id'"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.functionItemReadDatasource.api_id')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="read.api_id"
                  :placeholder="$t('module.functionItemReadDatasource.api_id')"
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  @change="changeApi(index)"
                >
                  <a-select-option
                    v-for="(item, i) in apis"
                    :key="i"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                :label="
                  $t('module.functionItemReadDatasource.api_version_code')
                "
                :prop="
                  'functionItemReadDatasources.' + index + '.api_version_code'
                "
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t(
                      'module.functionItemReadDatasource.api_version_code'
                    )
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="read.api_version_code"
                  :placeholder="
                    $t('module.functionItemReadDatasource.api_version_code')
                  "
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  @change="changeApiVersion(index)"
                >
                  <a-select-option
                    v-for="(item, i) in apiVersions[index]"
                    :key="i"
                    :value="item.version_code"
                  >
                    {{ item.version_code }} : {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                :label="$t('module.functionItemReadDatasource.api_response_pk')"
                :prop="'functionItemReadDatasources.' + index + '.api_response_pk'"
                :rules="{
                  required: true,
                  message: $t('validation.required', {
                    field: $t('module.functionItemReadDatasource.api_response_pk')
                  }),
                  trigger: ['change', 'blur']
                }"
              >
                <a-select
                  v-model="read.api_response_pk"
                  :placeholder="
                    $t('module.functionItemReadDatasource.api_response_pk')
                  "
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                  @change="changeApiRespone(index)"
                >
                  <a-select-option
                    v-for="(item, i) in apiResponses[index]"
                    :key="i"
                    :value="item.api_response_pk"
                  >
                    {{ item.path }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                :label="
                  $t(
                    'module.functionItemReadDatasource.api_response_datasource_pk'
                  )
                "
                :prop="
                  'functionItemReadDatasources.' +
                    index +
                    '.api_response_datasource_pk'
                "
              >
                <a-select
                  v-model="read.api_response_datasource_pk"
                  :placeholder="
                    $t(
                      'module.functionItemReadDatasource.api_response_datasource_pk'
                    )
                  "
                  allow-clear
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item, i) in apiResponseDatasources[index]"
                    :key="i"
                    :value="item.api_response_datasource_pk"
                  >
                    [{{ item.dbSchema.name }}].[{{ item.dbTable.name }}].[{{ item.dbColumn.name }}].[{{ $t('Version: ') + item.db_table_version_code }}]
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                :label="$t('module.functionItemReadDatasource.description')"
                :prop="'functionItemReadDatasources.' + index + '.description'"
              >
                <a-textarea
                  v-model="read.description"
                  :placeholder="
                    $t('module.functionItemReadDatasource.description')
                  "
                />
              </a-form-model-item>
              <a-divider />
            </div>
            <div class="box-button-add">
              <a-button
                type="primary"
                title="Tạo mới"
                class="button-add-university"
                @click="addNewFunctionItemReadDataSource()"
              >
                <a-icon type="file-add" />
              </a-button>
            </div>
          </div>
          <div
            :style="{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1,
            }"
          >
            <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="onClose">
              {{ $t('common.cancel') }}
            </a-button>
            <a-button
              html-type="submit"
              type="primary"
              :title="model.id ? 'Cập nhật' : 'Tạo mới'"
            >
              {{ model.id ? $t('common.update') : $t('common.create') }}
            </a-button>
          </div>
        </a-form-model>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import {
  USE_FLG_VALUE,
  LOGIC_TYPE_VALUE,
  LOGIC_TYPE_SELECT,
  DATA_TYPE_VALUE
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
    functionItems: {
      type: [Array],
      default: () => []
    },
    apis: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      resource: 'functionItemReadDatasource',
      USE_FLG_VALUE,
      LOGIC_TYPE_VALUE,
      LOGIC_TYPE_SELECT,
      DATA_TYPE_VALUE,
      drawerTitle: '',
      apiVersions: [],
      apiResponses: [],
      apiResponseDatasources: []
    }
  },
  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemReadDatasource.item_pk') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {},
  /**
   * Mounted event.
   */
  mounted() {
  },
  methods: {
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id ?? 0,
        item_pk: this.model.item_pk ?? '',
        functionItemReadDatasources: this.model.functionItemReadDatasources
          ? this.model.functionItemReadDatasources
          : []
      }

      return model
    },
    deleteDatasource(index, id) {
      if (id) {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteRecordDatasource(index, id)
        })
      } else {
        this.model.functionItemReadDatasources.splice(index, 1)
      }
    },
    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecordDatasource(index, id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.repository.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.model.functionItemReadDatasources.splice(index, 1)

        this.$emit('success')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    addNewFunctionItemReadDataSource() {
      this.model.functionItemReadDatasources.push({
        api_id: undefined,
        api_version_code: undefined,
        api_response_pk: undefined,
        api_response_datasource_pk: undefined,
        description: ''
      })
    },
    /**
     * Shows the drawer and sets the data for editing.
     */
    async showDrawer(idItem) {
      this.model = {
        item_pk: undefined,
        functionItemReadDatasources: []
      }
      if (idItem) {
        this.drawerTitle =
          this.$t('common.update') +
          ' ' +
          this.$t('module.functionItemReadDatasource')
        const { data: { result: { data } } } = await this.$api.functionItem.show(idItem)
        this.model = data
        for (let i = 0; i < this.model.functionItemReadDatasources.length; i++) {
          this.changeApi(i, true)
          this.changeApiVersion(i, true)
          this.changeApiRespone(i, true)
        }
      } else {
        this.addNewFunctionItemReadDataSource()
        this.drawerTitle =
          this.$t('common.create') +
          ' ' +
          this.$t('module.functionItemReadDatasource')
      }
      this.visible = true
    },

    changeApi(index, open) {
      const api = this.apis.find(item => item.id === this.model.functionItemReadDatasources[index].api_id)
      this.apiVersions[index] = api.version
      if (!open) {
        this.model.functionItemReadDatasources[index].api_response_pk = undefined
        this.model.functionItemReadDatasources[index].api_response_datasource_pk = undefined
        if (this.apiVersions[index].length > 0) {
          this.model.functionItemReadDatasources[index].api_version_code = this.apiVersions[index][0].version_code
          this.changeApiVersion(index)
        }
      }
    },

    async changeApiVersion(index, open) {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id,
          api_id: this.model.functionItemReadDatasources[index].api_id,
          version_code: this.model.functionItemReadDatasources[index].api_version_code,
          isDatasource: true,
          use_flg: USE_FLG_VALUE.yes
        }
        const { data: { result: { data } } } = await this.$api.apiResponse.list({ params })
        if (!open) {
          this.model.functionItemReadDatasources[index].api_response_pk = undefined
          this.model.functionItemReadDatasources[index].api_response_datasource_pk = undefined
        }
        this.apiResponses[index] = data
        this.$forceUpdate()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    changeApiRespone(index, open) {
      const apiResponse = this.apiResponses[index].find(item => item.api_response_pk === this.model.functionItemReadDatasources[index].api_response_pk)

      this.apiResponseDatasources[index] = apiResponse?.apiResponseDatasources
      if (!open) {
        if (this.apiResponseDatasources[index].length === 1) {
          this.model.functionItemReadDatasources[index].api_response_datasource_pk = this.apiResponseDatasources[index][0].api_response_datasource_pk
        } else {
          this.model.functionItemReadDatasources[index].api_response_datasource_pk = undefined
        }
      }
    },

    /**
     * Add api parameter
     */
    addApiParameterChild() {
      this.id = 0
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
            data.project_id = this.$store.state.project.id
            data.function_id = this.version.function_id
            data.version_code = this.version.version_code

            if (data.functionItemReadDatasources.some(datasource => datasource.id)) {
              await this.repository.update(data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.onClose()
            this.$emit('save')
            this.$emit('success')
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

    /**
     * Saves the changes by emitting a 'save' event.
     */
    success() {
      this.$emit('success')
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
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
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
      this.$store.dispatch('setLoading', true)

      try {
        if (id) {
          await this.$api.apiParameter.delete(id)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.onClose()
        this.$emit('success')
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', true)
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
  .ant-form-item:not(.default) {
    position: relative;
    .ant-form-explain {
      position: absolute;
    }
    .ant-form-item-children {
      position: relative;
    }
  }
  .heading-text {
    font-weight: 700;
  }
}
</style>
