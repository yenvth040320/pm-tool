<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 7 }"
    :wrapper-col="{ sm: 16 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.item_pk')"
              prop="item_pk"
            >
              <a-select
                v-model="model.item_pk"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.functionTestCase.item_pk')"
              >
                <a-select-option
                  v-for="item in functionItem"
                  :key="item.item_pk"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="model.mst_item_property_id"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.mstItemProperty')"
              >
                <a-select-option
                  v-for="item in mstItemProperty"
                  :key="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check')"
              prop="content_check"
            >
              <a-textarea
                v-model="model.content_check"
                :placeholder="$t('module.functionTestCase.content_check')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check_jp')"
              prop="content_check_jp"
            >
              <a-textarea
                v-model="model.content_check_jp"
                :placeholder="$t('module.functionTestCase.content_check_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result')"
              prop="expect_result"
            >
              <a-textarea
                v-model="model.expect_result"
                :placeholder="$t('module.functionTestCase.expect_result')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result_jp')"
              prop="expect_result_jp"
            >
              <a-textarea
                v-model="model.expect_result_jp"
                :placeholder="$t('module.functionTestCase.expect_result_jp')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          :title="id ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

          &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          title="Huỷ bỏ"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'

export default {
  mixins: [DataForm],

  /**
     * Fetch event.
     */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
         * Call api and processing data.
         * Note: check API response format ResponseServiceProvider.php.
         */
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    mstItemProperty: {
      type: [Array],
      default: () => []
    },
    functionItem: {
      type: [Array],
      default: () => []
    }
  },

  /**
     * Init data for component.
     */
  data: () => ({
    resource: 'functionTestCase'
  }),

  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
        content_check: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.content_check') }),
            trigger: ['change', 'blur']
          }
        ],
        expect_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.expect_result') }),
            trigger: ['change', 'blur']
          }
        ],

        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.item_pk') }),
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
        id: this.model.id,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code,
        item_pk: this.model.item_pk,
        mst_item_property_id: this.model.mst_item_property_id,
        content_check: this.model.content_check,
        content_check_jp: this.model.content_check_jp,
        expect_result: this.model.expect_result,
        expect_result_jp: this.model.expect_result_jp
      }

      return model
    },
    cancel() {
      this.$emit('close')
      this.model = {}
    },
    /**
       * Filter in select box
       */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },
    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.model = {}
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
      margin-bottom: 5px;
    }
  }
  </style>
