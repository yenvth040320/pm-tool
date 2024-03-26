<template>
  <div>
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
            class="table-mst-lifecycle"
          >
            <template
              slot="mst_life_cycle"
              slot-scope="text, record"
            >
              <span>
                {{ record.name }}
              </span>
            </template>
          </a-table>
        </a-col>
        <!--  end table mst life cycle -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="centerColumns"
            :row-key="record => record.id"
            :data-source="dataChecklist"
            :pagination="false"
            :custom-row="customRowCenter"
            :row-class-name="rowClassName"
            :scroll="{ y: 700 }"
          >
            <template
              slot="checklist"
              slot-scope="text, itemCenter"
            >
              <a-input v-model="itemCenter.name" />
            </template>
            <template
              slot="action"
              slot-scope="text, itemCenter"
            >
              <div v-if="itemCenter.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="submitChecklist(itemCenter)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(itemCenter.id, 'checklist')" />
              </div>
              <div v-if="!itemCenter.id && selectedRowLeft">
                <a-icon type="plus" @click="submitChecklist(itemCenter)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!--  end table checklist -->
        <a-col :span="11" style="margin-left: 2%">
          <a-table
            :columns="rightColumns"
            :row-key="record => record.id"
            :data-source="dataRightTable"
            :pagination="false"
            :scroll="{ y: 700 }"
          >
            <template
              slot="check_list_detail"
              slot-scope="text, itemRight"
            >
              <a-input v-model="itemRight.name" />
            </template>
            <template
              slot="action"
              slot-scope="text, itemRight"
            >
              <div v-if="itemRight.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="submitChecklistDetail(itemRight)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(itemRight.id, 'checklistDetail')" />
              </div>
              <div v-if="!itemRight.id && selectedRowLeft">
                <a-icon type="plus" @click="submitChecklistDetail(itemRight)" />
              </div>
            </template>
          </a-table>
        </a-col>
      </a-spin>
    </a-row>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import { cloneDeep } from 'lodash'
import DataTable from '~/mixins/data-table'
import {
  SORT,
  FORMAT_DATE_FULL
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {},

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
        project_id: this.project_id
      }

      const { data: { result: { data } } } = await this.repository.getDataChecklist({ params })
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
      resource: 'checklist',
      SORT,
      FORMAT_DATE_FULL,
      moment,
      selectedRowLeft: 0,
      selectedRowCenter: 0,
      visible: false,
      currentId: 0,
      dataRightTable: [],
      project_id: this.$route.params.id || 0,
      dataChecklist: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    leftColumns() {
      return [
        {
          title: this.$t('module.tab_check_list.mst_life_cycle'),
          scopedSlots: { customRender: 'mst_life_cycle' },
          width: 50
        }
      ]
    },

    centerColumns() {
      return [
        {
          title: this.$t('module.checklist'),
          scopedSlots: { customRender: 'checklist' },
          width: 200
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    rightColumns() {
      return [
        {
          title: this.$t('module.tab_check_list.check_list_detail'),
          scopedSlots: { customRender: 'check_list_detail' },
          width: 420
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
            this.dataRightTable = []
            this.dataChecklist = []
            const clone = cloneDeep(record.checklists)
            this.dataChecklist = clone.map(item => {
              return { ...item, isSelected: false }
            })
            this.dataChecklist.push({
              id: 0,
              project_id: this.project_id,
              mst_life_cycle_id: record.id,
              name: '',
              use_flg: 1,
              isSelected: false,
              checklist_details: []
            })
          }
        }
      }
    },

    /**
     * Custom row event of table checklist center
     */
    customRowCenter(record) {
      return {
        on: {
          click: () => {
            if (this.dataChecklist.some(col => col.isSelected === true)) {
              this.dataChecklist.find(item => item.id === this.selectedRowCenter).isSelected = false
            }
            this.selectedRowCenter = record.id
            record.isSelected = true
            this.dataRightTable = []
            if (record.id) {
              this.dataRightTable = cloneDeep(record.checklist_details)
              this.dataRightTable.push({
                id: 0,
                project_id: this.project_id,
                checklist_id: record.id,
                name: '',
                use_flg: 1
              })
            }
          }
        }
      }
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id, repo) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id, repo)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id, repo) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api[repo].delete(id)
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.handleDataAfterFetching()
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
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
          this.dataChecklist = []
          const clone = cloneDeep(currentRow.checklists)
          this.dataChecklist = clone.map(item => {
            return { ...item, isSelected: false }
          })
          this.dataChecklist.push({
            id: 0,
            project_id: this.project_id,
            mst_life_cycle_id: currentRow.id,
            name: '',
            use_flg: 1,
            isSelected: false,
            checklist_details: []
          })
        }
      }
      if (this.selectedRowCenter) {
        const currentChecklist = this.dataChecklist.find(item => item.id === this.selectedRowCenter)
        if (currentChecklist) {
          currentChecklist.isSelected = true
          this.dataRightTable = []
          this.dataRightTable = cloneDeep(currentChecklist.checklist_details)
          this.dataRightTable.push({
            id: 0,
            project_id: this.project_id,
            checklist_id: currentChecklist.id,
            name: '',
            use_flg: 1
          })
        }
      }
    },

    /**
     * create or update a checklist
     *
     * @param record
     */
    async submitChecklist(record) {
      if (record.name === '') {
        this.$notification.error({
          message: this.$t('module.tab_check_list.required_checklist_name.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.mst_life_cycle_id = this.selectedRowLeft
        data.project_id = this.project_id
        delete data.id
        if (record.id) {
          await this.$api.checklist.update(record.id, data)
        } else {
          await this.$api.checklist.create(data)
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
     * create or update a checklist detail
     *
     * @param record
     */
    async submitChecklistDetail(record) {
      if (record.name === '') {
        this.$notification.error({
          message: this.$t('module.tab_check_list.required_checklist_detail_name.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        data.checklist_id = this.selectedRowCenter
        data.project_id = this.project_id
        delete data.id
        if (record.id) {
          await this.$api.checklistDetail.update(record.id, data)
        } else {
          await this.$api.checklistDetail.create(data)
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
