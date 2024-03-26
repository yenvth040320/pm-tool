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
              :label="$t('module.entityHistory.project_id')"
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
              :label="$t('module.entityHistory.entity_id')"
              prop="entity_id"
            >
              <a-select
                v-model="model.entity_id"
                :placeholder="$t('module.entity')"
              >
                <a-select-option
                  v-for="(item, index) in entitys"
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
              :label="$t('module.entityHistory.entity_relationship_id')"
              prop="entity_relationship_id"
            >
              <a-select
                v-model="model.entity_relationship_id"
                :placeholder="$t('module.entityRelationship')"
              >
                <a-select-option
                  v-for="(item, index) in entityRelationships"
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
              :label="$t('module.entityHistory.description_before')"
              prop="description_before"
            >
              <a-input
                v-model="model.description_before"
                :placeholder="$t('module.entityHistory.description_before')"
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
              :label="$t('module.entityHistory.description_after')"
              prop="description_after"
            >
              <a-input
                v-model="model.description_after"
                :placeholder="$t('module.entityHistory.description_after')"
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
              :label="$t('module.entityHistory.update_user_id')"
              prop="update_user_id"
            >
              <a-select
                v-model="model.update_user_id"
                :placeholder="$t('module.updateUser')"
              >
                <a-select-option
                  v-for="(item, index) in updateUsers"
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
              :label="$t('module.entityHistory.type')"
              prop="type"
            >
              <a-input
                v-model="model.type"
                :placeholder="$t('module.entityHistory.type')"
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
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
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
  /**
   * Declare mixins.
   */
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
    resource: 'entityHistory',
    projects: [],
    entitys: [],
    entityRelationships: [],
    updateUsers: []
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
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.project_id') }),
            trigger: ['change', 'blur']
          }
        ],
        entity_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.entity_id') }),
            trigger: ['change', 'blur']
          }
        ],
        entity_relationship_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.entity_relationship_id') }),
            trigger: ['change', 'blur']
          }
        ],
        description_before: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.description_before') }),
            trigger: ['change', 'blur']
          }
        ],
        description_after: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.description_after') }),
            trigger: ['change', 'blur']
          }
        ],
        update_user_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.update_user_id') }),
            trigger: ['change', 'blur']
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityHistory.type') }),
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
    this.getEntitys()
    this.getEntityRelationships()
    this.getUpdateUsers()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Project
     */
    async getProjects() {
      const { data: { result: { data } } } = await this.$api.project.list()
      this.projects = data
    },

    /**
     * List Entity
     */
    async getEntitys() {
      const { data: { result: { data } } } = await this.$api.entity.list()
      this.entitys = data
    },

    /**
     * List EntityRelationship
     */
    async getEntityRelationships() {
      const { data: { result: { data } } } = await this.$api.entityRelationship.list()
      this.entityRelationships = data
    },

    /**
     * List UpdateUser
     */
    async getUpdateUsers() {
      const { data: { result: { data } } } = await this.$api.updateUser.list()
      this.updateUsers = data
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
        entity_id: this.model.entity_id,
        entity_relationship_id: this.model.entity_relationship_id,
        description_before: this.model.description_before,
        description_after: this.model.description_after,
        update_user_id: this.model.update_user_id,
        type: this.model.type,
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
