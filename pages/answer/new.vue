<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.answer') }}
    </template>

    <answer-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import AnswerForm from '~/components/templates/answer/AnswerForm'

export default {
  components: { AnswerForm },
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
