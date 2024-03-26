<template>
  <div>
    <a-row class="main-row">
      <a-spin :spinning="loading">
        <!--  end table mst life cycle -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="parentColumns"
            :row-key="record => record.id"
            :data-source="actionParent"
            :pagination="false"
            :custom-row="customRowParent"
            :row-class-name="rowClassName"
            :scroll="{ y: 700 }"
          >
            <template
              slot="action_list_parent"
              slot-scope="text, record"
            >
              <a-input v-model="record.name" @blur="record.name=record.name.trim()" />
            </template>
            <template
              slot="action"
              slot-scope="text, record"
            >
              <div v-if="record.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="submitActionParent(record)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(record.id, 'actionParent')" />
              </div>
              <div v-if="!record.id">
                <a-icon type="plus" @click="submitActionParent(record)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!--  end table action -->
        <a-col :span="11" style="margin-left: 2%">
          <a-table
            :columns="chillColumns"
            :row-key="record => record.id"
            :data-source="actionChill"
            :pagination="false"
            :scroll="{ y: 700 }"
          >
            <template
              slot="action_list_parent_chill"
              slot-scope="text, record"
            >
              <a-input v-model="record.name" @blur="record.name=record.name.trim()" />
            </template>
            <template
              slot="action"
              slot-scope="text, record, index"
            >
              <div v-if="record.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="submitActionChill(record, index)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(record.id, 'actionChill')" />
              </div>
              <div v-if="!record.id">
                <a-icon type="plus" @click="submitActionChill(record, index)" />
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
  SORT
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
        project_id: this.project_id,
        all: true
      }

      const { data: { result: { data } } } = await this.repository.list({ params })
      const newData = data.map(item => {
        return { ...item, isSelected: false }
      })
      this.data = newData
      this.actionParent = newData.filter(item => {
        return item.parent_id === 0
      })

      this.actionParent.push({
        name: '',
        project_id: this.project_id,
        parent_id: 0
      })
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
      resource: 'action',
      SORT,
      moment,
      selectedRowParent: 0,
      visible: false,
      currentId: 0,
      actionChill: [],
      project_id: this.$store.state.project.id,
      actionParent: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    parentColumns() {
      return [
        {
          title: this.$t('module.action.action_list_parent'),
          scopedSlots: { customRender: 'action_list_parent' },
          width: 200
        },
        {
          title: this.$t('common.action'),
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    chillColumns() {
      return [
        {
          title: this.$t('module.action.action_list_chill'),
          scopedSlots: { customRender: 'action_list_parent_chill' },
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
     * Custom row event of table action center
     */
    customRowParent(record) {
      return {
        on: {
          click: () => {
            if (this.actionParent.some(col => col.isSelected === true)) {
              this.actionParent.find(item => item.id === this.selectedRowParent).isSelected = false
            }
            this.actionChill = []
            this.selectedRowParent = record.id
            record.isSelected = true
            if (record.id) {
              this.actionChill = this.data.filter(item => {
                return item.parent_id === record.id
              })
              this.actionChill.push({
                project_id: this.project_id,
                parent_id: record.id,
                name: ''
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
    confirmToDelete(id, rep) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id, rep)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id, rep) {
      this.$store.dispatch('setLoading', true)

      try {
        const { data: { result: { data } } } = await this.repository.delete(id)
        if (data) {
          if (rep === 'actionParent') {
            this.actionChill = []
          } else {
            const index = this[rep].findIndex(item => item.id === id)
            if (index !== -1) {
              this[rep].splice(index, 1)
            }
          }
        }

        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
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

    /**
     * create or update a action
     *
     * @param record
     */
    async submitActionParent(record) {
      if (record.name === '') {
        this.$notification.error({
          message: this.$t('module.action.required_name.err_message')
        })
        return
      }
      this.$store.dispatch('setLoading', true)
      try {
        const data = cloneDeep(record)
        if (record.id) {
          await this.repository.update(record.id, data)
        } else {
          await this.repository.create(data)
        }
        await this.$fetch()
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
     * create or update a action detail
     *
     * @param record
     */
    async submitActionChill(record, index) {
      if (record.name === '') {
        this.$notification.error({
          message: this.$t('module.action.required_name.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        const input = cloneDeep(record)
        if (record.id) {
          await this.repository.update(record.id, input)
        } else {
          const { data: { result: { data } } } = await this.repository.create(input)
          this.actionChill[index] = data
          this.actionChill.push({
            project_id: this.project_id,
            parent_id: record.parent_id,
            name: ''
          })
        }

        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: _.response.data.message
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
