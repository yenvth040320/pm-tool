<template>
  <div>
    <a-row class="main-row">
      <a-spin :spinning="loading">
        <a-col :span="7">
          <a-table
            :columns="leftColumns"
            :row-key="record => record.id"
            :data-source="data"
            :pagination="false"
            :custom-row="customRowLeft"
            :row-class-name="rowClassNameRight"
            :scroll="{ y: 700 }"
            class="table-mst-lifecycle"
          >
            <template
              slot="actor"
              slot-scope="text, record"
            >
              <a-input v-model="record.name" />
            </template>
            <template
              slot="action"
              slot-scope="text, record"
            >
              <div v-if="record.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="createActor(record)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDeleteActor(record.id)" />
              </div>
              <div v-if="!record.id">
                <a-icon type="plus" @click="createActor(record)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!--  end table mst life cycle -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="centerColumns"
            :row-key="record => record.id"
            :data-source="dataGroupActions"
            :pagination="false"
            :custom-row="customRowCenter"
            :row-class-name="rowClassNameCenter"
            :scroll="{ y: 400 }"
          >
            <template
              slot="groupActions"
              slot-scope="text, recordCenter"
            >
              <a-select
                v-model="recordCenter.action_id"
                :placeholder="$t('module.action')"
              >
                <a-select-option
                  v-for="(item, index) in listActionParent"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template
              slot="action"
              slot-scope="text, recordCenter"
            >
              <div v-if="recordCenter.id">
                <a-icon type="delete" theme="filled" @click="confirmToDeleteGroup(recordCenter.action_id, recordCenter.actor_id)" />
              </div>
              <div v-if="!recordCenter.id">
                <a-icon type="plus" @click="createGroupAction(recordCenter)" />
              </div>
            </template>
          </a-table>
        </a-col>
        <!--  end table checklist -->
        <a-col :span="8" style="margin-left: 2%">
          <a-table
            :columns="rightColumns"
            :row-key="record => record.id"
            :data-source="dataRightTable"
            :pagination="false"
            :row-class-name="rowClassNameLeft"
            :scroll="{ y: 400 }"
          >
            <template
              slot="actionChildren"
              slot-scope="text, itemRight"
            >
              <a-select
                v-model="itemRight.action_id"
                :placeholder="$t('module.action')"
              >
                <a-select-option
                  v-for="(item, index) in listActionChildren"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </template>
            <template
              slot="action"
              slot-scope="text, itemRight"
            >
              <div v-if="itemRight.id">
                <a-icon type="edit" theme="filled" class="edit-icon" @click="submitChecklistDetail(itemRight)" />
                <a-icon type="delete" theme="filled" class="delete-icon" @click="confirmToDelete(itemRight.id)" />
              </div>
              <div v-if="!itemRight.id">
                <a-icon type="plus" @click="createChildrenAction(itemRight)" />
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
        all: true,
        project_id: this.project_id
      }

      const { data: { result: { data } } } = await this.$api.actor.list({ params })
      this.data = data
      this.data.push({
        id: 0,
        project_id: this.project_id,
        name: ''
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
      resource: 'useCase',
      SORT,
      FORMAT_DATE_FULL,
      moment,
      selectedRowLeft: 0,
      visible: false,
      currentId: 0,
      dataRightTable: [],
      project_id: this.$store.state.project.id,
      rowRightSelected: 0,
      rowCenterSelected: 0,
      rowLeftSelected: 0,
      dataGroupActions: [],
      listActorActions: [],
      listActionParent: [],
      listActionChildren: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    leftColumns() {
      return [
        {
          title: this.$t('actor'),
          scopedSlots: { customRender: 'actor' },
          width: 100
        }, {
          title: this.$t('common.action'),
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    centerColumns() {
      return [
        {
          title: this.$t('module.groupActions'),
          align: 'center',
          scopedSlots: { customRender: 'groupActions' },
          width: 100
        },
        {
          title: this.$t('common.action'),
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 100
        }
      ]
    },

    rightColumns() {
      return [
        {
          title: this.$t('module.action'),
          scopedSlots: { customRender: 'actionChildren' },
          width: 100
        },
        {
          title: this.$t('common.action'),
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 60
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getListAction()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     *Get list action
    */
    async getListAction() {
      const params = {
        order_by: 'id',
        order_type: SORT.asc,
        all: true,
        project_id: this.project_id,
        parent_id: 0
      }

      const { data: { result: { data } } } = await this.$api.action.list({ params })
      this.listActionParent = data
    },

    /**
     * Custom css class for row
     */
    rowClassNameRight(record) {
      if (record.id === this.rowRightSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Custom css class for row
     */
    rowClassNameCenter(record) {
      if (record.id === this.rowCenterSelected) {
        return 'selected'
      } else {
        return null
      }
    },

    /**
     * Custom css class for row
     */
    rowClassNameLeft(record) {
      if (record.id === this.rowLeftSelected) {
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
            if (this.rowRightSelected !== record.id) {
              this.rowCenterSelected = 0
              this.rowLeftSelected = 0
              this.dataRightTable = []
              this.rowRightSelected = record.id
              this.getListActionGroupOfActor(record.id)
            }
          }
        }
      }
    },

    /**
     *Get list action group of actor.
    */
    async getListActionGroupOfActor(actorId, parentId) {
      this.$store.dispatch('setLoading', true)
      try {
        this.dataGroupActions = []
        if (actorId !== 0) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            actor_id: actorId,
            all: true,
            project_id: this.project_id
          }

          const { data: { result: { data } } } = await this.$api.actorAction.list({ params })
          data.forEach(item => {
            if (+item.action.parent_id === 0) {
              if (parentId && parentId === +item.action.id) {
                this.rowCenterSelected = item.id
              }
              this.dataGroupActions.push({
                action_id: +item.action.id,
                actor_id: actorId,
                id: item.id
              })
            }
          })
          this.dataGroupActions = [...new Set(this.dataGroupActions)]
          this.dataGroupActions.push({
            id: 0,
            actor_id: actorId,
            project_id: this.project_id,
            action_id: ''
          })
        }
      } catch (error) {
        console.log(error)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Custom row event of table checklist center
     */
    customRowCenter(record) {
      return {
        on: {
          click: () => {
            if (this.rowCenterSelected !== record.id) {
              this.rowCenterSelected = record.id
              if (record.id !== 0) {
                this.$store.dispatch('setLoading', true)
                Promise.all([
                  this.getListActionActorChildren(record.action_id, record.actor_id),
                  this.getListActionChildren(record.action_id)
                ]).then(() => {
                  this.$store.dispatch('setLoading', false)
                })
              } else {
                this.dataRightTable = []
              }
            }
          }
        }
      }
    },

    /**
     * Get list action actor children.
     *
     * @param {Number} actionId
     * @param {Number} actorId
     */
    async getListActionActorChildren(actionId, actorId) {
      try {
        this.dataRightTable = []
        if (actorId !== 0) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            actor_id: actorId,
            all: true,
            action_parent: actionId,
            project_id: this.project_id
          }

          const { data: { result: { data } } } = await this.$api.actorAction.list({ params })
          this.dataRightTable = data
          this.dataRightTable.push({
            id: 0,
            parent_id: actionId,
            actor_id: actorId,
            project_id: this.project_id,
            action_id: ''
          })
        }
      } catch (error) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get list action children.
     *
     * @param {Number} actionId
     */
    async getListActionChildren(actionId) {
      try {
        this.listActionChildren = []
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          parent_id: actionId,
          all: true,
          project_id: this.project_id
        }
        const { data: { result: { data } } } = await this.$api.action.list({ params })
        this.listActionChildren = data
      } catch (error) {
        console.log(error)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(id, actorId) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id, actorId)
      })
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDeleteActor(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecordActor(id)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} actorId
     */
    async deleteRecordActor(actorId) {
      this.$store.dispatch('setLoading', true)
      try {
        await this.$api.actor.delete(actorId)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        await this.$fetch()
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
     * Confirm to delete
     *
     * @param {Number} actionId
     */
    confirmToDeleteGroup(actionId, actorId) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteGroupRecord(actionId, actorId)
      })
    },

    /**
     * Delete record
     *
     * @param {Number} actionId
     * @param {Number} actorId
     */
    async deleteGroupRecord(actionId, actorId) {
      this.$store.dispatch('setLoading', true)
      try {
        const data = {
          project_id: this.project_id,
          action_id: actionId,
          actor_id: actorId
        }
        await this.$api.actorAction.deleteGroupAction(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.dataRightTable = []
        this.rowCenterSelected = 0
        await this.getListActionGroupOfActor(actorId)
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
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecord(id, actorId) {
      this.$store.dispatch('setLoading', true)
      try {
        await this.$api.actorAction.delete(id)
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        await this.getListActionGroupOfActor(actorId)
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
     * create or update a checklist
     *
     * @param record
     */
    async createActor(record) {
      if (record.name === '') {
        this.$notification.error({
          message: this.$t('module.tab_check_list.required_checklist_name.err_message')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        const data = {
          name: record.name,
          project_id: this.project_id
        }
        if (record.id) {
          await this.$api.actor.update(record.id, data)
        } else {
          await this.$api.actor.create(data)
        }
        await this.$fetch()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        if (_?.response?.data?.errors?.name[0] === 'The name has already been taken.') {
          this.$notification.error({
            message: this.$t('module.actor.actor_name_unique')
          })
        } else {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
   * Create childen action
   *
   */
    createChildrenAction(record) {
      Promise.all([
        this.createGroupAction(record, record.parent_id)
      ]).then(() => {
        this.getListActionActorChildren(record.parent_id, record.actor_id)
      })
    },

    /**
     *Create group action.
    */
    async createGroupAction(record, parentId) {
      if (record.action_id === '') {
        this.$notification.error({
          message: this.$t('module.action_actor.required_group_actor.err_message')
        })
        return
      }
      // Check list data right
      if (parentId) {
        const checkUnique = this.dataRightTable.filter(item => item.action_id === record.action_id && item.id !== 0)
        if (checkUnique.length !== 0) {
          this.$notification.error({
            message: this.$t('module.action_actor.action_exist')
          })
          return
        }
      } else {
        // Check list data center
        const checkUnique = this.dataGroupActions.filter(item => (item.action_id === record.action_id && +item.id !== 0))
        if (checkUnique.length !== 0) {
          this.$notification.error({
            message: this.$t('module.action_actor.action_exist')
          })
          return
        }
      }

      this.$store.dispatch('setLoading', true)
      try {
        const data = {
          project_id: this.project_id,
          action_id: record.action_id,
          actor_id: record.actor_id
        }
        await this.$api.actorAction.create(data)
        await this.getListActionGroupOfActor(record.actor_id, parentId)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (error) {
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
      background-color: rgb(250, 215, 16) !important;
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
