<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          title="Tạo nhiều"
          :disabled="version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="confirm()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionTestCase.add_multi_testcase') }}
        </a-button>
        <a-button
          html-type="submit"
          type="primary"
          title="Tạo mới"
          class="min-w-100"
          :disabled="version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="createTestCase"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionTestCase.add_testcase') }}
        </a-button>
      </template>
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
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.item_pk')"
              prop="item_pk"
            >
              <a-select
                v-model="filters.item_pk"
                :placeholder="$t('module.mstItemProperty')"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in functionItem"
                  :key="index"
                  :value="item.item_pk"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.mst_item_property_id')"
              prop="mst_item_property_id"
            >
              <a-select
                v-model="filters.mst_item_property_id"
                :placeholder="$t('module.mstItemProperty')"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in mstItemProperty"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
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
      </a-form-model>
      <a-table
        ref="tabValidationTable"
        :columns="columns"
        :row-key="getRowKey"
        :data-source="functionTestCaseData"
        :pagination="false"
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
          slot="item_pk"
          slot-scope="text, record"
        >
          <div v-if="record.functionItem">
            {{ record.functionItem?.name }}
          </div>
        </template>
        <template
          slot="mst_item_property_id"
          slot-scope="text, record"
        >
          <div v-if="record.mstItemProperty">
            {{ record.mstItemProperty?.name }}
          </div>
        </template>

        <template
          slot="content_check"
          slot-scope="text, record"
        >
          <div v-if="record.id && version.testcase_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
            <EditCell :text="text" @change="onCellChange(record.id, 'content_check', $event)" />
          </div>
          <div v-else-if="record.id && (version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
            {{ record.content_check }}
          </div>
        </template>

        <template
          slot="expect_result"
          slot-scope="text, record"
        >
          <div v-if="record.id && version.testcase_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
            <EditCell :text="text" @change="onCellChange(record.id, 'expect_result', $event)" />
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
            v-if="!record.id"
            html-type="button"
            type="primary"
            size="small"
            title="Lưu"
            :disabled="loading"
            @click="saveNewValidation(record)"
          >
            <a-icon type="save" />
          </a-button>
          <a-button
            v-if="!record.id"
            html-type="button"
            type="danger"
            title="Xoá hàng"
            size="small"
            :disabled="loading"
            @click="deleteRow(record)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>

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
            v-if="version.testcase_lock_flg === LOCK_FLG_VALUE.no && record.use_flg === USE_FLG_VALUE.yes"
            html-type="button"
            type="danger"
            size="small"
            title="Dừng sử dụng"
            :disabled="loading || (version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)"
            @click="confirmToDelete(record.id)"
          >
            <a-icon type="stop" />
          </a-button>
          <a-button
            v-if="version.testcase_lock_flg === LOCK_FLG_VALUE.no && record.use_flg === USE_FLG_VALUE.no"
            html-type="button"
            type="primary"
            size="small"
            title="Sử dụng"
            :disabled="loading || version.testcase_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="useTestCase(record.id)"
          >
            <a-icon type="check-circle" />
          </a-button>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
    <a-modal
      ref="create"
      :visible="visible"
      :width="900"
      :footer="null"
      @cancel="visible = false"
    >
      <template slot="title">
        <font-awesome-icon icon="plus-circle" />
        {{ $t('common.create') }} {{ $t('module.functionTestCase') }}
      </template>

      <a-spin :spinning="loading">
        <TestCaseValidateForm
          :mst-item-property="mstItemProperty"
          :function-item="functionItem"
          :version="version"
          @save="save"
          @cancel="closeDialog(false)"
        />
      </a-spin>
    </a-modal>
  </div>
</template>
<script>

import TestCaseValidateForm from './TestCaseValidatorForm.vue'
import EditCell from './EditCell.vue'
import DataTable from '~/mixins/data-table'
import { LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'

export default {
  /**
     * Declare components.
     */
  components: {
    TestCaseValidateForm,
    EditCell
  },

  mixins: [
    DataTable
  ],
  fetch() {
    this.$store.dispatch('setLoading', true)

    try {
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    mstItemProperty: {
      type: [Array],
      default: () => []
    },
    functionItem: {
      type: [Array],
      default: () => []
    },
    functionTestCase: {
      type: [Array],
      default: () => []
    }
  },

  /**
     * Init data for component.
     */
  data() {
    return {
      visible: false,
      resource: 'functionTestCase',
      currentId: 0,
      defaultParams: {
        not_admin: 1
      },
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      filters: {
        item_pk: this.$route.query.item_pk || undefined,
        mst_item_property_id: this.$route.query.mst_item_property_id || undefined
      },
      functionTestCaseData: this.functionTestCase
    }
  },

  /**
     * Computed event.
     */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.functionTestCase.order'),
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          width: 100
        },
        {
          title: this.$t('module.functionTestCase.item_pk'),
          dataIndex: 'item_pk',
          scopedSlots: { customRender: 'item_pk' },
          width: 200
        },
        {
          title: this.$t('module.functionTestCase.mst_item_property_id'),
          dataIndex: 'mst_item_property_id',
          scopedSlots: { customRender: 'mst_item_property_id' },
          width: 180
        },
        {
          title: this.$t('module.functionTestCase.content_check'),
          dataIndex: 'content_check',
          scopedSlots: { customRender: 'content_check' }
        },
        {
          title: this.$t('module.functionTestCase.expect_result'),
          dataIndex: 'expect_result',
          scopedSlots: { customRender: 'expect_result' }
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
    functionTestCase: {
      immediate: true,
      handler(newVal) {
        this.updateFunctionTestCaseData(newVal)
      }
    }
  },

  /**
     * Mounted event.
     */
  mounted() {
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
     * Get list test case validation
     */
    updateFunctionTestCaseData(newVal) {
      this.functionTestCaseData = newVal.filter(record => record?.functionItem?.use_flg === USE_FLG_VALUE.yes && (
        record.mst_item_property_id !== null ||
    record.mst_testcase_validation_id !== null ||
    (record.mst_testcase_common_id === null && record.event_pk === null && record.logic_pk === null)))
      this.functionTestCaseData = this.functionTestCaseData.map((item, index) => {
        return { ...item, index: index + 1 }
      })
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        item_pk: undefined,
        mst_item_property_id: undefined
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      this.$emit('replaceQuery', this.filters)
    },

    /**
       * Filter in select box
       */
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
       * Update data
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
    confirm() {
      if (this.functionTestCaseData && this.functionTestCaseData.length > 0) {
        this.$confirm({
          title: this.$t('text.confirm_create_auto_test_case_validation'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.gotoCreateMultiTestcase()
        })
      } else {
        this.gotoCreateMultiTestcase()
      }
    },

    /**
       * Add multi testcase
       */
    async gotoCreateMultiTestcase() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          isValidator: true
        }
        const { data: { result: { data } } } = await this.repository.create(params)
        if (data !== null) {
          this.$emit('save')
          this.$notification.success({
            message: this.$t('text.successfully')
          })
        } else {
          this.$notification.info({
            message: this.$t('text.notification')
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

    closeDialog() {
      this.visible = false
    },
    save() {
      this.visible = false
      this.$emit('save')
    },

    /**
       * Set table class
       *
       * @param {array} record
       */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    /**
     * Copy Url
     */
    copyItem(recordId) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_test_cases_id', recordId)
      url.hash = 'test_case_validator'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    /**
       * Add Test case
       */
    createTestCase() {
      this.visible = true
    },

    /**
       * Confirm to delete
       *
       * @param {Number} id
       */
    confirmToDelete(id) {
      this.$confirm({
        title: this.$t('text.confirm_to_delete'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.deleteRecord(id)
      })
    },
    /**
       * Delete record
       *
       * @param {Number} id
       */
    async deleteRecord(id) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataSource = [...this.functionTestCaseData]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          data.use_flg = USE_FLG_VALUE.no

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
       * Delete record
       *
       * @param {Number} id
       */
    async useTestCase(id) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataSource = [...this.functionTestCaseData]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          data.use_flg = USE_FLG_VALUE.yes

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
  .editable-cell {
    position: relative;
  }

  :deep() {
    .ant-table-tbody {
      .disabled-row {
        background-color: rgba(217, 217, 217, 0.5);
        td {
          text-decoration: line-through;
        }
      }
    }
    .ant-form-item {
      margin-bottom: 10px;
    }
    .ant-form-explain {
      position: absolute;
    }
    .ant-form-item-children {
      position: relative;
    }
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
      padding-right: 24px;
    }

    .editable-cell-text-wrapper {
      padding: 5px 24px 5px 5px;
    }
    .editable-cell-text-wrapper {
      position: relative;
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
      position: absolute;
      top: 50%;
      transform: translateY(50%);
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
    .editable-cell {
      white-space: pre-line;
      .editable-cell-text-wrapper {
        margin-top: -19.5px;
      }
    }
  }
  .content {
    white-space: pre-line;
  }
  </style>
