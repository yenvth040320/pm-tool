<template>
  <div>
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
              :md="18"
              :xxl="12"
            >
              <a-form-model-item
                :label="$t('module.sequenceDiagram.source_code')"
                prop="source_code_id"
              >
                <a-select
                  v-model="model.source_code_id"
                  :placeholder="$t('module.sequenceDiagram.source_code')"
                  @change="handleSourceCodeChange()"
                >
                  <a-select-option
                    v-for="(item, i) in listSourceCodes"
                    :key="i"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col
              :span="24"
              :md="18"
              :xxl="12"
            >
              <a-form-model-item
                :label="$t('module.sequenceDiagram.branch')"
                prop="branch_id"
              >
                <a-select
                  v-model="model.branch_id"
                  :placeholder="$t('module.sequenceDiagram.branch')"
                  show-search
                  :filter-option="filterOption"
                  @change="handleBranchChange()"
                >
                  <a-select-option
                    v-for="(item, i) in listBranches"
                    :key="i"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col
              :span="24"
              :md="18"
              :xxl="12"
            >
              <a-form-model-item
                :label="$t('module.sequenceDiagram.tree')"
                class="choose-file-label"
              >
                <a-button
                  html-type="button"
                  type="default"
                  class="min-w-100"
                  @click="chooseFile()"
                >
                  {{ $t('module.sequenceDiagram.choose_file') }}
                </a-button>
                <div v-if="message" class="ant-form-explain error-message">
                  {{ message }}
                </div>
              </a-form-model-item>
            </a-col>

            <a-col
              :span="24"
              :md="18"
              :xxl="12"
            >
              <div v-if="path">
                {{ path }}
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="text-center p-3">
          <a-button
            html-type="submit"
            type="primary"
            title="Lưu"
            class="min-w-100"
          >
            {{ $t('common.submit') }}
          </a-button>
        </div>
      </a-spin>
    </a-form-model>
    <SelectFunctionModal ref="modalChooseFile" @choose-function="functionSelect" />
    <Diagram ref="diagram" />
  </div>
</template>

<script>
import DataForm from '~/mixins/data-form'
import Diagram from '~/components/templates/MermaidDiagram/Diagram'
import SelectFunctionModal from '~/components/templates/sequenceDiagram/SelectFunctionModal'
import AnalyticsCode from '~/mixins/analytics-code'
import { PROPERTY_TYPE_VALUE } from '~/constants'

export default {
  components: {
    Diagram,
    SelectFunctionModal
  },
  mixins: [DataForm, AnalyticsCode],

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
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  /**
     * Init data for component.
     */
  data: () => ({
    listBranches: [],
    listSourceCodes: [],
    listTrees: [],
    listClasses: [],
    listClassProperties: [],
    PROPERTY_TYPE_VALUE,
    isTreeIdFilled: false,
    classPropertyId: 0,
    path: '',
    message: ''
  }),

  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
        source_code_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sequenceDiagram.source_code') }),
            trigger: ['change', 'blur']
          }
        ],
        branch_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.sequenceDiagram.branch') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  created() {
    this.getSourceCode()
    this.getListBranch()
  },

  mounted() {
    this.getApiSequenceDiagram()
  },

  /**
     * List of methods.
     */
  methods: {
    /**
       * Get source code
       */
    async getApiSequenceDiagram() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          api_id: this.version.api_id,
          version_code: this.version.version_code,
          first: true
        }
        const { data: { result: { data } } } = await this.$api.apiSequenceDiagram.showApiSequenceDiagram({ params })
        if (data !== null) {
          this.model = data
          this.path = data.tree.path_name + '/' + data.class.name + '/' + data.classProperty.name
          const dataProperty = await this.$api.classProperties.show(data.class_property_id)
          if (dataProperty) {
            const classProPerty = dataProperty.data.result.data
            const outClass = []
            outClass.push({
              name: this.version.api.code,
              action: null
            })
            const result = await this.analyticSourceCode(classProPerty, outClass)
            await this.$refs.diagram.render(result, 'diagram')
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },
    /**
       * Get source code
       */
    async getSourceCode() {
      try {
        const params = {
          all: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.sourceCode.list({ params })
        this.listSourceCodes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
       * Get source code
       */
    async getListBranch() {
      try {
        this.$store.dispatch('setLoading', true)
        const params = {
          all: true,
          project_id: this.$store.state.project.id,
          source_code_id: this.model.source_code_id
        }
        const { data: { result: { data } } } = await this.$api.branch.list({ params })
        this.listBranches = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    chooseFile() {
      if (this.model.branch_id !== undefined) {
        this.$refs.modalChooseFile.open(this.model.branch_id)
      }
      this.message = ''
    },

    functionSelect(data) {
      if (data) {
        this.model.tree_id = data.tree_id
        this.model.class_id = data.class_id
        this.model.class_property_id = parseInt(data.class_property_id)
        this.path = data.path_name + '/' + data.class_name + '/' + data.property_name
        this.$refs.modalChooseFile.close()
      }
    },

    handleBranchChange() {
      this.$forceUpdate()
    },

    handleSourceCodeChange() {
      this.filteredBranches = this.listBranches.filter(item => item.source_code_id === this.model.source_code_id)
      this.model.branch_id = undefined
      this.model.tree_id = undefined
      this.model.class_id = undefined
      this.model.class_property_id = undefined
      this.getListBranch()
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
       * Get model
       *
       * @returns {Object}
       */
    getModel() {
      const model = {
        id: this.model.id,
        source_code_id: this.model.source_code_id,
        branch_id: this.model.branch_id,
        tree_id: this.model.tree_id,
        class_id: this.model.class_id,
        class_property_id: this.model.class_property_id
      }

      return model
    },

    /**
     * Filter in select box
     */
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
        if (valid && this.path !== '') {
          this.$store.dispatch('setLoading', true)

          try {
            const dataSequence = this.model
            dataSequence.class_property_id = parseInt(this.model.class_property_id.toString().match(/\d+/)[0])
            dataSequence.project_id = this.$store.state.project.id
            dataSequence.api_id = this.version.api_id
            dataSequence.version_code = this.version.version_code
            if (this.model.id) {
              await this.$api.apiSequenceDiagram.update(this.model.id, dataSequence)
            } else {
              await this.$api.apiSequenceDiagram.create(dataSequence)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.model = {}
            this.path = ''
            this.message = ''
            this.getApiSequenceDiagram()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        } else {
          this.message = this.$t('Hãy chọn file!')
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
    textarea {
      resize: none;
    }
    .choose-file-label::before {
      position: absolute;
      color: #f5222d;
      top: 33%;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .choose-file-label {
      .ant-form-item-label {
        padding-left: 10px;
      }
    }
    .error-message {
      color: #f5222d;
    }
  }
  </style>
