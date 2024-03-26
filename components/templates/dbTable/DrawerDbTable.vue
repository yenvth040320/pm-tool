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
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item :label="$t('module.dbTable')" prop="table">
              <a-textarea
                v-model="model.tables"
                :rows="20"
                :placeholder="$t('module.dbTable')"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :label="$t('module.dbTable.entity_id')"
              prop="entity_id"
            >
              <a-select
                v-model="model.entity_id"
                :placeholder="$t('module.dbTable.entity_id')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in entityList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
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
            zIndex: 1
          }"
        >
          <a-button
            :style="{ marginRight: '8px' }"
            title="Huỷ bỏ"
            @click="onClose"
          >
            {{ $t('common.cancel') }}
          </a-button>
          <a-button html-type="submit" type="primary" title="Xem trước">
            {{ $t('common.preview') }}
          </a-button>
        </div>
      </a-form-model>
      <PreviewTable ref="previewTable" @save="save" />
    </a-drawer>
  </div>
</template>
<script>
import PreviewTable from './PreviewTable.vue'
import {
  USE_FLG_VALUE,
  COLUMN_DATA_TYPE,
  DB_COLUMN_AUTO_INCREMENT_VALUE,
  DB_COLUMN_NOT_NULL_VALUE, SORT
} from '~/constants'

export default {
  components: { PreviewTable },
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      USE_FLG_VALUE,
      COLUMN_DATA_TYPE,
      DB_COLUMN_AUTO_INCREMENT_VALUE,
      DB_COLUMN_NOT_NULL_VALUE,
      resource: 'dbTable',
      drawerTitle: '',
      model: {
        tables: ''
      },
      tableOrigin: '',
      id: 0,
      isUpdate: false,
      entityList: []
    }
  },
  /**
   * Computed event.
   */
  computed: {},
  watch: {},
  /**
   * Mounted event.
   */
  mounted() {
    this.getEntity()
  },
  methods: {
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        name: this.model.name,
        tables: this.model.tables,
        entity_id: this.model.entity_id
      }

      return model
    },
    /**
     * Shows the drawer and sets the data for editing.
     */
    async open(version) {
      if (version) {
        this.id = version.db_table_id
        await this.getColumns(version)
        this.generateCreateTableQuery(this.model)
        this.drawerTitle =
          this.$t('common.update') + ' ' + this.$t('module.dbTable')
      } else {
        this.drawerTitle =
          this.$t('common.create') + ' ' + this.$t('module.dbTable')
      }
      this.visible = true
    },

    generateCreateTableQuery(data) {
      if (data.name && data.columns) {
        const tableName = data.name
        let query = `CREATE TABLE \`${tableName}\` (\n`

        let primaryKeyColumn = null
        Object.values(data.columns).forEach(column => {
          query += `\t\`${column.name}\` ${this.getColumnType(column)} ${this.getColumnConstraints(column)},\n`

          if (column.primary_key === 1) {
            primaryKeyColumn = column.name
          }
        })
        if (primaryKeyColumn) {
          query += `\tPRIMARY KEY (\`${primaryKeyColumn}\`) USING BTREE,\n`
        }
        query = query.slice(0, -2) // Loại bỏ dấu phẩy cuối cùng và ký tự xuống dòng thừa
        query += '\n) COLLATE \'utf8mb4_unicode_ci\'\n'
        query += 'ENGINE=InnoDB;\n'
        this.model.tables = query
        this.tableOrigin = query
      }
    },

    getColumnType(column) {
      const dataType = COLUMN_DATA_TYPE.find(
        dataType => dataType.value === column.data_type
      )

      if (dataType) {
        let columnType = dataType.label.toUpperCase()

        if (column.length) {
          columnType += `(${column.length})`
        }

        return columnType
      }

      return 'VARCHAR'
    },

    getColumnConstraints(column) {
      let constraints = ''

      // Xác định các ràng buộc tương ứng với column
      if (column.not_null === DB_COLUMN_NOT_NULL_VALUE.yes) {
        if (constraints !== '') {
          constraints += ' '
        }
        constraints += 'NULL'
      } else {
        constraints += 'NOT NULL'
      }

      if (column.auto_increment === DB_COLUMN_AUTO_INCREMENT_VALUE.yes) {
        constraints += ' AUTO_INCREMENT'
      }

      if (column.default_value !== null) {
        constraints += ` DEFAULT '${column.default_value}'`
      } else if (column.not_null === DB_COLUMN_NOT_NULL_VALUE.yes) {
        constraints += ' DEFAULT NULL'
      }

      if (column.description !== null) {
        constraints += ` COMMENT '${column.description}'`
      }

      return constraints
    },

    /**
     * Closes the drawer and resets variables.
     */
    onClose() {
      this.model = {}
      this.id = 0
      this.visible = false
      this.isUpdate = false
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Get item detail
     *
     * @param {Object} version
     */
    async getColumns(version) {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          project_id: this.$store.state.project.id,
          db_table_id: version.db_table_id,
          version_code: version.version_code
        }
        const { data: { result: { data } } } = await this.$api.dbTableColumn.list({ params })
        if (data.length > 0) {
          const model = {
            id: version.db_table_id,
            name: data[0].dbTable.name,
            columns: data,
            entity_id: data[0].dbTable.entity_id
          }
          this.model = model
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    save() {
      this.onClose()
      this.$emit('saveUpdate')
      this.$emit('save')
    },

    async getEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entityList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            data.db_schema_id = this.$store.state.dbSchema.id
            if (this.model.id) {
              if (this.model.tables !== this.tableOrigin) {
                this.isUpdate = true

                // Check if the table name has changed
                const newTableName = data.tables.match(/CREATE TABLE `(.*)`/)[1]
                const originalTableName = this.tableOrigin.match(/CREATE TABLE `(.*)`/)[1]

                if (newTableName !== originalTableName) {
                  this.$notification.error({
                    message: this.$t('module.dbTable.error_update')
                  })
                  return
                }
              } else {
                this.isUpdate = false
              }
              this.$refs.previewTable.open(data, this.isUpdate)
            } else {
              this.isUpdate = true
              this.$refs.previewTable.open(data, this.isUpdate)
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
