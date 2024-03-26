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
              :label="$t('module.apiResponse.project_id')"
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
              :label="$t('module.apiResponse.api_id')"
              prop="api_id"
            >
              <a-select
                v-model="model.api_id"
                :placeholder="$t('module.api')"
              >
                <a-select-option
                  v-for="(item, index) in apis"
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
              :label="$t('module.apiResponse.version_code')"
              prop="version_code"
            >
              <a-input
                v-model="model.version_code"
                :placeholder="$t('module.apiResponse.version_code')"
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
              :label="$t('module.apiResponse.api_response_pk')"
              prop="api_response_pk"
            >
              <a-input
                v-model="model.api_response_pk"
                :placeholder="$t('module.apiResponse.api_response_pk')"
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
              :label="$t('module.apiResponse.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('module.apiResponse.name')"
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
              :label="$t('module.apiResponse.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="model.name_jp"
                :placeholder="$t('module.apiResponse.name_jp')"
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
              :label="$t('module.apiResponse.parent_api_response_pk')"
              prop="parent_api_response_pk"
            >
              <a-input
                v-model="model.parent_api_response_pk"
                :placeholder="$t('module.apiResponse.parent_api_response_pk')"
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
              :label="$t('module.apiResponse.description')"
              prop="description"
            >
              <a-input
                v-model="model.description"
                :placeholder="$t('module.apiResponse.description')"
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
              :label="$t('module.apiResponse.description_jp')"
              prop="description_jp"
            >
              <a-input
                v-model="model.description_jp"
                :placeholder="$t('module.apiResponse.description_jp')"
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
              :label="$t('module.apiResponse.data_type')"
              prop="data_type"
            >
              <a-input
                v-model="model.data_type"
                :placeholder="$t('module.apiResponse.data_type')"
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
              :label="$t('module.apiResponse.order')"
              prop="order"
            >
              <a-input
                v-model="model.order"
                :placeholder="$t('module.apiResponse.order')"
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
              :label="$t('module.apiResponse.use_flg')"
              prop="use_flg"
            >
              <a-input
                v-model="model.use_flg"
                :placeholder="$t('module.apiResponse.use_flg')"
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
    resource: 'apiResponse',
    projects: [],
    apis: []
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
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        api_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.api_id') }),
            trigger: ['change', 'blur']
          }
        ],
        version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.version_code') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiResponse.version_code'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        api_response_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.api_response_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiResponse.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        name_jp: [
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.apiResponse.name_jp'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ],
        data_type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.data_type') }),
            trigger: ['change', 'blur']
          }
        ],
        use_flg: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apiResponse.use_flg') }),
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
    this.getProjects()
    this.getApis()
  },

  /**
   * List of methods.
   */
  methods: {
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
     * List Api
     */
    async getApis() {
      const { data: { result: { data } } } = await this.$api.api.list()
      this.apis = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.model.project_id,
        api_id: this.model.api_id,
        version_code: this.model.version_code,
        api_response_pk: this.model.api_response_pk,
        name: this.model.name,
        name_jp: this.model.name_jp,
        parent_api_response_pk: this.model.parent_api_response_pk,
        description: this.model.description,
        description_jp: this.model.description_jp,
        data_type: this.model.data_type,
        order: this.model.order,
        use_flg: this.model.use_flg,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
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
