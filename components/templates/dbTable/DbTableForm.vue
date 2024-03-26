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
              :label="$t('module.dbTable.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.dbTable.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTable.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.dbTable.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTable.entity_id')"
              prop="entity_id"
            >
              <a-select
                v-model="model.entity_id"
                :placeholder="$t('module.dbTable.entity_id')"
              >
                <a-select-option
                  v-for="(item, index) in entityList"
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
              :label="$t('module.dbTable.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.dbTable.description')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTable.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-model="model.description_jp"
                :placeholder="$t('module.dbTable.description_jp')"
                :rows="5"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTable.use_flg')"
              prop="use_flg"
            >
              <a-select
                v-model="model.use_flg"
                :placeholder="$t('module.dbTable.use_flg')"
              >
                <a-select-option
                  v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
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
import { USE_FLG, USE_FLG_VALUE, SORT } from '~/constants'

export default {
  components: { },
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'dbTable',
    dbSchemas: [],
    USE_FLG,
    USE_FLG_VALUE,
    entityList: [],
    SORT
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
            message: this.$t('validation.required', { field: this.$t('module.dbTable.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        db_schema_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTable.db_schema_id') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTable.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.dbTable.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTable.use_flg') }),
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
    this.getEntity()
  },

  /**
   * List of methods.
   */
  methods: {
    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
      this.model.db_schema_id = this.$store.state.dbSchema.id
      if (!this.model.id) {
        this.model.use_flg = USE_FLG_VALUE.yes
      }
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
        db_schema_id: this.model.db_schema_id,
        entity_id: this.model.entity_id,
        name: this.model.name,
        order: this.model.order,
        use_flg: this.model.use_flg,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    async getEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entityList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
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
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
}
</style>
