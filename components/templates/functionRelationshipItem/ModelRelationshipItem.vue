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
                  :label="$t('module.relationship.item_pk')"
                  prop="item_pk"
                >
                  <a-select
                    v-model="model.item_pk"
                    mode="single"
                    :disabled="loading"
                    :placeholder="$t('module.relationship.item_pk')"
                    show-search
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      v-for="item in functionItems"
                      :key="item.id"
                      :value="item.item_pk"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
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
  },
  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      resource: 'functionRelationshipItem',
      functionItems: [],
      model: {},
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
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.functionItems = cloneDeep(data)
      this.openModal = true
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    close() {
      this.openModal = false
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
