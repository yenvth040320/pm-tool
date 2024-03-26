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
            <a-col
              :span="24"
            >
              <a-form-model-item
                :label="$t('module.erGroup.entity')"
                prop="entities"
              >
                <a-select
                  v-model="model.entities"
                  :placeholder="$t('module.erGroup.entity')"
                  :filter-option="filterOption"
                  show-arrow
                  show-search
                  mode="multiple"
                >
                  <a-select-option
                    v-for="(item, index) in selectableEntity"
                    :key="index"
                    :value="String(item.id)"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
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
            {{ $t('common.update') }}
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
import { SORT } from '~/constants'
import DataForm from '~/mixins/data-form'

export default {
  mixins: [DataForm],

  /**
   * Init data for component.
   */
  data: () => ({
    resource: 'erGroup',
    visible: false,
    SORT,
    model: {},
    listEntity: [],
    selectableEntity: []
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

  created() {
    this.getListEntity()
  },

  methods: {
    /**
     * Get list entity
     */
    async getListEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.listEntity = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        this.selectableEntity = this.listEntity.filter(entity => entity.er_group_id === null || entity.er_group_id === id)
        let model = {}
        if (id) {
          const params = {
            show_entity: true
          }
          const { data: { result: { data } } } = await this.repository.show(id, { params })
          model = data
          model.entities = data.entities.map(i => String(i.id))
        }
        this.setModel(model)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Filter select option
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
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
        name: this.model.name,
        entities: this.model.entities
      }

      return model
    },

    open() {
      this.visible = true
    },

    close() {
      this.visible = false
    },

    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            await this.$api.erGroup.update(this.model.id, data)

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.visible = false
            this.$emit('save')
            this.getListEntity()
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
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
