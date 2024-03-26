<template>
  <div class="p-4">
    <a-spin :spinning="loading">
      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 24 }"
        :wrapper-col="{ sm: 24 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row type="flex" :gutter="30">
          <a-col :span="24" :md="12">
            <a-form-model-item
              :label="$t('module.design_frontend.component.category')"
              prop="category_id"
            >
              <a-select
                v-model="filters.category_id"
                mode="single"
                :placeholder="$t('module.design_frontend.component.category')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="item in categories"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="12">
            <a-form-model-item
              :label="$t('module.design_frontend.component.function')"
              prop="function_id"
            >
              <a-select
                v-model="filters.function_id"
                :disabled="loading || filters.category_id ? false : true"
                mode="single"
                :placeholder="$t('module.design_frontend.component.function')"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="item in functions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.code + ': ' + item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row type="flex" :gutter="30">
          <a-col :span="24" :md="14">
            <a-form-model-item
              :label="$t('module.design_frontend.component.function_item.name')"
              prop="item_name"
              :label-col="{ sm: 8 }"
              :wrapper-col="{ sm: 16 }"
            >
              <a-input
                v-model="filters.item_name"
                :placeholder="
                  $t('module.design_frontend.component.function_item.name')
                "
                :disabled="loading"
              />
            </a-form-model-item>
          </a-col>

          <a-col :md="10" class="text-center">
            <a-button
              html-type="submit"
              type="primary"
              title="Tìm kiếm"
              class="min-w-100"
              :disabled="loading"
            >
              <font-awesome-icon icon="search" class="mr-1" />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              title="Xoá điều kiện tìm kiếm"
              class="min-w-100"
              :disabled="loading"
              @click="reset"
            >
              <font-awesome-icon icon="eraser" class="mr-1" />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- Table function item -->
      <a-table
        bordered
        :data-source="data"
        :pagination="pagination"
        :columns="columns"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template slot="no" slot-scope="text, record">
          {{ record.item_num }}
        </template>
        <template slot="item_type" slot-scope="text, record">
          {{ record.mstItemType.name }}
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="addToReference(record)">Thêm</a>
        </template>
      </a-table>
      <!-- Table reference -->
      <a-table
        bordered
        :data-source="component_item_function"
        :pagination="false"
        :columns="columnsReference"
      >
        <template slot="no" slot-scope="text, record, indexReference">
          {{ indexReference + 1 }}
        </template>
        <template slot="function" slot-scope="text, record">
          {{ getFunctionName(record) }}
        </template>
        <template slot="name" slot-scope="text, record">
          {{ record.name ?? record.function_item.name }}
        </template>
        <template slot="action" slot-scope="text, record, indexReference">
          <a @click="removeReference(indexReference)">Xóa</a>
        </template>
      </a-table>
      <div class="text-center p-4">
        <a-button
          html-type="button"
          type="default"
          title="Cancel"
          class="min-w-100"
          :disabled="loading"
          @click="$emit('close')"
        >
          {{ $t('common.cancel') }}
        </a-button>
        <a-button
          html-type="submit"
          type="primary"
          title="Tìm kiếm"
          class="min-w-100"
          :disabled="loading"
          @click="$emit('save', component_item_function, index)"
        >
          {{ $t('common.ok') }}
        </a-button>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { SORT } from '~/constants'
import DataTable from '~/mixins/data-table'
export default {
  mixins: [DataTable],
  props: {
    functionItems: {
      type: [Array],
      default: () => []
    },
    categories: {
      type: [Array],
      default: () => []
    },
    index: {
      type: [Number],
      default: 0
    },
    version: {
      type: [Object],
      default: () => {}
    }
  },
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      if (
        this.filters.category_id === undefined ||
        this.filters.category_id === '' ||
        this.filters.function_id === undefined ||
        this.filters.function_id === ''
      ) {
        this.data = []
        return
      }
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.version_code = this.function.latest_version
      params.order_by = 'item_num'
      params.order_type = SORT.asc
      const {
        data: {
          result: { data, meta }
        }
      } = await this.repository.getListFunctionItem({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 10
      }
      const newData = data.map(item => {
        return { ...item, item_type: false }
      })
      this.data = newData
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  data() {
    return {
      resource: 'functionItem',
      filters: {
        category_id: +this.$route.query.category_id || '',
        function_id: +this.$route.query.function_id || '',
        item_name: this.$route.query.item_name || ''
      },
      functions: [],
      component_item_function: [],
      function: {}
    }
  },

  computed: {
    columns() {
      return [
        {
          title: 'STT',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: this.$t('module.design_frontend.component.item_type'),
          scopedSlots: { customRender: 'item_type' }
        },
        {
          title: 'Tên hạng mục',
          dataIndex: 'name'
        },
        {
          title: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    columnsReference() {
      return [
        {
          title: 'STT',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: 'Tên màn hình',
          scopedSlots: { customRender: 'function' }
        },
        {
          title: 'Tên hạng mục',
          scopedSlots: { customRender: 'name' },
          dataIndex: 'name'
        },
        {
          title: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  watch: {
    'filters.category_id'() {
      this.getFunctions()
    },
    'filters.function_id'() {
      this.getFunction()
    },
    index(val) {
      this.component_item_function = []
      if (this.index > 0) {
        this.component_item_function = this.functionItems[val - 1].component_item_function
      }
    },
    functionItems() {
      this.index = 0
    }
  },

  mounted() {
    this.component_item_function = this.functionItems[this.index - 1].component_item_function
  },

  methods: {
    async getFunction() {
      this.$store.dispatch('setLoading', true)
      try {
        if (this.filters.function_id) {
          const {
            data: {
              result: { data }
            }
          } = await this.$api.function.show(this.filters.function_id)
          this.function = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async getFunctions() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.filters.category_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            category_id: this.filters.category_id,
            // id: this.version.function_id,
            all: true
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.component.listSelectFunction({ params })
          this.functions = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    getFunctionName(record) {
      if (record.function) {
        return `[${record.function.code}] : ${record.function.name}`
      }
      return ''
    },

    addToReference(record) {
      this.component_item_function.push(record)
    },

    removeReference(index) {
      this.component_item_function.splice(index, 1)
    },

    /**
     * Clear form search
     */
    reset() {
      this.filters = {
        category_id: '',
        function_id: '',
        item_name: ''
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Search data
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    },

    open() {
      this.referenceVisible = true
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>
<style scoped lang="scss">
:deep() {
  .ant-form-item label {
    float: left !important;
  }
}
</style>
