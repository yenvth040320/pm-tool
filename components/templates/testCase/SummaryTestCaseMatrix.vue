<template>
  <div>
    <a-spin :spinning="spin">
      <div class="pb-2 total-testcase">
        {{ $t('module.testcaseList.testcase_number') }}: {{ calculateTotalTestCase() }}
      </div>
      <div class="main-container">
        <a-table
          ref="dataTable"
          :columns="columns"
          :row-key="getRowKey"
          :data-source="dataTestcaseMatrix"
          :pagination="false"
          :components="customWrapper"
          :custom-row="customRow"
          :loading="loading"
          :scroll="{ x: 900 }"
        >
          <template slot="group_name" slot-scope="text, record">
            <div>
              {{ record?.testcaseGroup?.name }}
            </div>
          </template>
          <template slot="matrix_name" slot-scope="text, record, indexRecord">
            <div
              class="test-item"
              @click="showDetailMatrix(record.id, indexRecord)"
            >
              {{ record.functionItem ? '[' + record.functionItem.item_num + ']' + ' ' + record.name : record.name }}
            </div>
          </template>
          <template slot="number_case" slot-scope="text, record">
            <div>
              {{ getTotalTestCase(record.testcaseNumbers) }}
            </div>
          </template>
          <template
            slot="action"
            slot-scope="text, record, index"
          >
            <a-button
              html-type="button"
              type="primary"
              size="large"
              title="Chỉnh sửa"
              :disabled="loading"
              @click="showDetailMatrix(record.id, index)"
            >
              <font-awesome-icon icon="pencil-alt" />
            </a-button>
            <a-button
              v-if="record?.testcaseGroup?.group_type !== 0 || (record.id && record?.testcaseGroup?.group_type === 0)"
              html-type="button"
              type="danger"
              size="small"
              title="Xoá"
              @click="deleteMatix(record, index)"
            >
              <font-awesome-icon icon="trash-alt" />
            </a-button>
            <font-awesome-icon
              v-if="record?.testcaseGroup?.group_type === 3 || (record.id && record?.testcaseGroup?.group_type === 0)"
              icon="copy"
              title="Copy test case matrix"
              class="icon icon-copy"
              @click="copyMatrix(record, index)"
            />
            <font-awesome-icon
              v-if="isIconPaste"
              icon="paste"
              title="Paste test case matrix"
              class="icon icon-paste"
              @click="pasteMatrix(index)"
            />
          </template>
        </a-table>
      </div>
    </a-spin>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import DataTable from '~/mixins/data-table'
import { db, deleteDoc, doc, addDoc, updateDoc, collection, query, getDocs, onSnapshot, where } from '~/plugins/firebase'
import { OUTPUT_DETAIL_TYPE_VALUE } from '~/constants'
import DraggableTestCaseMatrix from '~/components/templates/testCase/DraggableTestCaseMatrix'
export default {
  components: {
  },

  provide() {
    return {
      data: {
        changePosition: this.changePosition
      },
      list: this
    }
  },

  mixins: [
    DataTable
  ],

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
    spin: {
      type: Boolean,
      default: false
    },
    testcaseMatrixs: {
      type: Array,
      default: () => []
    },

    index: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code,
      currentGroupType: null,
      displayedGroups: [],
      selectedMatrixIndex: -1,
      isIconPaste: false,
      OUTPUT_DETAIL_TYPE_VALUE,
      dataTestcaseMatrix: this.testcaseMatrixs,
      customWrapper: {
        body: {
          wrapper: DraggableTestCaseMatrix
        }
      }
    }
  },
  computed: {
    header() {
      return [
        {
          title: 'STT',
          width: 60,
          align: 'center',
          customRender: (text, record, index) => index + 1
        },
        {
          title: this.$t('module.test_case_matrix.group'),
          dataIndex: 'group_name',
          scopedSlots: { customRender: 'group_name' }
        },
        {
          title: this.$t('module.test_case_matrix.item'),
          dataIndex: 'matrix_name',
          scopedSlots: { customRender: 'matrix_name' }
        },
        {
          title: this.$t('module.test_case_matrix.number_case'),
          dataIndex: 'number_case',
          scopedSlots: { customRender: 'number_case' }
        },
        {
          title: this.$t('module.test_case_matrix.action'),
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 160
        }
      ]
    }
  },
  watch: {
    testcaseMatrixs: {
      immediate: true,
      handler(newVal) {
        this.dataTestcaseMatrix = newVal
      }
    }
  },
  created() {},
  mounted() {
    this.$store.dispatch('clearClipboardData')
    this.updateFirebase()
    this.checkCopyTestCaseProcess()
    this.scrollToIndex(this.index)
  },
  methods: {
    scrollToIndex(index) {
      if (index !== -1) {
        this.$nextTick(() => {
          const tableElement = this.$refs.dataTable.$el
          const rowElements = tableElement.querySelectorAll('.ant-table-row')
          rowElements.forEach((element, currentIndex) => {
            if (currentIndex === index) {
              element.classList.add('hover-effect')
            } else {
              element.classList.remove('hover-effect')
            }
          })

          if (rowElements && rowElements[index]) {
            const scrollToElement = rowElements[index]
            scrollToElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
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
     * Delete document firebase
     */
    async deleteRecordFromFirebase(id, collection) {
      try {
        this.isIconPaste = false
        const docRef = doc(db, collection, id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    /**
     * Custom row event of table column
     */
    customRow(record, index) {
      return {
        on: {
          dblclick: () => {
            this.showDetailMatrix(record.id, index)
          }
        }
      }
    },

    /**
     * Delete document firebase
     */
    async updateFirebase() {
      try {
        const q = query(
          collection(db, 'Testcase_matrix'),
          where('user_id', '==', this.$auth.user.id)
        )
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(data => {
          const docRef = doc(db, 'Testcase_matrix', data.id)
          updateDoc(docRef, { status: 0 })
        })
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    checkCopyTestCaseProcess() {
      const q = query(
        collection(db, 'Testcase_matrix'),
        where('user_id', '==', this.$auth.user.id)
      )
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              if (data) {
                if (data.user_id === this.$auth.user.id) {
                  if (data.status === 1) {
                    this.isIconPaste = true
                  } else {
                    this.isIconPaste = false
                    this.deleteRecordFromFirebase(doc.id, 'Testcase_matrix')
                  }
                }
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    async copyMatrix(matrix, index) {
      const propertiesToRemove = [
        'id',
        'testcase_matrix_pk',
        'functionItem'
      ]
      let allTestcaseNumbers = []
      this.dataTestcaseMatrix.forEach(record => {
        allTestcaseNumbers = allTestcaseNumbers.concat(record.testcaseNumbers)
      })

      let maxTestcaseNumberPk = Math.max(...allTestcaseNumbers.map(record => record.testcase_number_pk))

      const push = { ...matrix }
      push.item_pk = null
      propertiesToRemove.forEach(property => delete push[property])

      const modifiedTestcaseMatrixInputs = matrix.testcaseMatrixInputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_input_pk = null
        modifiedRecord.test_case_input_id = null
        modifiedRecord.testcase_matrix_pk = null
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_input

        return modifiedRecord
      })

      push.testcaseMatrixInputs = modifiedTestcaseMatrixInputs

      const modifiedTestcaseMatrixOutputs = matrix.testcaseMatrixOutputs.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_output_pk = null
        modifiedRecord.test_case_output_id = null
        modifiedRecord.testcase_matrix_pk = null
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.last_update_date
        delete modifiedRecord.testcase_output

        return modifiedRecord
      })

      push.testcaseMatrixOutputs = modifiedTestcaseMatrixOutputs

      const modifiedTestcaseNumbers = matrix.testcaseNumbers.map(record => {
        const modifiedRecord = cloneDeep(record)
        modifiedRecord.id = 0
        modifiedRecord.testcase_matrix_pk = null
        modifiedRecord.testcase_number_old_pk = modifiedRecord.testcase_number_pk
        modifiedRecord.testcase_number_pk = ++maxTestcaseNumberPk
        modifiedRecord.temporary_pk = modifiedRecord.testcase_number_pk
        delete modifiedRecord.created_at
        delete modifiedRecord.updated_at
        delete modifiedRecord.is_deleted
        delete modifiedRecord.testcase_input
        delete modifiedRecord.testcase_output

        return modifiedRecord
      })

      // Update testcase_number_pk in testcaseMatrixInputs based on testcase_number_old_pk
      push.testcaseMatrixInputs.forEach(input => {
        input.testcase_input_results.forEach(result => {
          const correspondingTestCase = modifiedTestcaseNumbers.find(testcase => testcase.testcase_number_old_pk === result.testcase_number_pk)
          if (correspondingTestCase) {
            result.testcase_number_pk = correspondingTestCase.testcase_number_pk
            result.testcase_number_temporary_pk = correspondingTestCase.testcase_number_pk
            result.testcase_matrix_pk = null
            result.test_case_input_id = null
          }
        })
      })

      // Update testcase_number_pk in testcaseMatrixOutputs based on testcase_number_old_pk
      push.testcaseMatrixOutputs.forEach(input => {
        input.testcase_output_results.forEach(result => {
          const correspondingTestCase = modifiedTestcaseNumbers.find(testcase => testcase.testcase_number_old_pk === result.testcase_number_pk)
          if (correspondingTestCase) {
            result.testcase_number_pk = correspondingTestCase.testcase_number_pk
            result.testcase_number_temporary_pk = correspondingTestCase.testcase_number_pk
            result.testcase_matrix_pk = null
            result.test_case_output_id = null
          }
        })
      })

      push.testcaseNumbers = modifiedTestcaseNumbers
      this.$store.dispatch('copyTestCaseMatrix', push)
      await addDoc(collection(db, 'Testcase_matrix'), {
        user_id: this.$auth.user.id,
        function_id: this.function_id,
        version_code: this.version_code,
        matrix_id: matrix.id,
        status: 1
      })
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    async pasteMatrix(index) {
      await this.$emit('copy', index)
      const q = query(
        collection(db, 'Testcase_matrix'),
        where('user_id', '==', this.$auth.user.id)
      )
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(data => {
        const docRef = doc(db, 'Testcase_matrix', data.id)
        updateDoc(docRef, { status: 0 })
      })
    },

    deleteMatix(matrix, index) {
      if (!matrix.id || matrix.id === 0) {
        this.dataTestcaseMatrix.splice(index, 1)
      } else {
        this.confirmToDelete(matrix.id)
      }
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
        onOk: () => this.deleteTestCaseMatrix(id)
      })
    },

    /**
       * Delete record
       *
       * @param {Number} id
       */
    async deleteTestCaseMatrix(id) {
      this.$emit('changeSpin', true)

      try {
        await this.$api.testcaseMatrix.delete(id)

        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('saveMatrixResult')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    },

    showDetailMatrix(id, index) {
      this.$emit('change-tab', id, index)
    },

    copy(record, index) {
      this.$emit('copy', record, index)
    },

    getTotalTestCase(testCaseNumbers) {
      if (testCaseNumbers) {
        return testCaseNumbers.length
      }

      return 0
    },

    calculateTotalTestCase() {
      let totalTestCase = 0

      this.dataTestcaseMatrix.forEach(record => {
        totalTestCase += this.getTotalTestCase(record.testcaseNumbers)
      })

      return totalTestCase
    },

    async changePosition(newData) {
      for (let i = 0; i < this.dataTestcaseMatrix.length; i++) {
        this.dataTestcaseMatrix[i].order = i + 1
      }
      this.$emit('changeSpin', true)

      try {
        let data = cloneDeep(this.dataTestcaseMatrix)
        data = data.filter(item => item.id && item.id !== null)
        data.forEach(item => {
          delete item.functionItem
          delete item.testcaseGroup
          delete item.testcaseMatrixInputs
          delete item.testcaseMatrixOutputs
          delete item.testcaseNumbers
          delete item.project
          delete item.function
        })
        await this.$api.testcaseMatrix.updateOrder(data)
        this.$emit('saveMatrixResult')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$emit('changeSpin', false)
      }
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ {
  .ant-tag {
    margin-right: 0px;
  }
  .ant-table-row {
    cursor: pointer;
  }
  .ant-table-tbody {
    .disabled-row {
      pointer-events: none;
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
  .icon {
    cursor: pointer;
    font-size: 20px;
  }
  .icon-plus {
    color: rgb(34, 182, 227);
  }
  .icon-minus {
    color: red;
  }
  .icon-copy {
    color: #8C4EED;
  }

  .hover-effect {
    background-color: #effafa;
  }

  .icon-paste {
    color: #197c19;
  }
  .total-testcase {
    font-size: 16px;
    font-weight: 700;
    float: right;
  }
}
.test-item {
  color: $primary-color;
  cursor: pointer;
}
</style>
