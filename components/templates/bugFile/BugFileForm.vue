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
              :label="$t('module.bugFile.bug_id')"
              prop="bug_id"
            >
              <a-select
                id="bugFile_bug_id"
                v-model="model.bug_id"
                :allow-clear="true"
                :placeholder="$t('module.bug')"
              >
                <a-select-option
                  v-for="(item, index) in bugs"
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
              :label="$t('module.bugFile.file_path')"
              prop="file_path"
            >
              <a-input
                id="bugFile_file_path"
                v-model="model.file_path"
                :placeholder="$t('module.bugFile.file_path')"
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
    resource: 'bugFile',
    bugs: []
  }),

  /**
   * Computed event.
   */
  computed: {
    /**
     * Rules validate when submit form.
     */
    formRules() {
      return {
        bug_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bugFile.bug_id') }),
            trigger: ['change', 'blur']
          }
        ],
        file_path: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.bugFile.file_path') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.bugFile.file_path'), max: 255 }),
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
    this.getBugs()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Bug
     */
    async getBugs() {
      const { data: { result: { data } } } = await this.$api.bug.list()
      this.bugs = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        bug_id: this.model.bug_id,
        file_path: this.model.file_path
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
