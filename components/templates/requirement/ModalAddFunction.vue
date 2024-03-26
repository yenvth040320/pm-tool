<template>
  <a-modal :visible="open" :width="900" :dialog-style="{ top: '200px' }" :footer="null" @cancel="close">
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="this"
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
                >
                  <a-select
                    v-model="requirementFunctions"
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
                  {{ $t('module.requirement.button_add_modal') }}
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
      functions: [],
      idRequirement: 0,
      USE_FLG_VALUE,
      requirementFunctions: []
    }
  },
  props: {
  },

  computed: {
    formRules() {
      return {
      }
    }
  },

  mounted() {
    this.getListFunction()
  },

  methods: {
    openModal(idRequirement, data) {
      this.idRequirement = idRequirement
      if (data && data.length > 0) {
        data.forEach(item => {
          this.requirementFunctions.push(item.function_id)
        })
      }
      this.open = true
    },

    close() {
      this.open = false
      this.requirementFunctions = []
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
      try {
        const data = this.requirementFunctions
        this.$emit('save', data)

        this.close()
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
      .ant-col {
        margin-bottom: 5px;
      }
    }
    </style>
