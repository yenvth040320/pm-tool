<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.flow') }}
    </template>
    <template slot="extra">
      <a href="https://mermaid.live/" target="_blank">
        {{ '[' + $t('common.live_editor') + ']' }}
      </a>
    </template>

    <flow-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FlowForm from '~/components/templates/flow/FlowForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FlowForm
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      id: +this.$route.params.id || 0
    }
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * Go to list
     */
    goBack() {
      this.$router.push({
        path: '../',
        append: true
      })
    }
  }
}
</script>
