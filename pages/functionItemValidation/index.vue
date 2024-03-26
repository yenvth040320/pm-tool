<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.functionItemValidation') }}
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
              :label="$t('module.functionItemValidation.content_check')"
              prop="content_check"
            >
              <a-input
                v-model="filters.content_check"
                :placeholder="$t('module.functionItemValidation.content_check')"
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
              :label="$t('module.functionItemValidation.content_check_jp')"
              prop="content_check_jp"
            >
              <a-input
                v-model="filters.content_check_jp"
                :placeholder="$t('module.functionItemValidation.content_check_jp')"
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
              :label="$t('module.functionItemValidation.expect_result')"
              prop="expect_result"
            >
              <a-input
                v-model="filters.expect_result"
                :placeholder="$t('module.functionItemValidation.expect_result')"
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
              :label="$t('module.functionItemValidation.expect_result_jp')"
              prop="expect_result_jp"
            >
              <a-input
                v-model="filters.expect_result_jp"
                :placeholder="$t('module.functionItemValidation.expect_result_jp')"
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
              :label="$t('module.functionItemValidation.function_id')"
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
              :label="$t('module.functionItemValidation.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="filters.item_pk"
                :placeholder="$t('module.functionItemValidation.item_pk')"
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
              :label="$t('module.functionItemValidation.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="filters.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemPropertys"
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
              :label="$t('module.functionItemValidation.mst_validation_id')"
              prop="mst_validation_id"
            >
              <a-select
                v-model="filters.mst_validation_id"
                :placeholder="$t('module.mstValidation')"
              >
                <a-select-option
                  v-for="(item, index) in mstValidations"
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
              :label="$t('module.functionItemValidation.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.functionItemValidation.order')"
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
              :label="$t('module.functionItemValidation.project_id')"
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
              :label="$t('module.functionItemValidation.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.functionItemValidation.version_code')"
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
          slot="function_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.function.name }}
          </div>
        </template>
        <template
          slot="mst_item_property_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemProperty.name }}
          </div>
        </template>
        <template
          slot="mst_validation_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstValidation.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionItemValidation') }}
      </template>

      <a-spin :spinning="loading">
        <functionItemValidation-form
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
import FunctionItemValidationForm from '~/components/templates/functionItemValidation/FunctionItemValidationForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FunctionItemValidationForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionItemValidation',
      visible: false,
      currentId: 0,
      filters: {
        content_check: this.$route.query.content_check || '',
        content_check_jp: this.$route.query.content_check_jp || '',
        expect_result: this.$route.query.expect_result || '',
        expect_result_jp: this.$route.query.expect_result_jp || '',
        function_id: this.$route.query.function_id || '',
        item_pk: this.$route.query.item_pk || '',
        mst_item_property_id: this.$route.query.mst_item_property_id || '',
        mst_validation_id: this.$route.query.mst_validation_id || '',
        order: this.$route.query.order || '',
        project_id: this.$route.query.project_id || '',
        version_code: this.$route.query.version_code || ''
      },
      defaultParams: {
        not_admin: 1
      },
      functions: [],
      mstItemPropertys: [],
      mstValidations: [],
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
          title: this.$t('module.functionItemValidation.content_check'),
          dataIndex: 'content_check',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.content_check_jp'),
          dataIndex: 'content_check_jp',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.expect_result'),
          dataIndex: 'expect_result',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.expect_result_jp'),
          dataIndex: 'expect_result_jp',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.item_pk'),
          dataIndex: 'item_pk',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.mst_item_property_id'),
          dataIndex: 'mst_item_property_id',
          scopedSlots: { customRender: 'mst_item_property_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.mst_validation_id'),
          dataIndex: 'mst_validation_id',
          scopedSlots: { customRender: 'mst_validation_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.functionItemValidation.version_code'),
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
    this.getFunctions()
    this.getMstItemPropertys()
    this.getMstValidations()
    this.getProjects()
  },

  methods: {
    /**
     * List Function.
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

    /**
     * List MstItemProperty.
     */
    async getMstItemPropertys() {
      const { data: { result: { data } } } = await this.$api.mstItemProperty.list()
      this.mstItemPropertys = data
    },

    /**
     * List MstValidation.
     */
    async getMstValidations() {
      const { data: { result: { data } } } = await this.$api.mstValidation.list()
      this.mstValidations = data
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
        content_check: '',
        content_check_jp: '',
        expect_result: '',
        expect_result_jp: '',
        function_id: '',
        item_pk: '',
        mst_item_property_id: '',
        mst_validation_id: '',
        order: '',
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
