<template>
  <div>
    <a-spin :spinning="loading">
      <span v-if="path">
        {{ path }}
      </span>
      <Diagram ref="diagram" :key="diagramKey" />
    </a-spin>
  </div>
</template>
<script>
import Diagram from '~/components/templates/MermaidDiagram/Diagram'
import AnalyticsCode from '~/mixins/analytics-code'
export default {
  components: {
    Diagram
  },
  mixins: [AnalyticsCode],
  /**
       * Init data for component.
       */
  data: () => ({
    resource: 'classProperty',
    projects: [],
    model: {},
    loading: false,
    diagramKey: 0,
    path: ''
  }),
  props: {
    id: {
      type: [Number],
      default: () => 0
    }
  },

  /**
       * Computed event.
       */
  computed: {
  },
  watch: {
    id(val) {
      this.getDetailClassProPerty(val)
    }
  },

  /**
 * Mounted event.
 */
  mounted() {
    if (this.id !== 0) {
      this.getDetailClassProPerty(this.id)
    }
  },

  /**
       * List of methods.
       */
  methods: {
    /**
       * Get list entity
       */
    async getDetailClassProPerty(id) {
      this.loading = true
      try {
        if (id !== 0) {
          this.diagramKey += 1
          const { data: { result: { data } } } = await this.$api.classProperties.show(id)
          this.path = data?.class?.tree?.namespace + '/' + data?.class.name + '/' + data.name
          this.model = data
          const outClass = []
          outClass.push({
            name: 'OutClass',
            action: null
          })
          const result = await this.analyticSourceCode(data, outClass)
          await this.$refs.diagram.render(result, 'diagram')
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loading = false
      }
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
        flex-flow: column;
        align-items: center;
      }
    }
    </style>
