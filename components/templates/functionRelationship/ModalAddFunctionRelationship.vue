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
                  :label="$t('module.relationship.function_id')"
                  prop="function_id"
                >
                  <a-select
                    v-model="model.function_id"
                    show-search
                    allow-clear
                    show-arrow
                    mode="multiple"
                    :placeholder="$t('module.relationship.function_id')"
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      v-for="(item, index) in functions"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.code }} - {{ item.name }}
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
                  {{ $t('common.save') }}
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
import { USE_FLG_VALUE } from '~/constants'
export default {
  data() {
    return {
      open: false,
      loadModal: false,
      functionRelationshipData: [],
      functions: [],
      model: {
        function_id: [],
        functionRelationship: []
      },
      USE_FLG_VALUE
    }
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    }
  },

  computed: {
    formRules() {
      return {
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.relationship.function_id') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  mounted() {
    this.getListFunction()
  },

  methods: {
    openModal(data) {
      this.model = {
        function_id: [],
        functionRelationship: []
      }
      this.functionRelationships = data
      this.functionRelationships.forEach(item => {
        if (item) {
          this.model.function_id.push(item.function_id)
          this.model.functionRelationship.push(item)
        }
      })
      this.open = true
    },

    close() {
      this.open = false
      this.model.function_id = undefined
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getListFunction() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.not_id = this.version.function_id
        params.use_flg = USE_FLG_VALUE.yes

        const { data: { result: { data } } } = await this.$api.function.getListFunction({ params })
        this.functions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            data.project_id = this.$store.state.project.id
            data.function_id_source = this.version.function_id
            await this.$api.functionRelationship.create(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.$emit('save')
            this.close()
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
