<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a href="https://mermaid.live/" target="_blank">
          {{ '[' + $t('common.live_editor') + ']' }}
        </a>
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Update"
          @click="createOrUpdate(flows)"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ flows.length > 0 ? $t('common.update') : $t('common.new') }}
        </a-button>
        <a-button
          class="min-w-100 copy-btn"
          title="Copy flow"
          @click="copyFlow"
        >
          <font-awesome-icon icon="copy" class="mr-1" />
          {{ $t('common.copy') }}
        </a-button>
      </template>
      <div v-if="flows.length > 0" class="content-flow">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              prop="description"
            >
              <div v-for="(item, index) in flows" :key="index">
                <div class="text-pre-line">
                  {{ item.description }}
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
export default {
  /**
     * Declare components.
     */
  components: {
  },

  mixins: [
    DataTable
  ],

  props: {
    flows: {
      type: [Array],
      default: () => []
    }
  },
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
  data() {
    return {
      resource: 'flow',
      defaultParams: {
        project_id: this.$store.state.project.id
      }
    }
  },

  /**
     * Computed event.
     */
  computed: {
  },

  /**
     * Mounted event.
     */
  mounted() {

  },

  methods: {
    createOrUpdate(data) {
      if (data.length > 0) {
        const flow = data[0]
        this.$router.push(`/${this.resource}/${flow.id}`)
      } else {
        this.$router.push({ name: 'flow-new' })
      }
    },
    copyFlow() {
      if (this.flows && this.flows.length > 0) {
        const flow = this.flows[0]
        navigator.clipboard.writeText(flow.description)
        this.$message.success(this.$t('module.functionItem.copy_message'))
      }
    },
    save() {
      this.$emit('save')
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
    .text-pre-line {
        white-space: pre-line;
    }
    .content-flow {
        border: 1px solid #ccc;
        width: 50%;
        margin: auto;
    }
}
</style>
