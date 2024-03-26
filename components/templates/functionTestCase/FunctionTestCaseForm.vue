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
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check')"
              prop="content_check"
            >
              <a-input
                v-model="model.content_check"
                :placeholder="$t('module.functionTestCase.content_check')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check_jp')"
              prop="content_check_jp"
            >
              <a-input
                v-model="model.content_check_jp"
                :placeholder="$t('module.functionTestCase.content_check_jp')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="model.use_flg"
                :placeholder="$t('module.functionTestCase.use_flg')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.event_pk')"
              prop="event_pk"
            >
              <a-input
                v-model="model.event_pk"
                :placeholder="$t('module.functionTestCase.event_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result')"
              prop="expect_result"
            >
              <a-input
                v-model="model.expect_result"
                :placeholder="$t('module.functionTestCase.expect_result')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result_jp')"
              prop="expect_result_jp"
            >
              <a-input
                v-model="model.expect_result_jp"
                :placeholder="$t('module.functionTestCase.expect_result_jp')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.function_id')"
              prop="function_id"
            >
              <a-select
                v-model="model.function_id"
                :placeholder="$t('module.function')"
              >
                <a-select-option
                  v-for="(item, index) in functions"
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
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="model.item_pk"
                :placeholder="$t('module.functionTestCase.item_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.logic_pk')"
              prop="logic_pk"
            >
              <a-input
                v-model="model.logic_pk"
                :placeholder="$t('module.functionTestCase.logic_pk')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="model.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemPropertys"
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
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.mst_validation_id')"
              prop="mst_validation_id"
            >
              <a-select
                v-model="model.mst_validation_id"
                :placeholder="$t('module.mstValidation')"
              >
                <a-select-option
                  v-for="(item, index) in mstValidations"
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
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.functionTestCase.order')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.project_id')"
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
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.functionTestCase.version_code')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
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
          title="Huỷ bỏ"
          class="min-w-100"
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

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'functionTestCase',
    functions: [],
    mstItemPropertys: [],
    mstValidations: [],
    projects: []
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
        content_check_jp: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.content_check_jp') }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        event_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.event_pk') }),
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
        expect_result_jp: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.expect_result_jp') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.item_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        order: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.order') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.version_code') }),
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
    this.getFunctions()
    this.getMstItemPropertys()
    this.getMstValidations()
    this.getProjects()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Function
     */
    async getFunctions() {
      const { data: { result: { data } } } = await this.$api.function.list()
      this.functions = data
    },

    /**
     * List MstItemProperty
     */
    async getMstItemPropertys() {
      const { data: { result: { data } } } = await this.$api.mstItemProperty.list()
      this.mstItemPropertys = data
    },

    /**
     * List MstValidation
     */
    async getMstValidations() {
      const { data: { result: { data } } } = await this.$api.mstValidation.list()
      this.mstValidations = data
    },

    /**
     * List Project
     */
    async getProjects() {
      const params = {
        not_limit: true
      }
      const { data: { result: { data } } } = await this.$api.project.list({ params })
      this.projects = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        content_check: this.model.content_check,
        content_check_jp: this.model.content_check_jp,
        created_at: this.model.created_at,
        use_flg: this.model.use_flg,
        event_pk: this.model.event_pk,
        expect_result: this.model.expect_result,
        expect_result_jp: this.model.expect_result_jp,
        function_id: this.model.function_id,
        id: this.model.id,
        item_pk: this.model.item_pk,
        logic_pk: this.model.logic_pk,
        mst_item_property_id: this.model.mst_item_property_id,
        mst_validation_id: this.model.mst_validation_id,
        order: this.model.order,
        project_id: this.model.project_id,
        updated_at: this.model.updated_at,
        version_code: this.model.version_code
      }

      return model
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
}
</style>
