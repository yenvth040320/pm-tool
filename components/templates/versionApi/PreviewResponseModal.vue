<template>
  <a-modal
    :visible="openModal"
    :width="900"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <div class="p-4">
          <a-form-model
            ref="form"
            :model="this"
            :label-col="{ sm: 6 }"
            :wrapper-col="{ sm: 18 }"
            @submit.prevent="confirm"
          >
            <vue-json-pretty
              v-if="isCreateResponse === true"
              :data="responseData"
              :deep="4"
              :show-length="true"
              :show-line="true"
              :show-icon="true"
            />
            <DiffViewer v-else :delta="delta" :left="left" />
            <div v-if="delta !== undefined || isCreateResponse === true" class="text-center p-3">
              <a-button
                html-type="submit"
                type="primary"
                title="Tạo mới"
                class="min-w-100"
              >
                {{ isCreateResponse === false ? $t('common.update') : $t('common.create') }}
              </a-button>

              &nbsp;
              <a-button
                html-type="button"
                type="default"
                class="min-w-100"
                title="Huỷ bỏ"
                @click="close"
              >
                {{ $t('common.cancel') }}
              </a-button>
            </div>
          </a-form-model>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { LOGIC_TYPE, LOGIC_TYPE_VALUE, LOCK_FLG_VALUE } from '~/constants'
import DiffViewer from '~/components/templates/versionApi/DiffViewer.vue'

export default {
  components: {
    DiffViewer
  },
  props: {
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      responseData: {},
      model: {},
      LOGIC_TYPE,
      LOGIC_TYPE_VALUE,
      LOCK_FLG_VALUE,
      visible: false,
      delta: {},
      left: {},
      right: {},
      isCreateResponse: false
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data, currentData, isCreate) {
      this.model = data
      this.isCreateResponse = isCreate
      if (currentData) {
        const left = JSON.parse(currentData, this.$jsonDiff.dateReviver)
        const right = JSON.parse(data.response, this.$jsonDiff.dateReviver)

        this.delta = this.$jsonDiff.diff(left, right)
        this.left = left
        this.right = right
      } else {
        this.responseData = JSON.parse(data.response)
      }
      this.openModal = true
    },
    close() {
      this.openModal = false
    },

    confirm() {
      this.handleSubmit()
    },

    async handleSubmit() {
      this.$store.dispatch('setLoading', true)

      try {
        const data = this.model
        if (this.isCreateResponse === true) {
          data.responseData = JSON.stringify(this.responseData)
          await this.$api.apiResponse.createResponse(data)
        } else {
          data.responseData = JSON.stringify(this.right)
          data.currentResponse = JSON.stringify(this.left)
          await this.$api.apiResponse.updateResponse(data)
        }
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('onClose', false)
        this.$emit('saveNewParent')
        this.close()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>
