<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :wrapper-col="{ sm: 24 }"
    @submit.prevent="gotoPreview"
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
              prop="entity"
            >
              <a-textarea
                v-model="model.entity"
                :rows="20"
                :placeholder="$t('module.entity')"
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
          {{ $t('common.preview') }}
        </a-button>
      </div>
      <PreviewModal
        ref="previewEntity"
        @save="goBack"
        @close="close"
      />
    </a-spin>
  </a-form-model>
</template>
<script>
import PreviewModal from './PreviewModal.vue'
import DataForm from '~/mixins/data-form'
class ValidationError extends Error {
  constructor(lineIndex, lineContent, message) {
    super(message)
    this.name = 'ValidationError'
    this.lineIndex = lineIndex
    this.lineContent = lineContent
  }
}
export default {
  /**
   * Declare components.
   */
  components: {
    PreviewModal
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
    resource: 'entity',
    projects: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        entity: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.entity') }),
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
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        entity: this.model.entity
      }

      return model
    },
    /**
     * Get model
     *
     * @returns {Object}
     */
    analyzeStringByLines(inputString) {
      const lines = inputString.split('\n')
      const result = []
      const seenLines = new Set()
      let trimmedLine = ''

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        trimmedLine = line.trim()

        if (trimmedLine !== '' && trimmedLine.length > 0) {
          // const pattern = /^[a-zA-Z0-9 _-]+$/
          // if (!pattern.test(trimmedLine)) {
          //   throw new ValidationError(i, trimmedLine, 'Chỉ được phép nhập ký tự tiếng Anh, số, dấu "_" và "-"')
          // }

          if (seenLines.has(trimmedLine)) {
            throw new ValidationError(i, trimmedLine, 'Nội dung đã bị trùng lặp')
          }

          seenLines.add(trimmedLine)

          result.push(trimmedLine)
        }
      }

      return result
    },
    gotoPreview() {
      try {
        const lines = this.analyzeStringByLines(this.model.entity)
        if (lines) {
          this.$refs.previewEntity.open(lines)
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          const errorMessage = `Error at line ${error.lineIndex + 1}: ${error.message}. Nội dung lỗi [${error.lineContent}]`
          this.$notification.error({
            message: this.$t(errorMessage)
          })
        } else {
          console.log('Unknown error:', error)
        }
      }
    },
    goBack() {
      this.$router.push({ name: 'entityRelationship' })
    },
    close() {
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
