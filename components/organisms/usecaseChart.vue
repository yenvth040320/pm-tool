<template>
  <div class="mermaid">
    {{ diagramVN }}
  </div>
</template>

<script>
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs'
import { mapState } from 'vuex'
export default {
  props: {
    dataChart: {
      type: [Array],
      default: () => []
    },
    typeChart: {
      type: [String],
      default: () => 'vn'
    },
    checked: {
      type: [Boolean],
      default: () => false
    }
  },

  data() {
    return {
      mermaidCode: ''
    }
  },

  computed: {
    diagramVN() {
      return this.mermaidCode
    },
    ...mapState({
      loading: 'loading'
    })
  },

  created() {
    this.generateDiagram()
  },

  mounted() {
    mermaid.initialize({ startOnLoad: true })
    mermaid.init(undefined, document.querySelectorAll('.mermaid'))
  },

  methods: {
    generateDiagram() {
      this.$store.dispatch('setLoading', true)
      let mermaidCode =
        'flowchart LR\n'
      const processActionName = (name, nameJP) => {
        if (this.typeChart === 'jp') {
          return nameJP !== null ? nameJP.split(' ').join('_') : name.split(' ').join('_')
        } else {
          return name.split(' ').join('_')
        }
      }

      this.dataChart.forEach(actor => {
        if (actor.approve) {
          const actorName = processActionName(actor.actor_name, actor.actor_name_jp)

          if (actor.actions.length === 0) {
            mermaidCode += `
              ${actorName}(<div><img src='/images/actor.png'/></div><p>${actorName}</p>)
            `
          } else {
            actor.actions.forEach(actionParent => {
              const groupName = processActionName(actionParent.action_name, actionParent.action_name_jp)
              let nodeValue = ''

              actionParent.action_chills.forEach(item => {
                const actionName = processActionName(item.action_name, item.action_name_jp)
                const nodeName = actionName
                nodeValue += `${nodeName}((${nodeName}))\n`
              })

              mermaidCode += `
                subgraph ${groupName}
                  direction TB
                  ${nodeValue}
                end
              `

              if (actionParent.action_chills.length === 0) {
                mermaidCode += `
                  ${actorName}(<div><img src='/images/actor.png'/></div><p>${actorName}</p>) --> ${groupName}
                `
              } else {
                actionParent.action_chills.forEach(actionChill => {
                  const actionName = processActionName(actionChill.action_name, actionChill.action_name_jp)
                  mermaidCode += `${actorName}(<div><img src='/images/actor.png'/></div><p>${actorName}</p>) --> ${actionName}\n`
                })
              }
            })
          }

          mermaidCode += `class ${actorName} custom-label-actor\n`
        }
      })

      this.$store.dispatch('setLoading', false)
      this.mermaidCode = mermaidCode
    }
  }
}
</script>
