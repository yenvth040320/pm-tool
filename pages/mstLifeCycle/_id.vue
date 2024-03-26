<template>
  <a-card class="mb-4">
    <template slot="title">
      {{ $t('common.edit') }} {{ $t('module.mstLifeCycle') }}
    </template>

    <mstLifeCycle-form
      :id="id"
      @save="goBack"
      @cancel="goBack"
    />
  </a-card>
</template>

<script>
import MstLifeCycleForm from '~/components/templates/mstLifeCycle/MstLifeCycleForm'

export default {
  components: {
    MstLifeCycleForm
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
