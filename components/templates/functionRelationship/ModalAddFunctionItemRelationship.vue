<template>
  <a-modal
    :visible="open"
    :width="900"
    :dialog-style="{ top: '200px' }"
    :footer="null"
    :mask-closable="false"
    @cancel="close"
  >
    <a-card class="mb-4">
      <template slot="title">
        <span v-if="version.version_code && version.function.name">
          <span>{{ $store.state.project.name + ' / ' + $store.state.category.name }}</span>
          <span>{{
            ' / ' +
              '[' +
              version.function.code +
              ']' +
              ': ' +
              version.function.name
          }}</span>
          <span>{{ ' / ' + 'Version: ' + version.version_code }}</span>
        </span>
      </template>
      <div class="content">
        <a-spin :spinning="loadModal">
          <div class="container-fluid">
            <div v-if="functionItem.id" class="info-function-item pb-4">
              <p class="relationship-item">
                {{ $t('module.relationship.item_pk') }} : {{ functionItem.item_num + ' - ' + functionItem.name + ' (' + functionItem?.mstItemType.name + ')' }}
              </p>
              <p>Màn hình quan hệ: {{ functionData.code + ' - ' + functionData.name }}</p>
              <a-button
                type="primary"
                class="min-w-100"
                title="Tạo mới"
                :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
                @click="addRow(functionItem)"
              >
                <font-awesome-icon
                  icon="plus-circle"
                  class="mr-1"
                />
                {{ $t('common.new') }}
              </a-button>
            </div>
          </div>
          <table v-for="(relationshipItem, itemIndex) in getFilteredItems(functionItem.functionRelationshipItems, functionId, functionItem.item_pk)" :key="itemIndex">
            <tr class="sub-custom-table">
              <td class="sub-column-title">
                <a-select
                  v-model="relationshipItem.flg_related"
                  mode="single"
                >
                  <a-select-option
                    v-for="(val, index) in FLG_RELATED"
                    :key="index"
                    :value="val.value"
                  >
                    {{ val.label }}
                  </a-select-option>
                </a-select>
              </td>
              <td v-if="relationshipItem.flg_related === 1" class="sub-column-value">
                <a-select
                  v-model="relationshipItem.status"
                  mode="single"
                >
                  <a-select-option
                    v-for="(val, index) in STATUS_RELATIONSHIP"
                    :key="index"
                    :value="val.value"
                  >
                    {{ val.label }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-button
                  html-type="button"
                  type="danger"
                  title="Xoá"
                  class="min-w-100"
                  :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
                  @click="removeRow(functionItem, getFilteredItems(functionItem.functionRelationshipItems, functionId, functionItem.item_pk), itemIndex, relationshipItem)"
                >
                  {{ $t('common.delete') }}
                </a-button>
              </td>
            </tr>
            <tr v-if="relationshipItem.flg_related === 1" class="sub-custom-table">
              <td class="sub-column-title">
                <a-select
                  v-model="relationshipItem.item_pk"
                  :placeholder="$t('module.relationship.item_pk')"
                  mode="single"
                  show-search
                  :filter-option="filterOption"
                >
                  <a-select-option
                    v-for="item in versionFunctions.find(version => version.version_code === relationshipItem.version_code)?.function_items"
                    :key="item.id"
                    :value="item.item_pk"
                  >
                    {{ item.item_num }}: {{ item.name }} {{ '(' + item?.mst_item_type?.name + ')' }}
                  </a-select-option>
                </a-select>
              </td>
              <td class="sub-column-value">
                <a-select
                  v-model="relationshipItem.version_code"
                  :placeholder="$t('module.relationship.version_code')"
                  mode="single"
                  @change="handleChangeVersion(relationshipItem)"
                >
                  <a-select-option
                    v-for="val in versionFunctions"
                    :key="val.id"
                    :value="val.version_code"
                  >
                    {{ $t('module.relationship.version_code') }}: {{ val.version_code }}
                  </a-select-option>
                </a-select>
              </td>
            </tr>
            <tr v-if="relationshipItem.flg_related === 1" class="sub-custom-table">
              <td class="sub-column-value" colspan="2">
                <a-textarea
                  v-model="relationshipItem.relationship"
                  :placeholder="$t('Nhập quan hệ')"
                />
              </td>
            </tr>
          </table>
          <div class="text-center p-3">
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
              :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
              @click="saveAll(getFilteredItems(functionItem.functionRelationshipItems, functionId, functionItem.item_pk))"
            >
              {{ $t('common.submit_all') }}
            </a-button>
            <a-button
              html-type="button"
              type="default"
              title="Đóng"
              class="min-w-100"
              @click="close()"
            >
              {{ $t('common.close') }}
            </a-button>
          </div>
        </a-spin>
      </div>
    </a-card>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import { FLG_RELATED, STATUS_RELATIONSHIP, CATEGORY_QUESTION_VALUE, STATUS_RELATIONSHIP_VALUE, LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'
export default {
  data() {
    return {
      open: false,
      loadModal: false,
      FLG_RELATED,
      STATUS_RELATIONSHIP,
      CATEGORY_QUESTION_VALUE,
      STATUS_RELATIONSHIP_VALUE,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      functionItem: {},
      functionData: {},
      functionId: 0,
      versionFunctions: []
    }
  },
  props: {
    version: {
      type: [Object],
      default: () => {}
    }
  },

  computed: {
    formRules() {
      return {
      }
    }
  },

  mounted() {
  },

  methods: {
    async openModal(data, func) {
      this.functionItem = cloneDeep(data)
      this.functionId = func.function_id
      this.functionData = func.function
      await this.getListVersion(func.function_id)
      if (this.functionItem.functionRelationshipItems.length === 0) {
        await this.addRow(data)
      } else {
        const existingRecord = data.functionRelationshipItems.find(val => (val.function_id_target === func.function_id && val.function_id_source === data.function_id && val.item_pk_source === data.item_pk) ||
          (val.function_id_source === func.function_id && val.function_id_target === data.function_id && val.item_pk_target === data.item_pk))
        if (!existingRecord) {
          await this.addRow(data)
        }
      }

      this.open = true
      this.$emit('closeModal')
    },

    async getListVersion(functionId) {
      try {
        const params = {
          function_id: functionId
        }
        const { data: { result: { data } } } = await this.$api.versionFunction.getListVersion({ params })
        this.versionFunctions = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    close() {
      this.open = false
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    getFilteredItems(items, itemId, itemPk) {
      if (items && itemId && itemPk) {
        return items.filter(val => (val.function_id_target === itemId && itemPk === val.item_pk_source) || (val.function_id_source === itemId && itemPk === val.item_pk_target))
      }
    },

    /**
     * add row
     */
    addRow(record) {
      record.functionRelationshipItems.push({
        project_id: record.project_id,
        version_code_source: record.version_code,
        version_code: this.versionFunctions[0].version_code,
        function_id_source: record.function_id,
        function_id_target: this.functionId,
        relationship: '',
        item_pk_source: record.item_pk,
        item_pk: undefined,
        flg_related: 0,
        status: STATUS_RELATIONSHIP_VALUE.no_need_qa
      })
    },

    /**
     * Remove row
     */
    removeRow(record, item, itemIndex, relationshipItem) {
      if (relationshipItem.id) {
        this.confirmToDelete(relationshipItem.id)
      } else {
        const originalIndex = record.functionRelationshipItems.findIndex(
          item =>
            (item.project_id === relationshipItem.project_id &&
          item.version_code === relationshipItem.version_code &&
          item.function_id_source === relationshipItem.function_id_source &&
          item.function_id_target === relationshipItem.function_id_target &&
          item.item_pk_source === relationshipItem.item_pk_source && (item.item_pk_target === relationshipItem.item_pk_target || item.item_pk_target === undefined))
        )
        if (originalIndex !== -1) {
          record.functionRelationshipItems.splice(originalIndex, 1)
        }
      }
    },

    handleChangeVersion(relationshipItem) {
      relationshipItem.item_pk = undefined
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
        await this.$api.functionRelationshipItem.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('success')
        this.close()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * Create or update
     */
    async handleSubmit(record) {
      this.$store.dispatch('setLoading', true)

      try {
        if (record.id) {
          await this.$api.functionRelationshipItem.update(record.id, record)
        } else {
          await this.$api.functionRelationshipItem.create(record)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('success')
        this.close()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    async saveAll(record) {
      this.$store.dispatch('setLoading', true)

      try {
        await this.$api.functionRelationshipItem.createOrUpdateMulti(record)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('success')
        this.close()
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
:deep() {
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  .ant-col {
    margin-bottom: 5px;
  }
  .sub-custom-table {
    .sub-column-title {
      width: 45%;
    }
    .sub-column-value {
      width: 45%;
    }
  }
  table {
    width: 100%;
  }

  .ant-table table {
    border-top: none;
  }
  .info-function-item {
    font-weight: 500;
    display: flex;
    justify-content: space-between;
  }

  .save-data {
    cursor: pointer;
    color: #1890ff
  }
}
</style>
