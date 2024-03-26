<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.flowHistory') }}
    </template>
    <template slot="extra">
      <a href="https://mermaid.live/" target="_blank">
        {{ '[' + $t('common.live_editor') + ']' }}
      </a>
    </template>

    <flowHistory-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import FlowHistoryForm from '~/components/templates/flowHistory/FlowHistoryForm'

export default {
  /**
   * Declare components.
   */
  components: {
    FlowHistoryForm
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
