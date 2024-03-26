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
              :label="$t('module.functionItemProperty.function_id')"
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
              :label="$t('module.functionItemProperty.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="model.item_pk"
                :placeholder="$t('module.functionItemProperty.item_pk')"
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
              :label="$t('module.functionItemProperty.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="model.mst_item_property_id"
                :placeholder="$t('module.mstItemPropertie')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemProperties"
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
              :label="$t('module.functionItemProperty.project_id')"
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
              :label="$t('module.functionItemProperty.value')"
              prop="value"
            >
              <a-input
                v-model="model.value"
                :placeholder="$t('module.functionItemProperty.value')"
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
              :label="$t('module.functionItemProperty.value_jp')"
              prop="value_jp"
            >
              <a-input
                v-model="model.value_jp"
                :placeholder="$t('module.functionItemProperty.value_jp')"
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
              :label="$t('module.functionItemProperty.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.functionItemProperty.version_code')"
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

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'functionItemProperty',
    functions: [],
    mstItemProperties: [],
    projects: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemProperty.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemProperty.item_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemProperty.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        value: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemProperty.value') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.functionItemProperty.value'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        value_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.functionItemProperty.value_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItemProperty.version_code') }),
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
    this.getMstItemProperties()
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
     * List MstItemPropertie
     */
    async getMstItemProperties() {
      const { data: { result: { data } } } = await this.$api.mstItemPropertie.list()
      this.mstItemProperties = data
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
        created_at: this.model.created_at,
        function_id: this.model.function_id,
        id: this.model.id,
        item_pk: this.model.item_pk,
        mst_item_property_id: this.model.mst_item_property_id,
        project_id: this.model.project_id,
        updated_at: this.model.updated_at,
        value: this.model.value,
        value_jp: this.model.value_jp,
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
