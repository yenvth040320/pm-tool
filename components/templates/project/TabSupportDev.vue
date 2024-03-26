<template>
  <div>
    <a-card class="mb-4">
      <h3 class="title">
        {{ $t('module.supportMember.tab_title') }}
      </h3>
      <a-row class="main-row">
        <a-spin :spinning="loading">
          <a-col :span="6">
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
                slot="supporters"
                slot-scope="text, record"
              >
                <span>
                  {{ record.name }}
                  <span v-if="record.supporters.filter(i => i.project_id === Number(project_id)).length > 0">
                    <a-icon type="usergroup-add" />
                  </span>
                </span>
              </template>
            </a-table>
          </a-col>
          <a-col :span="17" style="margin-left: 2%">
            <a-table
              :columns="rightColumns"
              :row-key="record => record.id"
              :data-source="dataRightTable"
              :pagination="false"
              :scroll="{ y: 700 }"
            >
              <template
                slot="supported_user"
                slot-scope="text, itemRight"
              >
                <a-select
                  v-model="itemRight.supported_user_id"
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
                  format="YYYY/MM/DD"
                />
              </template>
              <template
                slot="end_date"
                slot-scope="text, itemRight"
              >
                <a-date-picker
                  v-model="itemRight.end_date"
                  format="YYYY/MM/DD"
                />
              </template>
              <template
                slot="action"
                slot-scope="text, itemRight"
              >
                <div v-if="itemRight.id">
                  <a-icon type="edit" theme="filled" class="edit-icon" @click="submit(itemRight)" />
                  <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(itemRight.id)" />
                </div>
                <div v-if="!itemRight.id && selectedRowLeft">
                  <a-icon type="plus" @click="submit(itemRight)" />
                </div>
              </template>
            </a-table>
          </a-col>
        </a-spin>
      </a-row>
    </a-card>
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
        belong_to_project: this.project_id
      }

      const { data: { result: { data } } } = await this.repository.listSupportMember({ params })
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
      resource: 'supportMember',
      SORT,
      FORMAT_DATE_FULL,
      moment,
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
          title: this.$t('module.supportMember.supporter_id'),
          scopedSlots: { customRender: 'supporters' },
          width: 140
        }
      ]
    },

    rightColumns() {
      return [
        {
          title: this.$t('module.supportMember.supported_user_id'),
          scopedSlots: { customRender: 'supported_user' },
          width: 150
        },
        {
          title: this.$t('module.supportMember.start_date'),
          scopedSlots: { customRender: 'start_date' },
          width: 150
        },
        {
          title: this.$t('module.supportMember.end_date'),
          scopedSlots: { customRender: 'end_date' },
          width: 150
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
            this.dataRightTable = cloneDeep(record.supporters)
            this.dataRightTable = this.dataRightTable.filter(i => i.project_id === Number(this.project_id))
            this.dataRightTable.push({
              id: 0,
              supporter_id: null,
              supported_user_id: null,
              project_id: this.project_id,
              start_date: null,
              end_date: null
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
    async submit(record) {
      if (record.supported_user_id === null || record.start_date === null) {
        this.$notification.error({
          message: this.$t('module.supportMember.required_mess')
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
        data.start_date = data.start_date ? moment(data.start_date).format(FORMAT_DATE_FULL) : null
        data.end_date = data.end_date ? moment(data.end_date).format(FORMAT_DATE_FULL) : null
        data.supporter_id = this.selectedRowLeft
        data.project_id = this.project_id
        delete data.id
        if (record.id) {
          await this.repository.update(record.id, data)
        } else {
          await this.repository.create(data)
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
        await this.repository.delete(id)
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
          this.dataRightTable = cloneDeep(currentRow.supporters)
          this.dataRightTable = this.dataRightTable.filter(i => i.project_id === Number(this.project_id))
          this.dataRightTable.push({
            id: 0,
            supporter_id: null,
            supported_user_id: null,
            project_id: this.project_id,
            start_date: null,
            end_date: null
          })
        }
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
