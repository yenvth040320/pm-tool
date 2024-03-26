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
              :label="$t('module.groupMember.leader_id')"
              prop="leader_id"
            >
              <a-select
                v-model="model.leader_id"
                :placeholder="$t('module.leader')"
              >
                <a-select-option
                  v-for="(item, index) in leaders"
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
              :label="$t('module.groupMember.member_id')"
              prop="member_id"
            >
              <a-select
                v-model="model.member_id"
                :placeholder="$t('module.member')"
              >
                <a-select-option
                  v-for="(item, index) in members"
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
              :label="$t('module.groupMember.flg_add_point')"
              prop="flg_add_point"
            >
              <a-input
                v-model="model.flg_add_point"
                :placeholder="$t('module.groupMember.flg_add_point')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.groupMember.start_date')"
              prop="start_date"
            >
              <a-input
                v-model="model.start_date"
                :placeholder="$t('module.groupMember.start_date')"
              >
                <font-awesome-icon
                  slot="prefix"
                  icon="heading"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.groupMember.end_date')"
              prop="end_date"
            >
              <a-input
                v-model="model.end_date"
                :placeholder="$t('module.groupMember.end_date')"
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
    resource: 'groupMember',
    leaders: [],
    members: []
  }),

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        leader_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.groupMember.leader_id') }),
            trigger: ['change', 'blur']
          }
        ],
        member_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.groupMember.member_id') }),
            trigger: ['change', 'blur']
          }
        ],
        flg_add_point: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.groupMember.flg_add_point') }),
            trigger: ['change', 'blur']
          }
        ],
        start_date: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.groupMember.start_date') }),
            trigger: ['change', 'blur']
          }
        ],
        end_date: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.groupMember.end_date') }),
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
    this.getLeaders()
    this.getMembers()
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * List Leader
     */
    async getLeaders() {
      const { data: { result: { data } } } = await this.$api.leader.list()
      this.leaders = data
    },

    /**
     * List Member
     */
    async getMembers() {
      const { data: { result: { data } } } = await this.$api.member.list()
      this.members = data
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        leader_id: this.model.leader_id,
        member_id: this.model.member_id,
        flg_add_point: this.model.flg_add_point,
        start_date: this.model.start_date,
        end_date: this.model.end_date,
        created_at: this.model.created_at,
        updated_at: this.model.updated_at
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
