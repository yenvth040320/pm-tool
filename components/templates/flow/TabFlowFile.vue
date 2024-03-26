<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
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

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="updated_time"
          slot-scope="text, record"
        >
          <div>
            {{ formatDate(record.updated_at) }}
          </div>
        </template>
        <template
          slot="update_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.updateUser?.name }}
          </div>
        </template>

        <template
          slot="path"
          slot-scope="text, record"
        >
          <div>
            <a
              :href="API_ROOT_URL + record.path"
              target="_blank"
            >
              {{ API_ROOT_URL + record.path }}
            </a>
            <a-icon type="copy" style="margin-left: 10px" @click="copyFlow(API_ROOT_URL + record.path)" />
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
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
        </template>
      </a-table>
      <!-- end main-table -->
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.flowFile') }}
      </template>

      <a-spin :spinning="loading">
        <FlowFile-form
          :id="currentId"
          @save="closeDialog(true)"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import FlowFileForm from '~/components/templates/flowFile/FlowFileForm'
import { FORMAT_DATE_TIME_FULL, API_ROOT_URL } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    FlowFileForm
  },

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'flowFile',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        flow_id: this.$route.query.flow_id || '',
        title: this.$route.query.title || '',
        image_url: this.$route.query.image_url || ''
      },
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id
      },
      projects: [],
      flows: [],
      FORMAT_DATE_TIME_FULL,
      API_ROOT_URL
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.flowFile.updated_time'),
          dataIndex: 'updated_time',
          scopedSlots: { customRender: 'updated_time' },
          sorter: true,
          width: 200
        },
        {
          title: this.$t('module.flowFile.title'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.flowFile.path'),
          dataIndex: 'path',
          scopedSlots: { customRender: 'path' },
          sorter: true
        },
        {
          title: this.$t('module.flowFile.update_user_id'),
          dataIndex: 'update_user_id',
          scopedSlots: { customRender: 'update_user_id' },
          sorter: true,
          width: 200
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

  /**
   * Methods.
   */
  methods: {
    formatDate(updated) {
      return moment(updated).format(FORMAT_DATE_TIME_FULL)
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
    copyFlow(url) {
      if (url) {
        navigator.clipboard.writeText(url)
        this.$message.success(this.$t('module.functionItem.copy_message'))
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

    getFileName(path) {
      const parts = path.split('/')
      return parts[parts.length - 1]
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

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$bus.$emit('updateFlowFile')
        this.$fetch()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async downloadItem(path, label) {
      const blob = await (await fetch(API_ROOT_URL + path)).blob()
      const url = URL.createObjectURL(blob)
      Object.assign(document.createElement('a'), { href: url, download: label })
        .click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>
