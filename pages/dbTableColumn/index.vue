<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.dbTableColumn') }}
      </template>

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
              :label="$t('module.dbTableColumn.project_id')"
              prop="project_id"
            >
              <a-select
                v-model="filters.project_id"
                :placeholder="$t('module.project')"
              >
                <a-select-option
                  v-for="(item, index) in projects"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.db_table_id')"
              prop="db_table_id"
            >
              <a-select
                v-model="filters.db_table_id"
                :placeholder="$t('module.dbTable')"
              >
                <a-select-option
                  v-for="(item, index) in dbTables"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.dbTableColumn.version_code')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.db_table_column_pk')"
              prop="db_table_column_pk"
            >
              <a-input
                v-model="filters.db_table_column_pk"
                :placeholder="$t('module.dbTableColumn.db_table_column_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.dbTableColumn.name')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.data_type')"
              prop="data_type"
            >
              <a-input
                v-model="filters.data_type"
                :placeholder="$t('module.dbTableColumn.data_type')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.primary_key')"
              prop="primary_key"
            >
              <a-input
                v-model="filters.primary_key"
                :placeholder="$t('module.dbTableColumn.primary_key')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.auto_increment')"
              prop="auto_increment"
            >
              <a-input
                v-model="filters.auto_increment"
                :placeholder="$t('module.dbTableColumn.auto_increment')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.not_null')"
              prop="not_null"
            >
              <a-input
                v-model="filters.not_null"
                :placeholder="$t('module.dbTableColumn.not_null')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.description')"
              prop="description"
            >
              <a-input
                v-model="filters.description"
                :placeholder="$t('module.dbTableColumn.description')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.description_jp')"
              prop="description_jp"
            >
              <a-input
                v-model="filters.description_jp"
                :placeholder="$t('module.dbTableColumn.description_jp')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.default_value')"
              prop="default_value"
            >
              <a-input
                v-model="filters.default_value"
                :placeholder="$t('module.dbTableColumn.default_value')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.dbTableColumn.order')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.dbTableColumn.use_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
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
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
          </div>
        </template>
        <template
          slot="db_table_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.dbTable.name }}
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
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.dbTableColumn') }}
      </template>

      <a-spin :spinning="loading">
        <dbTableColumn-form
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

import DataTable from '~/mixins/data-table'
import DbTableColumnForm from '~/components/templates/dbTableColumn/DbTableColumnForm'

export default {
  /**
   * Declare components.
   */
  components: {
    DbTableColumnForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'dbTableColumn',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        db_table_id: this.$route.query.db_table_id || '',
        version_code: this.$route.query.version_code || '',
        db_table_column_pk: this.$route.query.db_table_column_pk || '',
        name: this.$route.query.name || '',
        data_type: this.$route.query.data_type || '',
        primary_key: this.$route.query.primary_key || '',
        auto_increment: this.$route.query.auto_increment || '',
        not_null: this.$route.query.not_null || '',
        description: this.$route.query.description || '',
        description_jp: this.$route.query.description_jp || '',
        default_value: this.$route.query.default_value || '',
        order: this.$route.query.order || '',
        use_flg: this.$route.query.use_flg || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      dbTables: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.dbTableColumn.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.db_table_id'),
          dataIndex: 'db_table_id',
          scopedSlots: { customRender: 'db_table_id' },
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.version_code'),
          dataIndex: 'version_code',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.db_table_column_pk'),
          dataIndex: 'db_table_column_pk',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.data_type'),
          dataIndex: 'data_type',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.primary_key'),
          dataIndex: 'primary_key',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.auto_increment'),
          dataIndex: 'auto_increment',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.not_null'),
          dataIndex: 'not_null',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.description'),
          dataIndex: 'description',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.description_jp'),
          dataIndex: 'description_jp',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.default_value'),
          dataIndex: 'default_value',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.dbTableColumn.use_flg'),
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
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getProjects()
    this.getDbTables()
  },

  methods: {
    /**
     * List Project.
     */
    async getProjects() {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },

    /**
     * List DbTable.
     */
    async getDbTables() {
      const { data: { result: { data } } } = await this.$api.dbTable.list()
      this.dbTables = data
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
     * Search data.
     */
    search() {
      this.replaceQuery(this.filters)
    }
  }
}
</script>
