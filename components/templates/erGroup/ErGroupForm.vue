<template>
  <a-modal
    :visible="visible"
    :width="900"
    :dialog-style="{ top: '200px' }"
    :footer="null"
    @cancel="close"
  >
    <a-form-model
      ref="form"
      :model="model"
      :rules="formRules"
      :label-col="{ sm: 5 }"
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
            >
              <a-form-model-item
                :label="$t('module.erGroup.name')"
                prop="name"
              >
                <a-input
                  v-model="model.name"
                  :placeholder="$t('module.erGroup.name')"
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
            {{ $t('common.create') }}
          </a-button>

        &nbsp;
          <a-button
            html-type="button"
            type="default"
            class="min-w-100"
            @click="close"
          >
            {{ $t('common.cancel') }}
          </a-button>
        </div>
      </a-spin>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'erGroup',
    visible: false,
    loading: false,
    model: {}
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.erGroup.name') }),
            trigger: ['change', 'blur']
          },
          {
            max: 255,
            message: this.$t('validation.max', { field: this.$t('module.erGroup.name'), max: 255 }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
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
        project_id: this.model.project_id,
        name: this.model.name,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
      }

      return model
    },

    open() {
      this.visible = true
      const model = {}
      this.model = model
    },

    close() {
      this.visible = false
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            await this.$api.erGroup.create(data)

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visible = false
            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.loading = false
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
}
</style>
