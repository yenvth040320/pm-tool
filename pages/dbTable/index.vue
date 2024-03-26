<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{
          (this.$store.state.project.name
            ? this.$store.state.project.name + ' / '
            : '') +
            (this.$store.state.dbSchema.name
              ? this.$store.state.dbSchema.name + ' / '
              : '') +
            $t('module.dbTable')
        }}
      </template>

      <template slot="extra">
        <a-button html-type="button" type="primary" ghost @click="gotoNew()">
          <font-awesome-icon icon="plus-circle" class="mr-1" />
          {{ $t('common.new') }}
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoCopyUrl()"
        >
          {{ $t('common.copy_url') }}
        </a-button>
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row type="flex" :gutter="30">
          <a-col :span="24" :md="12">
            <a-form-model-item :label="$t('module.dbTable.name')" prop="name">
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.dbTable.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" :md="12">
            <a-form-model-item
              :label="$t('module.dbTable.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.dbTable.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" class="text-center">
            <a-button html-type="submit" type="primary" class="min-w-100">
              <font-awesome-icon icon="search" class="mr-1" />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon icon="eraser" class="mr-1" />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->
      <div class="pb-4">
        <a-button
          html-type="button"
          type="primary"
          class="min-w-100"
          :disabled="loading"
          @click="toggleExpandAll"
        >
          <a-icon v-if="!allExpanded" type="plus" />
          <a-icon v-else type="minus" />
          {{
            allExpanded
              ? $t('common.close_all_node')
              : $t('common.expand_all_node')
          }}
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :expanded-row-keys="expandedKeys"
        :expand-row-by-click="true"
        class="components-table-demo-nested"
        @change="handleTableChange"
        @expandedRowsChange="onExpand"
      >
        <template
          slot="name"
          slot-scope="text, item"
        >
          <NuxtLink :to="`/dbTable/${item.id}/version/${item.versions[0].version_code}`">
            {{ item.name }}
          </NuxtLink>
        </template>
        <template
          slot="name_jp"
          slot-scope="text, item"
        >
          <NuxtLink :to="`/dbTable/${item.id}/version/${item.versions[0].version_code}`">
            {{ item.name_jp }}
          </NuxtLink>
        </template>
        <template slot="db_schema_id" slot-scope="text, record">
          <div>
            {{ record.dbSchema.name }}
          </div>
        </template>
        <template slot="use_flg" slot-scope="text, record">
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="eye" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading || allVersionsLocked(record)"
            @click="increaseVersion(record.id)"
          >
            <a-icon type="diff" />
          </a-button>
        </template>
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :data-source="record.versions"
          :row-key="item => item.id"
          :pagination="false"
        >
          <template slot="version_code" slot-scope="text, record">
            <NuxtLink :to="`/dbTable/${record.db_table_id}/version/${record.version_code}`">
              {{ record.version_code }}
            </NuxtLink>
          </template>
          <template slot="version_name" slot-scope="text, record">
            <NuxtLink :to="`/dbTable/${record.db_table_id}/version/${record.version_code}`">
              {{ record.name }}
            </NuxtLink>
          </template>
          <template slot="lock_flg" slot-scope="text, record">
            <div
              v-for="(item, index) in LOCL_FLG[$nuxt.$i18n.locale]"
              :key="index"
            >
              <div v-if="item.value === record.lock_flg">
                {{ item.label }}
              </div>
            </div>
          </template>

          <template slot="action" slot-scope="text, record">
            <a-button
              v-if="record.lock_flg === LOCK_FLG_VALUE.no"
              html-type="button"
              type="primary"
              size="small"
              :disabled="loading"
              @click="changeVersion(record.id, LOCK_FLG_VALUE.yes)"
            >
              <font-awesome-icon icon="lock" />
            </a-button>
            <a-button
              v-if="record.lock_flg === LOCK_FLG_VALUE.yes"
              html-type="button"
              type="primary"
              size="small"
              :disabled="loading || isVersionDisabled(record)"
              @click="changeVersion(record.id, LOCK_FLG_VALUE.no)"
            >
              <font-awesome-icon :icon="['fas', 'lock-open']" />
            </a-button>
          </template>
        </a-table>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <a-modal
      v-model="notifiSelectDbSchema"
      class="modal-notifi"
      :centered="true"
      :cancel-text="$t('common.ok')"
      @cancel="hiddenModalNotifiSchema"
    >
      <p class="text">
        {{ $t('module.dbTable.schema_not_selected_yet.error') }}
      </p>
    </a-modal>

    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon
          :icon="`${currentId ? 'pencil-alt' : 'plus-circle'}`"
        />
        {{ currentId ? $t('common.edit') : $t('common.create') }}
        {{ $t('module.dbTable') }}
      </template>

      <a-spin :spinning="loading">
        <dbTable-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <DrawerDbTable
      ref="dbTableDrawer"
      @save="save"
    />
    <NotificationProjectNotSelectedVue />
    <IncreaseVersion ref="increaseVersion" @save="save" />
    <!-- end modal-detail -->
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import DbTableForm from '~/components/templates/dbTable/DbTableForm'
import { USE_FLG, USE_FLG_VALUE, LOCL_FLG, LOCK_FLG_VALUE } from '~/constants'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'
import DrawerDbTable from '~/components/templates/dbTable/DrawerDbTable.vue'
import IncreaseVersion from '~/components/templates/dbTable/IncreaseVersion.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    DbTableForm,
    DrawerDbTable,
    NotificationProjectNotSelectedVue,
    IncreaseVersion
  },

  mixins: [DataTable],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'dbTable',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || this.$store.state.project.id || 0,
        db_schema_id: this.$route.query.db_schema_id || this.$store.state.dbSchema.id || 0,
        name: this.$route.query.name || undefined,
        name_jp: this.$route.query.name_jp || undefined
      },
      defaultParams: {
        not_admin: 1,
        use_flg: USE_FLG_VALUE.yes,
        db_schema_id: this.$route.query.db_schema_id || this.$store.state.dbSchema.id || 0,
        project_id: this.$route.query.project_id || this.$store.state.project.id || 0
      },
      project: {},
      dbSchemas: [],
      USE_FLG,
      USE_FLG_VALUE,
      LOCL_FLG,
      LOCK_FLG_VALUE,
      notifiSelectDbSchema: false,
      notifiSelectProject: false,
      expandedKeys: [],
      allExpanded: false,
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
      db_schema_id: +this.$route.query.db_schema_id || this.$store.state.dbSchema.id || 0
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.dbTable.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          sorter: true
        },
        {
          title: this.$t('module.dbTable.name_jp'),
          dataIndex: 'name_jp',
          scopedSlots: { customRender: 'name_jp' },
          sorter: true
        },
        {
          title: this.$t('module.dbTable.use_flg'),
          scopedSlots: { customRender: 'use_flg' },
          dataIndex: 'use_flg',
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },

    headerInner() {
      return [
        {
          title: this.$t('module.versionApi.version_code'),
          scopedSlots: { customRender: 'version_code' },
          dataIndex: 'version_code'
        },
        {
          title: this.$t('module.versionApi.name'),
          scopedSlots: { customRender: 'version_name' },
          dataIndex: 'name'
        },
        {
          title: this.$t('module.versionApi.lock_flg'),
          scopedSlots: { customRender: 'lock_flg' },
          dataIndex: 'lock_flg'
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },

    innerColumns() {
      return this.headerInner.map(item => {
        item.sortOrder = null
        if (
          this.$route.query.order_by === item.dataIndex &&
          this.$route.query.order_type
        ) {
          item.sortOrder =
            +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },
    isVersionDisabled() {
      return function(version) {
        return version.disabled
      }
    },
    allVersionsLocked() {
      return function(record) {
        return record.versions.some(
          version => version.lock_flg === LOCK_FLG_VALUE.no
        )
      }
    }
  },
  watch: {
    data: {
      handler: 'checkLockedVersions',
      deep: true
    }
  },
  /**
   * Mounted event.
   */
  mounted() {
    if (
      this.project_id !== 0 &&
      this.db_schema_id === 0
    ) {
      this.notifiSelectDbSchema = true
    }
    this.showDetailProject()
    this.showDetailDBSchema()
  },

  methods: {
    async showDetailProject() {
      try {
        if (this.project_id !== this.$store.state.project.id) {
          const { data: { result: { data } } } = await this.$api.project.show(this.project_id)
          this.project = data
          this.$store.dispatch('addProject', {
            id: this.project_id,
            name: this.project.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async showDetailDBSchema() {
      try {
        if (this.db_schema_id !== this.$store.state.dbSchema.id) {
          const { data: { result: { data } } } = await this.$api.dbSchema.show(this.db_schema_id)
          this.$store.dispatch('addDbSchema', {
            id: this.db_schema_id,
            name: data.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/dbTable'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      url.searchParams.set('db_schema_id', this.$store.state.dbSchema.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },

    toggleExpandAll() {
      if (this.allExpanded) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.data.map(record => record.id)
      }
      this.allExpanded = !this.allExpanded
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.allExpanded = false
    },
    checkLockedVersions() {
      if (this.data) {
        this.data.forEach(item => {
          const areAllVersionsLocked = item.versions.some(
            version => version.lock_flg === LOCK_FLG_VALUE.no
          )

          if (areAllVersionsLocked) {
            item.versions.forEach(version => {
              if (version.lock_flg === LOCK_FLG_VALUE.yes) {
                version.disabled = true
              }
            })
          }
        })
      }
    },
    gotoVersionDetail(id) {
      this.$router.push({ name: 'dbTableVersion-id', params: { id } })
    },

    /**
     * hidden modal
     */
    hiddenModalNotifiSchema() {
      this.$router.push('/dbSchema')
      this.notifiSelectDbSchema = false
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
        const data = {
          use_flg: USE_FLG_VALUE.no
        }
        await this.$api.dbTable.updateMulti(id, data)

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
        name: '',
        name_jp: ''
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    },

    async changeVersion(id, value) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          lock_flg: value
        }
        await this.$api.dbTableVersion.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        await this.$fetch()
        this.checkLockedVersions()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    save() {
      this.$fetch()
      this.checkLockedVersions()
    },

    gotoNew() {
      this.$refs.dbTableDrawer.open(null)
    },

    gotoDetail(id) {
      this.$refs.dbTableDrawer.open(id)
    },

    /**
     * Increase version
     */
    increaseVersion(id) {
      this.$refs.increaseVersion.openModal(id)
    }
  }
}
</script>

<style lang="scss" scoped>

:deep() {
  .ant-table-tbody > tr > td {
    cursor: pointer;
  }
}
</style>
