<template>
  <a-modal
    :visible="openModal"
    :width="780"
    :dialog-style="{ top: '200px' }"
    :footer="null"
    @cancel="close"
  >
    <a-card class="mb-4 no-border">
      <template slot="title">
        <span>{{ $t('module.entity') }}</span>
      </template>
      <div class="content">
        <a-spin :spinning="loadModal">
          <div class="p-4">
            <a-form-model
              ref="form"
              :model="this"
              :label-col="{ sm: 6 }"
              :wrapper-col="{ sm: 18 }"
              @submit.prevent="handleSubmit"
            >
              <div v-for="(entity, index) in entityData" :key="index" class="entity-container">
                <span class="entity-number">{{ index + 1 }}. </span>
                <span :style="{ color: getColor(entity) }">{{ entity }}</span>
                <span v-if="duplicateEntities[entity]" class="duplicate-text">{{ $t('text.wrong_exists_entity_name') }}</span>
              </div>
              <div class="text-center p-3">
                <a-button
                  v-if="!showGoBackButton"
                  html-type="submit"
                  type="primary"
                  :disabled="loading"
                  title="Lưu"
                  class="min-w-100"
                >
                  {{ $t('common.submit') }}
                </a-button>
                <a-button
                  v-else
                  html-type="button"
                  type="default"
                  :disabled="loading"
                  title="Lưu"
                  class="min-w-100"
                  @click="goBack($event)"
                >
                  {{ $t('common.back') }}
                </a-button>
              </div>
            </a-form-model>
          </div>
        </a-spin>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { ERROR_CODE } from '~/constants'
export default {
  props: {
    versionCode: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      ERROR_CODE,
      entityData: [],
      visible: false,
      loading: false,
      entities: [],
      duplicateEntities: {},
      showGoBackButton: false
    }
  },
  computed: {

  },
  watch: {
  },
  mounted() {
    this.getEntities()
  },
  methods: {
    async open(data) {
      this.entityData = data
      this.openModal = true
      await this.getDataPreview(data)
    },

    getDataPreview(data) {
      if (this.entities && this.entities.length > 0) {
        const uppercaseEntities = this.entities.map(entity => entity.name.toUpperCase())

        data.forEach(entity => {
          if (uppercaseEntities.includes(entity.toUpperCase())) {
            this.$set(this.duplicateEntities, entity, true)
            this.showGoBackButton = true
          }
        })
      }
    },

    getColor(entity) {
      if (this.duplicateEntities && this.duplicateEntities[entity]) {
        return 'red'
      } else {
        return 'green'
      }
    },

    async getEntities() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entities = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async handleSubmit() {
      this.$store.dispatch('setLoading', true)
      try {
        const data = {
          project_id: this.$store.state.project.id,
          entities: this.entityData
        }
        await this.$api.entity.createMulti(data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.openModal = false
        this.$emit('save')
      } catch (_) {
        if (_.response.data.code && _.response.data.code === ERROR_CODE.EXIST_ENTITY_NAME) {
          this.$notification.error({
            message: this.$t('text.wrong_exists_entity_name')
          })
        } else {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        }
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    close() {
      this.entityData = []
      this.openModal = false
      this.showGoBackButton = false
      this.$emit('close')
    },
    goBack(event) {
      event.preventDefault()
      this.openModal = false
      this.showGoBackButton = false
    }
  }
}
</script>
<style scoped lang="scss">
.duplicate-text {
  color: red;
  margin-left: 10px;
  text-decoration: underline;
  font-size: 12px;
  font-style: italic;
}
.entity-container {
  margin-bottom: 10px;
}

.entity-number {
  font-weight: bold;
  margin-right: 5px;
}
</style>
