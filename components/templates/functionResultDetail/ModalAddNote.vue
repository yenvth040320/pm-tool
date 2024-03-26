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
                  :label="$t('module.functionResultDetail.note')"
                  prop="note"
                >
                  <a-textarea
                    v-model="model.note"
                    :rows="10"
                    :placeholder="$t('module.functionResultDetail.note')"
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
                  title="Cập nhật"
                >
                  {{ $t('common.update') }}
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
      model: {}
    }
  },

  computed: {
    formRules() {
      return {
        note: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionResultDetail.note') }),
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
      this.model = data
      this.open = true
    },

    close() {
      this.open = false
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.model
            await this.$api.functionResultDetail.update(data.id, data)
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
