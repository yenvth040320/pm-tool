<template>
  <div>
    <div class="pb-4 container">
      <div>
        <a-button
          v-if="isHasPermision"
          html-type="button"
          type="primary"
          :disabled="isUserEstimate"
          @click="gotoStart()"
        >
          {{ $t('module.requirement.estimate.start') }}
        </a-button>
        <a-button
          v-else
          html-type="button"
          type="primary"
          :disabled="startEstimate[dataFunction.function_id] === true"
          @click="gotoStart()"
        >
          {{ $t('module.requirement.estimate.start') }}
        </a-button>

        <a-button
          v-if="isUserEstimate"
          html-type="submit"
          type="primary"
          class="min-w-100"
          @click="handleSubmit()"
        >
          {{ $t('common.submit') }}
        </a-button>
        <a-button
          v-if="isUserEstimate"
          html-type="button"
          type="default"
          title="Huỷ bỏ"
          class="min-w-100"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
        <span v-if="!isUserEstimate && startEstimate[dataFunction.function_id] === true && !isHasPermision">{{ $t('module.requirement.text_message') }}</span>
      </div>

      <div>
        <span class="text-total-point">
          {{ $t('module.requirement.estimate.total_point') }}: {{ totalEtTime }}
        </span>
        <div v-if="userEstimate !== null">
          {{ $t('module.requirement.estimate.user') }}: {{ userEstimate }}
        </div>
      </div>
    </div>
    <a-form-model
      ref="form"
    >
      <a-table
        :columns="columns"
        :row-key="getRowKey"
        :data-source="dataMst"
        :loading="loading"
        bordered
        :pagination="false"
        :expanded-row-keys.sync="expandedRowKeys"
      >
        <template slot="name" slot-scope="text, record">
          <a-input
            v-if="record.mst_life_cycle_id && isUserEstimate && record.task && record.task.status === TASK_STATUS_VALUE.new &&
              ((record.approve_status === APPROVE_STATUS_VALUE.not_approve) || isHasPermision)"
            v-model="record.title"
            class="title-task"
          />
          <a-input v-else-if="record.mst_life_cycle_id && isUserEstimate && !record.task" v-model="record.title" class="title-task" />
          <a v-else-if="record.mst_life_cycle_id" target="_blank" :href="`/task/detail/${record?.task?.id}`">
            {{ record.title }}
          </a>
          <span v-else>
            {{ record.name }}
          </span>
        </template>

        <template slot="et_time" slot-scope="text, record">
          <div class="container-fluid">
            <a-form-model-item
              v-if="record.mst_life_cycle_id && isUserEstimate && record.task && record.task.status === TASK_STATUS_VALUE.new && ((record.approve_status === APPROVE_STATUS_VALUE.not_approve) || isHasPermision)"
              :key="`listTask.` + getRowKey + `.et_time`"
              :prop="`listTask.` + getRowKey + `.et_time`"
              :rules="{
                validator: (rule, value, callback) => checkRequiredEtTime(rule, value, callback, record),
                message: $t('module.requirement.estimate.et_point_exceed'),
                trigger: ['change', 'blur'],
              }"
            >
              <a-input-number v-model="record.et_time" :step="0.01" @keypress.native="preventAlphabetCharacterInput($event)" />
            </a-form-model-item>
            <a-form-model-item
              v-else-if="record.mst_life_cycle_id && isUserEstimate && !record.task"
              :key="`listTask.` + getRowKey + `.et_time`"
              :prop="`listTask.` + getRowKey + `.et_time`"
              :rules="{
                validator: (rule, value, callback) => checkRequiredEtTime(rule, value, callback, record),
                message: $t('module.requirement.estimate.et_point_exceed'),
                trigger: ['change', 'blur'],
              }"
            >
              <a-input-number v-model="record.et_time" :step="0.01" @keypress.native="preventAlphabetCharacterInput($event)" />
            </a-form-model-item>
            <span v-else>
              {{ record.et_time }}
            </span>
            <span v-if="!record.mst_life_cycle_id">
              <span class="text-total-point">
                {{ totalEtTimeLifeCycle(record) }}
              </span>
            </span>
          </div>
        </template>

        <template slot="note" slot-scope="text, record">
          <div v-if="record.mst_life_cycle_id && isUserEstimate && record.task && record.task.status === TASK_STATUS_VALUE.new && ((record.approve_status === APPROVE_STATUS_VALUE.not_approve) || isHasPermision)">
            <ckeditor
              v-model="record.note"
              :editor="editor"
              :config="editorConfig"
              @ready="onReady"
            />
          </div>
          <div v-else-if="record.mst_life_cycle_id && isUserEstimate && !record.id">
            <ckeditor
              v-model="record.note"
              :editor="editor"
              :config="editorConfig"
              @ready="onReady"
            />
          </div>
          <span v-else v-html="record.note" />
        </template>

        <template slot="approve_status" slot-scope="text, record">
          <div class="status-estimate">
            <span v-for="(status, indexStatus) in APPROVE_STATUS_ESTIMATE" :key="indexStatus" class="pb-3">
              <span v-if="status.value === record.approve_status">
                <a-tag :color="getStatusColorClass(record)">
                  {{ status.label }}
                </a-tag>
              </span>
            </span>
            <a-button
              v-if="record.mst_life_cycle_id && isHasPermision && record.approve_status === APPROVE_STATUS_VALUE.not_approve && record.id"
              html-type="button"
              type="primary"
              @click="gotoApprove(record)"
            >
              {{ $t('module.requirement.estimate.approve') }}
            </a-button>
            <br />
            <p v-if="record.mst_life_cycle_id && record.approve_status === APPROVE_STATUS_VALUE.approved">
              {{ record?.approveUser?.name }}
            </p>
          </div>
        </template>

        <template slot="action" slot-scope="text, record">
          <a-icon
            v-if="!record.mst_life_cycle_id && isUserEstimate"
            type="plus"
            class="icon icon-plus"
            @click="addRowChildren(record)"
          />
          <a-icon
            v-if="record.mst_life_cycle_id && isUserEstimate"
            type="plus"
            class="icon icon-plus"
            @click="addRow(record)"
          />
          <a-icon
            v-if="record.mst_life_cycle_id && isUserEstimate && record.task && record.task.status === TASK_STATUS_VALUE.new && ((record.approve_status === APPROVE_STATUS_VALUE.not_approve) || isHasPermision)"
            type="minus"
            class="icon icon-minus"
            @click="removeRow(record)"
          />
          <a-icon
            v-else-if="record.mst_life_cycle_id && isUserEstimate && !record.task"
            type="minus"
            class="icon icon-minus"
            @click="removeRow(record)"
          />
        </template>
      </a-table>
      <div v-if="isUserEstimate" class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
          @click="handleSubmit()"
        >
          {{ $t('common.submit') }}
        </a-button>
      &nbsp;
        <a-button
          html-type="button"
          type="default"
          title="Huỷ bỏ"
          class="min-w-100"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DataTable from '~/mixins/data-table'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ja'
import uploadPlugin from '~/plugins/ck-editor/upload-plugin'
import { db, deleteDoc, doc, addDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from '~/plugins/firebase'
import { MST_LIFECYCLE_TYPE_VALUE, TASK_TYPE_VALUE, APPROVE_STATUS_ESTIMATE, APPROVE_STATUS_VALUE, TASK_STATUS_VALUE, SORT, CKEDITOR_TOOLBAR_SETTING, API_ROOT_URL } from '~/constants'

export function uploadFn(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)
    const imageUrl = this.$nuxt.$store.$api.requirement.uploadImageContent(formData, {
      headers: {
        'Content-type': 'multipart/form-data'
      }
    }).then(data => {
      return data.data
    })

    return imageUrl
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  components: {
  },
  /**
   * Declare mixins.
   */
  mixins: [DataTable],
  /**
   * Fetch event.
   */
  async fetch() {
    try {
      await console.log('fetch')
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    }
  },

  props: {
    dataFunction: {
      type: [Object],
      default: () => {}
    },
    isHasPermision: {
      type: [Boolean],
      default: false
    }
  },

  data() {
    return {
      dataMst: [],
      mstLifeCycles: this.dataFunction.mstLifeCycles,
      expandedRowKeys: [],
      MST_LIFECYCLE_TYPE_VALUE,
      TASK_TYPE_VALUE,
      APPROVE_STATUS_ESTIMATE,
      APPROVE_STATUS_VALUE,
      TASK_STATUS_VALUE,
      startEstimate: {},
      userEstimate: null,
      isUserEstimate: false,
      SORT,
      etDeleteIds: [],
      editor: DecoupledEditor,
      API_ROOT_URL,
      editorConfig: {
        extraPlugins: [editor => uploadPlugin(editor, uploadFn.bind(self))],
        language: 'vi',
        toolbar: CKEDITOR_TOOLBAR_SETTING
      }
    }
  },
  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.task.title'),
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('module.task.et_point'),
          dataIndex: 'et_time',
          scopedSlots: { customRender: 'et_time' },
          align: 'center',
          width: 80
        },
        {
          title: this.$t('module.requirement.estimate.note_task'),
          scopedSlots: { customRender: 'note' }
        },
        {
          title: this.$t('module.requirement.estimate.approve_status'),
          dataIndex: 'approve_status',
          scopedSlots: { customRender: 'approve_status' },
          width: 180
        },
        {
          scopedSlots: { customRender: 'action' },
          width: 50
        }
      ]
    },

    totalEtTime() {
      let total = 0

      this.dataMst.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            if (child.et_time) {
              total += parseFloat(child.et_time)
            }
          })
        }
      })

      return total.toFixed(2)
    }
  },

  watch: {
    dataFunction(val) {
      this.mstLifeCycles = val.mstLifeCycles
      this.getMstLifeCycles()
    }
  },
  created() {
  },

  mounted() {
    this.checkProcessEstimate()
    this.getMstLifeCycles()
  },

  methods: {
    /**
     * List MstLifeCycle
     */
    getMstLifeCycles() {
      try {
        if (this.dataFunction && this.dataFunction.mstLifeCycles) {
          this.mstLifeCycles = [...this.dataFunction.mstLifeCycles]
          if (!this.isUserEstimate) {
            this.selectMstLifeCycles()
          } else {
            this.dataMst = this.mstLifeCycles
            if (Array.isArray(this.dataMst)) {
              this.expandedRowKeys = this.dataMst.map(record => record.id)
              this.dataMst.forEach(rootNode => {
                this.replaceNullNoteWithEmpty(rootNode)
              })
            }
          }
        }
      } catch (error) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    replaceNullNoteWithEmpty(node) {
      if (node && node.children && node.children.length > 0) {
        node.children.forEach(child => {
          if (child.note === null) {
            child.note = ''
          }
        })
      }
    },

    onReady(editor) {
      // Note: Using DecoupledEditor then Insert the toolbar by manual before the editable area.
      setTimeout(() => {
        editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
        )
      }, 100)
    },

    selectMstLifeCycles() {
      if (this.mstLifeCycles.length > 0) {
        this.dataMst = this.mstLifeCycles.filter(item => item.children && item.children.length > 0)
        this.dataMst.forEach(rootNode => {
          this.replaceNullNoteWithEmpty(rootNode)
        })
        this.expandedRowKeys = this.dataMst.map(record => record.id)
      }
    },

    /**
     * Go to start update
     */
    async gotoStart() {
      if (this.isHasPermision) {
        this.deleteDocWhenHijacking()
      }
      this.expandedRowKeys = this.dataMst.map(record => record.id)
      this.startEstimate = { ...this.startEstimate, [this.dataFunction.function_id]: true }
      await addDoc(collection(db, 'Process_estimate', String(this.dataFunction.requirement_id), 'functions'), {
        user_id: this.$auth.user.id,
        user_name: this.$auth.user.name,
        requirement_id: this.dataFunction.requirement_id,
        function_id: this.dataFunction.function_id,
        version_code: this.dataFunction.version_code,
        status: 0
      })
    },

    /**
     *Check process estimate
    */
    checkProcessEstimate() {
      const groupRef = doc(db, 'Process_estimate', String(this.dataFunction.requirement_id))
      const functionsCollectionRef = collection(groupRef, 'functions')
      const q = query(functionsCollectionRef, where('version_code', '==', this.dataFunction.version_code), where('function_id', '==', this.dataFunction.function_id))
      try {
        onSnapshot(q, querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.exists()) {
              const data = doc.data()
              if (data) {
                this.userEstimate = data.user_name
                if (data.user_id === this.$auth.user.id) {
                  this.isUserEstimate = true
                } else {
                  this.isUserEstimate = false
                }
                if (data.status === 0) {
                  this.startEstimate = { ...this.startEstimate, [this.dataFunction.function_id]: true }
                } else {
                  this.startEstimate = { ...this.startEstimate, [this.dataFunction.function_id]: false }
                  this.deleteRecordFromFirebase(doc.id, 'Process_estimate')
                }
                this.getMstLifeCycles()
              }
            }
          })
        })
      } catch (error) {
        console.error('Error getting documents:', error)
        throw error
      }
    },

    /**
     *Cancel update
    */
    async cancel() {
      this.etDeleteIds = []
      const groupRef = doc(db, 'Process_estimate', String(this.dataFunction.requirement_id))
      const functionsCollectionRef = collection(groupRef, 'functions')
      const q = query(functionsCollectionRef, where('version_code', '==', this.dataFunction.version_code), where('function_id', '==', this.dataFunction.function_id))
      const querySnapshot = await getDocs(q)

      await querySnapshot.forEach(data => {
        const docRef = doc(db, 'Process_estimate', String(this.dataFunction.requirement_id), 'functions', data.id)
        updateDoc(docRef, { status: 1 })
      })
      // this.selectMstLifeCycles()
    },

    /**
     * Delete document firebase
     */
    async deleteDocWhenHijacking() {
      const groupRef = doc(db, 'Process_estimate', String(this.dataFunction.requirement_id))
      const functionsCollectionRef = collection(groupRef, 'functions')
      const q = query(functionsCollectionRef, where('version_code', '==', this.dataFunction.version_code), where('function_id', '==', this.dataFunction.function_id))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(data => {
        const docRef = doc(db, 'Process_estimate', String(this.dataFunction.requirement_id), 'functions', data.id)
        deleteDoc(docRef)
      })
    },

    /**
     * Delete document firebase
     */
    async deleteRecordFromFirebase(id, collection) {
      try {
        this.isUserEstimate = false
        this.userEstimate = null
        const docRef = doc(db, collection, String(this.dataFunction.requirement_id), 'functions', id)
        await deleteDoc(docRef)
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    },

    addRowChildren(record) {
      const data = {
        project_id: this.$store.state.project.id,
        task_type: TASK_TYPE_VALUE.project,
        function_id: this.dataFunction.function_id,
        version_code: this.dataFunction.version_code,
        mst_life_cycle_id: record.id,
        requirement_id: this.dataFunction.requirement_id,
        title: record.name,
        note: '',
        et_time: 0,
        approve_status: 0
      }
      record.children.push(data)
    },

    /**
     * Add row
     */
    addRow(record) {
      const parentRecord = this.dataMst.find(item => item.id === record.mst_life_cycle_id)
      const data = {
        project_id: this.$store.state.project.id,
        task_type: TASK_TYPE_VALUE.project,
        function_id: this.dataFunction.function_id,
        version_code: this.dataFunction.version_code,
        mst_life_cycle_id: parentRecord.id,
        requirement_id: this.dataFunction.requirement_id,
        title: parentRecord.name,
        note: '',
        et_time: 0,
        approve_status: 0
      }
      parentRecord.children.push(data)
    },

    /**
     * Remove row
     */
    removeRow(record) {
      const parentRecord = this.dataMst.find(item => item.id === record.mst_life_cycle_id)
      const index = parentRecord.children.indexOf(record)
      if (index !== -1) {
        parentRecord.children.splice(index, 1)

        const idExists = this.etDeleteIds.includes(record.task_id)

        if (!idExists) {
          if (record.task_id) {
            this.etDeleteIds.push(record.task_id)
          }
          this.etDeleteIds = this.etDeleteIds.filter(item => item !== undefined)
        }
      }
    },

    /**
     * Check remove row
     */
    checkRemoveRow(record) {
      const parentRecord = this.dataMst.find(item => item.id === record.mst_life_cycle_id)
      if (parentRecord.children.length > 1) {
        return true
      }
      return false
    },

    /**
     * Validate required function item
     */
    checkRequiredEtTime(rule, value, callback, item) {
      if (item.et_time <= 0 || item.et_time > 4) {
        callback(new Error('Et_time cannot be 0.'))
      } else {
        callback()
      }
    },

    /**
     * Get row key
     */
    getRowKey(record, index) {
      if (record.id) {
        if (record.mst_life_cycle_id) {
          return 'T.' + record.id
        } else {
          return record.id
        }
      }
      return 'mst-' + record.mst_life_cycle_id + `temp-row-key-${index}`
    },

    /**
     * Validate number
     */
    preventAlphabetCharacterInput(event) {
      const code = event.which ? event.which : event.keyCode
      if (
        (code >= 48 && code <= 57) || // 0 -> 9
          code === 8 || //  Backspace
          code === 46 || //  (.)
          code === 45 || //  (-)
          (code >= 37 && code <= 40) // arrow keys
      ) {
        return
      }
      event.preventDefault()
    },

    /**
     * get color
     */
    getStatusColorClass(record) {
      const notApprove = record.approve_status === APPROVE_STATUS_VALUE.not_approve
      if (notApprove) {
        return '#f50'
      }

      return '#108ee9'
    },

    /**
     * Approve estimate
     */
    async gotoApprove(record) {
      try {
        if (record.id) {
          const data = { ...record }
          data.approve_status = APPROVE_STATUS_VALUE.approved
          data.approve_user_id = this.$auth.user.id
          await this.$api.requirementEstimate.update(record.id, data)
        }
        this.cancel()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getMstLifeCycles()
        this.$emit('success')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Validate before submit
     */
    async handleSubmit() {
      try {
        let hasInvalidChild = false

        for (const item of this.dataMst) {
          if (item.children) {
            hasInvalidChild = item.children.some(child => {
              return child.et_time === 0 || child.title.trim() === ''
            })

            if (hasInvalidChild) {
              break
            }
          }
        }

        if (hasInvalidChild) {
          this.$notification.error({
            message: this.$t('module.requirement.estimate.invalid_record')
          })
          return
        }
        const params = {
          requirement_id: this.dataFunction.requirement_id,
          function_id: this.dataFunction.function_id,
          version_code: this.dataFunction.version_code,
          deleteIds: this.etDeleteIds,
          dataMst: this.dataMst
        }
        await this.$api.requirementEstimate.createOrUpdateEstimate(params)
        this.cancel()
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.etDeleteIds = []
        await this.$emit('save')
        this.$bus.$emit('callListSchedule')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    totalEtTimeLifeCycle(record) {
      if (record.children && record.children.length > 0) {
        let total = 0

        record.children.forEach(child => {
          if (child.et_time) {
            total += parseFloat(child.et_time)
          }
        })

        return total.toFixed(2)
      }

      return 0
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ck-editor .ck-toolbar {
    z-index: 9999;
  }
  .ck-toolbar {
    max-width: 800px;
  }
  .ck-editor__editable {
    min-height: 100px;
  }
  .ck.ck-editor__editable_inline {
    border: 1px solid var(--ck-color-toolbar-border);
  }
  .ant-table-row-expand-icon {
    display: none;
  }
  .ant-checkbox-wrapper-disabled {
    display: none;
  }
  .ant-tag {
    margin-bottom: 2px;
  }
  .anticon {
    font-size: 18px;
  }
  .custom-action-col {
    border-right: none !important;
    border-bottom: none !important;
  }
  .custom-action-col-header {
    background: #fff !important;
    border-right: none !important;
    border-bottom: none !important;
    border-top: none !important;
  }
}
.open_btn {
  margin-left: 10px;
}
.title {
  font-weight: 700;
}
.title-task {
  width: 80%;
}
.container-fluid {
  position: relative;
  .ant-form-item {
    margin-bottom: 0px;
  }
}
.error {
  color: red;
  font-style: italic;
  font-size: 12px;
  position: absolute;
  top: 31px;
  left: 0;
}
.container {
  display: flex;
  justify-content: space-between;
}
.text-total-point {
  font-weight: 700;
}
</style>
