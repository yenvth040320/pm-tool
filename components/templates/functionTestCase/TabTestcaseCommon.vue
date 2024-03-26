<template>
  <div>
    <div class="add-btn">
      <a-button
        html-type="button"
        type="primary"
        title="Tạo mới"
        :disabled="version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
        @click="addSingleTestcase()"
      >
        {{ $t('module.functionTestCase.add_new') }}
      </a-button>
    </div>
    <!--  End add btn  -->
    <a-form-model
      ref="form"
      :model="filters"
      :label-col="{ sm: 6 }"
      :wrapper-col="{ sm: 18 }"
      class="mb-4"
      @submit.prevent="search"
    >
      <a-row
        type="flex"
        :gutter="30"
      >
        <a-col
          :span="12"
        >
          <a-form-model-item
            :label="$t('module.functionTestCase.mst_category_testcase_common_id')"
            prop="item_pk"
          >
            <a-select
              v-model="filters.mst_category_testcase_common_id"
              :placeholder="$t('module.functionTestCase.mst_category_testcase_common_id')"
              show-search
              :disabled="loading"
              :filter-option="filterOption"
              @change="getListTestcaseCommon(filters.mst_category_testcase_common_id)"
            >
              <a-select-option
                v-for="(item, index) in listCategoryTestCaseCommon"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            :label="$t('module.functionTestCase.mst_testcase_common_id')"
            prop="item_pk"
          >
            <a-select
              v-model="filters.mst_testcase_common_id"
              :placeholder="$t('module.functionTestCase.mst_testcase_common_id')"
              show-search
              :disabled="loading"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, index) in listTestCaseCommon"
                :key="index"
                :value="item.id"
              >
                {{ item.format_content_check }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col
          :md="24"
          class="text-center"
        >
          <a-button
            html-type="submit"
            type="primary"
            title="Tìm kiếm"
            class="min-w-100"
          >
            <font-awesome-icon
              icon="search"
              class="mr-1"
            />
            {{ $t('common.search') }}
          </a-button>

          &nbsp;
          <a-button
            html-type="button"
            type="default"
            title="Xoá điều kiện tìm kiếm"
            class="min-w-100"
            @click="reset"
          >
            <font-awesome-icon
              icon="eraser"
              class="mr-1"
            />
            {{ $t('common.clear') }}
          </a-button>
        </a-col>
      </a-row>
      <a-table
        ref="tabValidationTable"
        class="main-table"
        :columns="columns"
        :data-source="functionTestCaseData"
        :pagination="false"
        :row-key="getRowKey"
        :row-class-name="rowClassName"
        :loading="loading"
        :scroll="{ x: 1280 }"
        @change="handleTableChange"
      >
        <template
          slot="index"
          slot-scope="text, record"
        >
          <a-icon v-if="record.id" type="link" @click="copyItem(record.id)" />
          {{ record.index }}
        </template>
        <template
          slot="content_check"
          slot-scope="text, record"
        >
          <div v-if="version.testcase_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
            <EditCell :text="record.content_check" @change="onCellChange(record.id, 'content_check', $event)" />
          </div>
          <div v-else-if="record.id && (version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
            {{ record.content_check }}
          </div>
        </template>

        <template
          slot="expect_result"
          slot-scope="text, record"
        >
          <div v-if="version.testcase_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
            <EditCell :text="record.expect_result" @change="onCellChange(record.id, 'expect_result', $event)" />
          </div>
          <div v-else-if="record.id && (version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
            {{ record.expect_result }}
          </div>
        </template>

        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Sao chép"
            :disabled="loading || version.testcase_lock_flg === LOCK_FLG_VALUE.yes || record.use_flg === USE_FLG_VALUE.no || version.function.use_flg === USE_FLG_VALUE.no"
            @click="gotoCopy(record.id)"
          >
            <font-awesome-icon icon="copy" />
          </a-button>
          <a-button
            v-if="record.use_flg === USE_FLG_VALUE.yes"
            html-type="button"
            type="danger"
            size="small"
            title="Dừng sử dụng"
            :disabled="loading || version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="confirmToDelete(record.id, USE_FLG_VALUE.no)"
          >
            <a-icon type="stop" />
          </a-button>
          <a-button
            v-if="record.use_flg === USE_FLG_VALUE.no"
            html-type="button"
            type="primary"
            size="small"
            title="Sử dụng"
            :disabled="loading || version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="confirmToDelete(record.id, USE_FLG_VALUE.yes)"
          >
            <a-icon type="check-circle" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
      <multi-add-testcase-modal
        ref="multiAddModal"
        :version-code="versionCode"
        :function-id="functionId"
        @saveCommonTestcase="saveCommonTestcase"
      />
      <single-add-testcase-modal
        ref="singleAddModal"
        :version-code="versionCode"
        :function-id="functionId"
        :function-test-case="functionTestCaseData"
        @saveTestcase="saveTestcase"
      />
    </a-form-model>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import EditCell from './EditCell.vue'
import MultiAddTestcaseModal from '~/components/templates/functionTestCase/MultiAddTestcaseModal'
import SingleAddTestcaseModal from '~/components/templates/functionTestCase/SingleAddTestcaseModal'
import { USE_FLG_VALUE, LOCK_FLG_VALUE } from '~/constants'
export default {
  components: {
    MultiAddTestcaseModal,
    EditCell,
    SingleAddTestcaseModal
  },

  props: {
    versionCode: {
      type: [Number, String],
      default: null
    },
    version: {
      type: [Object],
      default: () => {}
    },
    functionId: {
      type: [Number, String],
      default: null
    },
    functionTestCase: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      USE_FLG_VALUE,
      LOCK_FLG_VALUE,
      filters: {
        mst_testcase_common_id: this.$route.query.mst_testcase_common_id || undefined,
        mst_category_testcase_common_id: this.$route.query.mst_category_testcase_common_id || undefined
      },
      listTestCaseCommon: [],
      listCategoryTestCaseCommon: [],
      functionTestCaseData: this.functionTestCase
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    }),

    header() {
      return [
        {
          title: this.$t('module.functionTestCase.order'),
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 100
        },
        {
          title: this.$t('module.functionTestCase.content_check'),
          scopedSlots: { customRender: 'content_check' }
        },
        {
          title: this.$t('module.functionTestCase.expect_result'),
          scopedSlots: { customRender: 'expect_result' }
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },

    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    pagination: {
      showSizeChanger: true,
      showTotal: (total, range) => this.$t('pagination.total', { total }),
      buildOptionText: ({ value }) => this.$createElement('span', [value])
    }
  },
  watch: {
    functionTestCase: {
      immediate: true,
      handler(newVal) {
        this.updateFunctionTestCaseData(newVal)
      }
    }
  },

  mounted() {
    this.getListCategoryTestCaseCommon()
  },
  updated() {
    const table = this.$refs.tabValidationTable.$el
    const tbody = table.querySelector('.ant-table-tbody')
    const item = tbody.querySelector(`[data-row-key="${this.$route.query.function_test_cases_id}"]`)
    if (item) {
      item.scrollIntoView()
    }
  },
  methods: {
    /**
     * Get list test case common
     */
    updateFunctionTestCaseData(newVal) {
      this.functionTestCaseData = newVal.filter(record => record.mst_testcase_common_id !== null)
      this.functionTestCaseData = this.functionTestCaseData.map((item, index) => {
        return { ...item, index: index + 1 }
      })
    },
    async getListTestcaseCommon(categoryId) {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          mst_category_testcase_common_id: categoryId,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstTestCaseCommon.list({ params })
        this.listTestCaseCommon = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getListCategoryTestCaseCommon() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstCategoryTestCaseCommon.list({ params })
        this.listCategoryTestCaseCommon = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    handleTableChange(pagination, filters, sorter) {
      const query = {
        limit: pagination.pageSize,
        page: pagination.current,
        order_by: sorter.order ? sorter.field : null,
        order_type: sorter.order ? +(sorter.order === 'ascend') : null
      }
      this.replaceQuery(query)
    },

    search() {
      this.$emit('replaceQuery', this.filters)
    },

    reset() {
      this.filters = {
        mst_testcase_common_id: undefined,
        mst_category_testcase_common_id: undefined
      }
      this.search()
    },

    /**
     * Open modal add multi test case
     */
    addMultiTestcase() {
      this.$refs.multiAddModal.open()
    },

    addSingleTestcase() {
      this.$refs.singleAddModal.openModal()
    },

    /**
     * On save common testcase
     */
    saveCommonTestcase() {
      this.$refs.multiAddModal.close()
      this.$emit('save')
    },

    saveTestcase() {
      this.$refs.singleAddModal.close()
      this.$emit('save')
    },

    /**
     * custom css row
     */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    /**
     * Open modal confirm delete
     */
    confirmToDelete(id, use) {
      if (use === USE_FLG_VALUE.no) {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.deleteRecord(id, use)
        })
      } else {
        this.deleteRecord(id, use)
      }
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
       * Get row key
       */
    getRowKey(record, index) {
      if (record.key) {
        return record.key
      }
      if (record.id) {
        return record.id
      }
      return `temp-row-key-${index}`
    },

    /**
     * Delete record
     */
    async deleteRecord(id, use) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataSource = [...this.functionTestCaseData]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          data.use_flg = use

          await this.$api.functionTestCase.update(id, data)
          this.$notification.success({
            message: this.$t('text.successfully')
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Change column value
     */
    async onCellChange(id, dataIndex, value) {
      if (!value) {
        this.$notification.error({
          message: this.$t('text.validate_data')
        })
        return
      }
      const dataSource = [...this.functionTestCaseData]
      const target = dataSource.find(item => item.id === id)
      if (target) {
        if (target[dataIndex] !== value) {
          target[dataIndex] = value
          await this.$api.functionTestCase.update(id, target)
          this.functionTestCaseData = dataSource
          this.$notification.success({
            message: this.$t('text.successfully')
          })
        } else {
          this.$notification.info({
            message: this.$t('text.no_changes')
          })
        }
      }
    },

    /**
     * Copy Url
     */
    copyItem(recordId) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_test_cases_id', recordId)
      url.hash = 'test_case_common'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    /**
       * Copy record
       *
       * @param {Number} id
       */
    async gotoCopy(id) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataSource = [...this.functionTestCaseData]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          await this.$api.functionTestCase.create(data)
          this.$notification.success({
            message: this.$t('text.successfully')
          })
          this.$emit('save')
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
  display: flex;
  justify-content: end;
  button {
    margin-left: 5px;
  }
}
:deep() {
  .editable-cell {
      white-space: pre-line;
      .editable-cell-text-wrapper {
        margin-top: -19.5px;
      }
    }
  .ant-table-tbody {
    .disabled-row {
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }

  .main-table {
    margin-top: 20px;
    .ant-table-tbody > tr > td {
      padding: 16px 10px;
    }
  }
}
.border-required {
  border-color: #f5222d;
}
.title-required {
  display: flex;
  .required-custom {
    color: #f5222d;
    display: inline-block;
    font-size: 14px;
    margin-right: 4px;
  }
}
.content {
  white-space: pre-line;
}
</style>
