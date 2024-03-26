<template>
  <div
    class="main"
  >
    <a-row>
      <a-col :span="22">
        <a-textarea
          v-model="testCaseSampleCode"
          :auto-size="{ minRows: 5 }"
        />
      </a-col>
      <a-col :span="2">
        <a-icon type="save" class="save-btn" @click="saveCode" />
      </a-col>
    </a-row>
  </div>
</template>
<script>

export default {
  props: {
    sampleCode: {
      type: String,
      default: ''
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      testCaseSampleCode: this.sampleCode,
      project_id: this.$store.state.project.id
    }
  },

  watch: {
    sampleCode(newVal) {
      this.testCaseSampleCode = newVal
    }
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * Click save btn to save testcase code
     */
    saveCode() {
      this.$emit('saveCode', this.testCaseSampleCode)
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding-top: 54px;
  /deep/ {
    .anticon-save > svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .save-btn {
    margin-left: 5px;
  }
}
</style>
