<template>
  <div class="editable-cell" @dblclick="edit">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input v-if="type !== MST_ITEM_TYPE.boolean" :value="value" @change="handleChange" @pressEnter="check" /><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
      <a-select
        v-if="type === MST_ITEM_TYPE.boolean"
        mode="single"
        @change="handleChange"
      >
        <a-select-option
          v-for="(item, index) in BOOLEAN_TYPE[$nuxt.$i18n.locale]"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
import { MST_ITEM_TYPE, BOOLEAN_TYPE } from '~/constants'
export default {
  props: {
    text: {
      type: String,
      default: null
    },
    type: {
      type: [Number, String],
      default: null
    }
  },

  data() {
    return {
      value: this.text,
      editable: false,
      MST_ITEM_TYPE,
      BOOLEAN_TYPE
    }
  },

  watch: {
    text(val) {
      this.value = val
    }
  },

  methods: {
    handleChange(e) {
      if (this.type === MST_ITEM_TYPE.boolean) {
        this.value = e
      } else {
        const value = e.target.value
        this.value = value
      }
    },
    check() {
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    }
  }
}
</script>

<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
