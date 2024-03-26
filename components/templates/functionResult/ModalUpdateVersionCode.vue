<template>
  <a-modal
    :visible="openModal"
    :width="720"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="model"
            :label-col="{ sm: 8 }"
            :wrapper-col="{ sm: 16 }"
            class="mt-3"
            @submit.prevent="handleSubmit"
          >
            <a-row>
              <a-col
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.functionResult.version_code')"
                  prop="version_code"
                >
                  <a-select
                    v-model="model.version_code"
                    allow-clear
                    show-search
                    :filter-option="filterOption"
                    :placeholder="$t('module.functionResult.version_code')"
                  >
                    <a-select-option
                      v-for="(item, index) in versions"
                      :key="index"
                      :value="item.version_code"
                    >
                      {{ item.version_code }}: {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                class="text-center pt-3"
              >
                <a-button
                  html-type="button"
                  type="default"
                  :disabled="loadModal"
                  title="Huỷ bỏ"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </a-button>
                <a-button
                  html-type="submit"
                  title="Save"
                  :disabled="loadModal"
                  type="primary"
                >
                  {{ $t('common.ok') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import { BUG_DONE_PERCENT } from '~/constants'

export default {
  components: {},

  data() {
    return {
      openModal: false,
      loadModal: false,
      BUG_DONE_PERCENT,
      visible: false,
      model: {},
      dataOriginal: {},
      versions: []
    }
  },
  /**
         * Computed event.
         */
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data, versions) {
      this.dataOriginal = data
      this.model = cloneDeep(data)
      this.openModal = true
      this.versions = versions
      if (this.versions.length > 0) {
        this.$set(this.model, 'version_code', this.versions[0].version_code)
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    close() {
      this.openModal = false
    },

    async handleSubmit() {
      this.loadModal = true
      try {
        if (this.model.id) {
          await this.$api.functionResult.update(this.model.id, this.model)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.openModal = false
        this.$emit('save')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadModal = false
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
:deep() {
    .ant-form-item-label {
        padding-right: 20px;
    }
    .ant-input-number {
        width: 100% !important;
    }
}
</style>
