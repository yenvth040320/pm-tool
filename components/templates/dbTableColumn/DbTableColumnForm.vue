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
            :span="16"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.dbTableColumn.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.data_type')"
              prop="data_type"
            >
              <a-select
                v-model="model.data_type"
                allow-clear
                :placeholder="$t('module.dbTableColumn.data_type')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in COLUMN_DATA_TYPE"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              v-if="!hasPrimaryKey"
              :label="$t('module.dbTableColumn.primary_key')"
              prop="primary_key"
            >
              <a-radio-group v-model="model.primary_key" @change="changeRadio">
                <a-radio
                  v-for="(item, index) in DB_COLUMN_PRIMARY_KEY"
                  :key="index"
                  :style="radioStyle"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              v-if="!hasPrimaryKey"
              :label="$t('module.dbTableColumn.auto_increment')"
              prop="auto_increment"
            >
              <a-radio-group v-model="model.auto_increment" @change="changeRadio">
                <a-radio
                  v-for="(item, index) in DB_COLUMN_AUTO_INCREMENT"
                  :key="index"
                  :style="radioStyle"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.not_null')"
              prop="not_null"
            >
              <a-radio-group v-model="model.not_null" @change="changeRadio">
                <a-radio
                  v-for="(item, index) in DB_COLUMN_NOT_NULL"
                  :key="index"
                  :style="radioStyle"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.default_value')"
              prop="default_value"
            >
              <a-input
                v-model="model.default_value"
                :placeholder="$t('module.dbTableColumn.default_value')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="16"
          >
            <a-form-model-item
              :label="$t('module.dbTableColumn.description')"
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :placeholder="$t('module.dbTableColumn.description')"
                :rows="5"
              />
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
import {
  COLUMN_DATA_TYPE,
  DB_COLUMN_PRIMARY_KEY,
  DB_COLUMN_AUTO_INCREMENT,
  DB_COLUMN_NOT_NULL,
  DB_COLUMN_NOT_NULL_VALUE,
  DB_COLUMN_AUTO_INCREMENT_VALUE,
  DB_COLUMN_PRIMARY_KEY_VALUE
} from '~/constants'

export default {
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'dbTableColumn',
    COLUMN_DATA_TYPE,
    DB_COLUMN_PRIMARY_KEY,
    DB_COLUMN_AUTO_INCREMENT,
    DB_COLUMN_NOT_NULL,
    DB_COLUMN_NOT_NULL_VALUE,
    DB_COLUMN_AUTO_INCREMENT_VALUE,
    DB_COLUMN_PRIMARY_KEY_VALUE,
    dbTables: [],
    radioStyle: {
      display: 'block',
      height: '30px',
      lineHeight: '30px'
    }
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableColumn.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.dbTableColumn.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        data_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableColumn.data_type') }),
            trigger: ['change', 'blur']
          }
        ],
        primary_key: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableColumn.primary_key') }),
            trigger: ['change', 'blur']
          }
        ],
        auto_increment: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableColumn.auto_increment') }),
            trigger: ['change', 'blur']
          }
        ],
        not_null: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableColumn.not_null') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    hasPrimaryKey: {
      type: [Boolean],
      default: false
    }
  },

  /**
   * Mounted event.
   */
  mounted() {},

  /**
   * List of methods.
   */
  methods: {
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
        db_table_column_pk: this.model.db_table_column_pk,
        name: this.model.name,
        data_type: this.model.data_type,
        primary_key: this.model.primary_key,
        auto_increment: this.model.auto_increment,
        not_null: this.model.not_null,
        description: this.model.description,
        description_jp: this.model.description_jp,
        default_value: this.model.default_value,
        order: this.model.order,
        use_flg: this.model.use_flg,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    setModel(data) {
      this.model = data
      if (!this.model.id) {
        this.model.project_id = this.$store.state.project.id
        this.model.db_table_id = this.version.db_table_id
        this.model.version_code = this.version.version_code
        this.model.not_null = DB_COLUMN_NOT_NULL_VALUE.no
        this.model.auto_increment = DB_COLUMN_AUTO_INCREMENT_VALUE.no
        this.model.primary_key = DB_COLUMN_PRIMARY_KEY_VALUE.no
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    changeRadio(e) {
      this.$forceUpdate()
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.model = {
              name: '',
              data_type: undefined,
              description: '',
              default_value: '',
              not_null: DB_COLUMN_NOT_NULL_VALUE.no,
              auto_increment: DB_COLUMN_AUTO_INCREMENT_VALUE.no,
              primary_key: DB_COLUMN_PRIMARY_KEY_VALUE.no,
              project_id: this.$store.state.project.id,
              db_table_id: this.version.db_table_id,
              version_code: this.version.version_code
            }
            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
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
