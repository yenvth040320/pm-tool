<template>
  <a-form-model
    ref="form"
    :model="filters"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
    class="mb-4"
    @submit.prevent="search"
  >
    <a-row type="flex" :gutter="30">
      <!-- Group test case -->
      <a-col :span="12">
        <a-form-model-item
          :label="$t('module.caseTest.group_test_case')"
          show-search
          :filter-option="filterOption"
        >
          <a-select
            v-model="filters.group_test_case"
            :placeholder="$t('module.caseTest.group_test_case')"
            @change="onChangeGroupTestcase"
          >
            <a-select-option v-for="item in GROUP_TEST_CASE" :key="item.id">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <!-- category test case -->
      <a-col
        v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.function"
        :span="12"
      >
        <a-form-model-item
          :label="$t('module.caseTest.mstCategoryTestCaseCommon')"
        >
          <a-select
            v-model="filters.category_test_case"
            :placeholder="$t('module.caseTest.mstCategoryTestCaseCommon')"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in categoryTestCaseList"
              :key="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <!-- item type -->
      <a-col
        v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.validate"
        :span="12"
      >
        <a-form-model-item :label="$t('module.caseTest.mstItemType')">
          <a-select
            v-model="filters.item_type"
            :placeholder="$t('module.caseTest.mstItemType')"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option v-for="item in itemTypeList" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <!-- item property -->
      <a-col
        v-if="filters.group_test_case === GROUP_TEST_CASE_VALUE.validate"
        :span="12"
      >
        <a-form-model-item :label="$t('module.caseTest.mstItemProperty')">
          <a-select
            v-model="filters.item_property"
            :placeholder="$t('module.mstItemProperty')"
            show-search
            :filter-option="filterOption"
          >
            <a-select-option v-for="item in itemPropertyList" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col
        :span="12"
        class="text-center"
      >
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          <font-awesome-icon icon="search" class="mr-1" />
          {{ $t('common.search') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="reset"
        >
          <font-awesome-icon icon="eraser" class="mr-1" />
          {{ $t('common.clear') }}
        </a-button>
      </a-col>
    </a-row>
    <!-- end search -->
  </a-form-model>
</template>
<script>
import { GROUP_TEST_CASE_VALUE, GROUP_TEST_CASE } from '~/constants'

export default {
  props: {
    filters: {
      type: Object,
      default: () => {
        return {
          group_test_case: undefined,
          item_type: undefined,
          category_test_case: undefined,
          item_property: undefined,
          project_id: this.$store.state.project.id
        }
      }
    },
    categoryTestCaseList: {
      type: Array,
      default: () => []
    },
    itemTypeList: {
      type: Array,
      default: () => []
    },
    itemPropertyList: {
      type: Array,
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      GROUP_TEST_CASE_VALUE,
      GROUP_TEST_CASE
    }
  },

  /**
   * Methods.
   */
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Search data
     */
    search() {
      this.$emit('search')
    },

    /**
     * reset form search
     */
    reset() {
      this.$emit('clearSearch')
    },

    /**
     * On Changing Group Testcase
     */
    onChangeGroupTestcase() {
      this.$emit('onChangeGroupTestcase')
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  font-weight: 700;
}
.ant-row-flex {
  flex-flow: column;
  align-items: center;
}

</style>
