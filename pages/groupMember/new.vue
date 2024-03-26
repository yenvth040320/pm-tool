<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.groupMember') }}
    </template>

    <groupMember-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import GroupMemberForm from '~/components/templates/groupMember/GroupMemberForm'

export default {
  /**
   * Declare components.
   */
  components: { GroupMemberForm },

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
