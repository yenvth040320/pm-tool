<template>
  <a-form-model
    ref="form"
    layout="vertical"
    hide-required-mark
    :model="model"
    :rules="formRules"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionItem')"
              prop="item_pk"
            >
              <a-select
                v-if="model.id"
                v-model="model.item_pk"
                allow-clear
                :placeholder="$t('module.functionItem')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(item, index) in functionItems"
                  :key="index"
                  :value="item.item_pk"
                >
                  {{ item.item_num }}: {{ item.name }}
                </a-select-option>
              </a-select>
              <a-select
                v-else
                v-model="model.item_pk"
                allow-clear
                :placeholder="$t('module.functionItem')"
                show-search
                :filter-option="filterOption"
                show-arrow
                mode="multiple"
              >
                <a-select-option
                  v-for="(item, index) in functionItems"
                  :key="index"
                  :value="item.item_pk"
                >
                  {{ item.item_num }}: {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.mstEvent')"
              prop="mst_event_id"
            >
              <a-select
                v-model="model.mst_event_id"
                allow-clear
                :placeholder="$t('module.mstEvent')"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="item in mstEvents"
                  :key="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="text-center">
          <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="$emit('onClose')">
            Cancel
          </a-button>
          <a-button type="primary" title="Lưu" @click="handleSubmit">
            Submit
          </a-button>
        </div>
        <div
          v-if="error"
          class="error mb-3"
        >
          <span class="error-create-event"> {{ message }}</span>
        </div>
      </div>
      <div v-if="id" class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="24"
          >
            <a-form-model-item
              :label="$t('module.functionEventLogical.description')"
              prop="description_logic"
            >
              <a-textarea
                v-model="description_logic"
                :rows="20"
                :placeholder="$t('module.functionEventLogical.description')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <div v-if="version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes" class="text-center">
          <a-button type="primary" title="Xem trước" @click="gotoPreview()">
            Preview
          </a-button>
        </div>
        <PreviewModal
          ref="previewLogic"
          @save="save"
          @onClose="onClose"
        />
      </div>
    </a-spin>
  </a-form-model>
</template>
<script>
import PreviewModal from './PreviewModal.vue'
import DataForm from '~/mixins/data-form'
import { LOGIC_TYPE_VALUE, LOGIC_TYPE_SELECT, ERROR_CODE, LOCK_FLG_VALUE, USE_FLG_VALUE } from '~/constants'
class ValidationErrorAnalyzeLogic extends Error {
  constructor(message, lineIndex, lineContent) {
    super(message)
    this.name = 'ValidationErrorAnalyzeLogic'
    this.lineIndex = lineIndex
    this.lineContent = lineContent
  }
}
export default {
  components: {
    PreviewModal
  },
  mixins: [
    DataForm
  ],
  props: {
    dataNode: {
      type: Object,
      default: () => {}
    },
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    },
    mstEvents: {
      type: [Array],
      default: () => []
    },
    functions: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      resource: 'functionEvent',
      LOGIC_TYPE_VALUE,
      LOGIC_TYPE_SELECT,
      LOCK_FLG_VALUE,
      USE_FLG_VALUE,
      initialModel: {},
      description_logic: '',
      preview: false,
      error: false,
      message: false,
      ERROR_CODE,
      isUpdate: false
    }
  },
  /**
     * Computed event.
     */
  computed: {
    formRules() {
      return {
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_event_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstEvent') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    model(newVal) {
      this.getDescriptionLogic()
    }
  },
  /**
     * Mounted event.
     */
  mounted() {
  },
  methods: {
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      return this.model
    },
    save() {
      this.$emit('save')
    },
    onClose() {
      this.$emit('onClose')
    },
    /**
       * Set model
       *
       * @param {Object} data
       */
    setModel(data) {
      const functionEvent = this.formatData(data)
      this.model = functionEvent
      this.model.project_id = this.$store.state.project.id
      this.initialModel = { ...data }
    },

    formatData(item) {
      const formattedItem = { ...item }

      if (item.functionEventLogical) {
        const logicMap = new Map()

        item.functionEventLogical.forEach(logic => {
          logic.children = []
          logic.parentId = logic.parent_logic_pk
          logicMap.set(logic.logic_pk, logic)
        })
        item.functionEventLogical.forEach(logic => {
          const parentLogic = logicMap.get(logic.parentId)
          if (parentLogic) {
            parentLogic.children.push(logic)
          }
        })

        formattedItem.functionEventLogical = item.functionEventLogical.filter(logic => !logic.parentId)
        formattedItem.functionEventLogical.forEach(logic => {
          delete logic.parentId
        })
      }

      return formattedItem
    },

    /**
       * Validate before submit
       */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.function_id = this.version.function_id
            data.version_code = this.version.version_code
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }
            this.$emit('onClose')
            this.$emit('save')
            this.$notification.success({
              message: this.$t('text.successfully')
            })
          } catch (_) {
            if (_.response.data.code && _.response.data.code === ERROR_CODE.EVENT_EXISTS) {
              this.error = true
              this.message = this.$t('module.functionEvent.error_event_exists')
            }
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },
    /**
       * Filter in select box
       */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },
    analyzeStringByLines(inputString) {
      const INDENT_SIZE = 4
      const lines = inputString.split('\n')
      const result = []
      const stack = []

      function getNextLine(lines, index) {
        for (let i = index + 1; i < lines.length; i++) {
          const nextLine = lines[i].trim()
          if (nextLine !== '') {
            return lines[i]
          }
        }
        return ''
      }

      function isLineGoto(line) {
        const lineCheck = line.replace(/\s/g, '').toLowerCase()
        return lineCheck.startsWith('goto')
      }

      function isLineIf(line) {
        const lineCheck = line.trim().toLowerCase()
        return lineCheck.startsWith('if')
      }

      function isLineElseif(line) {
        const lineCheck = line.replace(/\s/g, '').toLowerCase()
        return lineCheck.startsWith('elseif')
      }

      function isLineElse(line) {
        const lineCheck = line.replace(/\s/g, '').toLowerCase()
        return lineCheck.startsWith('else') && !lineCheck.startsWith('elseif')
      }

      function getTypeLine(line) {
        if (isLineGoto(line)) {
          return 1
        }
        if (isLineIf(line)) {
          return 2
        }
        if (isLineElseif(line)) {
          return 3
        }
        if (isLineElse(line)) {
          return 4
        }

        return 0
      }
      function validateFormat(string) {
        const regex = /^\(.*[^()\s].*\)$/
        return regex.test(string)
      }

      function findParentIf(parentBlock, indentLevel) {
        let ifPid = 0
        let listFindBlock = result
        if (parentBlock) {
          listFindBlock = parentBlock
        }
        if (!listFindBlock) {
          return 0
        }
        let ifIdx = listFindBlock.length - 1 // lay ra thang cuoi cung
        while (ifIdx >= 0) {
          const ifLine = listFindBlock[ifIdx]
          if (ifLine.indentLevel === indentLevel && isLineIf(ifLine.line)) {
            ifPid = ifLine.e_id
            break
          }
          ifIdx--
        }

        return ifPid
      }

      function pushToParentBlock(lineContent, indentLevel, idx, funtions) {
        const parentLine = stack[stack.length - 1]
        const parentBlock = parentLine.block
        let ifPid = 0
        let functionId = 0

        if (isLineElseif(lineContent) || isLineElse(lineContent)) {
          ifPid = findParentIf(parentBlock, indentLevel)
        }
        if (isLineGoto(lineContent)) {
          functionId = findFunctionId(lineContent, funtions)
        }

        parentBlock.push({ line: lineContent, block: [], function_goto_id: functionId, indentLevel, e_id: idx, p_id: parentLine.e_id, if_p_id: ifPid, tpye_line: getTypeLine(lineContent) })
        stack.push(parentBlock[parentBlock.length - 1])
      }

      function validateIfElseStructure(lineContent, indentLevel, index) {
        const stackLength = stack.length

        if (stackLength === 0) {
          if (isLineElseif(lineContent) || isLineElse(lineContent)) {
            throw new ValidationErrorAnalyzeLogic('Trước elseif và else thì phải là if', index, lineContent)
          }
          return // Không có dòng cha trước, không cần kiểm tra
        }

        const prevLine = stack[stackLength - 1]
        const prevIndentLevel = prevLine.indentLevel

        if (prevIndentLevel !== indentLevel) {
          return // Không có dòng cha trước, không cần kiểm tra
        }

        if (isLineElseif(lineContent) || isLineElse(lineContent)) {
          const prevLineContent = prevLine.line.trim()

          if (!isLineIf(prevLineContent) && !isLineElseif(prevLineContent)) {
            const errorMessage = 'Trước elseif và else thì phải là if'
            throw new ValidationErrorAnalyzeLogic(errorMessage, index, lineContent)
          }
        }
      }

      function validateElseIfStructure(lineContent, indentLevel, index, lines) {
        const stackLength = stack.length

        if (stackLength === 0) {
          return
        }
        if (isLineElseif(lineContent)) {
          for (let i = 0; i < index; i++) {
            const line = lines[i]
            const trimmedLine = line.trimLeft()
            const indexLine = line.length - trimmedLine.length
            if (trimmedLine !== '' && indexLine === indentLevel) {
              if (isLineElse(trimmedLine)) {
                const errorMessage = 'Trước elseif phải là if hoặc elseif'
                throw new ValidationErrorAnalyzeLogic(errorMessage, index, lineContent)
              }
            }
          }
        }
      }
      function validateFormatIfElse(lineContent, indentLevel, index) {
        if (isLineIf(lineContent)) {
          // Check if the lineContent has a condition format
          const keyword = 'if'
          const condition = lineContent.replace(new RegExp(keyword, 'i'), '').trim()

          if (!validateFormat(condition)) {
            throw new ValidationErrorAnalyzeLogic('if phải có định dạng if (điều kiện)', index, lineContent)
          }
        }

        if (isLineElseif(lineContent)) {
          // Check if the lineContent has a condition format
          const keyword = 'elseif'
          const condition = lineContent.toLowerCase().replace(keyword, '').trim()
          if (!validateFormat(condition)) {
            throw new ValidationErrorAnalyzeLogic('elseif phải có định dạng elseif (điều kiện)', index, lineContent)
          }
        }
        if (isLineElse(lineContent)) {
          // Check if the lineContent is empty (after trimming)
          const keyword = 'else'
          const condition = lineContent.toLowerCase().replace(keyword, '').trim()
          if (condition.length !== 0) {
            throw new ValidationErrorAnalyzeLogic('else không được có điều kiện', index, lineContent)
          }
        }
      }

      // check logic tuần tự không được có dòng con
      function validateNonEmptyBlock(lineContent, indentLevel, index) {
        if (!isLineIf(lineContent) && !isLineElseif(lineContent) && !isLineElse(lineContent)) {
          const nextLine = getNextLine(lines, index)
          if (nextLine) {
            const nextLineIndentLevel = nextLine.length - nextLine.trimLeft().length
            if (nextLineIndentLevel > indentLevel) {
              throw new ValidationErrorAnalyzeLogic('Logic tuần tự thì không được phép thêm dòng con', index, lineContent)
            }
          }
        }
        if (isLineIf(lineContent) || isLineElseif(lineContent) || isLineElse(lineContent)) {
          const nextLine = getNextLine(lines, index)
          if (nextLine) {
            const nextLineIndentLevel = nextLine.length - nextLine.trimLeft().length
            if (nextLineIndentLevel <= indentLevel) {
              throw new ValidationErrorAnalyzeLogic('Logic if, elseif, else phải có dòng con', index, lineContent)
            }
          } else {
            throw new ValidationErrorAnalyzeLogic('Logic if, elseif, else phải có dòng con', index, lineContent)
          }
        }
      }
      function findFunctionId(lineContent, functions) {
        let functionId = 0
        if (isLineGoto(lineContent)) {
          const colonIndex = lineContent.indexOf(':')
          const lineCode = lineContent.substring(colonIndex + 1).trim().split(' ')[0]
          const foundFunction = functions.find(func => func.code === lineCode)
          if (foundFunction) {
            functionId = foundFunction.id
          }
        }
        return functionId
      }

      function validateGotoCodes(lineContent, index, functions) {
        let updatedLineContent = lineContent

        if (isLineGoto(lineContent)) {
          const colonIndex = lineContent.indexOf(':')
          const lineCode = lineContent.substring(colonIndex + 1).trim()
          const foundFunction = functions.find(func => func.code === lineCode)
          if (foundFunction) {
            updatedLineContent = lineContent + ' - ' + foundFunction.name
          } else {
            throw new ValidationErrorAnalyzeLogic('Không tìm thấy mã chức năng = ' + lineCode, index, lineContent)
          }
        }
        return updatedLineContent
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmedLine = line.trimLeft()
        const indentLevel = line.length - trimmedLine.length
        let lineContent = trimmedLine

        if (trimmedLine !== '') {
          validateIfElseStructure(lineContent, indentLevel, i)
          validateElseIfStructure(lineContent, indentLevel, i, lines)
          validateFormatIfElse(lineContent, indentLevel, i)
          validateNonEmptyBlock(lineContent, indentLevel, i)
          lineContent = validateGotoCodes(lineContent, i, this.functions)

          if (indentLevel === 0) {
            let ifPid = 0
            let functionId = 0
            if (isLineElseif(lineContent) || isLineElse(lineContent)) {
              ifPid = findParentIf(null, indentLevel)
            }
            if (isLineGoto(lineContent)) {
              functionId = findFunctionId(lineContent, this.functions)
            }

            result.push({ line: lineContent, block: [], function_goto_id: functionId, indentLevel, e_id: i + 1, p_id: 0, if_p_id: ifPid, tpye_line: getTypeLine(lineContent) })
            stack.length = 0
            stack.push(result[result.length - 1])
          } else {
            if (indentLevel % INDENT_SIZE !== 0) {
              throw new ValidationErrorAnalyzeLogic('Khoảng cách đầu dòng không đúng theo chuẩn 4 space: Khoảng cách hiện tại đang là ' + indentLevel, i, line)
            }

            if (indentLevel === stack.length * INDENT_SIZE) {
              pushToParentBlock(lineContent, indentLevel, i + 1, this.functions)
            } else if (indentLevel < stack.length * INDENT_SIZE) {
              while (stack.length > 0 && indentLevel < stack.length * INDENT_SIZE) {
                stack.pop()
              }

              if (indentLevel !== stack.length * INDENT_SIZE) {
                throw new ValidationErrorAnalyzeLogic('Khoảng cách space không đúng theo phân cấp 1', i, line)
              }

              pushToParentBlock(lineContent, indentLevel, i + 1, this.functions)
            } else {
              throw new ValidationErrorAnalyzeLogic('Khoảng cách space không đúng theo phân cấp 2', i, line)
            }
          }
        }
      }

      return result
    },
    gotoPreview() {
      try {
        const lines = this.analyzeStringByLines(this.description_logic)
        if (lines) {
          this.$refs.previewLogic.open(lines, this.model, this.isUpdate)
        }
      } catch (error) {
        if (error instanceof ValidationErrorAnalyzeLogic) {
          this.$notification.error({
            message: this.$t(`Error at line ${error.lineIndex + 1}: ${error.message}. Nội dung lỗi [${error.lineContent}]`)
          })
          console.log(`Error at line ${error.lineIndex + 1}: ${error.lineContent}`)
          console.log('Error:', error.message)
        } else {
          console.log('Unknown error:', error)
        }
      }
    },
    getDescriptionLogic() {
      if (this.model && this.model.functionEventLogical) {
        if (this.model.functionEventLogical.length > 0) {
          this.isUpdate = true
        } else {
          this.isUpdate = false
        }
        this.description_logic = this.analyzeArrayToString(this.model.functionEventLogical)
      }
    },

    analyzeArrayToString(inputArray) {
      const array = []
      let dataArray = []

      const formatNameNode = (item, keyNode, functions) => {
        const objNode = {
          line: '',
          key: keyNode,
          children: [],
          parent: null
        }

        switch (item.logic_type) {
          case 1: {
            const gotoFunction = functions.find(func => func.id === item.function_goto_id)
            if (gotoFunction) {
              objNode.line = `Goto: ${gotoFunction.code}`
            }
            break
          }
          case 2:
            objNode.line = `If (${item.conditions})`
            break
          case 3:
            objNode.line = `Elseif (${item.conditions})`
            break
          case 4:
            objNode.line = 'Else'
            break
          default:
            objNode.line = item.logic_detail
            break
        }
        return objNode
      }
      const buildNode = (dataNodes, parentNodes) => {
        let objNode = null
        if (parentNodes == null) {
          objNode = formatNameNode(dataNodes, dataNodes.id, this.functions)
          array.push(objNode)
          dataNodes.children?.forEach(item => {
            if (item.logic_type > LOGIC_TYPE_VALUE.if) {
              buildNode(item, objNode.parent)
            } else {
              buildNode(item, objNode)
            }
          })
        } else {
          objNode = formatNameNode(dataNodes, parentNodes.key + '-' + dataNodes.id, this.functions)
          objNode.parent = parentNodes
          parentNodes.children.push(objNode)
          dataNodes.children?.forEach(item => {
            if (item.logic_type > LOGIC_TYPE_VALUE.if) {
              buildNode(item, objNode.parent)
            } else {
              buildNode(item, objNode)
            }
          })
        }
      }
      const buildTree = nodes => {
        nodes.forEach(item => {
          buildNode(item, null)
        })
        return array
      }
      dataArray = buildTree(inputArray)

      function arrayToString(array, indent = '', childIndent = '    ') {
        let result = ''

        array.forEach(item => {
          const line = indent + item.line + '\n'
          const children = item.children

          result += line

          if (children.length > 0) {
            result += arrayToString(children, indent + childIndent, childIndent)
          }
        })

        return result
      }

      return arrayToString(dataArray)
    }
  }
}
</script>
<style lang="scss" scoped>
.error {
  position:absolute;
  bottom: -25px;
  right: 50%;
  transform: translateX(50%);
  .error-create-event {
    text-align: center;
    color: #f5222d;
    display: block;
    line-height: 21px;
    font-size: 16px;
  }
}
.text-center {
  position: relative;
}
</style>
