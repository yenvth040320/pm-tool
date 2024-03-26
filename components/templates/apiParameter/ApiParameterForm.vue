<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    layout="vertical"
    @submit.prevent="handleSubmit"
  >
    <div class="p-4">
      <div
        v-if="dataNode.id && !id"
        class="pb-4"
        :span="24"
      >
        <div v-for="(type, index) in DATA_TYPE" :key="index">
          <div v-if="type.value === dataNode.data_type" class="category-label">
            {{ $t('module.apiParameter.parent') + ': ' + dataNode.name + ' (' + type.label + ')' }}
          </div>
        </div>
      </div>

      <a-row v-if="!isParameterJson" :gutter="16">
        <a-col :span="24">
          <a-form-model-item
            :label="$t('module.apiParameter.name')"
            prop="name"
          >
            <a-input
              v-model="model.name"
              :placeholder="$t('module.apiParameter.name')"
            />
          </a-form-model-item>
        </a-col>
        <a-col v-if="id === 0" :span="24">
          <a-form-model-item
            :label="$t('module.apiParameter.data_type')"
            prop="data_type"
          >
            <a-select
              v-model="model.data_type"
              :placeholder="$t('module.apiParameter.data_type')"
              allow-clear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, index) in DATA_TYPE"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item
            :label="$t('module.apiParameter.description')"
            prop="description"
          >
            <a-textarea
              v-model="model.description"
              :rows="4"
              :placeholder="$t('module.apiParameter.description')"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row v-else :gutter="16">
        <a-col :span="24">
          <a-form-model-item
            :label="$t('module.apiParameter')"
            prop="parameter"
          >
            <a-textarea
              v-model="model.parameter"
              :rows="20"
              :placeholder="$t('module.apiParameter')"
            />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-divider />
      <div v-if="!isParameterJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" class="heading-text pb-3">
        {{ $t('module.apiParameterDatasource') }}
      </div>
      <div v-for="(parameter, index) in model.apiParameterDatasources" v-show="!isParameterJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" :key="index">
        <div class="delete-btn pb-4">
          <a-button
            type="danger"
            title="Xoá"
            @click="deleteDatasource(index, parameter.id)"
          >
            <a-icon type="delete" />
          </a-button>
        </div>
        <a-form-model-item
          :label="$t('module.apiParameterDatasource.schema')"
          :prop="'apiParameterDatasources.' + index + '.db_schema_id'"
          :rules="{
            required: true,
            message: $t('validation.required', {
              field: $t('module.apiParameterDatasource.schema')
            }),
            trigger: ['change', 'blur']
          }"
        >
          <a-select
            v-model="parameter.db_schema_id"
            :placeholder="$t('module.apiParameterDatasource.schema')"
            allow-clear
            show-search
            :filter-option="filterOption"
            @change="changeSchema(index)"
          >
            <a-select-option
              v-for="(item, i) in dbSchemas"
              :key="i"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          :label="$t('module.apiParameterDatasource.dbTable')"
          :prop="'apiParameterDatasources.' + index + '.db_table_id'"
          :rules="{
            required: true,
            message: $t('validation.required', {
              field: $t('module.apiParameterDatasource.dbTable')
            }),
            trigger: ['change', 'blur']
          }"
        >
          <a-select
            v-model="parameter.db_table_id"
            :placeholder="$t('module.apiParameterDatasource.dbTable')"
            allow-clear
            show-search
            :filter-option="filterOption"
            @change="changeTable(index)"
          >
            <a-select-option
              v-for="(item, i) in filterTable[index]"
              :key="i"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          :label="$t('module.apiParameterDatasource.dbTableVersion')"
          :prop="'apiParameterDatasources.' + index + '.db_table_version_code'"
          :rules="{
            required: true,
            message: $t('validation.required', {
              field: $t('module.apiParameterDatasource.dbTableVersion')
            }),
            trigger: ['change', 'blur']
          }"
        >
          <a-select
            v-model="parameter.db_table_version_code"
            :placeholder="$t('module.apiParameterDatasource.dbTableVersion')"
            allow-clear
            show-search
            :filter-option="filterOption"
            @change="changeTableVersion(index)"
          >
            <a-select-option
              v-for="(item, i) in filterTableVersion[index]"
              :key="i"
              :value="item.version_code"
            >
              {{ item.version_code }}: {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          v-if="model.data_type !== DATA_TYPE_VALUE.object"
          :label="$t('module.apiParameterDatasource.dbColumn')"
          :prop="'apiParameterDatasources.' + index + '.db_table_column_pk'"
          :rules="{
            required: true,
            message: $t('validation.required', {
              field: $t('module.apiParameterDatasource.dbColumn')
            }),
            trigger: ['change', 'blur']
          }"
        >
          <a-select
            v-model="parameter.db_table_column_pk"
            :placeholder="$t('module.apiParameterDatasource.dbColumn')"
            allow-clear
            show-search
            :filter-option="filterOption"
            @change="changeColumn(index)"
          >
            <a-select-option
              v-for="(item, i) in filterColumn[index]"
              :key="i"
              :value="item.db_table_column_pk"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          :label="$t('module.apiParameterDatasource.type_action')"
          :prop="'apiParameterDatasources.' + index + '.type_action'"
          :rules="{
            required: true,
            message: $t('validation.required', {
              field: $t('module.apiParameterDatasource.type_action')
            }),
            trigger: ['change', 'blur']
          }"
        >
          <a-select
            v-model="parameter.type_action"
            :placeholder="$t('module.apiParameterDatasource.type_action')"
            allow-clear
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="(item, i) in TYPE_ACTION"
              :key="i"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          :label="$t('module.apiParameterDatasource.description')"
          :prop="'apiParameterDatasources.' + index + '.description'"
        >
          <a-textarea
            v-model="parameter.description"
            :placeholder="$t('module.apiParameterDatasource.description')"
          />
        </a-form-model-item>
        <a-divider />
      </div>
      <div v-if="!isParameterJson && model.data_type !== DATA_TYPE_VALUE.array && model.data_type !== DATA_TYPE_VALUE.null" class="box-button-add">
        <a-button
          type="primary"
          title="Tạo mới"
          class="button-add-university"
          @click="addNewParameterDataSource()"
        >
          <a-icon type="file-add" />
        </a-button>
      </div>
    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button v-if="model.is_update" :style="{ marginRight: '8px' }" type="danger" title="Xoá" @click="confirmToDeleteAll(model)">
        {{ $t('common.delete') }}
      </a-button>
      <a-button v-if="model.id" :style="{ marginRight: '8px' }" type="danger" title="Xoá" @click="confirmToDelete(model.id, model)">
        {{ $t('common.delete') }}
      </a-button>
      <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="close">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button v-if="isParameterJson" html-type="submit" type="primary" title="Xem trước">
        {{ $t('common.preview') }}
      </a-button>
      <a-button v-else type="default" :title="id ? 'Cập nhật' : 'Tạo mới'" @click="updateParameter">
        {{ id ? $t('common.update') : $t('common.create') }}
      </a-button>
    </div>
    <PreviewParameterModal
      ref="previewParameter"
      :is-create="isCreate"
      @save="$emit('save')"
      @onClose="$emit('onClose')"
    />
  </a-form-model>
</template>

<script>
import { cloneDeep } from 'lodash'
import PreviewParameterModal from './PreviewParameterModal.vue'
import { DATA_TYPE, DATA_TYPE_VALUE, LOCK_FLG_VALUE, TYPE_ACTION, USE_FLG_VALUE } from '~/constants'
import DataForm from '~/mixins/data-form'

export default {
  components: {
    PreviewParameterModal
  },
  mixins: [DataForm],
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    dataNode: {
      type: Object,
      default: () => {}
    },
    parent: {
      type: Object,
      default: () => {}
    },
    dbSchemas: {
      type: [Array],
      default: () => []
    },
    dbTables: {
      type: [Array],
      default: () => []
    },
    dbColumns: {
      type: [Array],
      default: () => []
    },
    dbTableVersions: {
      type: [Array],
      default: () => []
    },
    isParameterJson: {
      type: [Boolean],
      default: false
    },
    listApiParameters: {
      type: [Array],
      default: () => []
    }
  },
  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API Parameter format ParameterServiceProvider.php.
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
    resource: 'apiParameter',
    DATA_TYPE,
    DATA_TYPE_VALUE,
    LOCK_FLG_VALUE,
    TYPE_ACTION,
    USE_FLG_VALUE,
    filterTable: [],
    filterColumn: [],
    filterTableVersion: [],
    isCreate: false,
    currentParameter: {}
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
            message: this.$t('validation.required', { field: this.$t('module.apiParameter.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiParameter.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiParameter.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        data_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiParameter.data_type') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    model(newModel) {
      if (newModel && Object.keys(newModel).length > 0 && newModel.apiParameterDatasources && newModel.apiParameterDatasources.length > 0) {
        for (let i = 0; i < newModel.apiParameterDatasources.length; i++) {
          this.changeSchema(i, true)
          this.changeTable(i, true)
          this.changeTableVersion(i, true)
        }
      }
    },
    listApiParameters(val) {
      this.getApiParameter(val)
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getApiParameter(this.listApiParameters)
  },

  /**
   * List of methods.
   */
  methods: {
    getApiParameter(data) {
      if (data.length > 0) {
        const recursive = (parentPK = null) => {
          const list = cloneDeep(data.filter(item => item.parent_api_parameter_pk === parentPK))
          const result = {}

          list.forEach(item => {
            const childResult = recursive(item.api_parameter_pk)
            if (item.data_type === DATA_TYPE_VALUE.object) {
              if (childResult && Object.keys(childResult).length > 0) {
                result[item.name] = childResult
              } else {
                result[item.name] = item.description
              }
            } else if (item.data_type === DATA_TYPE_VALUE.array) {
              const childArrayResult = []
              if (childResult && Object.keys(childResult).length > 0) {
                Object.values(childResult).forEach(value => {
                  childArrayResult.push(value)
                })
              }
              result[item.name] = childArrayResult
            } else if (item.data_type === DATA_TYPE_VALUE.boolean) {
              result[item.name] = item.description === '1'
            } else if (item.data_type === DATA_TYPE_VALUE.integer || item.data_type === DATA_TYPE_VALUE.float || item.data_type === DATA_TYPE_VALUE.double) {
              result[item.name] = parseFloat(item.description)
            } else {
              result[item.name] = item.description
            }
          })

          return result
        }

        const dataParameter = recursive()
        this.model.is_update = data.is_update
        this.model.parameter = JSON.stringify(dataParameter, null, 2)
        this.currentParameter = JSON.stringify(dataParameter)
      } else {
        this.model = {}
        this.currentParameter = {}
      }
    },
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id ?? 0,
        name: this.model.name ?? '',
        data_type: this.model.data_type ?? '',
        description: this.model.description ?? '',
        parameter: this.model.parameter ?? '',
        apiParameterDatasources: this.model.apiParameterDatasources ? this.model.apiParameterDatasources : []
      }

      return model
    },
    deleteDatasource(index, id) {
      if (id) {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteRecordDatasource(id)
        })
      } else {
        this.model.apiParameterDatasources.splice(index, 1)
      }
      this.$forceUpdate()
    },

    /**
     * Delete record
     */
    async updateUseFlgRecord(id, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg
        }
        await this.$api.apiParameterDatasource.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Delete record
     *
     * @param {Number} id
     */
    async deleteRecordDatasource(id) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.apiParameterDatasource.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    addNewParameterDataSource() {
      if (!this.model.apiParameterDatasources) {
        this.model = {
          name: this.model.name ? this.model.name : '',
          data_type: this.model.data_type ? this.model.data_type : '',
          description: this.model.description ? this.model.description : '',
          parameter: this.model.parameter ? this.model.parameter : '',
          apiParameterDatasources: []
        }
      }
      this.model.apiParameterDatasources.push({
        db_schema_id: undefined,
        db_table_id: undefined,
        db_table_version_code: undefined,
        db_table_column_pk: undefined,
        description: ''
      })
    },

    /**
       * Confirm to delete
       *
       * @param {Number} id
       */
    confirmToDelete(id, data) {
      if (data.functionItemWriteDatasources.length > 0) {
        this.$confirm({
          title: this.$t('text.confirm_delete_api_parameter'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgParameter(id, USE_FLG_VALUE.no)
        })
      } else {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgParameter(id, USE_FLG_VALUE.no)
        })
      }
    },

    /**
     * Delete record
     */
    async updateUseFlgParameter(id, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg
        }
        await this.$api.apiParameter.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('onClose')
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    changeSchema(index, open) {
      if (!open) {
        this.model.apiParameterDatasources[index].db_table_id = undefined
        this.model.apiParameterDatasources[index].db_table_version_code = undefined
        this.model.apiParameterDatasources[index].db_table_column_pk = undefined
      }
      this.filterTable[index] = this.dbTables.filter(item => item.db_schema_id === this.model.apiParameterDatasources[index].db_schema_id && item.use_flg === USE_FLG_VALUE.yes)
      this.$forceUpdate()
    },

    changeTable(index, open) {
      this.filterTableVersion[index] = this.dbTableVersions.filter(item => item.db_table_id === this.model.apiParameterDatasources[index].db_table_id)
      if (!open) {
        this.model.apiParameterDatasources[index].db_table_column_pk = undefined
        if (this.filterTableVersion[index].length > 0) {
          this.model.apiParameterDatasources[index].db_table_version_code = this.filterTableVersion[index][0].version_code
          this.changeTableVersion(index)
        }
      }
      this.$forceUpdate()
    },

    changeTableVersion(index, open) {
      if (!open) {
        this.model.apiParameterDatasources[index].db_table_column_pk = undefined
      }
      this.filterColumn[index] = this.dbColumns.filter(item => item.db_table_id === this.model.apiParameterDatasources[index].db_table_id && item.version_code === this.model.apiParameterDatasources[index].db_table_version_code && item.use_flg === USE_FLG_VALUE.yes)
      this.$forceUpdate()
    },

    changeColumn(index) {
      this.$forceUpdate()
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.api_id = this.version.api_id
            data.version_code = this.version.version_code
            if (Object.keys(this.currentParameter).length > 0) {
              this.isCreate = false
              this.$refs.previewParameter.open(data, this.currentParameter, this.isCreate)
            } else {
              this.isCreate = true
              this.$refs.previewParameter.open(data, null, this.isCreate)
            }
          } catch (_) {
            if (_.message === this.$t('module.apiParameter.message_error_null')) {
              this.$notification.error({
                message: _.message
              })
            } else {
              this.$notification.error({
                message: this.$t('text.something_wrong')
              })
            }
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    /**
     * Validate before submit
     */
    updateParameter() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.api_id = this.version.api_id
            data.version_code = this.version.version_code
            if (this.model.id) {
              data.api_parameter_pk = this.model.api_parameter_pk
              await this.$api.apiParameter.update(this.model.id, data)
            } else {
              if (this.dataNode) {
                data.parent_api_parameter_pk = this.dataNode.api_parameter_pk
              }
              await this.$api.apiParameter.create(data)
              this.model = {}
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

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
    },
    /**
     * Confirm to delete
     *
     * @param {Number} id
     */
    confirmToDeleteAll(data) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.updateUseFlgAllRecord(USE_FLG_VALUE.no)
      })
    },

    /**
     * Delete record
     */
    async updateUseFlgAllRecord(flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg,
          api_id: this.version.api_id,
          project_id: this.$store.state.project.id,
          version_code: this.version.version_code
        }
        await this.$api.apiParameter.updateMulti(data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('onClose')
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },
    close() {
      this.model = {}
      this.currentParameter = {}
      this.isCreate = false
      this.$emit('onClose')
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-form-item:not(.default) {
    position: relative;
    .ant-form-explain {
      position: absolute;
    }
    .ant-form-item-children {
      position: relative;
    }
  }
}
.heading-text {
  font-weight: 700;
}
</style>
