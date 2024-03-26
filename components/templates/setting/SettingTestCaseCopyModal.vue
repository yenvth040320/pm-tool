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
                :span="24"
                :md="18"
              >
                <a-form-model-item
                  :label="$t('module.project')"
                  prop="project_id"
                >
                  <a-select
                    v-model="model.project_id"
                    :placeholder="$t('module.project')"
                  >
                    <a-select-option
                      v-for="(item, index) in projects"
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
import { ERROR_CODE } from '~/constants'

export default {
  data() {
    return {
      open: false,
      loadModal: false,
      model: {},
      projects: [],
      prj_copy_from_id: 0,
      prj_copy_to_id: 0,
      ERROR_CODE
    }
  },
  props: {
  },

  computed: {
    formRules() {
      return {
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.project') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  mounted() {
    this.getProjects()
  },

  methods: {
    openModal() {
      this.open = true
    },

    close() {
      this.open = false
      this.model.project_id = undefined
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    async getProjects() {
      try {
        const params = {
          not_limit: true,
          not_project: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.project.list({ params })
        this.projects = data
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
            const data = {
              prj_copy_to_id: this.$store.state.project.id,
              prj_copy_from_id: this.model.project_id
            }
            await this.$api.testCaseInput.copyTestCase(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.open = false
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
    .ant-col {
      margin-bottom: 10px;
    }
  }
  </style>
