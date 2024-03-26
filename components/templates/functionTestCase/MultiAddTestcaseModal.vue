<template>
  <a-modal :visible="openModal" :width="900" :dialog-style="{ top: '200px' }" :footer="null" @cancel="close">
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
                  title="Tạo mới"
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
      openModal: false,
      loadModal: false,
      model: {
        mst_category_testcase_common_id: undefined
      },
      listCategoryTestCaseCommon: []
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
        ]
      }
    }
  },

  mounted() {
    this.getListCategoryTestCaseCommon()
  },

  methods: {
    open() {
      this.openModal = true
    },

    close() {
      this.openModal = false
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getListCategoryTestCaseCommon() {
      this.loadModal = true
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
      } finally {
        this.loadModal = false
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
            await this.$api.functionTestCase.copyAll(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.$emit('saveCommonTestcase')
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
