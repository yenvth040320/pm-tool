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
              :label="$t('module.dbTableVersion.version_code')"
              prop="version_code"
            >
              <span>{{ model.version_code }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableVersion.name')"
              prop="name"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.name"
                :placeholder="$t('module.dbTableVersion.name')"
              />
              <span v-else>{{ model.name }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableVersion.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.name_jp"
                :placeholder="$t('module.dbTableVersion.name_jp')"
              />
              <span v-else>{{ model.name_jp }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableVersion.description')"
              prop="description"
            >
              <a-textarea
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.description"
                :placeholder="$t('module.dbTableVersion.description')"
              />
              <span v-else>{{ model.description }}</span>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.dbTableVersion.description_jp')"
              prop="description_jp"
            >
              <a-textarea
                v-if="version.lock_flg === LOCK_FLG_VALUE.no"
                v-model="model.description_jp"
                :placeholder="$t('module.dbTableVersion.description_jp')"
              />
              <span v-else>{{ model.description_jp }}</span>
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
                v-model="model.dbTable.entity_id"
                :placeholder="$t('module.dbTable.entity_id')"
                show-search
                :filter-option="filterOption"
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
        </a-row>
      </div>
      <div v-if="version.lock_flg === LOCK_FLG_VALUE.no" class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          title="Cập nhật"
          class="min-w-100"
        >
          {{ $t('common.update') }}
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
import { LOCK_FLG_VALUE } from '~/constants'

export default {
  mixins: [DataForm],

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    entityList: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'dbTableVersion',
    LOCK_FLG_VALUE,
    dbTables: [],
    model: {
      dbTable: {}
    }
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
            message: this.$t('validation.required', { field: this.$t('module.dbTableVersion.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        db_table_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableVersion.db_table_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableVersion.version_code') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableVersion.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.dbTableVersion.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.dbTableVersion.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        lock_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.dbTableVersion.lock_flg') }),
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
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get item detail
     *
     */
    getDetail() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        let model = {}

        model = this.version

        this.setModel(model)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
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
        db_table_id: this.model.db_table_id,
        version_code: this.model.version_code,
        name: this.model.name,
        name_jp: this.model.name_jp,
        description: this.model.description,
        description_jp: this.model.description_jp,
        lock_flg: this.model.lock_flg,
        dbTable: this.model.dbTable,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
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

            this.getDetail()
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
