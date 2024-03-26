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
        ref="formChild"
        :model="model"
        layout="vertical"
        @submit.prevent="handleSubmit"
      >
        <a-row :gutter="16">
          <a-col :span="12">
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
          <a-col :span="12">
            <a-form-model-item
              :label="$t('module.apiResponse.data_type')"
              prop="data_type"
              :rules="{
                required: true,
                message: this.$t('validation.required', { field: this.$t('module.apiResponse.data_type') }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="model.data_type"
                :placeholder="$t('module.apiResponse.data_type')"
                allow-clear
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in DATA_TYPE"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              :label="$t('module.apiResponse.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :rows="4"
                :placeholder="$t('module.apiResponse.description')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider />
        <div v-for="(response, index) in model.apiResponseDatasources" :key="index">
          <div class="delete-btn pb-4">
            <a-button
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
        </div>
        <div class="box-button-add mt-3">
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
          <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="onClose">
            {{ $t('common.cancel') }}
          </a-button>
          <a-button html-type="submit" type="primary" :title="model.id ? 'Cập nhật' : 'Tạo mới'">
            {{ model.id ? $t('common.update') : $t('common.create') }}
          </a-button>
        </div>
      </a-form-model>
    </a-drawer>
  </div>
</template>
<script>
import { USE_FLG_VALUE, DATA_TYPE, DATA_TYPE_VALUE } from '~/constants'
export default {
  components: {
  },
  props: {
    parent: {
      type: [Object],
      default: () => {}
    },
    version: {
      type: [Object],
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      USE_FLG_VALUE,
      DATA_TYPE,
      DATA_TYPE_VALUE,
      drawerTitle: '',
      model: {
        name: undefined,
        data_type: undefined,
        apiResponseDatasources: []
      },
      listSchema: [],
      filterTable: {},
      filterColumn: {},
      filterTableVersion: {},
      dbTables: [],
      dbColumns: [],
      dbTableVersion: []
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
    changeSchema(index, open) {
      if (!open) {
        this.model.apiResponseDatasources[index].db_table_id = undefined
        this.model.apiResponseDatasources[index].db_table_column_pk = undefined
        this.model.apiResponseDatasources[index].db_table_version_code = undefined
      }
      this.filterTable[index] = this.dbTables.filter(item => item.db_schema_id === this.model.apiResponseDatasources[index].db_schema_id)
    },

    changeTable(index, open) {
      if (!open) {
        this.model.apiResponseDatasources[index].db_table_column_pk = undefined
      }
      this.filterTableVersion[index] = this.dbTableVersion.filter(item => item.db_table_id === this.model.apiResponseDatasources[index].db_table_id)
    },

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

    changeVersion(index) {
      if (this.model.apiResponseDatasources[index].db_table_id) {
        this.filterColumn[index] = this.dbColumns.filter(item => item.db_table_id === this.model.apiResponseDatasources[index].db_table_id && item.version_code === this.model.apiResponseDatasources[index].db_table_version_code)
      }
    },
    /**
     * Shows the drawer and sets the data for editing.
     */
    open() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
      this.model = {
        name: undefined,
        data_type: undefined,
        description: undefined,
        apiResponseDatasources: []
      }
      this.drawerTitle = this.$t('module.apiResponse.create') + ' ' + this.parent.name
      this.visible = true
    },

    addNewResponseDataSource() {
      this.model.apiResponseDatasources.push({
        db_table_version_code: undefined,
        db_schema_id: undefined,
        db_table_id: undefined,
        db_table_column_pk: undefined
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
      this.visible = false
      this.$emit('close')
    },

    handleSubmit() {
      this.$refs.formChild.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.api_id = this.version.api_id
            data.version_code = this.version.version_code
            data.parent_api_response_pk = this.parent.api_response_pk
            if (this.model.id) {
              await this.$api.apiResponse.update(this.model.id, data)
            } else {
              await this.$api.apiResponse.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('saveChild')
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
          project_id: this.$store.state.project.id
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
