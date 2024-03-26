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
            @submit.prevent="handleSubmit"
          >
            <a-row>
              <a-col
                v-if="model.version_function_life_cycles"
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.tab_process.start')"
                  prop="start_date"
                >
                  <a-date-picker
                    v-model="model.version_function_life_cycles.find(item => item.mst_life_cycle_id === mstLifeCycleId).start_date"
                    :placeholder="$t('module.tab_process.start')"
                    format="YYYY/MM/DD"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                v-if="model.version_function_life_cycles"
                :span="24"
              >
                <a-form-model-item
                  :label="$t('module.tab_process.end')"
                  prop="end_date"
                >
                  <a-date-picker
                    v-model="model.version_function_life_cycles.find(item => item.mst_life_cycle_id === mstLifeCycleId).end_date"
                    :placeholder="$t('module.tab_process.end')"
                    format="YYYY/MM/DD"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                class="text-center"
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
                  {{ $t('common.submit') }}
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
import DataTable from '~/mixins/data-table'

export default {
  components: {},

  mixins: [
    DataTable
  ],

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

  props: {
    mstLifeCycles: {
      type: [Array],
      default: () => []
    },
    users: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      resource: 'versionFunctionLifeCycle',
      model: {},
      mstLifeCycleId: undefined,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },
  /**
   * Computed event.
   */
  computed: {},

  watch: {},

  mounted() {},

  methods: {
    open(data, index) {
      this.model = cloneDeep(data)
      this.mstLifeCycleId = index
      this.openModal = true
    },

    close() {
      this.openModal = false
    },
    async handleSubmit() {
      this.loadModal = true
      try {
        let data = {}
        data = this.model.version_function_life_cycles.find(item => item.mst_life_cycle_id === this.mstLifeCycleId)
        if (data.start_date && data.end_date) {
          const start = moment(data.start_date)
          const end = moment(data.end_date)
          if (start.isSameOrAfter(end)) {
            this.$notification.error({
              message: this.$t('module.tab_schedule.validate_date_err_message')
            })
            return
          }
        }
        data.start_date = data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null
        data.end_date = data.end_date ? moment(data.end_date).format('YYYY-MM-DD') : null

        if (Object.keys(data).length > 0) {
          if (data.id) {
            await this.repository.update(data.id, data)
          } else {
            await this.repository.create(data)
          }

          this.$notification.success({
            message: this.$t('text.successfully')
          })
          this.$emit('save')
          this.openModal = false
        }
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
}

</style>
