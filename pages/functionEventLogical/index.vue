<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.functionEventLogical') }}
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
              :label="$t('module.functionEventLogical.conditions')"
              prop="conditions"
            >
              <a-input
                v-model="filters.conditions"
                :placeholder="$t('module.functionEventLogical.conditions')"
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
              :label="$t('module.functionEventLogical.conditions_jp')"
              prop="conditions_jp"
            >
              <a-input
                v-model="filters.conditions_jp"
                :placeholder="$t('module.functionEventLogical.conditions_jp')"
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
              :label="$t('module.functionEventLogical.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.functionEventLogical.use_flg')"
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
              :label="$t('module.functionEventLogical.event_pk')"
              prop="event_pk"
            >
              <a-input
                v-model="filters.event_pk"
                :placeholder="$t('module.functionEventLogical.event_pk')"
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
              :label="$t('module.functionEventLogical.function_goto_id')"
              prop="function_goto_id"
            >
              <a-select
                v-model="filters.function_goto_id"
                :placeholder="$t('module.functionGoto')"
              >
                <a-select-option
                  v-for="(item, index) in functionGotos"
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
              :label="$t('module.functionEventLogical.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_id"
                :placeholder="$t('module.function')"
              >
                <a-select-option
                  v-for="(item, index) in functions"
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
              :label="$t('module.functionEventLogical.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="filters.item_pk"
                :placeholder="$t('module.functionEventLogical.item_pk')"
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
              :label="$t('module.functionEventLogical.logic_detail')"
              prop="logic_detail"
            >
              <a-input
                v-model="filters.logic_detail"
                :placeholder="$t('module.functionEventLogical.logic_detail')"
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
              :label="$t('module.functionEventLogical.logic_detail_jp')"
              prop="logic_detail_jp"
            >
              <a-input
                v-model="filters.logic_detail_jp"
                :placeholder="$t('module.functionEventLogical.logic_detail_jp')"
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
              :label="$t('module.functionEventLogical.logic_pk')"
              prop="logic_pk"
            >
              <a-input
                v-model="filters.logic_pk"
                :placeholder="$t('module.functionEventLogical.logic_pk')"
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
              :label="$t('module.functionEventLogical.logic_type')"
              prop="logic_type"
            >
              <a-input
                v-model="filters.logic_type"
                :placeholder="$t('module.functionEventLogical.logic_type')"
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
              :label="$t('module.functionEventLogical.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.functionEventLogical.order')"
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
              :label="$t('module.functionEventLogical.parent_logic_pk')"
              prop="parent_logic_pk"
            >
              <a-input
                v-model="filters.parent_logic_pk"
                :placeholder="$t('module.functionEventLogical.parent_logic_pk')"
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
              :label="$t('module.functionEventLogical.project_id')"
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
              :label="$t('module.functionEventLogical.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.functionEventLogical.version_code')"
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
          slot="function_goto_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.functionGoto.name }}
          </div>
        </template>
        <template
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.name }}
          </div>
        </template>
        <template
          slot="project_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.project.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionEventLogical') }}
      </template>

      <a-spin :spinning="loading">
        <functionEventLogical-form
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
import FunctionEventLogicalForm from '~/components/templates/functionEventLogical/FunctionEventLogicalForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionEventLogicalForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionEventLogical',
      visible: false,
      currentId: 0,
      filters: {
        conditions: this.$route.query.conditions || '',
        conditions_jp: this.$route.query.conditions_jp || '',
        use_flg: this.$route.query.use_flg || '',
        event_pk: this.$route.query.event_pk || '',
        function_goto_id: this.$route.query.function_goto_id || '',
        function_id: this.$route.query.function_id || '',
        item_pk: this.$route.query.item_pk || '',
        logic_detail: this.$route.query.logic_detail || '',
        logic_detail_jp: this.$route.query.logic_detail_jp || '',
        logic_pk: this.$route.query.logic_pk || '',
        logic_type: this.$route.query.logic_type || '',
        order: this.$route.query.order || '',
        parent_logic_pk: this.$route.query.parent_logic_pk || '',
        project_id: this.$route.query.project_id || '',
        version_code: this.$route.query.version_code || ''
      },
      defaultParams: {
        not_admin: 1
      },
      functionGotos: [],
      functions: [],
      projects: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.functionEventLogical.conditions'),
          dataIndex: 'conditions',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.conditions_jp'),
          dataIndex: 'conditions_jp',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.use_flg'),
          dataIndex: 'use_flg',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.event_pk'),
          dataIndex: 'event_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.function_goto_id'),
          dataIndex: 'function_goto_id',
          scopedSlots: { customRender: 'function_goto_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.item_pk'),
          dataIndex: 'item_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.logic_detail'),
          dataIndex: 'logic_detail',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.logic_detail_jp'),
          dataIndex: 'logic_detail_jp',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.logic_pk'),
          dataIndex: 'logic_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.logic_type'),
          dataIndex: 'logic_type',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.parent_logic_pk'),
          dataIndex: 'parent_logic_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionEventLogical.version_code'),
          dataIndex: 'version_code',
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
    this.getFunctionGotos()
    this.getFunctions()
    this.getProjects()
  },

  methods: {
    /**
     * List FunctionGoto.
     */
    async getFunctionGotos() {
      const { data: { result: { data } } } = await this.$api.functionGoto.list()
      this.functionGotos = data
    },

    /**
     * List Function.
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

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
        conditions: '',
        conditions_jp: '',
        use_flg: '',
        event_pk: '',
        function_goto_id: '',
        function_id: '',
        item_pk: '',
        logic_detail: '',
        logic_detail_jp: '',
        logic_pk: '',
        logic_type: '',
        order: '',
        parent_logic_pk: '',
        project_id: '',
        version_code: ''
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
