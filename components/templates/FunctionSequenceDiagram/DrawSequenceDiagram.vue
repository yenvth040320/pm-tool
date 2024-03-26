<template>
  <div>
    <a-spin :spinning="loading">
      <Diagram ref="diagram" />
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
    loading: false
  }),
  props: {
    item: {
      type: Object,
      default: () => { }
    }
  },

  /**
       * Computed event.
       */
  computed: {
  },
  watch: {
    item(val) {
      this.drawSequence(val)
    }
  },

  /**
 * Mounted event.
 */
  mounted() {
    if (this.item !== 0) {
      this.drawSequence(this.item)
    }
  },

  /**
       * List of methods.
       */
  methods: {
    drawSequence(item) {
      const actors = []
      item.actors.forEach(e => {
        actors.push(e.name)
      })
      console.warn(item)
      const joinedString = actors.join('/')
      console.warn(joinedString)
      const objects = []
      objects.push({
        name: joinedString,
        action: item.functionItem.name
      })
      objects.push({
        name: 'website',
        action: item.mstEvent.name
      })
      objects.push({
        name: item.api.code,
        action: null
      })
      this.getApiSequenceDiagram(item, objects)
    },

    async getApiSequenceDiagram(item, objects) {
      this.loading = true
      try {
        const params = {
          project_id: this.$store.state.project.id,
          api_id: item.api_id,
          version_code: item.api_version_code,
          first: true
        }
        const { data: { result: { data } } } = await this.$api.apiSequenceDiagram.showApiSequenceDiagram({ params })
        if (data !== null) {
          const dataProperty = await this.$api.classProperties.show(data.class_property_id)
          if (dataProperty) {
            const classProPerty = dataProperty.data.result.data
            const result = await this.analyticSourceCode(classProPerty, objects)
            await this.$refs.diagram.render(result, item.id)
          }
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
