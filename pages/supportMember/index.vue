<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.supportMember') }}
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
              :label="$t('module.supportMember.supporter_id')"
              prop="supporter_id"
            >
              <a-select
                v-model="filters.supporter_id"
                :placeholder="$t('module.supporter')"
              >
                <a-select-option
                  v-for="(item, index) in supporters"
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
              :label="$t('module.supportMember.supported_user_id')"
              prop="supported_user_id"
            >
              <a-select
                v-model="filters.supported_user_id"
                :placeholder="$t('module.supportedUser')"
              >
                <a-select-option
                  v-for="(item, index) in supportedUsers"
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
              :label="$t('module.supportMember.start_date')"
              prop="start_date"
            >
              <a-input
                v-model="filters.start_date"
                :placeholder="$t('module.supportMember.start_date')"
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
              :label="$t('module.supportMember.end_date')"
              prop="end_date"
            >
              <a-input
                v-model="filters.end_date"
                :placeholder="$t('module.supportMember.end_date')"
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
          slot="supporter_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.supporter.name }}
          </div>
        </template>
        <template
          slot="supported_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.supportedUser.name }}
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.supportMember') }}
      </template>

      <a-spin :spinning="loading">
        <supportMember-form
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
import SupportMemberForm from '~/components/templates/supportMember/SupportMemberForm'

export default {
  /**
   * Declare components.
   */
  components: {
    SupportMemberForm
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
      resource: 'supportMember',
      visible: false,
      currentId: 0,
      filters: {
        supporter_id: this.$route.query.supporter_id || '',
        supported_user_id: this.$route.query.supported_user_id || '',
        start_date: this.$route.query.start_date || '',
        end_date: this.$route.query.end_date || ''
      },
      defaultParams: {
        not_admin: 1
      },
      supporters: [],
      supportedUsers: []
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
          title: this.$t('module.supportMember.supporter_id'),
          dataIndex: 'supporter_id',
          scopedSlots: { customRender: 'supporter_id' },
          sorter: true
        },
        {
          title: this.$t('module.supportMember.supported_user_id'),
          dataIndex: 'supported_user_id',
          scopedSlots: { customRender: 'supported_user_id' },
          sorter: true
        },
        {
          title: this.$t('module.supportMember.start_date'),
          dataIndex: 'start_date',
          sorter: true
        },
        {
          title: this.$t('module.supportMember.end_date'),
          dataIndex: 'end_date',
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
    this.getSupporters()
    this.getSupportedUsers()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * List Supporter.
     */
    async getSupporters() {
      const { data: { result: { data } } } = await this.$api.supporter.list()
      this.supporters = data
    },

    /**
     * List SupportedUser.
     */
    async getSupportedUsers() {
      const { data: { result: { data } } } = await this.$api.supportedUser.list()
      this.supportedUsers = data
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
        supporter_id: '',
        supported_user_id: '',
        start_date: '',
        end_date: ''
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
