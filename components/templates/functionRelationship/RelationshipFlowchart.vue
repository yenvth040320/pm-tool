<template>
  <div>
    <Diagram ref="diagram" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Diagram from '~/components/templates/MermaidDiagram/Diagram'

export default {
  components: {
    Diagram
  },

  props: {
    functionData: {
      type: [Object],
      default: () => ({})
    },
    relationshipData: {
      type: [Array],
      default: () => []
    },
    mstType: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      mermaidCode: 'flowchart LR\n Hello("Loading...")',
      diagramData: '',
      chartData: {
        functionData: {},
        relationshipData: [],
        mstType: []
      }
    }
  },

  computed: {
    processedData() {
      return this.mermaidCode // Return the same data as a computed property
    },
    ...mapState({
      loading: 'loading'
    })
  },

  watch: {
    functionData: {
      handler() {
        this.handleChartDataChange()
      },
      deep: true
    },
    relationshipData: {
      handler() {
        this.handleChartDataChange()
      },
      deep: true
    },
    mstType: {
      handler() {
        this.handleChartDataChange()
      },
      deep: true
    }
  },

  methods: {
    handleChartDataChange() {
      this.chartData.functionData = this.functionData
      this.chartData.relationshipData = this.relationshipData
      this.chartData.mstType = this.mstType
      this.generateCodeForChart(this.chartData)
      this.$refs.diagram.render(this.mermaidCode, 'diagram')
    },

    generateCodeForChart(chartData) {
      this.$store.dispatch('setLoading', true)
      let mermaidCode = 'flowchart LR\n'
      if (chartData.functionData) {
        mermaidCode += `N${chartData.functionData.id}("[${chartData.functionData.code}] - ${chartData.functionData.name}")` + '\n'
        mermaidCode += `style N${chartData.functionData.id} fill:#f9f,stroke:#333,stroke-width:2px` + '\n'
      }
      if (chartData.relationshipData) {
        let availableNodelist = []
        chartData.relationshipData.forEach(e => {
          if (e.function_id_source === Number(this.$route.params.id)) {
            mermaidCode += `N${e.functionTarget.id}("[${e.functionTarget.code}] - ${e.functionTarget.name}")` + '\n'
            availableNodelist.push(e.functionTarget.id)
          }

          if (e.function_id_target === Number(this.$route.params.id)) {
            mermaidCode += `N${e.functionSource.id}("[${e.functionSource.code}] - ${e.functionSource.name}")` + '\n'
            availableNodelist.push(e.functionSource.id)
          }
          availableNodelist = availableNodelist.filter((value, index, self) => {
            return self.indexOf(value) === index
          }).filter(value => value !== Number(this.$route.params.id))
        })

        availableNodelist.forEach(node => {
          mermaidCode += `N${chartData.functionData.id} <--> N${node}` + '\n'
        })
      }
      this.$store.dispatch('setLoading', false)
      this.mermaidCode = mermaidCode
      console.log('relationship mermaidCode', mermaidCode)
    },

    escapeSpecialCharacters(inputString) {
      const backslashChar = '\\'
      const doubleQuote = '"'
      const greaterThan = '>'
      const lessThan = '<'
      let newString = inputString
      if (inputString.includes(backslashChar)) {
        newString = newString.replaceAll('\\', '#92;')
      }
      if (inputString.includes(doubleQuote)) {
        newString = newString.replaceAll(doubleQuote, '#34;')
      }
      if (inputString.includes(greaterThan)) {
        newString = newString.replaceAll(greaterThan, '#62;')
      }
      if (inputString.includes(lessThan)) {
        newString = newString.replaceAll(lessThan, '#60;')
      }
      newString = newString.replaceAll(/\s+/g, ' ').trim()
      return newString
    }
  }
}
</script>
