<template>
  <a-card class="mb-4">
    <div>
      <relationship-flowchart
        :function-data="functionData"
        :relationship-data="functionRelationship"
        :mst-type="mstType"
      />
    </div>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import RelationshipFlowchart from '~/components/templates/functionRelationship/RelationshipFlowchart.vue'
export default {
  props: {
    functionRelationships: {
      type: [Array],
      default: () => []
    },
    version: {
      type: Object,
      default: () => {}
    }
  },

  components: { RelationshipFlowchart },

  data() {
    return {
      resource: 'function',
      functionData: {},
      functionRelationship: []
    }
  },

  computed: {
    currentVersion() {
      return this.$route.params.version_code
    },
    currentFunctionId() {
      return this.$route.params.id
    },
    ...mapState({
      loading: 'loading'
    })
  },

  watch: {
    functionRelationships: {
      handler(newFunctionData) {
        this.getFunctionRelationships(newFunctionData)
      },
      deep: true
    }
  },

  mounted() {
    this.getRootFunction()
    this.getFunctionRelationships()
  },

  methods: {
    getRootFunction() {
      this.functionData = this.version.function
    },

    getFunctionRelationships() {
      const functionRelationship = this.functionRelationships.filter(e => ((e.function_id_source === Number(this.$route.params.id)) || (e.function_id_target === Number(this.$route.params.id))))
      this.functionRelationship = functionRelationship
    }
  }

}
</script>
