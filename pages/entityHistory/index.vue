<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.entityHistory') }}
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
              :label="$t('module.entityHistory.project_id')"
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
              :label="$t('module.entityHistory.entity_id')"
              prop="entity_id"
            >
              <a-select
                v-model="filters.entity_id"
                :placeholder="$t('module.entity')"
              >
                <a-select-option
                  v-for="(item, index) in entitys"
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
              :label="$t('module.entityHistory.entity_relationship_id')"
              prop="entity_relationship_id"
            >
              <a-select
                v-model="filters.entity_relationship_id"
                :placeholder="$t('module.entityRelationship')"
              >
                <a-select-option
                  v-for="(item, index) in entityRelationships"
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
              :label="$t('module.entityHistory.description_before')"
              prop="description_before"
            >
              <a-input
                v-model="filters.description_before"
                :placeholder="$t('module.entityHistory.description_before')"
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
              :label="$t('module.entityHistory.description_after')"
              prop="description_after"
            >
              <a-input
                v-model="filters.description_after"
                :placeholder="$t('module.entityHistory.description_after')"
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
              :label="$t('module.entityHistory.update_user_id')"
              prop="update_user_id"
            >
              <a-select
                v-model="filters.update_user_id"
                :placeholder="$t('module.updateUser')"
              >
                <a-select-option
                  v-for="(item, index) in updateUsers"
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
              :label="$t('module.entityHistory.type')"
              prop="type"
            >
              <a-input
                v-model="filters.type"
                :placeholder="$t('module.entityHistory.type')"
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
          slot="entity_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.entity.name }}
          </div>
        </template>
        <template
          slot="entity_relationship_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.entityRelationship.name }}
          </div>
        </template>
        <template
          slot="update_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.updateUser.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.entityHistory') }}
      </template>

      <a-spin :spinning="loading">
        <entityHistory-form
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
import EntityHistoryForm from '~/components/templates/entityHistory/EntityHistoryForm'

export default {
  /**
   * Declare components.
   */
  components: {
    EntityHistoryForm
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
      resource: 'entityHistory',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        entity_id: this.$route.query.entity_id || '',
        entity_relationship_id: this.$route.query.entity_relationship_id || '',
        description_before: this.$route.query.description_before || '',
        description_after: this.$route.query.description_after || '',
        update_user_id: this.$route.query.update_user_id || '',
        type: this.$route.query.type || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      entitys: [],
      entityRelationships: [],
      updateUsers: []
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
          title: this.$t('module.entityHistory.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.entity_id'),
          dataIndex: 'entity_id',
          scopedSlots: { customRender: 'entity_id' },
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.entity_relationship_id'),
          dataIndex: 'entity_relationship_id',
          scopedSlots: { customRender: 'entity_relationship_id' },
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.description_before'),
          dataIndex: 'description_before',
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.description_after'),
          dataIndex: 'description_after',
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.update_user_id'),
          dataIndex: 'update_user_id',
          scopedSlots: { customRender: 'update_user_id' },
          sorter: true
        },
        {
          title: this.$t('module.entityHistory.type'),
          dataIndex: 'type',
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
    this.getEntitys()
    this.getEntityRelationships()
    this.getUpdateUsers()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * List Project.
     */
    async getProjects() {
      const { data: { result: { data } } } = await this.$api.project.list()
      this.projects = data
    },

    /**
     * List Entity.
     */
    async getEntitys() {
      const { data: { result: { data } } } = await this.$api.entity.list()
      this.entitys = data
    },

    /**
     * List EntityRelationship.
     */
    async getEntityRelationships() {
      const { data: { result: { data } } } = await this.$api.entityRelationship.list()
      this.entityRelationships = data
    },

    /**
     * List UpdateUser.
     */
    async getUpdateUsers() {
      const { data: { result: { data } } } = await this.$api.updateUser.list()
      this.updateUsers = data
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
        entity_id: '',
        entity_relationship_id: '',
        description_before: '',
        description_after: '',
        update_user_id: '',
        type: ''
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
