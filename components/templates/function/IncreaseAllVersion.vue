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
                  :label="$t('module.versionFunction.name')"
                  prop="name"
                >
                  <a-input
                    v-model="model.name"
                    :placeholder="$t('module.versionFunction.name')"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="20"
              >
                <a-form-model-item
                  :label="$t('module.versionFunction.description')"
                  prop="description"
                >
                  <a-textarea
                    v-model="model.description"
                    :rows="10"
                    :placeholder="$t('module.versionFunction.description')"
                  />
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
                  title="Lưu"
                >
                  {{ $t('common.submit') }}
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
import { REGEX_NUMBER_ONLY, USE_FLG_VALUE, ERROR_CODE } from '~/constants'

export default {
  data() {
    return {
      open: false,
      loadModal: false,
      REGEX_NUMBER_ONLY,
      USE_FLG_VALUE,
      ERROR_CODE,
      functionIds: [],
      model: {
        name: '',
        description: ''
      }
    }
  },

  computed: {
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.name') }),
            trigger: ['change', 'blur']
          }
        ],
        description: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionFunction.description') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  mounted() {
  },

  methods: {
    openModal(data) {
      this.functionIds = data
      this.open = true
    },

    close() {
      this.model = {}
      this.open = false
      this.$emit('save')
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loadModal = true

          try {
            const data = this.model
            data.function_ids = this.functionIds
            await this.$api.function.increaseMultiVersion(data)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.open = false
            this.model = {}
            this.$emit('save')
          } catch (_) {
            if (_.response.data.code && _.response.data.code === ERROR_CODE.VERSION_UNLOCK) {
              this.$notification.error({
                message: this.$t('text.wrong_increase_version')
              })
            } else {
              this.$notification.error({
                message: this.$t('text.something_wrong')
              })
            }
          } finally {
            this.loadModal = false
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
