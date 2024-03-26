<template>
  <a-modal
    :visible="openModal"
    :width="720"
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
            :label-col="{ sm: 8 }"
            :wrapper-col="{ sm: 16 }"
            class="mt-3"
            @submit.prevent="handleSubmit"
          >
            <a-row>
              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.bug.status')"
                  prop="status"
                >
                  <a-select
                    id="bug_status"
                    v-model="model.status"
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.status')"
                  >
                    <a-select-option
                      v-for="(item, index) in BUG_STATUS"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                class="text-center pt-3"
              >
                <a-button
                  html-type="button"
                  type="default"
                  :disabled="loadModal"
                  title="Huỷ bỏ"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </a-button>
                <a-button
                  html-type="submit"
                  title="Save"
                  :disabled="loadModal"
                  type="primary"
                >
                  {{ $t('common.ok') }}
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
import { cloneDeep } from 'lodash'
import { BUG_STATUS } from '~/constants'

export default {
  components: {},

  data() {
    return {
      openModal: false,
      loadModal: false,
      BUG_STATUS,
      visible: false,
      model: {}
    }
  },
  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
        status: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bug.status') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.model = cloneDeep(data)
      this.model.users = this.model.users.map(user => user.id)
      this.openModal = true
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    close() {
      this.openModal = false
    },

    async handleSubmit() {
      this.loadModal = true
      try {
        if (this.model.id) {
          await this.$api.bug.updateBug(this.model.id, this.model)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.openModal = false
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadModal = false
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  :deep() {
      .ant-form-item-label {
          padding-right: 20px;
      }
      .ant-input-number {
          width: 100% !important;
      }
  }
  </style>
