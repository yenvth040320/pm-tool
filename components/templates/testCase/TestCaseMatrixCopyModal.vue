<template>
  <a-modal
    :visible="open"
    :width="900"
    :dialog-style="{ top: '200px' }"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="model"
            :rules="formRules"
            :label-col="{ sm: 6 }"
            :wrapper-col="{ sm: 18 }"
            @submit.prevent="handleSubmit"
          >
            <a-row
              type="flex"
              :gutter="30"
            >
              <a-col
                :span="20"
              >
                <a-form-model-item
                  :label="$t('module.functionItem.function_copy')"
                  prop="function_copy_id"
                >
                  <a-select
                    v-model="model.function_copy_id"
                    :placeholder="$t('module.functionItem.function_copy_placeholder')"
                    :filter-option="filterOption"
                    show-search
                    allow-clear
                    @change="showVersion"
                  >
                    <a-select-option
                      v-for="(item, index) in functions"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.code + ': ' + item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="20"
              >
                <a-form-model-item
                  :label="$t('module.functionItem.version_copy')"
                  prop="version_copy_code"
                >
                  <a-select
                    v-model="model.version_copy_code"
                    :placeholder="$t('module.functionItem.version_copy_placeholder')"
                    :filter-option="filterOption"
                    allow-clear
                    show-search
                  >
                    <a-select-option
                      v-for="(item, index) in filterVersions"
                      :key="index"
                      :value="item.version_code"
                    >
                      {{ item.version_code + ': ' + item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="20"
                class="text-center"
              >
                <a-button
                  html-type="button"
                  type="default"
                  title="Huỷ bỏ"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </a-button>
                <a-button
                  html-type="submit"
                  type="primary"
                  title="Sao chép"
                >
                  {{ $t('common.copy') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>
<script>
import { REGEX_NUMBER_ONLY, USE_FLG_VALUE } from '~/constants'

export default {
  data() {
    return {
      open: false,
      loadModal: false,
      REGEX_NUMBER_ONLY,
      USE_FLG_VALUE,
      model: {},
      functions: [],
      versions: [],
      filterVersions: []
    }
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  computed: {
    formRules() {
      return {
        function_copy_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.function_copy') }),
            trigger: ['change', 'blur']
          }
        ],
        version_copy_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.version_copy') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  mounted() {
    this.getFunctions()
    this.getVersions()
  },

  methods: {
    openModal() {
      this.open = true
    },

    close() {
      this.open = false
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getFunctions() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id,
          id_not_equal: this.version.function_id
        }
        const { data: { result: { data } } } = await this.$api.function.list({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getVersions() {
      try {
        const params = {
          not_limit: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.versionFunction.list({ params })
        this.versions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    showVersion() {
      this.filterVersions = this.versions.filter(item => item.function_id === this.model.function_copy_id)
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.version_code = this.version.version_code
            data.function_id = this.version.function_id
            await this.$api.testcaseMatrix.copyTestCase(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.open = false
            this.model = {}
            this.$emit('saveMatrixResult')
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
