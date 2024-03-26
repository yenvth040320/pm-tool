<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.modelFrontend') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          title="Tạo mới"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon icon="plus-circle" class="mr-1" />
          {{ $t('common.new') }}
        </a-button>
      </template>

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
              :label="$t('module.design_frontend.component.tree')"
              prop="source_code_id"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.design_frontend.component.tree')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="filters.source_code_id"
                mode="single"
                :placeholder="$t('module.design_frontend.component.tree')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="(item, index) in sourceCodes"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="12">
            <a-form-model-item
              :label="$t('module.design_frontend.component.branch')"
              prop="branch_id"
              :rules="{
                required: true,
                message: $t('validation.required', {
                  field: $t('module.design_frontend.component.branch')
                }),
                trigger: ['change', 'blur']
              }"
            >
              <a-select
                v-model="filters.branch_id"
                mode="single"
                :placeholder="$t('module.design_frontend.component.branch')"
                :disabled="loading"
                show-search
                :filter-option="filterOption"
                allow-clear
              >
                <a-select-option
                  v-for="(item, index) in branches"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="24" :md="12">
            <a-form-model-item
              :label="$t('module.modelFrontend.name')"
              prop="model_name"
            >
              <a-input
                v-model="filters.model_name"
                :placeholder="$t('module.modelFrontend.name')"
                :disabled="loading"
              />
            </a-form-model-item>
          </a-col>

          <a-col :md="24" class="text-center">
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
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :scroll="{ x: 400 }"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="no" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>

        <template slot="action" slot-scope="text, record">
          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Chỉnh sửa"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="danger"
            size="small"
            title="Xoá"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
  </div>
</template>

<script>
import { SORT, TYPE_SOURCE_CODE } from '~/constants'
import DataTable from '~/mixins/data-table'
export default {
  mixins: [DataTable],

  data() {
    return {
      resource: 'model',
      visible: false,
      currentId: 0,
      filters: {
        source_code_id: +this.$route.query.source_code_id || '',
        branch_id: +this.$route.query.branch_id || '',
        model_name: this.$route.query.model_name || ''
      },
      sourceCodes: [],
      branches: [],
      project_id: this.$store.state.project.id,
      TYPE_SOURCE_CODE
    }
  },

  computed: {
    header() {
      return [
        {
          title: 'STT',
          scopedSlots: { customRender: 'no' },
          width: 100
        },
        {
          title: this.$t('module.modelFrontend.name'),
          dataIndex: 'model_name'
        },
        {
          title: this.$t('module.design_frontend.component.tree'),
          dataIndex: 'sourceCode.name'
        },
        {
          title: this.$t('module.design_frontend.component.branch'),
          dataIndex: 'branch.name'
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    }
  },
  watch: {
    'filters.source_code_id'() {
      this.getBranches()
    }
  },
  mounted() {
    this.getSourceCodes()
  },
  methods: {
    async getSourceCodes() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          type_id: this.TYPE_SOURCE_CODE[0].value,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.sourceCode.list({ params })
        this.sourceCodes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    async getBranches() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.filters.source_code_id) {
          const params = {
            order_by: 'id',
            order_type: SORT.asc,
            project_id: this.project_id,
            source_code_id: this.filters.source_code_id,
            all: true
          }

          const {
            data: {
              result: { data }
            }
          } = await this.$api.branch.list({ params })
          this.branches = data
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .includes(input.toLowerCase()) === true
      )
    },

    /**
     * Clear form search
     */
    reset() {
      this.filters = {
        source_code_id: '',
        branch_id: '',
        model_name: ''
      }
    },

    /**
     * Search data
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
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
