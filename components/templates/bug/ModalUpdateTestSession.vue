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
                  :label="$t('module.bug.test_session_id')"
                  prop="function_result_id"
                >
                  <a-select
                    id="bug_test_session_id"
                    v-model="model.test_session_id"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.bug.test_session_id')"
                  >
                    <a-select-option
                      v-for="(item, index) in testSessions"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.name }}
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
import { BUG_DONE_PERCENT } from '~/constants'

export default {
  components: {},

  props: {
    testSessions: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      openModal: false,
      loadModal: false,
      BUG_DONE_PERCENT,
      visible: false,
      model: {},
      dataOriginal: {}
    }
  },
  /**
       * Computed event.
       */
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.dataOriginal = data
      this.model = cloneDeep(data)
      this.model.users = this.model.users.map(user => user.id)
      if (this.model.functionResult) {
        this.$set(this.model, 'test_session_id', this.model.functionResult.test_session_id)
      }
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
          if (this.model.test_session_id) {
            const testSession = this.testSessions.find(item => item.id === this.model.test_session_id)
            if (testSession) {
              const functionResult = testSession.functionResults.find(item => item.function_id === this.model.function_id && item.version_code === this.model.version_code)
              if (functionResult) {
                this.model.function_result_id = functionResult.id
              }
            }
          } else {
            this.model.function_result_id = null
          }

          if (this.model.function_result_id !== this.dataOriginal.function_result_id) {
            this.model.testcase_number_id = null
            this.model.testcase_matrix_output_id = null
            this.model.testcase_matrix_id = null
          }

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
