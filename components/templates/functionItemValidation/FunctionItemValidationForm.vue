<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          title="Tạo tự động"
          :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="confirm()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionItemValidation.auto_create') }}
        </a-button>
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          title="Tạo mới"
          :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="handleAdd"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.functionItemValidation.create') }}
        </a-button>
      </template>
      <a-form-model
        ref="form"
      >
        <a-table
          ref="tabValidationTable"
          :columns="columns"
          :row-key="getRowKey"
          :data-source="functionItemValidationData"
          :pagination="false"
          :row-class-name="rowClassName"
          :loading="loading"
          :scroll="{ x: 1280 }"
          @change="handleTableChange"
        >
          <template
            slot="functionItem_name"
            slot-scope="text, record"
          >
            <div v-if="record.functionItem">
              {{ record.functionItem?.name }}
            </div>
            <a-form-model-item
              v-else
              :key="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.functionItem_name`"
              :prop="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.functionItem_name`"
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredFunctionName(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.functionItem') }),
                  trigger: ['change', 'blur'],
                }
              ]"
              class="mb-10"
            >
              <a-select
                v-model="record.item_pk"
                mode="single"
                :disabled="loading"
                :placeholder="$t('text.choose')"
                show-search
                :filter-option="filterOption"
                @change="handleItemNumChange(record)"
              >
                <a-select-option
                  v-for="item in functionItem"
                  :key="item.item_pk"
                >
                  {{ item.name }}
                </a-select-option>
                <font-awesome-icon
                  slot="prefix"
                  icon="map-marker-alt"
                  class="width-1x"
                  style="color:rgba(0,0,0,.25)"
                />
              </a-select>
            </a-form-model-item>
          </template>

          <template
            slot="content_check"
            slot-scope="text, record"
          >
            <div v-if="record.id && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
              <EditCellVue :text="text" @change="onCellChange(record.id, 'content_check', $event)" />
            </div>
            <div v-else-if="record.id && (version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
              {{ record.content_check }}
            </div>
            <a-form-model-item
              v-else
              :key="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.content_check`"
              :prop="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.content_check`"
              class="mb-10"
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredContentCheck(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.functionItemValidation.content_check') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-textarea
                v-model="record.content_check"
                :placeholder="$t('module.functionItemValidation.content_check')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="content_check_jp"
            slot-scope="text, record"
          >
            <div v-if="record.id && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
              <EditCellVue :text="text" @change="onCellChange(record.id, 'content_check_jp', $event)" />
            </div>
            <div v-else-if="record.id && (version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
              {{ record.content_check_jp }}
            </div>
            <a-form-model-item
              v-else
              :key="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.content_check_jp`"
              :prop="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.content_check_jp`"
              class="mb-10"
            >
              <a-textarea
                v-model="record.content_check_jp"
                :placeholder="$t('module.functionItemValidation.content_check_jp')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="expect_result"
            slot-scope="text, record"
          >
            <div v-if="record.id && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
              <EditCellVue :text="text" @change="onCellChange(record.id, 'expect_result', $event)" />
            </div>
            <div v-else-if="record.id && (version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
              {{ record.expect_result }}
            </div>
            <a-form-model-item
              v-else
              :key="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.expect_result`"
              :prop="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.expect_result`"
              class="mb-10"
              :rules="[
                {
                  validator: (rule, value, callback) => checkRequiredExpectResult(rule, value, callback, record),
                  message: $t('validation.required', { field: $t('module.functionItemValidation.expect_result') }),
                  trigger: ['change', 'blur'],
                }
              ]"
            >
              <a-textarea
                v-model="record.expect_result"
                :placeholder="$t('module.functionItemValidation.expect_result')"
              />
            </a-form-model-item>
          </template>

          <template
            slot="expect_result_jp"
            slot-scope="text, record"
          >
            <div v-if="record.id && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes">
              <EditCellVue :text="text" @change="onCellChange(record.id, 'expect_result_jp', $event)" />
            </div>
            <div v-else-if="record.id && (version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no)" class="content">
              {{ record.expect_result_jp }}
            </div>
            <a-form-model-item
              v-else
              :key="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.expect_result_jp`"
              :prop="`functionItemValidation.` + functionItemValidationData.indexOf(record) + `.expect_result_jp`"
              class="mb-10"
            >
              <a-textarea
                v-model="record.expect_result_jp"
                :placeholder="$t('module.functionItemValidation.expect_result_jp')"
              />
            </a-form-model-item>
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
              v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && record.use_flg === USE_FLG_VALUE.yes && version.function.use_flg === USE_FLG_VALUE.yes"
              html-type="button"
              type="danger"
              size="small"
              title="Dừng sử dụng"
              :disabled="loading"
              @click="confirmToDelete(record.id)"
            >
              <a-icon type="stop" />
            </a-button>
            <a-button
              v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && record.use_flg === USE_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
              html-type="button"
              type="primary"
              size="small"
              title="Sử dụng"
              :disabled="loading"
              @click="useValidation(record.id)"
            >
              <a-icon type="check-circle" />
            </a-button>
          </template>
        </a-table>
      </a-form-model>
      <!-- end main-table -->
    </a-card>
  </div>
</template>
<script>

import EditCellVue from './EditCell.vue'
import DataTable from '~/mixins/data-table'
import { LOCK_FLG_VALUE, SORT, USE_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    EditCellVue
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
    functionItem: {
      type: [Array],
      default: () => []
    },
    mstItemProperty: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionItemValidation',
      visible: false,
      currentId: 0,
      defaultParams: {
        not_admin: 1
      },
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      rowKeyCounter: 0,
      functionItemValidationData: [],
      selectedItemNum: false,
      item_pk: null,
      mst_item_property_id: undefined,
      content_check: '',
      content_check_jp: '',
      expect_result: '',
      expect_result_jp: '',
      validationRules: [],
      functionItemValidation: [],
      SORT
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: 'No',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' },
          customRender: (text, record, index) => ({
            children: [
              <span>{index + 1}</span>,
              record.id ? <a-icon type="link" onClick={() => this.copyItem(record.id)} /> : null
            ]
          }),
          width: 70
        },
        {
          title: this.$t('module.functionItem'),
          dataIndex: 'functionItem_name',
          scopedSlots: { customRender: 'functionItem_name' },
          width: 200
        },
        {
          title: this.$t('module.functionItemValidation.content_check'),
          dataIndex: 'content_check',
          scopedSlots: { customRender: 'content_check' }
        },
        {
          title: this.$t('module.functionItemValidation.content_check_jp'),
          dataIndex: 'content_check_jp',
          scopedSlots: { customRender: 'content_check_jp' }
        },
        {
          title: this.$t('module.functionItemValidation.expect_result'),
          dataIndex: 'expect_result',
          scopedSlots: { customRender: 'expect_result' }
        },
        {
          title: this.$t('module.functionItemValidation.expect_result_jp'),
          dataIndex: 'expect_result_jp',
          scopedSlots: { customRender: 'expect_result_jp' }
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },
    expectResultValidationRules() {
      return [
        {
          required: true,
          message: this.$t('validation.required', { field: this.$t('module.functionItemValidation.expect_result') }),
          trigger: ['change', 'blur']
        }
      ]
    }
  },

  watch: {
    functionItemValidation(newVal) {
      this.functionItemValidationData = newVal
    },
    functionItem(newVal) {
      this.functionItem = newVal
    }
  },

  created() {
    this.functionItemValidationData = this.functionItemValidation
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.getFunctionItemValidation()
  },

  updated() {
    const table = this.$refs.tabValidationTable.$el
    const tbody = table.querySelector('.ant-table-tbody')
    const item = tbody.querySelector(`[data-row-key="${this.$route.query.function_item_validation_id}"]`)
    if (item) {
      item.scrollIntoView()
    }
  },

  methods: {
    /**
    * Get function image validation
     *
     * @param {Number} id
     */
    async getFunctionItemValidation() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code,
          not_limit: true,
          order_by: 'item_pk',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.functionItemValidation.list({ params })
        this.functionItemValidation = data.map((item, index) => {
          return { ...item, index: index + 1 }
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * Validate required content check
     */
    checkRequiredContentCheck(rule, value, callback, item) {
      if (item.content_check === '') {
        this.$antdvalidate.checkRequired(rule, value, callback, item.content_check)
      } else {
        callback()
      }
    },
    /**
     * Validate required expect result
     */
    checkRequiredExpectResult(rule, value, callback, item) {
      if (item.expect_result === '') {
        this.$antdvalidate.checkRequired(rule, value, callback, item.expect_result)
      } else {
        callback()
      }
    },

    /**
     * Validate required function item
     */
    checkRequiredFunctionName(rule, value, callback, item) {
      if (item.item_pk === undefined) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.item_pk)
      } else {
        callback()
      }
    },

    /**
     * Validate required property
     */
    checkRequiredProperty(rule, value, callback, item) {
      if (item.mst_item_property_id === undefined) {
        this.$antdvalidate.checkRequired(rule, value, callback, item.mst_item_property_id)
      } else {
        callback()
      }
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        item_pk: this.item_pk,
        content_check: this.content_check,
        content_check_jp: this.content_check_jp,
        expect_result: this.expect_result,
        expect_result_jp: this.expect_result_jp
      }
      return model
    },

    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      this.model = data
    },
    /**
     * Handles the change of the 'item_pk' field in the record.
     */
    handleItemNumChange(record) {
      record.item_pk = record.item_pk || null
      this.selectedItemNum = Boolean(record.item_pk)
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
      const dataSource = [...this.functionItemValidationData]
      const target = dataSource.find(item => item.id === id)
      if (target) {
        // Kiểm tra xem giá trị mới có khác với giá trị cũ hay không
        if (target[dataIndex] !== value) {
          target[dataIndex] = value
          await this.repository.update(id, target)
          this.functionItemValidationData = dataSource
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
      if (this.functionItemValidationData && this.functionItemValidationData.length > 0) {
        this.$confirm({
          title: this.$t('text.confirm_create_auto_validation'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.gotoCreateAuto()
        })
      } else {
        this.gotoCreateAuto()
      }
    },

    /**
     * Add validation auto
     */
    async gotoCreateAuto() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          project_id: this.$store.state.project.id,
          function_id: this.version.function_id,
          version_code: this.version.version_code
        }
        const { data: { result: { data } } } = await this.repository.create(params)
        if (data !== null) {
          this.getFunctionItemValidation()
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

    /**
     * Add validation
     */
    async saveNewValidation(record) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.isRecordValid(record)) {
          record.project_id = this.$store.state.project.id
          record.function_id = this.version.function_id
          record.version_code = this.version.version_code
          record.use_flg = USE_FLG_VALUE.yes
          const { data: { result: { data } } } = await this.repository.create(record)
          const index = this.functionItemValidationData.indexOf(record)
          if (index > -1) {
            this.functionItemValidationData.splice(index, 1)
          }
          this.functionItemValidationData.unshift(data)
          await this.$emit('save')
          this.$notification.success({
            message: this.$t('text.successfully')
          })
        } else {
          this.$notification.error({
            message: this.$t('text.validate_data')
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
     * Check data insert
     */
    isRecordValid(data) {
      for (const key in data) {
        if (data[key] === null || data[key] === undefined || data[key] === '') {
          return false
        }
      }
      return true
    },

    /**
     * Set table class
     *
     * @param {array} record
     */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else if (record.functionItem && record.functionItem.use_flg === USE_FLG_VALUE.no) {
        return 'hide-row'
      } else {
        return null
      }
    },

    /**
     * Add row
     */
    handleAdd() {
      const newData = {
        item_pk: undefined,
        content_check: '',
        expect_result: ''
      }
      this.functionItemValidationData.unshift(newData)
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
        const dataSource = [...this.functionItemValidation]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          data.use_flg = USE_FLG_VALUE.no

          await this.repository.update(id, data)
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
    async useValidation(id) {
      this.$store.dispatch('setLoading', true)

      try {
        const dataSource = [...this.functionItemValidation]
        const data = dataSource.find(item => item.id === id)
        if (data) {
          data.use_flg = USE_FLG_VALUE.yes

          await this.repository.update(id, data)
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

    deleteRow(item) {
      const index = this.functionItemValidationData.indexOf(item)
      this.functionItemValidationData.splice(index, 1)
    },

    /**
     * Copy Url
     */
    copyItem(recordId) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_item_validation_id', recordId)
      url.hash = 'tab_validations'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
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
    .hide-row {
      display: none;
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
      margin-top: -18px;
    }
  }
}
.content {
  white-space: pre-line;
}

</style>
