<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.question') }}
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
              :label="$t('module.question.category')"
              prop="category"
            >
              <a-input
                v-model="filters.category"
                :placeholder="$t('module.question.category')"
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
              :label="$t('module.question.context')"
              prop="context"
            >
              <a-input
                v-model="filters.context"
                :placeholder="$t('module.question.context')"
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
              :label="$t('module.question.function_id')"
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
              :label="$t('module.question.is_deleted')"
              prop="is_deleted"
            >
              <a-input
                v-model="filters.is_deleted"
                :placeholder="$t('module.question.is_deleted')"
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
              :label="$t('module.question.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="filters.item_pk"
                :placeholder="$t('module.question.item_pk')"
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
              :label="$t('module.question.project_id')"
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
              :label="$t('module.question.question')"
              prop="question"
            >
              <a-input
                v-model="filters.question"
                :placeholder="$t('module.question.question')"
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
              :label="$t('module.question.status')"
              prop="status"
            >
              <a-input
                v-model="filters.status"
                :placeholder="$t('module.question.status')"
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
              :label="$t('module.question.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="filters.version_code"
                :placeholder="$t('module.question.version_code')"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.question') }}
      </template>

      <a-spin :spinning="loading">
        <question-form
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
import QuestionForm from '~/components/templates/question/QuestionForm'

export default {
  /**
   * Declare components.
   */
  components: {
    QuestionForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'question',
      visible: false,
      currentId: 0,
      filters: {
        category: this.$route.query.category || '',
        context: this.$route.query.context || '',
        function_id: this.$route.query.function_id || '',
        is_deleted: this.$route.query.is_deleted || '',
        item_pk: this.$route.query.item_pk || '',
        project_id: this.$route.query.project_id || '',
        question: this.$route.query.question || '',
        status: this.$route.query.status || '',
        version_code: this.$route.query.version_code || ''
      },
      defaultParams: {
        not_admin: 1
      },
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
          title: 'ID',
          dataIndex: 'id',
          width: 60
        },
        {
          title: this.$t('module.question.category'),
          dataIndex: 'category',
          sorter: true
        },
        {
          title: this.$t('module.question.context'),
          dataIndex: 'context',
          sorter: true
        },
        {
          title: this.$t('module.question.function_id'),
          dataIndex: 'function_id',
          scopedSlots: { customRender: 'function_id' },
          sorter: true
        },
        {
          title: this.$t('module.question.is_deleted'),
          dataIndex: 'is_deleted',
          sorter: true
        },
        {
          title: this.$t('module.question.item_pk'),
          dataIndex: 'item_pk',
          sorter: true
        },
        {
          title: this.$t('module.question.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.question.question'),
          dataIndex: 'question',
          sorter: true
        },
        {
          title: this.$t('module.question.status'),
          dataIndex: 'status',
          sorter: true
        },
        {
          title: this.$t('module.question.version_code'),
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
     * List Project.
     */
    async getProjects() {
      const { data: { result: { data } } } = await this.$api.project.list()
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
        category: '',
        context: '',
        function_id: '',
        is_deleted: '',
        item_pk: '',
        project_id: '',
        question: '',
        status: '',
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
