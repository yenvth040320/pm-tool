<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :wrapper-col="{ sm: 24 }"
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
              prop="description"
            >
              <a-textarea
                v-model="model.description"
                :rows="20"
                :placeholder="$t('module.flow.description')"
              />
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
          {{ $t('common.submit') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="gotoBack"
        >
          {{ $t('common.back') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>
<script>
import DataForm from '~/mixins/data-form'
export default {
  /**
   * Declare components.
   */
  components: {
  },
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
    resource: 'flow'
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        description: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.flow.description') }),
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
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
      this.model.project_id = this.$store.state.project.id
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
        description: this.model.description
      }
      return model
    },
    gotoBack() {
      this.$router.push({ name: 'flow' })
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
    justify-content: center;
  }
}
</style>
