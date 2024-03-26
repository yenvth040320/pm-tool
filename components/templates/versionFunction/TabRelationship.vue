<template>
  <div>
    <a-card class="mb-4 no-border">
      <template slot="extra">
        <a-button
          html-type="submit"
          type="primary"
          @click="toggleDiagram()"
        >
          <span v-if="showDiagram">{{ $t('Relationship Table') }}</span>
          <span v-else>{{ $t('Flowchart') }}</span>
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Thêm màn hình quan hệ"
          :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
          @click="gotoAddFunction()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('module.relationship.button_add') }}
        </a-button>
      </template>
      <div v-if="!showDiagram">
        <a-table
          :columns="columns"
          :row-key="getRowKey"
          :data-source="functionItemData"
          :loading="loading"
          bordered
          :pagination="false"
          :scroll="{ x: 900, y: 700 }"
          class="scroll-table"
          @change="handleTableChange"
        >
          <template
            slot="mst_item_type_id"
            slot-scope="text, record"
          >
            <span>
              {{ record?.mstItemType.name }}
            </span>
          </template>
          <template v-for="(item) in functionRelationships" :slot="'function_' + item.function_id" slot-scope="text, record">
            <div :key="item.function_id" class="table" @dblclick="addFunctionItemRelationship(record, item)">
              <table v-for="(relationshipItem, itemIndex) in getFilteredItems(record.functionRelationshipItems, item.function_id, record.item_pk)" v-show="relationshipItem.flg_related === 1" :key="itemIndex">
                <tr class="sub-custom-table">
                  <td class="sub-column-value">
                    <div
                      v-for="val in STATUS_RELATIONSHIP"
                      :key="val.value"
                    >
                      <div v-if="val.value === relationshipItem.status">
                        {{ $t('module.relationship.status') }}: {{ val.label }}
                      </div>
                    </div>
                  </td>
                  <td class="sub-column-value">
                    {{ $t('module.relationship.item_pk') }}: <b>{{ relationshipItem?.function_item?.name }}</b> / {{ $t('module.relationship.version_code') }}: {{ relationshipItem.version_code }}
                  </td>
                </tr>
                <tr class="sub-custom-table">
                  <td class="sub-column-value" colspan="2">
                    {{ $t('module.relationship.relationship') }}: {{ relationshipItem.relationship }}
                  </td>
                </tr>
              </table>

              <table>
                <tr>
                  <td colspan="2">
                    <span>
                      ID Q&A:
                    </span>
                    <span v-for="(question, index) in uniqueQuestionIds(record, item.function_id)" :key="index">
                      <span class="detail-question" @click="detailQA(question)">
                        {{ question }}
                      </span>
                      <span v-if="index < uniqueQuestionIds(record, item.function_id).length - 1">, </span>
                    </span>
                    <a-icon type="plus" @click="addQA(record, item.function)" />
                  </td>
                </tr>
              </table>
            </div>
          </template>
        </a-table>
      </div>
      <div v-else>
        <ModalFlowchart :version="version" :function-relationships="functionRelationships" />
      </div>
    </a-card>

    <QuestionForm :id="currentId" ref="modalAddQuestion" :version="version" :function-items="functionItems" @success="success" />
    <ModalDetailQuestion :id="idQuestion" ref="modalDetailQuestion" :version="version" :function-items="functionItems" @close="close" />
    <ModalAddFunctionRelationship ref="modalAddFunctionRelationship" :version="version" :function-items="functionItems" @save="save" />
    <ModalAddFunctionItemRelationship ref="modalAddFunctionItemRelationship" :version="version" @success="success" />
  </div>
</template>
<script>
import { FLG_RELATED, STATUS_RELATIONSHIP, CATEGORY_QUESTION_VALUE, STATUS_RELATIONSHIP_VALUE, LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'
import DataTable from '~/mixins/data-table'
import QuestionForm from '~/components/templates/question/QuestionForm.vue'
import ModalDetailQuestion from '~/components/templates/question/ModalDetailQuestion.vue'
import ModalAddFunctionRelationship from '~/components/templates/functionRelationship/ModalAddFunctionRelationship.vue'
import ModalAddFunctionItemRelationship from '~/components/templates/functionRelationship/ModalAddFunctionItemRelationship.vue'
import ModalFlowchart from '~/components/templates/functionRelationship/ModalFlowchart.vue'
export default {
  components: {
    QuestionForm,
    ModalDetailQuestion,
    ModalAddFunctionRelationship,
    ModalAddFunctionItemRelationship,
    ModalFlowchart
  },
  mixins: [DataTable],

  /**
   * Fetch event.
   */
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      /**
       * Call api and processing data.
       * Note: check API response format ResponseServiceProvider.php.
       */
      await console.log('fetch')
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
    functionItems: {
      type: [Array],
      default: () => []
    },
    mstType: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      FLG_RELATED,
      model: {},
      STATUS_RELATIONSHIP,
      STATUS_RELATIONSHIP_VALUE,
      functionItemData: [],
      CATEGORY_QUESTION_VALUE,
      currentId: 0,
      idQuestion: 0,
      checkSwitch: true,
      functionRelationships: [],
      shouldCallAddFunctionItemRelationship: true,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      showDiagram: false
    }
  },

  /**
   * Computed event.
   */
  computed: {
    additionalColumns() {
      return this.functionRelationships.map(column => ({
        title: column.function.code + ' - ' + column.function.name,
        dataIndex: column.function_id,
        width: 500,
        scopedSlots: { customRender: `function_${column.function_id}` }
      }))
    },
    columns() {
      const mergedColumns = [...this.header, ...this.additionalColumns]

      return mergedColumns
    },
    header() {
      return [
        {
          title: this.$t('No'),
          dataIndex: 'item_num',
          width: 60,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-item-num'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-item-num'
            }
          }
        },
        {
          title: this.$t('module.relationship.item_type'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' },
          width: 95,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-item-type'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-item-type'
            }
          }
        },
        {
          title: this.$t('module.relationship.item_name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150,
          customHeaderCell: () => {
            return {
              class: 'fixed__column-item-name'
            }
          },
          customCell: () => {
            return {
              class: 'fixed__column-item-name'
            }
          }
        }
      ]
    },

    innerTableColumns() {
      return this.headerInner.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    headerInner() {
      return [
        {
          title: this.$t('module.relationship.item_pk'),
          dataIndex: 'mst_item_type_id',
          scopedSlots: { customRender: 'mst_item_type_id' },
          width: 105
        },
        {
          title: this.$t('module.relationship.status'),
          dataIndex: 'item_num',
          width: 100
        },
        {
          title: this.$t('module.relationship.relationship'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150
        },
        {
          title: this.$t('module.relationship.id_qa'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 150
        }
      ]
    }
  },

  watch: {
    functionItems(newVal) {
      this.mergeArrays()
    }
  },
  created() {
  },

  async mounted() {
    await this.getListFunctionRelationships()
    this.mergeArrays()
  },

  methods: {
    uniqueQuestionIds(record, itemId) {
      if (record && itemId) {
        const uniqueIds = new Set()
        record.questions.forEach(question => uniqueIds.add(question.id))
        const data = this.getFilteredItems(record.functionRelationshipItems, itemId, record.item_pk)
        if (data.length > 0) {
          data.forEach(relationshipItem => {
            if (relationshipItem.question_sources) {
              relationshipItem.question_sources.forEach(questionSource => uniqueIds.add(questionSource.id))
            }
            if (relationshipItem.question_targets) {
              relationshipItem.question_targets.forEach(questionTarget => uniqueIds.add(questionTarget.id))
            }
          })
        }

        return Array.from(uniqueIds)
      }
    },
    getFilteredItems(items, itemId, itemPk) {
      return items.filter(val => (val.function_id_target === itemId && itemPk === val.item_pk_source) || (val.function_id_source === itemId && itemPk === val.item_pk_target))
    },

    async getListFunctionRelationships() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.all = true

        const { data: { result: { data } } } = await this.$api.functionRelationship.list({ params })
        const updatedData = data.map(item => {
          if (this.version.function_id === item.function_id_source) {
            return {
              ...item,
              function_id: item.function_id_target,
              function: item.functionTarget,
              is_source: true
            }
          } else if (this.version.function_id === item.function_id_target) {
            return {
              ...item,
              function_id: item.function_id_source,
              function: item.functionSource,
              is_target: true
            }
          }
          return null
        })
        this.functionRelationships = updatedData
          .filter(item => item !== null)
          .sort((a, b) => {
            const functionCodeA = a.function.code
            const functionCodeB = b.function.code

            if (functionCodeA < functionCodeB) {
              return -1
            }
            if (functionCodeA > functionCodeB) {
              return 1
            }
            return 0
          })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    mergeArrays() {
      this.functionItems.forEach(item => {
        item.functionRelationshipItemSource = item.functionRelationshipItemSource.map(val => {
          if (val.version_code_source === this.version.version_code && val.function_id_source === this.version.function_id) {
            return {
              ...val,
              item_pk: val.item_pk_target,
              function_item: val.function_item_target,
              version_code: val.version_code_target,
              is_source: true
            }
          }
        }).filter(Boolean)
        item.functionRelationshipItemTarget = item.functionRelationshipItemTarget.map(val => {
          if (val.version_code_target === this.version.version_code && val.function_id_target === this.version.function_id) {
            return {
              ...val,
              item_pk: val.item_pk_source,
              function_item: val.function_item_source,
              version_code: val.version_code_source,
              is_target: true
            }
          }
        }).filter(Boolean)
      })
      this.functionItemData = this.functionItems.map(item => {
        return {
          ...item,
          functionRelationshipItems: item.functionRelationshipItemSource.concat(item.functionRelationshipItemTarget)
        }
      })
    },

    async save() {
      await this.getListFunctionRelationships()
      this.mergeArrays()
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
     * Add question
     */
    addQA(record, func, id) {
      this.currentId = id
      this.shouldCallAddFunctionItemRelationship = false
      this.$refs.modalAddQuestion.open(record, func, CATEGORY_QUESTION_VALUE.relationships)
    },

    /**
     * Detail question
     */
    detailQA(question) {
      this.idQuestion = question
      this.shouldCallAddFunctionItemRelationship = false
      this.$refs.modalDetailQuestion.open()
    },

    close() {
      this.idQuestion = 0
      this.mergeArrays()
      this.$refs.modalDetailQuestion.close()
    },

    success() {
      this.$emit('save')
    },
    /**
     * Go to add function
     */
    gotoAddFunction() {
      this.$refs.modalAddFunctionRelationship.openModal(this.functionRelationships)
    },

    toggleDiagram() {
      this.showDiagram = !this.showDiagram
    },

    addFunctionItemRelationship(record, func) {
      if (this.shouldCallAddFunctionItemRelationship) {
        this.$refs.modalAddFunctionItemRelationship.openModal(record, func)
      } else {
        this.shouldCallAddFunctionItemRelationship = true
      }
    },

    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .action {
    .ant-btn-danger {
      height: 31.99px;
      padding: 0 10px;
    }
  }
  .ant-form-item:not(.default) {
    position: relative;
    .ant-form-explain {
      position: absolute;
    }
    .ant-form-item-children {
      position: relative;
    }
    .heading-text {
      font-weight: 700;
    }
  }

  .ant-table-row-cell-break-word {
    .table {
      padding: 0px;
    }
  }
}
.table {
  text-align: center;
  padding: 8px;
  margin: -16px;
  border-collapse: collapse;
  border: none;
  cursor: pointer;
}
.sub-custom-table {
  transition: background 0.3s;
  .sub-column-title {
    width: 45%;
  }
  .sub-column-value {
    width: 45%;
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
  }
}

.ant-table table {
  border-top: none;
}

.merge-row-table {
  height: 30% !important;
}
.save-data,
.detail-question {
  cursor: pointer;
  color: #1890ff
}
.scroll-table {
  max-width: 100%;
  overflow-x: auto;
}

:deep() {
  .fixed__column-item-num {
    position: sticky;
    left: 0;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-item-type {
    position: sticky;
    left: 60px;
    z-index: 999;
    background-color: white;
  }
  .fixed__column-item-name {
    position: sticky;
    left: 155px;
    z-index: 999;
    background-color: white;
  }
}
</style>
