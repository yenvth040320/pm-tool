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
              :label="$t('module.entityRelationship.entity_id_1')"
              prop="entity_id_1"
            >
              <a-select
                v-model="model.entity_id_1"
                :placeholder="$t('module.entity1')"
              >
                <a-select-option
                  v-for="(item, index) in entity1s"
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
              :label="$t('module.entityRelationship.entity_id_2')"
              prop="entity_id_2"
            >
              <a-select
                v-model="model.entity_id_2"
                :placeholder="$t('module.entity2')"
              >
                <a-select-option
                  v-for="(item, index) in entity2s"
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
              :label="$t('module.entityRelationship.relation_1')"
              prop="relation_1"
            >
              <a-input
                v-model="model.relation_1"
                :placeholder="$t('module.entityRelationship.relation_1')"
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
              :label="$t('module.entityRelationship.relation_2')"
              prop="relation_2"
            >
              <a-input
                v-model="model.relation_2"
                :placeholder="$t('module.entityRelationship.relation_2')"
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
              :label="$t('module.entityRelationship.relation_label')"
              prop="relation_label"
            >
              <a-input
                v-model="model.relation_label"
                :placeholder="$t('module.entityRelationship.relation_label')"
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
    resource: 'entityRelationship',
    entity1s: [],
    entity2s: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        entity_id_1: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityRelationship.entity_id_1') }),
            trigger: ['change', 'blur']
          }
        ],
        entity_id_2: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityRelationship.entity_id_2') }),
            trigger: ['change', 'blur']
          }
        ],
        relation_1: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityRelationship.relation_1') }),
            trigger: ['change', 'blur']
          }
        ],
        relation_2: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityRelationship.relation_2') }),
            trigger: ['change', 'blur']
          }
        ],
        relation_label: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entityRelationship.relation_label') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.entityRelationship.relation_label'), max: 255 }),
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
    this.getEntity1s()
    this.getEntity2s()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Entity1
     */
    async getEntity1s() {
      const { data: { result: { data } } } = await this.$api.entity1.list()
      this.entity1s = data
    },

    /**
     * List Entity2
     */
    async getEntity2s() {
      const { data: { result: { data } } } = await this.$api.entity2.list()
      this.entity2s = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        entity_id_1: this.model.entity_id_1,
        entity_id_2: this.model.entity_id_2,
        relation_1: this.model.relation_1,
        relation_2: this.model.relation_2,
        relation_label: this.model.relation_label,
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
