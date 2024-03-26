<template>
  <div>
    <div
      v-for="func in record.functionRelationships"
      v-show="record.functionRelationships.length > 0"
      :key="func.function.id"
    >
      <div v-if="getFilteredItems(record, func.function.id).length > 0" class="text-heading function-header pt-3">
        <span>
          {{ '[' + func.function.code + ']: ' + func.function.name }}/ version: {{ getFilteredVersion(record, func.function.id) }}
        </span>
        <a-button
          v-if="shouldShowAddButton(func.function.id)"
          type="primary"
          class="min-w-100"
          title="Tạo mới"
          @click="addRecord(func.function.id, getFilteredVersion(record, func.function.id), getFilteredItems(record, func.function.id))"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.add') }}
        </a-button>
        <a-button
          v-else
          v-show="checkItemToDelete(func.function.id)"
          html-type="button"
          type="danger"
          title="Xoá"
          class="min-w-100"
          @click="findItemToDelete(func.function.id)"
        >
          {{ $t('common.delete') }}
        </a-button>
      </div>
      <div v-for="(relationshipItem, itemIndex) in getFilteredItems(record, func.function.id)" :key="itemIndex">
        {{ relationshipItem.function_item_origin.item_num }}. {{ relationshipItem.function_item_origin.name +': (' + relationshipItem.function_item_origin.mst_item_type.name + ')' }}
        ⇔
        {{ relationshipItem.function_item.item_num }}. {{ relationshipItem.function_item.name +': (' + relationshipItem.function_item.mst_item_type.name + ')' }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    record: {
      type: [Object],
      default: () => {}
    },
    requirementFunctions: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      version: {}
    }
  },

  mounted() {
  },

  methods: {
    getFilteredItems(record, funcId) {
      const filteredItems = []

      record.functionRelationshipItems.forEach(item => {
        const filtered = item.functionRelationshipItems.filter(val => val.function_item.function_id === funcId)
        filteredItems.push(...filtered)
      })

      return filteredItems
    },

    getFilteredVersion(record, funcId) {
      const filteredItems = []

      record.functionRelationshipItems.forEach(item => {
        const filtered = item.functionRelationshipItems.filter(val => val.function_item.function_id === funcId)
        filtered.forEach(value => {
          filteredItems.push(value.function_item.version_code)
        })
      })
      return filteredItems
    },

    shouldShowAddButton(funcId) {
      const exists = this.requirementFunctions.some(func => func.function_id === funcId)

      return !exists
    },

    /**
     * Add function
     */
    async addRecord(funcId, listVersion, listItems) {
      const version = await this.showDetailFunction(funcId, listVersion)
      const functionItems = listItems.map(item => item.function_item)
      this.$emit('addRecord', { version, functionItems })
    },

    async showDetailFunction(funcId, listVersion) {
      try {
        const versionCode = Math.max(...listVersion)
        const params = {
          function_id: funcId,
          version_code: versionCode,
          isTabAnalytics: true
        }
        const { data: { result: { data } } } = await this.$api.versionFunction.getDetail({ params })
        return data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    findItemToDelete(funcId) {
      const index = this.requirementFunctions.findIndex(item => item.function_id === funcId)
      this.deleteRecord(index)
    },

    checkItemToDelete(funcId) {
      const item = this.requirementFunctions.find(item => item.function_id === funcId)
      if (item.approve_status === 1) {
        return false
      } else {
        return true
      }
    },

    deleteRecord(index) {
      this.$emit('deleteRecord', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.text-heading {
  font-weight: 500;
  font-size: 16px;
}
.function-header {
  display: flex;
  justify-content: space-between;
}
</style>
