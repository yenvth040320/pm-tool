<template>
  <div>
    <a-card class="mb-4">
      <template slot="extra">
        <a href="https://mermaid.live/" target="_blank">
          {{ '[' + $t('common.live_editor') + ']' }}
        </a>
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
      </template>
      <a-row class="main-row">
        <a-spin :spinning="loading">
          <a-col :span="3">
            <div class="table-wrap">
              <table class="table table-striped" style="width: 100%;">
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">
                      {{ $t('module.entityRelationship.entity_id_1') }}
                    </th>
                  </tr>
                </thead>
                <draggable :list="data" tag="tbody" @change="updatePosition">
                  <tr v-for="(record, index) in data" :key="index">
                    <td
                      scope="row"
                      :class="[ record.isSelected ? 'selected' : '']"
                      @click="selectEntity(record)"
                      @dblclick="updateEntity(record)"
                    >
                      <div class="text-center">
                        {{ record.name }}
                      </div>
                    </td>
                  </tr>
                </draggable>
              </table>
            </div>
          </a-col>
          <a-col :span="20" style="margin-left: 2%">
            <a-table
              :columns="rightColumns"
              :row-key="record => record.id"
              :data-source="dataRightTable"
              :pagination="false"
              :scroll="{ y: 700 }"
            >
              <template
                slot="relation_1"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.relation_1"
                >
                  <a-select-option
                    v-for="(item, index) in ENTITY_RELATION"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template
                slot="type"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.type"
                >
                  <a-select-option
                    v-for="(item, index) in ENTITY_RELATION_TYPE"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template
                slot="relation_2"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.relation_2"
                >
                  <a-select-option
                    v-for="(item, index) in ENTITY_RELATION"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template
                slot="entity_id_2"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.entity_id_2"
                >
                  <a-select-option
                    v-for="(item, index) in data"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </template>
              <template
                slot="relation_label"
                slot-scope="text, itemRight"
              >
                <a-input v-model="itemRight.relation_label" />
              </template>
              <template
                slot="description"
                slot-scope="text, itemRight"
              >
                <a-textarea v-model="itemRight.description" :rows="3" />
              </template>
              <template
                slot="action"
                slot-scope="text, itemRight"
              >
                <div v-if="itemRight.id">
                  <a-icon type="edit" theme="filled" class="edit-icon" @click="submitRelation(itemRight)" />
                  <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(itemRight.id)" />
                </div>
                <div v-if="!itemRight.id && selectedRowLeft">
                  <a-icon type="plus" @click="submitRelation(itemRight)" />
                </div>
              </template>
            </a-table>
          </a-col>
        </a-spin>
      </a-row>
    </a-card>
    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.entity') }}
      </template>
      <a-spin :spinning="loading">
        <entity-update-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'
import DataTable from '~/mixins/data-table'
import {
  ENTITY_RELATION,
  ENTITY_RELATION_1_SYMBOLS,
  ENTITY_RELATION_2_SYMBOLS,
  ENTITY_RELATION_VALUE,
  ENTITY_RELATION_TYPE,
  ENTITY_RELATION_TYPE_VALUE,
  COLUMN_DATA_TYPE_VALUE,
  SORT
} from '~/constants'
import EntityUpdateForm from '~/components/templates/entity/EntityUpdateForm'

export default {
  /**
   * Declare components.
   */
  components: {
    EntityUpdateForm,
    draggable
  },

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = {
        project_id: this.$store.state.project.id,
        order_by: 'position',
        order_type: SORT.asc
      }

      const { data: { result: { data } } } = await this.repository.getEntityRelation({ params })
      const newData = data.map(item => {
        return { ...item, isSelected: false }
      })
      this.data = newData
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'entity',
      ENTITY_RELATION_VALUE,
      ENTITY_RELATION_1_SYMBOLS,
      ENTITY_RELATION_2_SYMBOLS,
      ENTITY_RELATION,
      ENTITY_RELATION_TYPE,
      ENTITY_RELATION_TYPE_VALUE,
      COLUMN_DATA_TYPE_VALUE,
      SORT,
      selectedRowLeft: 0,
      visible: false,
      currentId: 0,
      dataRightTable: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    rightColumns() {
      return [
        {
          title: this.$t('module.entityRelationship.relation_1'),
          scopedSlots: { customRender: 'relation_1' },
          width: 100
        },
        {
          title: this.$t('module.entityRelationship.type'),
          scopedSlots: { customRender: 'type' },
          width: 70
        },
        {
          title: this.$t('module.entityRelationship.relation_2'),
          scopedSlots: { customRender: 'relation_2' },
          width: 100
        },
        {
          title: this.$t('module.entityRelationship.entity_id_2'),
          scopedSlots: { customRender: 'entity_id_2' },
          width: 100
        },
        {
          title: this.$t('module.entityRelationship.relation_label'),
          scopedSlots: { customRender: 'relation_label' },
          dataIndex: 'relation_label',
          width: 120
        },
        {
          title: this.$t('module.entityRelationship.description'),
          scopedSlots: { customRender: 'description' },
          dataIndex: 'description',
          width: 170
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  /**
   * Methods.
   */
  methods: {
    /**
     * Close dialog.
     *
     * @param {boolean} fetch - fetch status.
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * create or update a relation
     *
     * @param record
     */
    async submitRelation(record) {
      if (record.relation_1 === null || record.relation_2 === null || record.entity_id_2 === null) {
        this.$notification.error({
          message: this.$t('module.entityRelationship.required_mess')
        })
        return
      }
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.entity_id_1 = this.selectedRowLeft
        data.project_id = this.$store.state.project.id
        delete data.id
        if (record.id) {
          await this.$api.entityRelationship.update(record.id, data)
        } else {
          await this.$api.entityRelationship.create(data)
        }
        await this.$fetch()
        this.handleDataAfterFetching()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
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
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.entityRelationship.delete(id)
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.handleDataAfterFetching()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Navigate copy to mermaid.live
     */
    copyCode() {
      let er = 'erDiagram\n'
      this.data.forEach(itemData => {
        if (itemData.relation1.length > 0) {
          itemData.relation1.forEach(relation => {
            er += `"${itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "${this.data.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
          })
        }
      })
      let tableCode = ''
      this.data.forEach(itemData => {
        if (itemData.table.length > 0) {
          itemData.table.forEach(tableItem => {
            const tableName = `"${itemData.name}"`
            let columnCode = ''
            if (tableItem.columns.length > 0) {
              tableItem.columns.forEach(columnItem => {
                columnCode += ` ${COLUMN_DATA_TYPE_VALUE[columnItem.data_type]} ${columnItem.name} "${columnItem.description ?? ''}"\n`
              })
            }
            const fullTableCode = `${tableName} {\n${columnCode}\n}\n`
            tableCode += fullTableCode
          })
        }
      })
      const result = er + tableCode
      navigator.clipboard.writeText(result)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    /**
     * Go to new
     */
    gotoNew() {
      this.$router.push({ name: 'entity-new' })
    },

    handleDataAfterFetching() {
      if (this.selectedRowLeft) {
        const currentRow = this.data.find(item => item.id === this.selectedRowLeft)
        if (currentRow) {
          currentRow.isSelected = true
          this.dataRightTable = []
          this.dataRightTable = cloneDeep(currentRow.relation1)
          this.dataRightTable.push({
            id: 0,
            entity_id_1: null,
            entity_id_2: null,
            relation_1: null,
            relation_2: null,
            relation_label: '',
            description: '',
            type: 0
          })
        }
      }
    },

    /**
     * Select entity on clicking row
     *
     * @param record
     */
    selectEntity(record) {
      if (this.selectedRowLeft !== 0 && this.data.some(col => col.isSelected === true)) {
        this.data.find(item => item.id === this.selectedRowLeft).isSelected = false
      }
      this.selectedRowLeft = record.id
      record.isSelected = true
      this.dataRightTable = []
      this.dataRightTable = cloneDeep(record.relation1)
      this.dataRightTable.push({
        id: 0,
        entity_id_1: null,
        entity_id_2: null,
        relation_1: null,
        relation_2: null,
        relation_label: '',
        description: '',
        type: 0
      })
    },

    /**
     * Open update modal on double click row
     *
     * @param record
     */
    updateEntity(record) {
      this.currentId = record.id
      this.visible = true
    },

    /**
     * Update Entity Position
     */
    async updatePosition() {
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(this.data.map((item, index) => {
          return {
            id: item.id,
            project_id: item.project_id,
            name: item.name,
            position: index + 1
          }
        }))
        await this.$api.entity.updatePosition(data)
        await this.$fetch()
        this.handleDataAfterFetching()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: transparent;
  }
  .anticon-plus > svg ,
  .anticon-edit > svg ,
  .anticon-copy > svg ,
  .anticon-delete > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}
.delete-icon {
  margin-left: 10px;
}
.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 10px 10px;
  word-wrap: break-word;
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
  .selected {
    background-color: rgb(1,247,1) !important;
  }
  > tr {
    cursor: pointer;
  }
}
.table-wrap {
  max-height: 750px;
  overflow-y: auto;
}
</style>
