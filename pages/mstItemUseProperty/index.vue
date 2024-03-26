<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.mstItemUseProperty') }}
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
              :label="$t('module.mstItemUseProperty.project_id')"
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
              :label="$t('module.mstItemUseProperty.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="filters.mst_item_type_id"
                :placeholder="$t('module.mstItemType')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemTypes"
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
              :label="$t('module.mstItemUseProperty.mst_item_property_id')"
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
              :label="$t('module.mstItemUseProperty.order')"
              prop="order"
            >
              <a-input
                v-model="filters.order"
                :placeholder="$t('module.mstItemUseProperty.order')"
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
              :label="$t('module.mstItemUseProperty.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="filters.use_flg"
                :placeholder="$t('module.mstItemUseProperty.use_flg')"
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
          slot="mst_item_type_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.mstItemType.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.mstItemUseProperty') }}
      </template>

      <a-spin :spinning="loading">
        <mstItemUseProperty-form
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
import MstItemUsePropertyForm from '~/components/templates/mstItemUseProperty/MstItemUsePropertyForm'

export default {
  /**
   * Declare components.
   */
  components: {
    MstItemUsePropertyForm
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'mstItemUseProperty',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || '',
        mst_item_type_id: this.$route.query.mst_item_type_id || '',
        mst_item_property_id: this.$route.query.mst_item_property_id || '',
        order: this.$route.query.order || '',
        use_flg: this.$route.query.use_flg || ''
      },
      defaultParams: {
        not_admin: 1
      },
      projects: [],
      mstItemTypes: [],
      mstItemPropertys: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.mstItemUseProperty.project_id'),
          dataIndex: 'project_id',
          scopedSlots: { customRender: 'project_id' },
          sorter: true
        },
        {
          title: this.$t('module.mstItemUseProperty.mst_item_type_id'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' },
          sorter: true
        },
        {
          title: this.$t('module.mstItemUseProperty.mst_item_property_id'),
          dataIndex: 'mst_item_property_id',
          scopedSlots: { customRender: 'mst_item_property_id' },
          sorter: true
        },
        {
          title: this.$t('module.mstItemUseProperty.order'),
          dataIndex: 'order',
          sorter: true
        },
        {
          title: this.$t('module.mstItemUseProperty.use_flg'),
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
    this.getMstItemTypes()
    this.getMstItemPropertys()
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
     * List MstItemType.
     */
    async getMstItemTypes() {
      const { data: { result: { data } } } = await this.$api.mstItemType.list()
      this.mstItemTypes = data
    },

    /**
     * List MstItemProperty.
     */
    async getMstItemPropertys() {
      const { data: { result: { data } } } = await this.$api.mstItemProperty.list()
      this.mstItemPropertys = data
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
        mst_item_type_id: '',
        mst_item_property_id: '',
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
