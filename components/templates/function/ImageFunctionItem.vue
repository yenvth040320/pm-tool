<template>
  <div>
    <a-spin :spinning="loadingImage">
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
        <a-col :span="5" :style="{ maxHeight: Math.max(590, version.max_image_height * 0.75 + 10) + 'px', overflowY: 'auto' }">
          <div class="p-3 table-wrap" style="max-width: 320px;">
            <table class="table table-striped" style="width: 100%;">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">
                    No
                  </th>
                  <th scope="col">
                    {{ $t('module.functionItem.name') }}
                  </th>
                  <th scope="col">
                    Type
                  </th>
                </tr>
              </thead>
              <draggable :list="functionItem" tag="tbody" @change="updateNumber">
                <tr v-for="(record, index) in functionItem" :key="index">
                  <td scope="row" @click="focusItem(record)">
                    <div class="text-center">
                      {{ record.item_num }}
                    </div>
                    <a-divider type="horizontal" />
                    <div class="icon-wrapper">
                      <a-popover
                        v-if="record.functionItemReadDatasources.length > 0
                          || record.functionItemWriteDatasources.length > 0"
                      >
                        <template #content>
                          <div
                            v-if="record.functionItemReadDatasources.length > 0"
                          >
                            <h4>
                              {{ $t('module.tab_datasource.api_response') }}
                            </h4>
                            <span
                              v-for="(item, i) in record.functionItemReadDatasources"
                              :key="i"
                            >
                              <p v-if="item.api_response.use_flg === USE_FLG_VALUE.yes">
                                {{ '['+ item?.api?.name + ']' + '/' + (item?.api_response?.path ? item?.api_response?.path : item?.api_response?.name) }}({{ 'Version: ' + item?.api_version_code }})
                              </p>
                            </span>
                          </div>
                          <div
                            v-if="record.functionItemWriteDatasources.length > 0"
                          >
                            <h4>
                              {{ $t('module.tab_datasource.api_parameter') }}
                            </h4>
                            <span
                              v-for="(item, ind) in record.functionItemWriteDatasources"
                              :key="ind"
                            >
                              <p v-if="item.api_parameter.use_flg === USE_FLG_VALUE.yes">
                                {{ '['+ item?.api?.name + ']' + '/' + (item?.api_parameter?.path ? item?.api_parameter?.path : item?.api_parameter?.name) }}({{ 'Version: ' + item?.api_version_code }})
                              </p>
                            </span>
                          </div>
                        </template>
                        <template #title>
                          <span>{{ $t('module.api_info') }}</span>
                        </template>
                        <a-icon type="api" style="color: #40a9ff;" />
                      </a-popover>
                      <a-popover
                        v-if="checkApi(record)"
                      >
                        <template #content>
                          <span>{{ $t('module.tab_item_design.no_datasource_tooltip') }}</span>
                        </template>
                        <a-icon type="api" style="color: red;" />
                      </a-popover>
                      <a-popover
                        v-if="(record.functionItemReadDatasources.length > 0 && record.functionItemReadDatasources.some(item => item.api_response_datasource !== null))
                          || record.functionItemWriteDatasources.length > 0 && record.functionItemWriteDatasources.some(item => item.api_response_datasource !== null)"
                      >
                        <template #content>
                          <div
                            v-if="record.functionItemReadDatasources.length > 0"
                          >
                            <h4>
                              {{ $t('module.tab_datasource.api_response') }}
                            </h4>
                            <span
                              v-for="(item, i) in record.functionItemReadDatasources"
                              :key="i"
                            >
                              <p v-if="item.api_response.use_flg === USE_FLG_VALUE.yes">
                                {{ '['+ item?.api?.name + ']' + '/' + (item?.api_response?.path ? item?.api_response?.path : item?.api_response?.name) }}({{ 'Version: ' + item?.api_version_code }})
                                <span v-if="item.api_response_datasource">
                                  {{ 'DB:/[' + item?.api_response_datasource?.db_schema.name + '].' + '[' + item?.api_response_datasource?.db_table.name + '].' + '[' + item?.api_response_datasource?.db_column.name + ']' + '.[Version: ' + item?.api_response_datasource.db_table_version_code + ']' }}
                                </span>
                              </p>
                            </span>
                          </div>
                          <div
                            v-if="record.functionItemWriteDatasources.length > 0"
                          >
                            <h4>
                              {{ $t('module.tab_datasource.api_parameter') }}
                            </h4>
                            <span
                              v-for="(item, ind) in record.functionItemWriteDatasources"
                              :key="ind"
                            >
                              <p v-if="item.api_parameter.use_flg === USE_FLG_VALUE.yes">
                                {{ '['+ item?.api?.name + ']' + '/' + (item?.api_parameter?.path ? item?.api_parameter?.path : item?.api_parameter?.name) }}({{ 'Version: ' + item?.api_version_code }})
                                <span v-if="item.api_parameter_datasource">
                                  {{ 'DB' + ' (' +
                                    (TYPE_ACTION.find(action => action.value === item?.api_parameter_datasource?.type_action)?.label || '') +
                                    ')' + ':/[' + item?.api_parameter_datasource?.db_schema.name +'].' + '[' + item?.api_parameter_datasource?.db_table.name +'].' + '[' + item?.api_parameter_datasource?.db_column.name +']' + '.[Version: ' + item?.api_parameter_datasource.db_table_version_code + ']' }}
                                </span>
                              </p>
                            </span>
                          </div>
                        </template>
                        <template #title>
                          <span>{{ $t('module.api_info_db') }}</span>
                        </template>
                        <a-icon type="database" style="color: #40a9ff;" />
                      </a-popover>
                      <a-popover
                        v-if="showEvent(record)"
                      >
                        <template #content>
                          <p
                            v-for="event in record.functionEvent"
                            :key="event.id"
                          >
                            {{ record.name + ': (' + record?.mstItemType.name + ') On => ' + event?.mst_event.name }}
                          </p>
                        </template>
                        <template #title>
                          <span>{{ $t('module.event_info') }}</span>
                        </template>
                        <a-icon type="interaction" style="color: #40a9ff;" />
                      </a-popover>
                      <a-popover v-if="checkFunctionItemHasLogic(record)">
                        <template #content>
                          {{ $t('module.tab_item_design.no_event_tooltip') }}
                        </template>
                        <a-icon type="interaction" style="color: red" />
                      </a-popover>
                    </div>
                  </td>
                  <td scope="row" @click="gotoDetail(record)">
                    {{ record.name }}
                    <div v-if="getItemLabelText(record)">
                      <a-divider type="horizontal" />
                      {{ getItemLabelText(record) }}
                    </div>
                  </td>
                  <td>{{ record.mstItemType.name }}</td>
                </tr>
              </draggable>
            </table>
          </div>
        </a-col>
      </a-row>
    </a-spin>
    <tab-item-modal
      :id="currentId"
      ref="tabItemModal"
      :version="version"
      :mst-type="mstType"
      :mst-property="mstProperty"
      :required-property="requiredProperty"
      :function-item="functionItem"
      @save="save"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import draggable from 'vuedraggable'
import { fabric } from 'fabric'
import DataForm from '~/mixins/data-form'
import { USE_FLG, USE_FLG_VALUE, API_ROOT_URL, LOCK_FLG_VALUE, TYPE_ACTION } from '~/constants'
import TabItemModal from '~/components/templates/versionFunction/TabItemModal'

export default {
  components: { TabItemModal, draggable },

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
    },
    functionItem: {
      type: [Array],
      default: () => []
    },
    mstProperty: {
      type: [Array],
      default: () => []
    },
    mstType: {
      type: [Array],
      default: () => []
    },
    requiredProperty: {
      type: [Array],
      default: () => []
    }
  },

  /**
   * Init data for component.
   */
  data: () => ({
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
    shouldRenderCanvas: false,
    forceRerenderKey: 0
  }),

  computed: {
    ...mapState({
      loading: 'loading'
    }),

    columns() {
      return this.header.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
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
    'version.images': {
      async handler(newValue) {
        this.forceRerenderKey += 1
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
    },

    functionItem() {
      if (this.version.images.length > 0 && !this.flgNotRenderItem) {
        this.initItemNum()
        this.clearRect()
      }
      this.flgNotRenderItem = false
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
  },

  /**
   * List of methods.
   */
  methods: {
    getItemLabelText(record) {
      if (record.functionItemProperties.length > 0) {
        const find = record.functionItemProperties.find(item => item.mst_item_property.name === 'Label Text')
        if (find) {
          return find.value
        } else {
          return null
        }
      } else {
        return null
      }
    },

    /**
     * open add modal
     */
    addItemFunction(startX, startY, endX, endY, imageId) {
      if (this.version.design_lock_flg === LOCK_FLG_VALUE.no && this.version.function.use_flg === USE_FLG_VALUE.yes) {
        this.$refs.tabItemModal.open(true, startX, startY, endX, endY, imageId)
      }
    },

    /**
     * Create new canvas
     */
    initCanvas() {
      this.$nextTick(() => {
        for (let i = 0; i < this.version.images.length; i++) {
          const value = 'canvas_' + i
          this.canvas[i] = new fabric.Canvas(value)
        }
      })
    },

    /**
     *  Clear all rect
     */
    clearRect() {
      for (let i = 0; i < this.canvas.length; i++) {
        const objectsToRemove = this.canvas[i].getObjects().filter(obj => obj.type === 'rect')
        objectsToRemove.forEach(obj => this.canvas[i].remove(obj))
      }
    },

    setBackgroundImage() {
      this.fileList.forEach((url, index) => {
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
        })
        this.canvas[index].id = url.uid
      })
    },

    /**
     *  Add mouse events to canvas
     */
    addMouseEvents() {
      for (let i = 0; i < this.canvas.length; i++) {
        let startX, startY
        const thatCanvas = this.canvas[i]
        const addItem = this.addItemFunction
        const updateItem = this.updateItemOnMoving
        let objClickTarget = null
        this.canvas[i].on('mouse:down', function(o) {
          const pointer = thatCanvas.getPointer(o.e)
          startX = pointer.x
          startY = pointer.y

          const target = o.target
          if (target && target.type === 'text') {
            objClickTarget = target
          } else {
            objClickTarget = null
          }
        })
        this.canvas[i].on('mouse:up', function(o) {
          const pointer = thatCanvas.getPointer(o.e)
          const endX = pointer.x
          const endY = pointer.y

          if (!(startX === endX && startY === endY)) {
            if (objClickTarget) {
              const itemId = objClickTarget.get('id')
              const data = {
                start_x: objClickTarget.left,
                start_y: objClickTarget.top,
                end_x: endX,
                end_y: endY,
                function_image_id: thatCanvas.get('id')
              }
              updateItem(itemId, data)
            } else {
              addItem(startX, startY, endX, endY, thatCanvas.get('id'))
            }
          }
        })
      }
    },

    /**
     * Init Item Number to Canvas
     */
    initItemNum() {
      if (this.functionItem) {
        for (let i = 0; i < this.canvas.length; i++) {
          const objectsToRemove = this.canvas[i].getObjects().filter(obj => obj.type === 'text')
          objectsToRemove.forEach(obj => this.canvas[i].remove(obj))
          for (let j = 0; j < this.functionItem.length; j++) {
            const item = this.functionItem[j]
            if (item.function_image_id === this.canvas[i].get('id')) {
              const text = new fabric.Text(`${item.item_num}`, {
                left: Math.min((this.canvas[i].width) - 15, Math.max(0, item.start_x)),
                top: Math.min((this.canvas[i].height) - 15, Math.max(0, item.start_y)),
                fontSize: 15,
                fontWeight: 'normal',
                stroke: 'red',
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true
              })
              text.set('id', item.id)
              this.canvas[i].add(text)
            }
          }
          this.canvas[i].renderAll()
        }
        // init old item
        this.functionItem.forEach(item => {
          if (!item.function_image_id) {
            const text = new fabric.Text(`${item.item_num}`, {
              left: item.start_x,
              top: item.start_y,
              fontSize: 15,
              fontWeight: 'normal',
              stroke: 'red',
              lockScalingX: true,
              lockScalingY: true,
              lockRotation: true
            })
            text.set('id', item.id)
            this.canvas[0].add(text)
          }
        })
      }
    },

    save() {
      this.$emit('save', true)
    },

    /**
     * Focus item on click
     */
    focusItem(record) {
      let selectCanvas = null
      for (let i = 0; i < this.canvas.length; i++) {
        if (this.canvas[i].id === record.function_image_id) {
          selectCanvas = this.canvas[i]
          break
        }
      }
      if (selectCanvas) {
        const objectsFocus = selectCanvas.getObjects().filter(obj => obj.type === 'text' && obj.id === record.id)
        if (objectsFocus.length > 0) {
          const targetObject = objectsFocus[0]
          targetObject.set({ fill: 'yellow' })
          targetObject.animate('scaleX', 10, {
            onChange: selectCanvas.renderAll.bind(selectCanvas),
            duration: 1000,
            easing: fabric.util.ease.easeInOutQuad,
            onComplete() {
              targetObject.animate('scaleX', 1, {
                onChange: selectCanvas.renderAll.bind(selectCanvas),
                duration: 1000,
                easing: fabric.util.ease.easeInOutQuad
              })
            }
          })

          targetObject.animate('scaleY', 10, {
            onChange: selectCanvas.renderAll.bind(selectCanvas),
            duration: 1000,
            easing: fabric.util.ease.easeInOutQuad,
            onComplete() {
              targetObject.animate('scaleY', 1, {
                onChange: selectCanvas.renderAll.bind(selectCanvas),
                duration: 1000,
                easing: fabric.util.ease.easeInOutQuad
              })
            }
          })

          const canvasOffset = selectCanvas._offset
          const targetLeft = targetObject.left + canvasOffset.left + targetObject.width / 2
          const targetTop = targetObject.top + canvasOffset.top + targetObject.height / 2
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

    closeModal() {
      this.addMouseEvents()
    },

    /**
     * Update geo on moving item
     */
    async updateItemOnMoving(id, data) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.version.design_lock_flg === LOCK_FLG_VALUE.no && this.version.function.use_flg === USE_FLG_VALUE.yes) {
          await this.$api.functionItem.update(id, data)
          this.flgNotRenderItem = true
          this.$emit('save', true)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        window.location.reload()
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Go to detail of record
     */
    gotoDetail(record) {
      this.currentId = record.id
      this.$refs.tabItemModal.open(false)
    },

    /**
     * Update Item Num
     */
    async updateNumber() {
      this.loadingImage = true
      const data = this.functionItem.map((item, index) => {
        return {
          id: item.id,
          project_id: item.project_id,
          function_id: item.function_id,
          mst_item_type_id: item.mst_item_type_id,
          item_pk: item.item_pk,
          name: item.name,
          item_num: index + 1,
          last_version_update: item.version_code
        }
      })
      try {
        if (this.version.design_lock_flg === LOCK_FLG_VALUE.no && this.version.function.use_flg === USE_FLG_VALUE.yes) {
          await this.$api.functionItem.updateItemNum(data)
          this.$emit('save', true)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadingImage = false
      }
    },

    /**
     * Check show red event icon
     *
     * @param record
     * @returns {boolean}
     */
    checkFunctionItemHasLogic(record) {
      const typeName = record.mstItemType.name
      if (typeName === 'select' || typeName === 'combo_box' || typeName === 'button') {
        if (record.functionEvent.length === 0 || (record.functionEvent.length > 0 && record.functionEvent.some(event => event.function_event_logicals.length === 0))) {
          return true
        }
      }
      return false
    },

    /**
     * Check show blue event icon
     *
     * @param record
     * @returns {boolean}
     */
    showEvent(record) {
      const typeName = record.mstItemType.name
      if (typeName !== 'select' && typeName !== 'combo_box' && typeName !== 'button' && record.functionEvent.length > 0) {
        return true
      } else if ((typeName === 'select' || typeName === 'combo_box' || typeName === 'button') && record.functionEvent.some(event => event.function_event_logicals.length > 0)) {
        return true
      }
      return false
    },

    /**
     * Check show red icon api
     */
    checkApi(record) {
      const typeName = record.mstItemType.name
      if (typeName !== 'button' &&
          typeName !== 'label' &&
          typeName !== 'link' &&
          typeName !== 'file' &&
          typeName !== 'image' &&
          typeName !== 'document_body' &&
          typeName !== 'document_title' &&
          typeName !== 'document_meta' &&
          typeName !== 'paginate' &&
          typeName !== 'Tab'
      ) {
        if (record.functionItemWriteDatasources.length === 0 && record.functionItemReadDatasources.length === 0) {
          return true
        }
      }
      return false
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
</style>
