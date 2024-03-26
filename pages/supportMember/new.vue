<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.supportMember') }}
    </template>

    <supportMember-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import SupportMemberForm from '~/components/templates/supportMember/SupportMemberForm'

export default {
  /**
   * Declare components.
   */
  components: { SupportMemberForm },

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
