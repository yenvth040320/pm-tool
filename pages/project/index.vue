<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.project') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
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
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.project.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.project.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.project.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.project.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              title="Tìm kiếm"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              title="Xoá điều kiện tìm kiếm"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->

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
          slot="project_name"
          slot-scope="text, record"
        >
          <a @click="gotoCategory(record)">
            {{ record.name }}
          </a>
        </template>
        <template
          slot="status"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in STATUS[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.status">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            size="small"
            class="excel-btn"
            @click="exportProjectReport(record)"
          >
            <a-icon type="file-excel" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Chỉnh sửa"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Sao chép"
            :disabled="loading"
            @click="gotoCopy(record.id)"
          >
            <font-awesome-icon icon="copy" />
          </a-button>

          <a-button
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
    </a-card>

    <a-modal
      ref="detail"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <a-spin :spinning="loading">
        <copy-project-form
          :id="currentId"
          :projects="projects"
          @save="closeDialog(true)"
          @cancel="closeDialog()"
        />
      </a-spin>
    </a-modal>
    <!-- end modal-detail -->
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import CopyProjectForm from '~/components/templates/project/CopyProjectForm'
import { STATUS } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    CopyProjectForm
  },

  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }

      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
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
      resource: 'project',
      visible: false,
      currentId: 0,
      filters: {
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        name: this.$route.query.name || '',
        name_jp: this.$route.query.name_jp || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      STATUS
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.project.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'project_name' },
          sorter: true
        },
        {
          title: this.$t('module.project.name_jp'),
          dataIndex: 'name_jp',
          sorter: true
        },
        {
          title: this.$t('module.project.description'),
          dataIndex: 'description',
          sorter: true
        },
        {
          title: this.$t('module.project.description_jp'),
          dataIndex: 'description_jp',
          sorter: true
        },
        {
          title: this.$t('module.project.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 230
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
    /**
     * List Project.
     */
    async getProjects(id) {
      const params = {
        not_project: id,
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },
    /**
     * Go to copy
     *
     * @param {number} id - Item Id.
     */
    async gotoCopy(id) {
      this.currentId = id
      await this.getProjects(id)
      this.visible = true
    },
    /**
     * Close dialog.
     *
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * Calculate points in 1 life cycle
     */
    calculateTotalPointEt(pointEts) {
      if (pointEts.length > 0) {
        const total = pointEts.reduce((total, pointObj) => total + pointObj.total_pm_point_et + pointObj.total_com_point_et + pointObj.total_dev_point_et, 0)
        const roundedTotal = Math.max(total, 0).toFixed(2)
        return parseFloat(roundedTotal)
      } else {
        return 0
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        description: '',
        description_jp: '',
        name: '',
        name_jp: '',
        status: ''
      }
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

    /**
     * Go to category
     */
    gotoCategory(project) {
      this.$store.dispatch('addProject', {
        id: project.id,
        name: project.name
      })
      this.$store.dispatch('addCategory', {
        id: 0,
        name: ''
      })
      this.$store.dispatch('addApiCategory', {
        id: 0,
        name: ''
      })
      this.$store.dispatch('addDbSchema', {
        id: 0,
        name: ''
      })
      this.$router.push({ name: 'project-id-detailInfo', params: { id: project.id } })
    },

    async exportProjectReport(project) {
      try {
        const fileDownload = require('js-file-download')
        const params = {}
        params.project_id = project.id
        const rawData = await this.$api.project.exportExcel(
          params,
          { responseType: 'blob' }
        )
        const fileName = '[' + project.name + '_ET' + ']' + '.xlsx'
        fileDownload(rawData.data, fileName)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    goToManage(id) {
      this.$router.push({ name: 'project-manage-id', params: { id } })
    }
  }
}
</script>
<style lang="scss" scoped>
.excel-btn {
  background-color: rgb(49,190,125);
}
.manage-btn {
  background-color: gold;
}
.schedule-btn {
  background-color: orange;
}
.link {
  color: #1890ff;
  cursor: pointer;
}
</style>
