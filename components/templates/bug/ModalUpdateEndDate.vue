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
                  :label="$t('module.bug.end_date')"
                  prop="end_date"
                >
                  <a-date-picker
                    id="bug_end_date"
                    v-model="model.end_date"
                    :placeholder="$t('module.bug.end_date')"
                    format="YYYY/MM/DD"
                    style="width:100%"
                  />
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
import moment from 'moment-timezone'
import { cloneDeep } from 'lodash'

export default {
  components: {},

  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      model: {}
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
    open(data) {
      this.model = cloneDeep(data)
      this.model.users = this.model.users.map(user => user.id)
      this.openModal = true
    },

    close() {
      this.openModal = false
    },

    async handleSubmit() {
      this.loadModal = true
      try {
        if (this.model.id) {
          if (this.model.end_date) {
            this.model.end_date = moment(this.model.end_date).format('YYYY-MM-DD')
          }
          await this.$api.bug.updateBug(this.model.id, this.model)
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
