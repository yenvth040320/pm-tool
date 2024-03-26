<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a href="https://mermaid.live/" target="_blank">
          {{ '[' + $t('common.live_editor') + ']' }}
        </a>
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
          slot="update_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record?.updateUser?.name }}
          </div>
        </template>

        <template
          slot="updated_at"
          slot-scope="text, record"
        >
          <div>
            {{ formatDate(record.updated_at) }}
          </div>
        </template>

        <template
          slot="description_before"
          slot-scope="text, record"
        >
          <div class="content">
            <span v-if="record.type === FLOW_HISTORY_TYPE.flow">

              {{ record.description_before }}
              <span v-if="record.description_before">
                <a-icon type="copy" style="margin-left: 10px" @click="copyFlow(record.description_before)" />
              </span>
            </span>
            <span v-else>
              <span v-if="record.description_before">
                <a
                  :href="API_ROOT_URL + record.description_before"
                  target="_blank"
                >
                  {{ API_ROOT_URL + record.description_before }}
                </a>
                <a-icon type="copy" style="margin-left: 10px" @click="copyFlow(API_ROOT_URL + record.description_before)" />
              </span>
              <span v-else>
                {{ record.description_before }}
              </span>
            </span>
          </div>
        </template>

        <template
          slot="description_after"
          slot-scope="text, record"
        >
          <div class="content">
            <span v-if="record.type === FLOW_HISTORY_TYPE.flow">

              {{ record.description_after }}
              <span v-if="record.description_after">
                <a-icon type="copy" style="margin-left: 10px" @click="copyFlow(record.description_after)" />
              </span>
            </span>
            <span v-else>
              <span v-if="record.description_after">
                <a
                  :href="API_ROOT_URL + record.description_after"
                  target="_blank"
                >
                  {{ API_ROOT_URL + record.description_after }}
                </a>
                <a-icon type="copy" style="margin-left: 10px" @click="copyFlow(API_ROOT_URL + record.description_after)" />
              </span>
              <span v-else>
                {{ record.description_after }}
              </span>
            </span>
          </div>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
    <!-- end modal-detail -->
  </div>
</template>
<script>
import moment from 'moment-timezone'
import DataTable from '~/mixins/data-table'
import { FORMAT_DATE_TIME_FULL, API_ROOT_URL, FLOW_HISTORY_TYPE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
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
      resource: 'flowHistory',
      visible: false,
      currentId: 0,
      FORMAT_DATE_TIME_FULL,
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id
      },
      API_ROOT_URL,
      FLOW_HISTORY_TYPE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.flowHistory.updated_time'),
          dataIndex: 'updated_at',
          scopedSlots: { customRender: 'updated_at' }
        },
        {
          title: this.$t('module.flowHistory.description_before'),
          dataIndex: 'description_before',
          scopedSlots: { customRender: 'description_before' }
        },
        {
          title: this.$t('module.flowHistory.description_after'),
          dataIndex: 'description_after',
          scopedSlots: { customRender: 'description_after' }
        },
        {
          title: this.$t('module.flowHistory.update_user_id'),
          dataIndex: 'update_user_id',
          scopedSlots: { customRender: 'update_user_id' }
        }
      ]
    }
  },
  created() {
    this.$bus.$on('updateFlowFile', editedData => {
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
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
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
    formatDate(updated) {
      return moment(updated).format(FORMAT_DATE_TIME_FULL)
    },

    copyFlow(description) {
      if (description) {
        navigator.clipboard.writeText(description)
        this.$message.success(this.$t('module.functionItem.copy_message'))
      }
    },

    getFileName(path) {
      const parts = path.split('/')
      return parts[parts.length - 1]
    },

    isImage(url) {
      // Logic to determine if the URL points to an image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
      const extension = url.substring(url.lastIndexOf('.')).toLowerCase()
      return imageExtensions.includes(extension)
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

<style lang="scss" scoped>
:deep() {
  .content {
    white-space: pre-line;
  }
}
</style>
