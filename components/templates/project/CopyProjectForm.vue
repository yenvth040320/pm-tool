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
      <div class="container">
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
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          title="Sao chép"
          class="min-w-100"
        >
          {{ $t('common.copy') }}
        </a-button>

          &nbsp;
        <a-button
          html-type="button"
          type="default"
          title="Huỷ bỏ"
          class="min-w-100"
          @click="handleCancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { ERROR_CODE } from '~/constants'

export default {
  mixins: [DataForm],

  props: {
    projects: {
      type: [Array],
      default: () => [
      ]
    }
  },

  /**
     * Init data for component.
     */
  data: () => ({
    resource: 'project',
    prj_copy_from_id: 0,
    prj_copy_to_id: 0,
    ERROR_CODE
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
            message: this.$t('validation.required', { field: this.$t('module.project') }),
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
       * Get model
       *
       * @returns {Object}
       */
    getModel() {
      const model = {
        project_id: this.model.project_id
      }

      return model
    },
    /**
     * Handle cancel
     */
    handleCancel() {
      this.model.project_id = undefined
      this.$emit('cancel')
    },
    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = {
              prj_copy_to_id: this.model.id,
              prj_copy_from_id: this.model.project_id
            }
            if (this.model.id) {
              await this.repository.copyData(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })

            this.$emit('save')
          } catch (e) {
            const error = e.response.data
            if (error.code === ERROR_CODE.PRJ_HAS_FUNCTION_ITEM) {
              this.$notification.error({
                message: this.$t('module.project.has_function_item.error')
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
  .container {
    padding: 50px 20px;
  }
  </style>
