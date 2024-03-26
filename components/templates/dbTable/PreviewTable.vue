<template>
  <a-modal
    :visible="openModal"
    :width="980"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="this"
            :label-col="{ sm: 6 }"
            :wrapper-col="{ sm: 18 }"
            @submit.prevent="handleSubmit"
          >
            <div v-for="(table, index) in model.tables" :key="index">
              <div class="table-name p-4">
                <span>{{ $t('module.dbTableColumn.db_table_id') + ': ' + table.table_name }}</span>
              </div>
              <a-table
                :columns="columns"
                :row-key="getRowKey"
                :data-source="table.columns"
                :pagination="false"
                :loading="loading"
                :scroll="{ x: 900 }"
                @change="handleTableChange"
              >
                <template slot="name" slot-scope="text, record">
                  <div>
                    {{ record?.column_name }}
                  </div>
                </template>
                <template slot="description" slot-scope="text, record">
                  <div>
                    {{ record?.comment }}
                  </div>
                </template>
                <template slot="primary_key" slot-scope="text, record">
                  <div v-if="record?.auto_increment && record?.auto_increment === 'auto_increment'">
                    <a-icon type="key" />
                  </div>
                </template>
              </a-table>
            </div>
            <div class="text-center p-3">
              <a-button
                html-type="submit"
                type="primary"
                :disabled="!hasUpdate || loading"
                :title=" model.id ? 'Chỉnh sửa' : 'Tạo mới'"
                class="min-w-100"
              >
                {{ model.id ? $t('common.update') : $t('common.create') }}
              </a-button>

                &nbsp;
              <a-button
                html-type="button"
                type="default"
                class="min-w-100"
                title="Huỷ bỏ"
                @click="close"
              >
                {{ $t('common.cancel') }}
              </a-button>
            </div>
          </a-form-model>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import DataTable from '~/mixins/data-table'
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE } from '~/constants'

export default {
  components: {
  },
  mixins: [
    DataTable
  ],
  props: {
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      model: {
        tables: []
      },
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      visible: false,
      resource: 'dbTable',
      hasUpdate: false
    }
  },
  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: 'No',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$t('module.dbTableColumn.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('module.dbTableColumn.description'),
          dataIndex: 'description',
          scopedSlots: { customRender: 'description' }
        },
        {
          title: this.$t('module.dbTableColumn.data_type'),
          dataIndex: 'data_type',
          scopedSlots: { customRender: 'data_type' }
        },
        {
          title: this.$t('module.dbTableColumn.length'),
          dataIndex: 'length',
          scopedSlots: { customRender: 'length' }
        },
        {
          title: this.$t('module.dbTableColumn.null'),
          dataIndex: 'nullable',
          scopedSlots: { customRender: 'null' }
        },
        {
          title: this.$t('module.dbTableColumn.default_value'),
          dataIndex: 'default_value',
          scopedSlots: { customRender: 'default_value' },
          width: 100
        },
        {
          title: this.$t('module.dbTableColumn.primary_key'),
          dataIndex: 'primary_key',
          align: 'center',
          scopedSlots: { customRender: 'primary_key' },
          width: 120
        }
      ]
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    /**
     * Get row key
     */
    getRowKey(record, index) {
      if (record.key) {
        return record.key
      }
      if (record.id) {
        return record.id
      }
      return `temp-row-key-${index}`
    },
    open(data, isUpdate) {
      if (isUpdate) {
        this.hasUpdate = true
      }
      this.handleTable(data)
      this.openModal = true
    },
    handleTable(data) {
      this.model = data
      const table = data.tables
        .replace(/`/g, '') // Loại bỏ dấu ` trong tên cột
        .replace(/COMMENT '([^']+)'/g, "COMMENT '$1'") // Giữ nguyên dấu ' trong phần comment
        .replace(/DEFAULT '([^']+)'/g, 'DEFAULT ($1)') // Loại bỏ dấu ' trong phần default
        .replace(/COLLATE '([^']+)'/g, 'COLLATE $1') // Loại bỏ dấu ' trong phần collate
        .replace(/(\() ([^\s]+) (\))/g, '($2)') // Loại bỏ khoảng trắng dư thừa trong phần khai báo kiểu dữ liệu
        .replace(/=([^\s]+)/g, ' $1') // Loại bỏ dấu = dư thừa trong các phần tử khác
        .replace(/'utf8mb4_unicode_ci'/g, 'utf8mb4_unicode_ci') // Loại bỏ dấu nháy đơn trong phần COLLATE
        .replace(/INDEX [\s\S]*?\n/g, '') // Xoá bỏ các dòng bắt đầu bằng INDEX
        .replace(/,(\n\s+)?\)/g, '\n)') // Xoá bỏ dấu phẩy ở cuối dòng trước khi có dấu đóng ngoặc đơn
        .replace(/(\b)year_month(\b)/g, '`year_month`') // Thay thế "year_month" thành "`year_month`"
        .replace(/(\b)order(\b)/g, '`order`') + ';' // Thay thế "order" thành "`order`"

      const parseTable = this.$sqlParser.parse(table)
      let columnOrder = 1
      const newTableInfo = parseTable.map(item => {
        const tableInfo = {
          table_name: item.table[0].table,
          columns: item.create_definitions.map(column => {
            if (column.column) {
              const columnInfo = {
                column_name: column.column.column,
                data_type: column.definition.dataType,
                length: column.definition.length ?? null,
                nullable: column.nullable ? column.nullable?.value : 'null',
                default_value: column.default_val?.value?.value !== undefined ? column.default_val.value.value
                  : column.default_val?.value?.column !== undefined ? column.default_val.value.column
                    : null,
                comment: column.comment?.value?.value ?? null,
                auto_increment: column?.auto_increment ?? null,
                order: columnOrder
              }
              columnOrder++
              return columnInfo
            }
            return null
          }).filter(column => column !== null)
        }
        return tableInfo
      })
      data.tables = newTableInfo
      this.model.tables = newTableInfo
    },
    close() {
      this.openModal = false
      this.hasUpdate = false
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            if (this.model.id) {
              await this.repository.updateDbTable(this.model.id, data)
            } else {
              await this.repository.createDbTable(data)
            }
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.close()
            setTimeout(() => {
              this.$emit('save')
            }, 500)
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
.table-name {
  span {
    font-size: 16px;
    font-weight: 700;
  }
}
</style>
