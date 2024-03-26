<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="title">
        <label>{{ $t('module.dbTable.entity_id') + ': ' }}</label>
        <span>{{ entityList.find(item => item.id === dbTable.entity_id)?.name }}</span>
      </template>
      <template slot="extra">
        <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          :disabled="version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="newColumn()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.dbTableColumn.new') }}
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          ghost
          :disabled="loading || version.lock_flg === LOCK_FLG_VALUE.yes"
          @click="gotoDetail()"
        >
          <font-awesome-icon icon="pencil-alt" />
          {{ $t('module.dbTable.update') }}
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :row-class-name="rowClassName"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="name"
          slot-scope="text, record"
        >
          <div>
            <span>
              {{ record.name }}
            </span>
            <span v-if="record.primary_key">
              <a-icon type="key" />
            </span>
          </div>
        </template>
        <template
          slot="data_type"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in COLUMN_DATA_TYPE" :key="index">
            <span v-if="record.data_type === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="auto_increment"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in DB_COLUMN_AUTO_INCREMENT" :key="index">
            <span v-if="record.auto_increment === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="not_null"
          slot-scope="text, record"
        >
          <div v-for="(item, index) in DB_COLUMN_NOT_NULL" :key="index">
            <span v-if="record.not_null === item.value">
              {{ item.label }}
            </span>
          </div>
        </template>
        <template
          slot="use_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            v-if="version.lock_flg === LOCK_FLG_VALUE.no"
            html-type="button"
            type="primary"
            size="small"
            title="Chi tiết"
            :disabled="loading"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>

          <a-button
            v-if="version.lock_flg === LOCK_FLG_VALUE.no"
            html-type="button"
            type="danger"
            size="small"
            title="Xoá"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->

      <a-modal
        ref="detail"
        :visible="visible"
        :width="900"
        :footer="null"
        @cancel="visible = false"
      >
        <template slot="title">
          <font-awesome-icon :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`" />
          {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.dbTableColumn') }}
        </template>

        <a-spin :spinning="loading">
          <dbTableColumn-form
            :id="currentId"
            :version="version"
            :has-primary-key="hasPrimaryKey"
            @save="closeDialog(true)"
            @cancel="closeDialog(false)"
          />
        </a-spin>
      </a-modal>
      <!-- end modal-detail -->
      <DrawerDbTable
        ref="dbTableDrawer"
        @saveUpdate="saveUpdate"
      />
    </a-card>
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import DbTableColumnForm from '~/components/templates/dbTableColumn/DbTableColumnForm'
import DrawerDbTable from '~/components/templates/dbTable/DrawerDbTable.vue'
import { USE_FLG_VALUE, DB_COLUMN_PRIMARY_KEY_VALUE, DB_COLUMN_AUTO_INCREMENT_VALUE, DB_COLUMN_NOT_NULL_VALUE, COLUMN_DATA_TYPE, DB_COLUMN_AUTO_INCREMENT, DB_COLUMN_NOT_NULL, USE_FLG, LOCK_FLG_VALUE } from '~/constants'

export default {

  /**
   * Declare components.
   */
  components: {
    DbTableColumnForm,
    DrawerDbTable
  },

  mixins: [
    DataTable
  ],
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      params.project_id = this.$store.state.project.id
      params.db_table_id = this.version.db_table_id
      params.version_code = this.version.version_code
      if (this.checkSwitch) {
        params.use_flg = USE_FLG_VALUE.yes
      }
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      if (!this.checkSwitch && params.use_flg) {
        delete params.use_flg
      }

      const { data: { result: { data } } } = await this.repository.list({ params })
      this.data = data
      if (this.data.length > 0) {
        if (this.data[0].dbTable) {
          this.dbTable = this.data[0].dbTable
        }
      }
      for (let i = 0; i < this.data.length; i++) {
        if (data[i].primary_key === 1) {
          this.hasPrimaryKey = true
          break
        }
      }
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    entityList: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'dbTableColumn',
      visible: false,
      currentId: 0,
      DB_COLUMN_PRIMARY_KEY_VALUE,
      DB_COLUMN_AUTO_INCREMENT_VALUE,
      DB_COLUMN_NOT_NULL_VALUE,
      COLUMN_DATA_TYPE,
      DB_COLUMN_AUTO_INCREMENT,
      DB_COLUMN_NOT_NULL,
      USE_FLG_VALUE,
      USE_FLG,
      LOCK_FLG_VALUE,
      defaultParams: {
        not_admin: 1
      },
      hasPrimaryKey: false,
      checkSwitch: true,
      dbTable: {}
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.dbTableColumn.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.data_type'),
          dataIndex: 'data_type',
          scopedSlots: { customRender: 'data_type' },
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.auto_increment'),
          dataIndex: 'auto_increment',
          scopedSlots: { customRender: 'auto_increment' },
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.not_null'),
          dataIndex: 'not_null',
          scopedSlots: { customRender: 'not_null' },
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.description'),
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.default_value'),
          dataIndex: 'default_value',
          align: 'center'
        },
        {
          title: this.$t('module.dbTableColumn.use_flg'),
          dataIndex: 'use_flg',
          scopedSlots: { customRender: 'use_flg' },
          align: 'center'
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
  },

  methods: {
    onChangeSwitch() {
      this.$fetch()
    },
    newColumn() {
      this.currentId = null
      this.visible = true
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    /**
     * Custom css row not use
     */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
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
     * On clear form search.
     */
    reset() {
      this.filters = {
        project_id: '',
        db_table_id: '',
        version_code: '',
        db_table_column_pk: '',
        name: '',
        data_type: '',
        primary_key: '',
        auto_increment: '',
        not_null: '',
        description: '',
        description_jp: '',
        default_value: '',
        order: '',
        use_flg: ''
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
        onOk: () => this.updateUseFlgRecord(id, USE_FLG_VALUE.no)
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
        await this.repository.update(id, data)
        this.$bus.$emit('columnEdited', flg)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$fetch()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
    },
    gotoDetail() {
      this.$refs.dbTableDrawer.open(this.version)
    },
    saveUpdate() {
      this.$fetch()
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
  display: flex;
  justify-content: end;
  button {
    margin-left: 5px;
  }
}
:deep() {
  .anticon-key {
    color: #fadb14;
  }
}
:deep() {
  .ant-table-tbody {
    .disabled-row {
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
}
.switch-btn {
  margin-right: 15px;
}
</style>
