<template>
  <div>
    <a-drawer
      :title="drawerTitle"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form-model
        ref="form"
        :model="model"
        layout="vertical"
        @submit.prevent="handleSubmit"
      >
        <a-row v-if="!isResponseJson" :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              :label="$t('module.apiResponse.name')"
              prop="name"
              :rules="{
                required: true,
                message: this.$t('validation.required', { field: this.$t('module.apiResponse.name') }),
                trigger: ['change', 'blur']
              }"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.apiResponse.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :label="$t('module.apiResponse.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :rows="5"
                :placeholder="$t('module.apiResponse.description')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-else :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              :label="$t('module.apiResponse')"
              prop="response"
            >
              <a-textarea
                v-model="model.response"
                :rows="20"
                :placeholder="$t('module.apiResponse')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider />
        <div v-if="!isResponseJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" class="heading-text pb-3">
          {{ $t('module.apiParameterDatasource') }}
        </div>
        <div v-for="(response, index) in model.apiResponseDatasources" v-show="!isResponseJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" :key="index">
          <div class="delete-btn pb-4">
            <a-button
              v-if="model.apiResponseDatasources.length >= 1"
              type="danger"
              title="Xoá"
              @click="deleteDatasource(index, response.id)"
            >
              <a-icon type="delete" />
            </a-button>
          </div>
          <a-form-model-item
            :prop="'apiResponseDatasources.' + index + '.db_schema_id'"
            :label="$t('module.apiResponse.schema')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.schema')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="response.db_schema_id"
              :placeholder="$t('module.apiResponse.schema')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeSchema(index)"
            >
              <a-select-option
                v-for="(item, i) in listSchema"
                :key="i"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            :label="$t('module.apiResponse.dbTable')"
            :prop="'apiResponseDatasources.' + index + '.db_table_id'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.dbTable')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="response.db_table_id"
              :placeholder="$t('module.apiResponse.dbTable')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeTable(index)"
            >
              <a-select-option
                v-for="(item, i) in filterTable[index]"
                :key="i"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            :prop="'apiResponseDatasources.' + index + '.db_table_version_code'"
            :label="$t('module.apiResponse.version')"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.version')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="response.db_table_version_code"
              :placeholder="$t('module.apiResponse.version')"
              allow-clear
              show-search
              :filter-option="filterOption"
              @change="changeVersion(index)"
            >
              <a-select-option
                v-for="(item, i) in filterTableVersion[index]"
                :key="i"
                :value="item.version_code"
              >
                {{ item.version_code }}: {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            v-if="model.data_type !== DATA_TYPE_VALUE.object"
            :label="$t('module.apiResponse.dbColumn')"
            :prop="'apiResponseDatasources.' + index + '.db_table_column_pk'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t('module.apiResponse.dbColumn')
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="response.db_table_column_pk"
              :placeholder="$t('module.apiResponse.dbColumn')"
              allow-clear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, i) in filterColumn[index]"
                :key="i"
                :value="item.db_table_column_pk"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item
            :label="$t('module.apiResponseDatasource.description')"
            :prop="'apiResponseDatasources.' + index + '.description'"
          >
            <a-textarea
              v-model="response.description"
              :placeholder="$t('module.apiResponseDatasource.description')"
            />
          </a-form-model-item>
          <a-divider />
        </div>
        <div v-if="!isResponseJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" class="box-button-add mt-3">
          <a-button
            type="primary"
            title="Thêm mới"
            class="button-add-university"
            @click="addNewResponseDataSource()"
          >
            <a-icon type="file-add" />
          </a-button>
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
          <a-button v-if="model.id" :style="{ marginRight: '8px' }" type="danger" title="Xoá" @click="confirmToDelete(model.id, model)">
            {{ $t('common.delete') }}
          </a-button>
          <a-button v-if="model.is_update" :style="{ marginRight: '8px' }" type="danger" title="Xoá" @click="confirmToDeleteAll(model)">
            {{ $t('common.delete') }}
          </a-button>

          <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="onClose">
            {{ $t('common.cancel') }}
          </a-button>
          <a-button v-if="isResponseJson" html-type="submit" type="primary" title="Xem trước">
            {{ $t('common.preview') }}
          </a-button>
          <a-button v-else type="default" title="Cập nhật" @click="updateResponse">
            {{ $t('common.update') }}
          </a-button>
        </div>
      </a-form-model>
      <PreviewResponseModal
        ref="previewResponse"
        :is-create="isCreate"
        @save="save"
        @onClose="onClose"
        @saveNewParent="saveNewParent"
      />
    </a-drawer>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { USE_FLG_VALUE, DATA_TYPE, DATA_TYPE_VALUE } from '~/constants'
import PreviewResponseModal from '~/components/templates/versionApi/PreviewResponseModal'

export default {
  components: {
    PreviewResponseModal
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    isJson: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      visible: false,
      USE_FLG_VALUE,
      DATA_TYPE,
      DATA_TYPE_VALUE,
      drawerTitle: '',
      parent: {},
      model: {
        response: '',
        apiResponseDatasources: []
      },
      listSchema: [],
      filterTable: {},
      filterColumn: {},
      filterTableVersion: {},
      dbTables: [],
      dbColumns: [],
      dbTableVersion: [],
      currentResponse: {},
      isResponseJson: this.isJson,
      isCreate: false
    }
  },
  watch: {
    isJson(newVal) {
      this.isResponseJson = newVal
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getListSchema()
    this.getListDbTable()
    this.getListDbColumn()
    this.getDbVersion()
  },
  methods: {
    /*
     * Delete one datasource
     */
    deleteDatasource(index, id) {
      if (id) {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteRecordDatasource(id)
        })
      } else {
        this.model.apiResponseDatasources.splice(index, 1)
      }
    },

    /**
     * Delete record
     */
    async updateUseFlgRecordDatasource(id, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg
        }
        await this.$api.apiResponseDatasource.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveNewParent')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async deleteRecordDatasource(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.apiResponseDatasource.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveNewParent')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    changeSchema(index, open) {
      if (!open) {
        this.model.apiResponseDatasources[index].db_table_id = undefined
        this.model.apiResponseDatasources[index].db_table_column_pk = undefined
        this.model.apiResponseDatasources[index].db_table_version_code = undefined
      }
      this.filterTable[index] = this.dbTables.filter(item => item.db_schema_id === this.model.apiResponseDatasources[index].db_schema_id && item.use_flg === USE_FLG_VALUE.yes)
    },

    changeTable(index, open) {
      this.filterTableVersion[index] = this.dbTableVersion.filter(item => item.db_table_id === this.model.apiResponseDatasources[index].db_table_id)
      if (!open) {
        this.model.apiResponseDatasources[index].db_table_column_pk = undefined
        if (this.filterTableVersion[index].length > 0) {
          this.model.apiResponseDatasources[index].db_table_version_code = this.filterTableVersion[index][0].version_code
          this.changeVersion(index)
        }
      }
    },

    /**
     * On change version
     */
    changeVersion(index) {
      if (this.model.apiResponseDatasources[index].db_table_id) {
        this.filterColumn[index] = this.dbColumns.filter(item => item.db_table_id === this.model.apiResponseDatasources[index].db_table_id && item.version_code === this.model.apiResponseDatasources[index].db_table_version_code && item.use_flg === USE_FLG_VALUE.yes)
      }
    },

    showDrawer(data) {
      if (data) {
        this.drawerTitle = this.$t('module.apiResponse.update')

        const recursive = (parentPK = null) => {
          const list = cloneDeep(data.filter(item => item.parent_api_response_pk === parentPK))
          const result = {}

          list.forEach(item => {
            const childResult = recursive(item.api_response_pk)
            if (item.data_type === DATA_TYPE_VALUE.object) {
              if (childResult && Object.keys(childResult).length > 0) {
                result[item.name] = childResult
              } else {
                result[item.name] = item.description
              }
            } else if (item.data_type === DATA_TYPE_VALUE.array) {
              const childArrayResult = []
              if (childResult && Object.keys(childResult).length > 0) {
                Object.values(childResult).forEach(value => {
                  childArrayResult.push(value)
                })
              }
              result[item.name] = childArrayResult
            } else if (item.data_type === DATA_TYPE_VALUE.boolean) {
              result[item.name] = item.description === '1'
            } else if (item.data_type === DATA_TYPE_VALUE.integer || item.data_type === DATA_TYPE_VALUE.float || item.data_type === DATA_TYPE_VALUE.double) {
              result[item.name] = parseFloat(item.description)
            } else {
              result[item.name] = item.description
            }
          })

          return result
        }

        const dataResponse = recursive()

        this.model.response = JSON.stringify(dataResponse, null, 2)
        this.model.is_update = data.is_update
        this.currentResponse = JSON.stringify(dataResponse)
      } else {
        this.drawerTitle = this.$t('module.apiResponse.create')
      }
      this.visible = true
    },

    /**
     * Shows the drawer and sets the data for editing.
     */
    open(parent, data) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.model = {
        response: '',
        apiResponseDatasources: []
      }
      if (data) {
        this.drawerTitle = this.$t('module.apiResponse.update')
        this.model = data
        for (let i = 0; i < this.model.apiResponseDatasources.length; i++) {
          this.changeSchema(i, true)
          this.changeTable(i, true)
          this.changeVersion(i, true)
        }
      } else {
        this.drawerTitle = this.$t('module.apiResponse.create')
      }
      if (parent) {
        this.parent = parent
      }
      this.visible = true
    },

    addNewResponseDataSource() {
      this.model.apiResponseDatasources.push({
        db_table_version_code: undefined,
        db_schema_id: undefined,
        db_table_id: undefined,
        db_table_column_pk: undefined,
        description: ''
      })
      this.$forceUpdate()
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
      this.model = {}
      this.currentResponse = {}
      this.visible = false
      this.isCreate = false
      this.$emit('close')
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id, data) {
      if (data.functionItemReadDatasources.length > 0) {
        this.$confirm({
          title: this.$t('text.confirm_delete_api_response'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgRecord(id, USE_FLG_VALUE.no)
        })
      } else {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgRecord(id, USE_FLG_VALUE.no)
        })
      }
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDeleteAll(data) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.updateUseFlgAllRecord(USE_FLG_VALUE.no)
      })
    },

    /**
     * Delete record
     */
    async updateUseFlgRecord(id, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg
        }
        await this.$api.apiResponse.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.onClose()
        this.$emit('saveNewParent')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Delete record
     */
    async updateUseFlgAllRecord(flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg,
          api_id: this.version.api_id,
          project_id: this.$store.state.project.id,
          version_code: this.version.version_code
        }
        await this.$api.apiResponse.updateMulti(data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.onClose()
        this.$emit('saveNewParent')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
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

    saveNewParent() {
      this.$emit('saveNewParent')
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.api_id = this.version.api_id
            data.version_code = this.version.version_code
            if (Object.keys(this.currentResponse).length > 0) {
              this.isCreate = false
              this.$refs.previewResponse.open(data, this.currentResponse, this.isCreate)
            } else {
              this.isCreate = true
              this.$refs.previewResponse.open(data, null, this.isCreate)
            }
          } catch (_) {
            if (_.message === this.$t('module.apiResponse.message_error_null')) {
              this.$notification.error({
                message: _.message
              })
            } else {
              this.$notification.error({
                message: this.$t('text.something_wrong')
              })
            }
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },
    updateResponse() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.api_id = this.version.api_id
            data.version_code = this.version.version_code
            if (this.model.id) {
              await this.$api.apiResponse.update(this.model.id, data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.saveNewParent()
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
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getListSchema() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.dbSchema.list({ params })
        this.listSchema = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListDbTable() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.dbTable.list({ params })
        this.dbTables = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListDbColumn() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.dbTableColumn.list({ params })
        this.dbColumns = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getDbVersion() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.dbTableVersion.list({ params })
        this.dbTableVersion = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
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
.heading-text {
  font-weight: 700;
}
</style>
