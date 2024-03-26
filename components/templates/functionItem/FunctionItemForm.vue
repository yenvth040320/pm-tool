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
              :label="$t('module.functionItem.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="model.use_flg"
                :placeholder="$t('module.functionItem.use_flg')"
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
              :label="$t('module.functionItem.function_id')"
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
              :label="$t('module.functionItem.item_num')"
              prop="item_num"
            >
              <a-input
                v-model="model.item_num"
                :placeholder="$t('module.functionItem.item_num')"
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
              :label="$t('module.functionItem.item_pk')"
              prop="item_pk"
            >
              <a-input
                v-model="model.item_pk"
                :placeholder="$t('module.functionItem.item_pk')"
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
              :label="$t('module.functionItem.mst_item_type_id')"
              prop="mst_item_type_id"
            >
              <a-select
                v-model="model.mst_item_type_id"
                :placeholder="$t('module.mstItemType')"
              >
                <a-select-option
                  v-for="(item, index) in mstItemTypes"
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
              :label="$t('module.functionItem.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.functionItem.order')"
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
              :label="$t('module.functionItem.parent_item_pk')"
              prop="parent_item_pk"
            >
              <a-input
                v-model="model.parent_item_pk"
                :placeholder="$t('module.functionItem.parent_item_pk')"
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
              :label="$t('module.functionItem.project_id')"
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
              :label="$t('module.functionItem.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.functionItem.version_code')"
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
    resource: 'functionItem',
    functions: [],
    mstItemTypes: [],
    projects: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.use_flg') }),
            trigger: ['change', 'blur']
          }
        ],
        function_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.function_id') }),
            trigger: ['change', 'blur']
          }
        ],
        item_num: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.item_num') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.functionItem.item_num'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.item_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_item_type_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.mst_item_type_id') }),
            trigger: ['change', 'blur']
          }
        ],
        project_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem.version_code') }),
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
    this.getMstItemTypes()
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
     * List MstItemType
     */
    async getMstItemTypes() {
      const { data: { result: { data } } } = await this.$api.mstItemType.list()
      this.mstItemTypes = data
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
        use_flg: this.model.use_flg,
        function_id: this.model.function_id,
        id: this.model.id,
        item_num: this.model.item_num,
        item_pk: this.model.item_pk,
        mst_item_type_id: this.model.mst_item_type_id,
        order: this.model.order,
        parent_item_pk: this.model.parent_item_pk,
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
