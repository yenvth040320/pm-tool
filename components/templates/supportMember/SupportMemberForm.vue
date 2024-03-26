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
              :label="$t('module.supportMember.supporter_id')"
              prop="supporter_id"
            >
              <a-select
                v-model="model.supporter_id"
                :placeholder="$t('module.supporter')"
              >
                <a-select-option
                  v-for="(item, index) in supporters"
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
              :label="$t('module.supportMember.supported_user_id')"
              prop="supported_user_id"
            >
              <a-select
                v-model="model.supported_user_id"
                :placeholder="$t('module.supportedUser')"
              >
                <a-select-option
                  v-for="(item, index) in supportedUsers"
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
              :label="$t('module.supportMember.start_date')"
              prop="start_date"
            >
              <a-input
                v-model="model.start_date"
                :placeholder="$t('module.supportMember.start_date')"
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
              :label="$t('module.supportMember.end_date')"
              prop="end_date"
            >
              <a-input
                v-model="model.end_date"
                :placeholder="$t('module.supportMember.end_date')"
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
    resource: 'supportMember',
    supporters: [],
    supportedUsers: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        supporter_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.supportMember.supporter_id') }),
            trigger: ['change', 'blur']
          }
        ],
        supported_user_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.supportMember.supported_user_id') }),
            trigger: ['change', 'blur']
          }
        ],
        start_date: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.supportMember.start_date') }),
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
    this.getSupporters()
    this.getSupportedUsers()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Supporter
     */
    async getSupporters() {
      const { data: { result: { data } } } = await this.$api.supporter.list()
      this.supporters = data
    },

    /**
     * List SupportedUser
     */
    async getSupportedUsers() {
      const { data: { result: { data } } } = await this.$api.supportedUser.list()
      this.supportedUsers = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        supporter_id: this.model.supporter_id,
        supported_user_id: this.model.supported_user_id,
        start_date: this.model.start_date,
        end_date: this.model.end_date,
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
