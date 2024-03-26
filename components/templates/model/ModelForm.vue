<template>
  <a-form-model
    ref="form"
    :model="model"
    :label-col="{ sm: 24 }"
    :wrapper-col="{ sm: 24 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row type="flex" :gutter="30">
          <a-col :span="24" :md="8">
            <a-form-model-item
              :label="$t('module.design_frontend.component.tree')"
              prop="source_code_id"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.design_frontend.component.tree')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="model.source_code_id"
                mode="single"
                :placeholder="$t('module.design_frontend.component.tree')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
                @change="handleChangeSourceCode"
              >
                <a-select-option
                  v-for="(item, index) in sourceCodes"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="8">
            <a-form-model-item
              :label="$t('module.design_frontend.component.branch')"
              prop="branch_id"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.design_frontend.component.branch')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="model.branch_id"
                mode="single"
                :placeholder="$t('module.design_frontend.component.branch')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
                @change="handleChangeBranch"
              >
                <a-select-option
                  v-for="(item, index) in branches"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="8">
            <a-form-model-item
              :label="$t('module.design_frontend.component.branch_path')"
              prop="model_path"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.design_frontend.component.branch_path')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="model.model_path"
                mode="single"
                :placeholder="
                  $t('module.design_frontend.component.branch_path')
                "
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="(item, index) in paths"
                  :key="index"
                  :value="item.path_name"
                >
                  {{ item.path_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="8">
            <a-form-model-item
              :label="$t('module.modelFrontend')"
              prop="model_id"
            >
              <a-select
                v-model="model.model_id"
                mode="single"
                :placeholder="$t('module.modelFrontend')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
                @change="onChangeModel"
              >
                <a-select-option
                  v-for="(item, index) in models"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.model_name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="8">
            <a-form-model-item
              :label="$t('module.modelFrontend.name')"
              prop="model_name"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.modelFrontend.name')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-input
                v-model="model.model_name"
                :disabled="model.model_id"
                :placeholder="$t('module.modelFrontend.name')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <data-component
        :model="model"
        @addRow="addRow"
        @removeRow="removeRow"
      />
      <div class="text-center p-3">
        <a-button html-type="submit" type="primary" class="min-w-100">
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
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
import { SORT, TYPE_SOURCE_CODE } from '~/constants'
import DataComponent from '~/components/templates/model/subComponent/Properties.vue'
export default {

  components: {
    DataComponent
  },

  mixins: [DataForm],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const {
        data: {
          result: { data }
        }
      } = await this.$api.model.list({ params: { all: true } })
      this.models = data
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  data() {
    return {
      resource: 'model',
      sourceCodes: [],
      branches: [],
      paths: [],
      models: [],
      model: {
        properties: []
      },
      propertiesBef: [],
      project_id: this.$store.state.project.id,
      TYPE_SOURCE_CODE
    }
  },
  computed: {
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', {
              field: this.$t('user.name')
            }),
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            required: true,
            message: this.$t('validation.required', {
              field: this.$t('user.email')
            }),
            trigger: ['change', 'blur']
          },
          {
            type: 'email',
            message: this.$t('validation.invalid_email'),
            trigger: ['change', 'blur']
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('validation.required', {
              field: this.$t('user.code')
            }),
            trigger: ['change', 'blur']
          }
        ],
        username: [
          {
            required: true,
            message: this.$t('validation.required', {
              field: this.$t('user.username')
            }),
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: !this.id || this.model.password_confirm,
            message: this.$t('validation.required', {
              field: this.$t('user.password')
            }),
            trigger: ['change', 'blur']
          },
          {
            min: 8,
            message: this.$t('validation.min', {
              field: this.$t('user.password'),
              min: 8
            }),
            trigger: ['change', 'blur']
          }
        ],
        password_confirm: [
          {
            required: !this.id || this.model.password,
            message: this.$t('validation.required', {
              field: this.$t('user.password_confirm')
            }),
            trigger: ['change', 'blur']
          },
          {
            min: 8,
            message: this.$t('validation.min', {
              field: this.$t('user.password_confirm'),
              min: 8
            }),
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              if (
                !value ||
                !this.model.password ||
                value === this.model.password
              ) {
                return callback()
              }

              return callback(
                new Error(
                  this.$t('validation.not_match', {
                    field1: this.$t('user.password'),
                    field2: this.$t('user.password_confirm')
                  })
                )
              )
            },
            message: this.$t('validation.not_match', {
              field1: this.$t('user.password'),
              field2: this.$t('user.password_confirm')
            }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    'model.source_code_id'() {
      this.getBranches()
    },
    'model.branch_id'() {
      this.getPaths()
      // this.getComponents()
    }
  },
  mounted() {
    this.getSourceCodes()
  },
  methods: {
    async getSourceCodes() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          type_id: this.TYPE_SOURCE_CODE[0].value,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.sourceCode.list({ params })
        this.sourceCodes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getBranches() {
      this.$store.dispatch('setLoading', true)
      try {
        if (this.model.source_code_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            source_code_id: this.model.source_code_id,
            all: true
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.branch.list({ params })
          this.branches = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async getPaths() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.model.source_code_id && this.model.branch_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            source_code_id: this.model.source_code_id,
            branch_id: this.model.branch_id,
            all: true
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.tree.list({ params })
          this.paths = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async onChangeModel(id) {
      this.$store.dispatch('setLoading', true)

      try {
        // Set data model property before clone model property.
        if (this.model.properties && this.propertiesBef.length > 0) {
          this.propertiesBef.forEach(element => {
            const indexOf = this.model.properties.indexOf(element)
            this.model.properties.splice(indexOf, 1)
          })
        }
        // No load data model property if model select equals model update.
        if (this.model.id === id) {
          this.propertiesBef = []
          return
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.model.show(id)
        this.model.model_name = data.model_name
        // Format data model property.
        const mappedArray = data.properties.map(item => {
          return {
            property_name: item.property_name,
            data_type_id: item.data_type_id,
            data_type: item.data_type,
            create_user_id: item.create_user_id,
            model_id: item.model_id
          }
        })
        this.propertiesBef = mappedArray

        // Set data clone model property
        if (!this.model.properties) {
          this.$set(this.model, 'properties', mappedArray)
        } else {
          const properties = mappedArray.concat(this.model.properties)
          this.$set(this.model, 'properties', properties)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    handleChangeBranch() {
      this.$set(this.model, 'model_path', undefined)
    },

    handleChangeSourceCode() {
      this.paths = []
      this.$set(this.model, 'branch_id', undefined)
      this.$set(this.model, 'model_path', undefined)
    },
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        source_code_id: this.model.source_code_id,
        branch_id: this.model.branch_id,
        model_path: this.model.model_path,
        project_id: this.project_id,
        model_name: this.model.model_name,
        properties: this.model.properties ?? []
      }
      const userId = this.$auth.user.id
      if (this.model.id) {
        model.update_user_id = userId
      } else {
        model.create_user_id = userId
      }
      return model
    },

    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
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

            this.$emit('save')
          } catch (_) {
            if (_.response.data.errors && _.response.data.errors.email) {
              this.$notification.error({
                message: this.$t('validation.email_unique')
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

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
    },

    addRow(ref) {
      let newData = null

      if (!this.model.properties) {
        this.$set(this.model, 'properties', [])
      }

      if (ref === 'properties') {
        newData = {
          property_name: '',
          data_type_id: '',
          data_type: ''
        }
      }

      this.model[ref].push(newData)
    },

    removeRow(ref, index) {
      this.model[ref].splice(index, 1)
    }
  }
}
</script>
