<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.create') }} {{ $t('module.question') }}
    </template>

    <question-form
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>
<script>

import QuestionForm from '~/components/templates/question/QuestionForm'

export default {
  components: { QuestionForm },
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
