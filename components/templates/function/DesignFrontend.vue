<template>
  <div>
    <a-spin :spinning="loading">
      <a-row class="main-row" :width="version.max_image_width + 285">
        <a-col :span="19" :style="{ maxWidth: '1215px', overflowX: 'auto' }">
          <div v-if="version.images.length > 0">
            <div v-for="(img, index) in version.images" :key="index" class="">
              <canvas :id="`canvas_${index}`" :width="img.width * 0.75" :height="img.height * 0.75" class="canvas" />
            </div>
          </div>
          <div v-else>
            <h2>{{ $t('text.error_image_design') }}</h2>
          </div>
        </a-col>
        <a-col
          :span="5"
          :style="{
            maxHeight:
              Math.max(590, version.max_image_height * 0.75 + 10) + 'px',
            overflowY: 'auto'
          }"
        >
          <div class="p-3" style="max-width: 320px">
            <a-button class="merge-branch" type="primary" @click="mergeBrach()">
              {{ $t('module.design_frontend.component.merge_branch') }}
            </a-button>
          </div>
          <div class="p-3 table-wrap" style="max-width: 320px">
            <table class="table table-striped" style="width: 100%">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    No
                  </th>
                  <th scope="col">
                    {{ $t('module.design_frontend.component.name') }}
                  </th>
                  <th scope="col">
                    {{ $t('module.design_frontend.component.branch') }}
                  </th>
                </tr>
              </thead>
              <draggable tag="tbody">
                <tr
                  v-for="(record, index) in componentItems"
                  :key="index"
                  :class="{ 'selected-row': record.selected }"
                >
                  <td class="focusItem" @click="focusItem(record)">
                    {{ index + 1 }}
                    <div v-if="record.component.storybook_url">
                      <a :href="record.component.storybook_url" target="_blank" style="color:#0077c0;" class="link__detail-task">{{ record.component.storybook_url }}</a>
                    </div>
                  </td>
                  <td class="updateItem" @click="updateItem(record)">
                    {{ record.component.component_name }}
                  </td>
                  <td>{{ record.branch?.name }}</td>
                  <td class="icon-remove">
                    <a-icon type="minus" class="icon icon-minus" @click="removeComponentConfirm(record.id)" />
                  </td>
                </tr>
              </draggable>
            </table>
          </div>
        </a-col>
      </a-row>
    </a-spin>
    <component-form
      :id="currentId"
      ref="refComponentForm"
      :version="version"
      :version-code="versionCode"
      :project-id="project_id"
      :function-id="functionId"
      @save="save"
      @close="closeModal"
      @deleteComponent="deleteComponent"
    />
    <merge-branch-form
      :id="currentId"
      ref="refMergeComponentForm"
      :version="version"
      :version-code="versionCode"
      :project-id="project_id"
      :function-id="functionId"
      @save="save"
      @close="closeModal"
      @deleteComponent="initItemNum"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { fabric } from 'fabric'
import DataForm from '~/mixins/data-form'
import {
  USE_FLG,
  USE_FLG_VALUE,
  API_ROOT_URL,
  LOCK_FLG_VALUE,
  TYPE_ACTION,
  SORT
} from '~/constants'
import ComponentForm from '~/components/templates/designFrontend/ComponentForm.vue'
import MergeBranchForm from '~/components/templates/designFrontend/MergeBranchForm.vue'

export default {
  components: { ComponentForm, draggable, MergeBranchForm },

  mixins: [DataForm],

  props: {
    versionCode: {
      type: [Number, String],
      default: null
    },
    functionId: {
      type: [Number, String],
      default: null
    },
    version: {
      type: [Object],
      default: () => {}
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'functionImage',
      funtionImage: [],
      USE_FLG,
      USE_FLG_VALUE,
      TYPE_ACTION,
      fileList: [],
      previewVisible: false,
      previewImage: '',
      API_ROOT_URL,
      loadingImage: false,
      LOCK_FLG_VALUE,
      canvas: [],
      currentId: 0,
      image_id: 0,
      load: false,
      flgNotRenderItem: false,
      isOkActive: true,
      componentItems: [],
      rectCounter: 1,
      selectCanvas: null,
      project_id: this.$store.state.project.id
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    }),

    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (
          this.$route.query.order_by === item.dataIndex &&
          this.$route.query.order_type
        ) {
          item.sortOrder =
            +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },

    header() {
      return [
        {
          title: 'No',
          scopedSlots: { customRender: 'item_num' },
          dataIndex: 'item_num',
          width: 50,
          align: 'center'
        },
        {
          title: this.$t('module.functionItem.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'left',
          width: 150
        }
      ]
    }
  },

  watch: {
    selectCanvas(value) {
      if (value !== null) {
        this.isOkActive = false
      } else {
        this.isOkActive = true
      }
    },
    'version.images': {
      async handler(newValue) {
        this.canvas = []
        this.funtionImage = newValue
        this.fileList = []
        this.fileList = this.funtionImage.map(item => ({
          uid: item.id,
          url: API_ROOT_URL + item.image_path,
          name: item.image_path
        }))

        if (newValue.length > 0) {
          await new Promise(resolve => {
            this.$nextTick(() => {
              setTimeout(() => {
                resolve()
              }, 1000)
            })
          })
          await this.initCanvas()
          await this.setBackgroundImage()
          await this.initItemNum()
          await this.addMouseEvents()
        }
      },
      deep: true
    }
  },

  /**
   * Mounted event.
   */
  async mounted() {
    if (this.version) {
      this.funtionImage = this.version.images
      this.fileList = []
      this.fileList = this.funtionImage.map(item => ({
        uid: item.id,
        url: API_ROOT_URL + item.image_path,
        name: item.image_path
      }))
    }
    if (this.version.images.length > 0) {
      await this.initCanvas()
      await this.setBackgroundImage()
      await this.initItemNum()
      await this.addMouseEvents()
    } else {
      this.$notification.error({
        message: this.$t('text.error_image_design')
      })
    }
    document.body.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.handleDocumentClick)
  },
  /**
   * List of methods
   */
  methods: {
    removeComponentConfirm(id) {
      this.$confirm({
        title: 'Confirm',
        content: this.$t('common.confirm'),
        okText: this.$t('common.clear'),
        cancelText: this.$t('common.cancel'),
        onOk: async () => {
          if (id) {
            this.$store.dispatch('setLoading', true)
            await this.$api.componentFunctionMapping.delete(id)
            this.$store.dispatch('setLoading', false)
            this.closeModal()
          }
        }
      })
    },

    /**
     * Delete component
     */
    deleteComponent() {
      this.clearRect()
      this.initItemNum()
    },

    /**
     * Clear rect in canvas
     */
    clearRect() {
      for (let i = 0; i < this.canvas.length; i++) {
        const objectsToRemove = this.canvas[i]
          .getObjects()
          .filter(obj => obj.type === 'rect' || obj.type === 'text')
        objectsToRemove.forEach(obj => this.canvas[i].remove(obj))
      }
    },

    /**
     * handle document click
     * @param {*} event
     */
    handleDocumentClick(event) {
      if (
        (event.target.classList.contains('focusItem') &&
          event.target.tagName.toLowerCase() === 'td') ||
        event.target.classList.contains('updateItem') ||
        event.target.classList.contains('canvas')
      ) {
      } else {
        for (let i = 0; i < this.canvas.length; i++) {
          const objectRectObject = this.canvas[i]
            .getObjects()
            .filter(obj => obj.type === 'rect')
          objectRectObject.forEach(obj =>
            obj.set({ stroke: 'red', selectable: false })
          )
          const objectTextObject = this.canvas[i]
            .getObjects()
            .filter(obj => obj.type === 'text')
          objectTextObject.forEach(obj =>
            obj.set({ stroke: 'red', selectable: false })
          )
          this.canvas[i].selection = false
          this.canvas[i].allowTouchScrolling = false
          this.canvas[i].renderAll()
        }
        for (let i = 0; i < this.componentItems.length; i++) {
          if (this.componentItems[i].selected === true) {
            this.componentItems[i].selected = false
          }
        }
        this.selectCanvas = null
      }
    },

    /**
     * Update component item
     * @param {*} record
     */
    updateItem(record) {
      this.currentId = record.component_id
      this.$refs.refComponentForm.open(false)
    },

    /**
     * Merge branch form.
     */
    mergeBrach() {
      this.$refs.refMergeComponentForm.open(false)
    },

    /**
     * open add modal
     */
    addItemFunction(startX, startY, endX, endY, imageId, rectId) {
      if (
        this.version.design_lock_flg === LOCK_FLG_VALUE.no &&
        this.version.function.use_flg === USE_FLG_VALUE.yes
      ) {
        this.currentId = 0
        this.$refs.refComponentForm.open(
          true,
          startX,
          startY,
          endX,
          endY,
          imageId,
          rectId
        )
      }
    },

    /**
     * Create new canvas
     */
    initCanvas() {
      for (let i = 0; i < this.version.images.length; i++) {
        const value = 'canvas_' + i
        this.canvas[i] = new fabric.Canvas(value)
      }
    },

    /**
     * Set canvas background image
     */
    setBackgroundImage() {
      this.fileList.forEach((url, index) => {
        this.$nextTick(() => {
          fabric.Image.fromURL(url.url, image => {
            image.scaleToWidth(image.width)
            image.scaleToHeight(image.height)
            this.canvas[index].setDimensions({
              width: image.width * 0.75,
              height: image.height * 0.75
            })
            this.canvas[index].setBackgroundImage(image, this.canvas[index].renderAll.bind(this.canvas[index]), {
              scaleX: 0.75,
              scaleY: 0.75
            })
            setTimeout(() => {
            }, 1000)
          })
        })
        this.canvas[index].id = url.uid
      })
    },

    /**
     *  Add mouse events to canvas
     */
    addMouseEvents() {
      for (let i = 0; i < this.canvas.length; i++) {
        let startX, startY, endX, endY, rectangle
        let isDown = null
        const thatCanvas = this.canvas[i]
        const _this = this
        const addItem = this.addItemFunction
        this.canvas[i].on('mouse:down', function(o) {
          if (!_this.isOkActive) {
            return
          }
          const pointer = thatCanvas.getPointer(o.e)
          isDown = true
          startX = pointer.x
          startY = pointer.y

          rectangle = new fabric.Rect({
            left: startX,
            top: startY,
            fill: 'transparent',
            stroke: 'red',
            strokeWidth: 3
          })
          thatCanvas.add(rectangle)
        })
        thatCanvas.on('mouse:move', function(o) {
          if (!isDown) {
            return
          }
          if (!_this.isOkActive) {
            return
          }
          const pointer = thatCanvas.getPointer(o.e)
          endX = pointer.x
          endY = pointer.y
          if (startX > endX) {
            rectangle.set({
              left: Math.abs(endX)
            })
          }
          if (startY > endY) {
            rectangle.set({
              top: Math.abs(endY)
            })
          }

          rectangle.set({
            width: Math.abs(startX - endX)
          })
          rectangle.set({
            height: Math.abs(startY - endY)
          })
          rectangle.set({
            selectable: false
          })
          rectangle.set({
            id: _this.rectCounter
          })
          thatCanvas.renderAll()
        })
        thatCanvas.on('mouse:up', function(o) {
          if (!_this.isOkActive) {
            return
          }
          const text = new fabric.Text(_this.rectCounter.toString(), {
            id: _this.rectCounter,
            left: rectangle.left - 15,
            top: rectangle.top - 15,
            fontSize: 16,
            fill: 'red', // Thay đổi màu chữ thành màu đỏ
            originX: 'left',
            originY: 'top',
            selectable: false // Ngăn không cho người dùng chọn và di chuyển văn bản
          })
          thatCanvas.add(text)

          isDown = false
          _this.isOkActive = false
          addItem(
            startX,
            startY,
            endX,
            endY,
            thatCanvas.get('id'),
            _this.rectCounter
          )
        })
        thatCanvas.on('object:moving', function(e) {
          const activeObject = e.target
          const textObjects = thatCanvas
            .getObjects()
            .filter(obj => obj.type === 'text')

          // Lặp qua mỗi đối tượng văn bản và cập nhật vị trí tương ứng
          textObjects.forEach(text => {
            if (text.id === activeObject.id) {
              text.set({
                left: activeObject.left - 15,
                top: activeObject.top - 15
              })
            }
          })
          thatCanvas.renderAll() // Vẽ lại canvas
        })
      }
    },

    /**
     * Init Item Number to Canvas
     */
    async initItemNum() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          order_by: 'id',
          order_type: SORT.asc,
          project_id: this.project_id,
          version_code: this.versionCode,
          function_id: this.version.function_id,
          all: true
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.componentFunctionMapping.list({ params })
        this.componentItems = data.map(item => {
          return { ...item, selected: false }
        })
        if (data.length > 0) {
          this.rectCounter = data.length + 1
          for (let i = 0; i < this.canvas.length; i++) {
            const objectsToRemove = this.canvas[i]
              .getObjects()
              .filter(obj => obj.type === 'text')
            objectsToRemove.forEach(obj => this.canvas[i].remove(obj))
            for (let j = 0; j < data.length; j++) {
              const item = data[j]
              const no = j + 1
              if (item.function_image_id === this.canvas[i].get('id')) {
                const rect = new fabric.Rect({
                  left: Math.abs(item.x_start),
                  top: Math.abs(item.y_start),
                  width: Math.abs(item.x_end - item.x_start),
                  height: Math.abs(item.y_end - item.y_start),
                  fill: 'transparent',
                  stroke: 'red',
                  strokeWidth: 3,
                  selectable: false
                })
                const text = new fabric.Text(`${no.toString()}`, {
                  left: Math.abs(item.x_start - 15),
                  top: Math.abs(item.y_start - 15),
                  fontSize: 16,
                  fill: 'red',
                  originX: 'left',
                  originY: 'top',
                  selectable: false
                })
                rect.set('id', item.id)
                text.set('id', item.id)
                this.canvas[i].add(rect)
                this.canvas[i].add(text)
              }
            }
            this.canvas[i].renderAll()
          }
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    save() {
      this.clearRect()
      this.initItemNum()
      this.isOkActive = true
    },

    resetFocusEvents() {
      for (let i = 0; i < this.canvas.length; i++) {
        const obj = this.canvas[i].getObjects()
        if (obj.type === 'rect' || obj.type === 'text') {
          obj.set({ stroke: 'red', selectable: true })
        }
        this.canvas[i].off('object:modified')
        this.canvas[i].renderAll()
      }
    },
    /**
     * Focus item on click
     */
    focusItem(record) {
      this.resetFocusEvents()
      const _this = this
      this.componentItems.forEach(item => {
        if (item.selected) {
          this.$set(item, 'selected', false)
        }
      })
      this.$set(record, 'selected', true)

      for (let i = 0; i < this.canvas.length; i++) {
        if (this.canvas[i].id === record.function_image_id) {
          this.selectCanvas = this.canvas[i]
          break
        }
      }

      const objectsRectOther = this.selectCanvas
        .getObjects()
        .filter(obj => obj.type === 'rect' && obj.id !== record.id)
      objectsRectOther.forEach(obj => obj.set({ stroke: 'red' }))

      const objectsTextOther = this.selectCanvas
        .getObjects()
        .filter(obj => obj.type === 'text' && obj.id !== record.id)
      objectsTextOther.forEach(obj => obj.set({ stroke: 'red' }))

      if (this.selectCanvas) {
        const objectsRectFocus = this.selectCanvas
          .getObjects()
          .filter(obj => obj.type === 'rect' && obj.id === record.id)

        const objectsTextFocus = this.selectCanvas
          .getObjects()
          .filter(obj => obj.type === 'text' && obj.id === record.id)

        if (objectsRectFocus.length > 0 && objectsTextFocus.length > 0) {
          const targetRectObject = objectsRectFocus[0]
          const targetTextObject = objectsTextFocus[0]
          targetRectObject.set({ stroke: 'blue', selectable: true })
          targetTextObject.set({ stroke: 'blue', selectable: false })
          this.selectCanvas.on('object:modified', function(options) {
            const obj = options.target
            const boundingRect = obj.getBoundingRect()

            const startX = boundingRect.left
            const startY = boundingRect.top
            const endX = boundingRect.left + boundingRect.width
            const endY = boundingRect.top + boundingRect.height

            _this.updatePosition(record, startX, startY, endX, endY)
          })

          this.selectCanvas.renderAll()
          this.selectCanvas.selection = true
          this.selectCanvas.allowTouchScrolling = true

          const canvasOffset = this.selectCanvas._offset
          const targetLeft =
            objectsRectFocus.left +
            canvasOffset.left +
            objectsRectFocus.width / 2
          const targetTop =
            objectsRectFocus.top +
            canvasOffset.top +
            objectsRectFocus.height / 2
          const windowCenterX = window.innerWidth / 2
          const windowCenterY = window.innerHeight / 2
          const scrollLeft = targetLeft - windowCenterX
          const scrollTop = targetTop - windowCenterY

          window.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: 'smooth'
          })
        }
      }
    },
    async updatePosition(record, startX, startY, endX, endY) {
      try {
        const data = {
          x_start: startX,
          y_start: startY,
          x_end: endX,
          y_end: endY,
          function_id: record.function_id,
          version_code: record.version_code,
          function_image_id: record.function_image_id
        }
        await this.$api.componentFunctionMapping.update(record.id, data)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
      }
    },

    /**
     * Close modal end remove rect
     * @param {*} component
     */
    closeModal() {
      this.clearRect()
      this.initItemNum()
      this.isOkActive = true
    }
  }
}
</script>
<style lang="scss" scoped>
:deep() {
  .ant-divider-horizontal {
    margin: 5px 0;
  }
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
  }
  .anticon-database > svg,
  .anticon-interaction > svg,
  .anticon-api > svg {
    width: 1.15rem;
    height: 1.15rem;
  }
  .selected-row {
    background-color: gold;
  }
}
.only-read {
  :deep() {
    .anticon-delete {
      display: none;
    }
  }
}
.item_num {
  cursor: pointer;
}
.function-item-name {
  cursor: pointer;
}
.canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 10px 10px;
  word-wrap: break-word;
}
.thead-dark {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  > tr > td {
    border: 1px solid #e8e8e8;
    padding: 10px 10px;
    word-wrap: break-word;
    word-break: break-all;
    transition: background 0.3s;
    cursor: pointer;
  }
}
.table-wrap {
  width: 100%;
  table th:first-child,
  table td:first-child {
    width: 30%;
  }

  table th:nth-child(2),
  table td:nth-child(2) {
    width: 45%;
  }

  table th:nth-child(3),
  table td:nth-child(3) {
    width: 25%;
  }
}
.icon-remove {
  width: 10px !important;
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
  .icon-minus {
    color: red;
    font-size: 20px;
  }
}
</style>
