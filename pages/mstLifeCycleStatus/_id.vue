<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.mstLifeCycleStatus') }}
    </template>

    <mstLifeCycleStatus-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import MstLifeCycleStatusForm from '~/components/templates/mstLifeCycleStatus/MstLifeCycleStatusForm'

export default {
  components: {
    MstLifeCycleStatusForm
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
