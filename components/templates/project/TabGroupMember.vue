<template>
  <div>
    <a-card class="mb-4 no-border">
      <h3 class="title">
        {{ $t('module.groupMember.title') }}
      </h3>
      <h4>
        {{ $t('module.groupMember.sub_title') }}
      </h4>
      <a-row class="main-row">
        <a-spin :spinning="loading">
          <a-col :span="4">
            <a-table
              :columns="leftColumns"
              :row-key="record => record.id"
              :data-source="data"
              :pagination="false"
              :custom-row="customRowLeft"
              :row-class-name="rowClassName"
              :scroll="{ y: 700 }"
            >
              <template
                slot="name"
                slot-scope="text, itemLeft"
              >
                <span v-if="itemLeft.groupMembers.filter(i => i.project_id === Number(project_id)).length > 0">
                  {{ itemLeft.name }}
                  <a-icon type="usergroup-add" />
                </span>
                <span v-else>
                  {{ itemLeft.name }}
                </span>
              </template>
            </a-table>
          </a-col>
          <a-col :span="19" style="margin-left: 2%">
            <a-table
              :columns="rightColumns"
              :row-key="record => record.id"
              :data-source="dataRightTable"
              :pagination="false"
              :scroll="{ y: 700 }"
            >
              <template
                slot="member_id"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.member_id"
                  :placeholder="$t('module.groupMember.member_id')"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="(item, index) in filterUser"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </template>
              <template
                slot="start_date"
                slot-scope="text, itemRight"
              >
                <a-date-picker
                  v-model="itemRight.start_date"
                  :placeholder="$t('module.groupMember.start_date')"
                  format="YYYY/MM/DD"
                  style="width:100%; min-width: 180px;"
                />
              </template>

              <template
                slot="end_date"
                slot-scope="text, itemRight"
              >
                <a-date-picker
                  v-model="itemRight.end_date"
                  :placeholder="$t('module.groupMember.end_date')"
                  format="YYYY/MM/DD"
                  style="width:100%; min-width: 180px;"
                />
              </template>
              <template
                slot="flg_add_point"
                slot-scope="text, itemRight"
              >
                <a-checkbox
                  v-model="itemRight.flg_add_point"
                />
              </template>
              <template
                slot="is_direct_manager"
                slot-scope="text, itemRight"
              >
                <a-checkbox
                  v-model="itemRight.is_direct_manager"
                />
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
import moment from 'moment-timezone'
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
  FLG_ADD_POINT,
  SORT
} from '~/constants'
import EntityUpdateForm from '~/components/templates/entity/EntityUpdateForm'

export default {
  /**
     * Declare components.
     */
  components: {
    EntityUpdateForm
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
        order_by: 'id',
        order_type: SORT.asc,
        belong_to_project: this.project_id
      }

      const { data: { result: { data } } } = await this.$api.user.getGroupMembers({ params })
      const newData = data.map(item => {
        return { ...item, isSelected: false }
      })
      this.data = newData.sort((a, b) => a.id - b.id)
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
      FLG_ADD_POINT,
      selectedRowLeft: 0,
      visible: false,
      currentId: 0,
      dataRightTable: [],
      project_id: this.$route.params.id || 0,
      filterUser: []
    }
  },

  /**
     * Computed event.
     */
  computed: {
    leftColumns() {
      return [
        {
          title: this.$t('module.groupMember.leader_id'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        }
      ]
    },

    rightColumns() {
      return [
        {
          title: this.$t('module.groupMember.member_id'),
          scopedSlots: { customRender: 'member_id' },
          width: 100
        },
        {
          title: this.$t('module.groupMember.start_date'),
          scopedSlots: { customRender: 'start_date' },
          width: 100
        },
        {
          title: this.$t('module.groupMember.end_date'),
          scopedSlots: { customRender: 'end_date' },
          width: 100
        },
        {
          title: this.$t('module.groupMember.flg_add_point'),
          scopedSlots: { customRender: 'flg_add_point' },
          width: 100
        },
        {
          title: this.$t('module.groupMember.direct_manager'),
          scopedSlots: { customRender: 'is_direct_manager' },
          width: 100
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 80
        }
      ]
    }
  },

  created() {
    this.$bus.$on('addMember', addMember => {
      this.$fetch()
    })
  },

  /**
     * Mounted event.
     */
  mounted() {
  },

  /**
     * Methods.
     */
  methods: {
    /**
       * Custom css class for row
       */
    rowClassName(record) {
      if (record.isSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Filter search option
     *
     * @param input
     * @param option
     * @returns {boolean}
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

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
       * Custom row event of table column left
       */
    customRowLeft(record) {
      return {
        on: {
          click: () => {
            if (this.selectedRowLeft !== 0 && this.data.some(col => col.isSelected === true)) {
              this.data.find(item => item.id === this.selectedRowLeft).isSelected = false
            }
            this.selectedRowLeft = record.id
            record.isSelected = true
            this.filterUser = this.data.filter(i => i.id !== this.selectedRowLeft)
            this.dataRightTable = []
            this.dataRightTable = cloneDeep(record.groupMembers)
            this.dataRightTable = this.dataRightTable.filter(i => i.project_id === Number(this.project_id))
            this.dataRightTable.push({
              id: 0,
              leader_id: undefined,
              member_id: undefined,
              start_date: null,
              end_date: null,
              flg_add_point: 0,
              is_direct_manager: 0,
              project_id: this.project_id
            })
          }
        }
      }
    },

    /**
       * create or update a relation
       *
       * @param record
       */
    async submitRelation(record) {
      if (record.member_id === undefined || record.start_date === null) {
        this.$notification.error({
          message: this.$t('module.groupMember.required_mess')
        })
        return
      }
      if (record.start_date && record.end_date) {
        const start = moment(record.start_date)
        const end = moment(record.end_date)
        if (start.isSameOrAfter(end)) {
          this.$notification.error({
            message: this.$t('module.tab_schedule.validate_date_err_message')
          })
          return
        }
      }
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.leader_id = this.selectedRowLeft
        data.start_date = data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null
        data.end_date = data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : null
        if (data.flg_add_point === true || data.flg_add_point === 1) {
          data.flg_add_point = 1
        } else {
          data.flg_add_point = 0
        }
        if (data.is_direct_manager === true || data.is_direct_manager === 1) {
          data.is_direct_manager = 1
        } else {
          data.is_direct_manager = 0
        }
        data.project_id = this.project_id
        delete data.id
        if (record.id) {
          await this.$api.groupMember.update(record.id, data)
        } else {
          await this.$api.groupMember.create(data)
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
        await this.$api.groupMember.delete(id)
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

    handleDataAfterFetching() {
      if (this.selectedRowLeft) {
        const currentRow = this.data.find(item => item.id === this.selectedRowLeft)
        if (currentRow) {
          currentRow.isSelected = true
          this.dataRightTable = []
          this.dataRightTable = cloneDeep(currentRow.groupMembers)
          this.dataRightTable = this.dataRightTable.filter(i => i.project_id === Number(this.project_id))
          this.dataRightTable.push({
            id: 0,
            leader_id: undefined,
            member_id: undefined,
            project_id: this.project_id,
            start_date: null,
            end_date: null,
            flg_add_point: 0,
            is_direct_manager: 0
          })
        }
      }
    },

    /**
     * Check share.
     */
    checked(add) {
      if (add === FLG_ADD_POINT) {
        return true
      }
      return false
    }

  }
}
</script>
<style lang="scss" scoped>
  /deep/ {
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: transparent;
    }
    .ant-table-tbody {
      .selected {
        background-color: rgb(1,247,1) !important;
      }
      > tr {
        cursor: pointer;
      }
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
  .title {
    font-weight: 700;
  }
</style>
