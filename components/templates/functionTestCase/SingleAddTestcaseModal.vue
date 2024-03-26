<template>
  <a-modal :visible="open" :width="900" :dialog-style="{ top: '200px' }" :footer="null" @cancel="close">
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
                  :label="$t('module.functionTestCase.mst_category_testcase_common_id')"
                  prop="mst_category_testcase_common_id"
                >
                  <a-select
                    v-model="model.mst_category_testcase_common_id"
                    show-search
                    allow-clear
                    :placeholder="$t('module.functionTestCase.mst_category_testcase_common_id')"
                    :filter-option="filterOption"
                    @change="getListTestcaseCommon(model.mst_category_testcase_common_id)"
                  >
                    <a-select-option
                      v-for="(item, index) in listCategoryTestCaseCommon"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="20"
              >
                <a-form-model-item
                  :label="$t('module.functionTestCase.mst_testcase_common_id')"
                  prop="mst_testcase_common_id"
                >
                  <a-select
                    v-model="model.mst_testcase_common_id"
                    show-search
                    allow-clear
                    show-arrow
                    mode="multiple"
                    :placeholder="$t('module.functionTestCase.mst_testcase_common_id')"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      v-for="(item, index) in listTestCaseCommon"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.format_content_check }}
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
                  title="Tạo mới"
                  type="primary"
                >
                  {{ $t('common.create') }}
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
export default {
  data() {
    return {
      open: false,
      loadModal: false,
      model: {
        mst_category_testcase_common_id: undefined,
        mst_testcase_common_id: undefined
      },
      listCategoryTestCaseCommon: [],
      listTestCaseCommon: []
    }
  },
  props: {
    versionCode: {
      type: [Number, String],
      default: null
    },
    functionId: {
      type: [Number, String],
      default: null
    },
    functionTestCase: {
      type: [Array],
      default: () => []
    }
  },

  computed: {
    formRules() {
      return {
        mst_category_testcase_common_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.mst_category_testcase_common_id') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_testcase_common_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.mst_testcase_common_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  mounted() {
    this.getListCategoryTestCaseCommon()
  },

  methods: {
    openModal() {
      this.open = true
    },

    close() {
      this.open = false
      this.model.mst_testcase_common_id = undefined
      this.model.mst_category_testcase_common_id = undefined
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getListCategoryTestCaseCommon() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstCategoryTestCaseCommon.list({ params })
        this.listCategoryTestCaseCommon = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListTestcaseCommon(categoryId) {
      try {
        this.listTestCaseCommon = []
        this.model.mst_testcase_common_id = undefined
        const params = {
          project_id: this.$store.state.project.id,
          mst_category_testcase_common_id: categoryId,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstTestCaseCommon.list({ params })
        for (let i = 0; i < data.length; i++) {
          const id = data[i].id
          const found = this.functionTestCase.find(item => item.mst_testcase_common_id === id)
          if (!found) {
            this.listTestCaseCommon.push(data[i])
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.version_code = this.versionCode
            data.function_id = this.functionId
            await this.$api.functionTestCase.copySingle(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.$emit('saveTestcase')
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
  .ant-col {
    margin-bottom: 5px;
  }
}
</style>
