<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $store.state.project.name + ' - ' }} {{ $t('common.edit') }} {{ $t('module.mstEvnTestCase') }}
    </template>

    <mstEvnTestCase-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import MstEvnTestCaseForm from '~/components/templates/mstEvnTestCase/MstEvnTestCaseForm'

export default {
  components: {
    MstEvnTestCaseForm
  },

  data() {
    return {
      id: +this.$route.params.id || 0
    }
  },

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
