<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
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
              :label="$t('module.functionMessage.message_code')"
              prop="message_code"
            >
              <a-input
                v-model="filters.message_code"
                :placeholder="$t('module.functionMessage.message_code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionMessage.content_vi')"
              prop="content_vi"
            >
              <a-input
                v-model="filters.content_vi"
                :placeholder="$t('module.functionMessage.content_vi')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionMessage.content_jp')"
              prop="content_jp"
            >
              <a-input
                v-model="filters.content_jp"
                :placeholder="$t('module.functionMessage.content_jp')"
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
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="showDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            :disabled="loading || version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="confirmToDelete(record)"
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
        {{ currentId ? $t('common.edit') : $t('common.create') }} {{ $t('module.functionMessage') }}
      </template>

      <a-spin :spinning="loading">
        <functionMessage-form
          :id="currentId"
          :version="version"
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
import FunctionMessageForm from '~/components/templates/functionMessage/FunctionMessageForm'
import { LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
    FunctionMessageForm
  },

  /**
     * Declare mixins.
     */
  mixins: [
    DataTable
  ],
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  /**
     * Init data for component.
     */
  data() {
    return {
      resource: 'functionMessage',
      visible: false,
      currentId: 0,
      filters: {
        message_code: this.$route.query.message_code || '',
        content_vi: this.$route.query.content_vi || '',
        content_jp: this.$route.query.content_jp || ''
      },
      defaultParams: {
        not_admin: 1,
        use_flg: USE_FLG_VALUE.yes,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code
      },
      projects: [],
      functions: [],
      USE_FLG_VALUE,
      LOCK_FLG_VALUE
    }
  },

  /**
     * Computed event.
     */
  computed: {
    header() {
      return [
        {
          title: this.$t('common.order'),
          dataIndex: 'index',
          customRender: (text, record, index) => this.calculateIndex(index),
          width: 100
        },
        {
          title: this.$t('module.functionMessage.message_code'),
          dataIndex: 'message_code',
          sorter: true
        },
        {
          title: this.$t('module.functionMessage.content_vi'),
          dataIndex: 'content_vi',
          sorter: true
        },
        {
          title: this.$t('module.functionMessage.content_jp'),
          dataIndex: 'content_jp',
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
  },

  /**
     * Methods.
     */
  methods: {
    calculateIndex(index) {
      return index + 1
    },
    /**
     * Go to new
     */
    gotoNew() {
      this.currentId = 0
      this.visible = true
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
        message_code: '',
        content_vi: '',
        content_jp: ''
      }
      this.search()
    },

    /**
       * Search data.
       */
    search() {
      this.replaceQuery(this.filters)
    },

    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDelete(record) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.updateUseFlg(record, USE_FLG_VALUE.no)
      })
    },

    /**
     * Delete record
     */
    async updateUseFlg(record, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = record
        data.use_flg = flg
        await this.repository.update(record.id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$fetch()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>
