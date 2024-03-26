<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableForeignKey.project_id')"
              prop="project_id"
            >
              <a-select
                v-model="model.project_id"
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
              :label="$t('module.dbTableForeignKey.db_table_id')"
              prop="db_table_id"
            >
              <a-select
                v-model="model.db_table_id"
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
              :label="$t('module.dbTableForeignKey.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.dbTableForeignKey.version_code')"
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
              :label="$t('module.dbTableForeignKey.db_table_foreign_key_pk')"
              prop="db_table_foreign_key_pk"
            >
              <a-input
                v-model="model.db_table_foreign_key_pk"
                :placeholder="$t('module.dbTableForeignKey.db_table_foreign_key_pk')"
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
              :label="$t('module.dbTableForeignKey.db_table_column_pk')"
              prop="db_table_column_pk"
            >
              <a-input
                v-model="model.db_table_column_pk"
                :placeholder="$t('module.dbTableForeignKey.db_table_column_pk')"
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
              :label="$t('module.dbTableForeignKey.db_table_foreign_id')"
              prop="db_table_foreign_id"
            >
              <a-select
                v-model="model.db_table_foreign_id"
                :placeholder="$t('module.dbTableForeign')"
              >
                <a-select-option
                  v-for="(item, index) in dbTableForeigns"
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
              :label="$t('module.dbTableForeignKey.db_column_foreign_pk')"
              prop="db_column_foreign_pk"
            >
              <a-input
                v-model="model.db_column_foreign_pk"
                :placeholder="$t('module.dbTableForeignKey.db_column_foreign_pk')"
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
              :label="$t('module.dbTableForeignKey.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.dbTableForeignKey.order')"
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
              :label="$t('module.dbTableForeignKey.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="model.use_flg"
                :placeholder="$t('module.dbTableForeignKey.use_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          :title="id ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          title="Huỷ bỏ"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'

export default {
  mixins: [DataForm],

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
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
  data: () => ({
    resource: 'dbTableForeignKey',
    projects: [],
    dbTables: [],
    dbTableForeigns: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        db_table_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.db_table_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.version_code') }),
            trigger: ['change', 'blur']
          }
        ],
        db_table_foreign_key_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.db_table_foreign_key_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        db_table_column_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.db_table_column_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        db_table_foreign_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.db_table_foreign_id') }),
            trigger: ['change', 'blur']
          }
        ],
        db_column_foreign_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.db_column_foreign_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableForeignKey.use_flg') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getProjects()
    this.getDbTables()
    this.getDbTableForeigns()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Project
     */
    async getProjects() {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },

    /**
     * List DbTable
     */
    async getDbTables() {
      const { data: { result: { data } } } = await this.$api.dbTable.list()
      this.dbTables = data
    },

    /**
     * List DbTableForeign
     */
    async getDbTableForeigns() {
      const { data: { result: { data } } } = await this.$api.dbTableForeign.list()
      this.dbTableForeigns = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        db_table_id: this.model.db_table_id,
        version_code: this.model.version_code,
        db_table_foreign_key_pk: this.model.db_table_foreign_key_pk,
        db_table_column_pk: this.model.db_table_column_pk,
        db_table_foreign_id: this.model.db_table_foreign_id,
        db_column_foreign_pk: this.model.db_column_foreign_pk,
        order: this.model.order,
        use_flg: this.model.use_flg,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
}
</style>
