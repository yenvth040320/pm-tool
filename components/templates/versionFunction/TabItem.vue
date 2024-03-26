<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4 no-border">
        <template slot="extra">
          <a-switch v-model="checkSwitch" class="switch-btn" @change="onChangeSwitch" />
          <a-button
            type="primary"
            class="min-w-100"
            title="Tạo mới"
            :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="add"
          >
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('common.new') }}
          </a-button>

          <a-button
            html-type="submit"
            type="primary"
            class="min-w-100"
            title="Tạo nhiều"
            :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="addMulti"
          >
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('module.functionItem.multi_add') }}
          </a-button>
          <a-button
            v-if="checkCopyItem()"
            class="min-w-100 copy-btn"
            title="Copy hạng mục"
            :disabled="version.design_lock_flg === LOCK_FLG_VALUE.yes || version.function.use_flg === USE_FLG_VALUE.no"
            @click="openCopyModal"
          >
            <font-awesome-icon icon="copy" class="mr-1" />
            {{ $t('module.functionItem.copy') }}
          </a-button>
          <a-button
            v-if="functionItem.length > 0"
            class="min-w-100 copy-btn"
            title="Copy language"
            @click="copyLanguage"
          >
            <font-awesome-icon icon="copy" class="mr-1" />
            {{ $t('module.functionItem.copy_lang') }}
          </a-button>
          <a-button
            v-if="functionItem.length > 0"
            class="min-w-100 copy-all-code-btn"
            title="Copy all code"
            @click="copyAllItemSampleCode"
          >
            <font-awesome-icon icon="copy" class="mr-1" />
            {{ $t('module.functionItem.copy_all_code') }}
          </a-button>
          <a-button
            v-if="functionItem.length > 0"
            class="reset-all-html-btn min-w-100"
            title="Tạo tất cả html id"
            html-type="button"
            type="danger"
            @click="syncAllItemHtmlIds"
          >
            <a-icon type="redo" class="mr-1" />
            {{ $t('module.functionItem.reset_all_html_id') }}
          </a-button>
        </template>

        <a-table
          ref="tabItemTable"
          bordered
          :data-source="functionItem"
          :row-key="record => record.item_num"
          :row-class-name="rowClassName"
          :custom-row="customRow"
          :pagination="false"
          :columns="columns"
          :loading="load"
          class="main-table"
        >
          <template
            slot="item_num"
            slot-scope="text, record"
          >
            <a-icon type="link" @click="copyItem(record.item_num)" />
            {{ record.item_num }}
          </template>
          <template
            slot="mst_item_type_id"
            slot-scope="text, record"
          >
            <span v-if="record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no" class="function-item-name" @click="gotoDetail(record)">
              {{ record.mstItemType ? record.mstItemType.name : '' }}
            </span>
            <span v-else>
              {{ record.mstItemType ? record.mstItemType.name : '' }}
            </span>
          </template>
          <template
            slot="name"
            slot-scope="text, record"
          >
            <span v-if="record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no" class="function-item-name" @click="gotoDetail(record)">
              {{ record.name }}
            </span>
            <span v-else>
              {{ record.name }}
            </span>
          </template>
          <template
            slot="html_id"
            slot-scope="text, record"
          >
            <div v-if="record.functionItemHtmlId">
              <div>
                {{ $t('module.functionItem.html_id_title_id') + ': ' }}
                <span class="link" @click="copyToClipBoard(record.functionItemHtmlId.title_id)">{{ record.functionItemHtmlId?.title_id }}</span>
                <a-icon type="copy" class="copy-icon" @click="copyToClipBoard(record.functionItemHtmlId.title_id)" />
              </div>
              <div>
                {{ $t('module.functionItem.html_id_input_id') + ': ' }}
                <span class="link" @click="copyToClipBoard(record.functionItemHtmlId.input_id)">{{ record.functionItemHtmlId?.input_id }}</span>
                <a-icon type="copy" class="copy-icon" @click="copyToClipBoard(record.functionItemHtmlId.input_id)" />
              </div>
            </div>
            <div v-if="record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no">
              <a-icon type="redo" @click="syncHtmlId(record)" />
            </div>
          </template>
          <template
            slot="property"
            slot-scope="text, record"
          >
            <div v-if="record.functionItemProperties.length > 0 && record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no" class="function-item-name">
              <span v-for="(item, index) in record.functionItemProperties" :key="index">
                <span
                  v-if="index !== record.functionItemProperties.length - 1"
                >
                  {{ item?.mst_item_property?.name + ': ' }}
                  <span class="link" @click="copyToClipBoard(item.value)">{{ item.value }}</span>
                  <a-icon v-if="item?.mst_item_property?.name === 'Label Text'" type="copy" class="copy-icon" @click="copyToClipBoard(item.value)" />
                  <span>, </span>
                </span>
                <span
                  v-else
                >
                  {{ item?.mst_item_property?.name + ': ' }}
                  <span class="link" @click="copyToClipBoard(item.value)">{{ item.value }}</span>
                  <a-icon v-if="item?.mst_item_property?.name === 'Label Text'" type="copy" class="copy-icon" @click="copyToClipBoard(item.value)" />
                </span>
              </span>
            </div>
            <div v-else>
              <span v-for="(item, index) in record.functionItemProperties" :key="index">
                <span
                  v-if="index !== record.functionItemProperties.length - 1"
                >
                  {{ item?.mst_item_property?.name + ': ' }}
                  <span class="link" @click="copyToClipBoard(item.value)">{{ item.value }}</span>
                  <a-icon v-if="item?.mst_item_property?.name === 'Label Text'" type="copy" class="copy-icon" @click="copyToClipBoard(item.value)" />
                  <span>, </span>
                </span>
                <span
                  v-else
                >
                  {{ item?.mst_item_property?.name + ': ' }}
                  <span class="link" @click="copyToClipBoard(item.value)">{{ item.value }}</span>
                  <a-icon v-if="item?.mst_item_property?.name === 'Label Text'" type="copy" class="copy-icon" @click="copyToClipBoard(item.value)" />
                </span>
              </span>
            </div>
          </template>
          <template
            slot="action"
            slot-scope="text, record"
          >
            <a-button
              html-type="button"
              size="large"
              :disabled="load"
              class="copy-code-btn"
              title="Copy code front end"
              @click="copyTypeSampleCode(record)"
            >
              <a-icon type="code" />
            </a-button>
            <a-button
              v-if="record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
              html-type="button"
              type="primary"
              title="Chỉnh sửa"
              :disabled="load"
              @click="gotoDetail(record)"
            >
              <font-awesome-icon icon="pencil-alt" />
            </a-button>
            <a-button
              v-if="record.use_flg === USE_FLG_VALUE.yes && version.design_lock_flg === LOCK_FLG_VALUE.no && version.function.use_flg === USE_FLG_VALUE.yes"
              html-type="button"
              type="danger"
              size="small"
              title="Dừng sử dụng"
              :disabled="load"
              @click="confirmToDelete(record.id)"
            >
              <a-icon type="stop" />
            </a-button>
            <a-button
              v-if="record.use_flg === USE_FLG_VALUE.no && record.id"
              html-type="button"
              type="primary"
              size="small"
              title="Sử dụng"
              :disabled="load"
              @click="confirmToEnable(record.id)"
            >
              <a-icon type="check-circle" />
            </a-button>
          </template>
        </a-table>
        <tab-item-modal
          :id="currentId"
          ref="tabItemModal"
          :version="version"
          :mst-type="mstType"
          :mst-property="mstProperty"
          :required-property="requiredProperty"
          :function-item="functionItem"
          @save="save"
        />
        <add-multi-function-item-modal
          ref="addMultiFunctionItemModal"
          :version="version"
          @save="save"
        />
        <tab-item-copy-modal
          ref="tabItemCopyModal"
          :version="version"
          @save="save"
        />
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { USE_FLG_VALUE, SORT, MST_ITEM_TYPE, LOCK_FLG_VALUE } from '~/constants'
import TabItemModal from '~/components/templates/versionFunction/TabItemModal'
import AddMultiFunctionItemModal from '~/components/templates/versionFunction/AddMultiFunctionItemModal'
import TabItemCopyModal from '~/components/templates/versionFunction/TabItemCopyModal'
import Openai from '~/mixins/openai'
export default {
  components: { TabItemModal, AddMultiFunctionItemModal, TabItemCopyModal },

  mixins: [Openai],

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
    },
    itemLanguageKeys: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      functionItemProperties: [],
      USE_FLG_VALUE,
      SORT,
      MST_ITEM_TYPE,
      showValidate: false,
      LOCK_FLG_VALUE,
      visible: false,
      drawerTitle: '',
      load: false,
      checkSwitch: true,
      currentId: 0,
      translateEng: {}
    }
  },

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
          title: this.$t('module.functionItem.item_num'),
          scopedSlots: { customRender: 'item_num' },
          dataIndex: 'item_num',
          width: 80,
          align: 'center'
        },
        {
          title: this.$t('module.functionItem.mst_item_type_id'),
          scopedSlots: { customRender: 'mst_item_type_id' },
          align: 'left',
          width: 100
        },
        {
          title: this.$t('module.functionItem.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'left',
          width: 150
        },
        {
          title: this.$t('module.functionItem.html_id'),
          scopedSlots: { customRender: 'html_id' },
          align: 'left',
          width: 450
        },
        {
          title: this.$t('module.functionItem.property'),
          scopedSlots: { customRender: 'property' },
          align: 'left'
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 180,
          align: 'center'
        }
      ]
    }
  },

  created() {
  },

  updated() {
    const table = this.$refs.tabItemTable.$el
    const tbody = table.querySelector('.ant-table-tbody')
    const item = tbody.querySelector(`[data-row-key="${this.$route.query.function_item_num}"]`)
    if (item) {
      item.scrollIntoView()
    }
  },

  methods: {
    checkCopyItem() {
      if (this.functionItem.length === 0 || (this.functionItem.length === 1 && this.functionItem[0]?.mstItemType?.name === 'document_body')) {
        return true
      } else {
        return false
      }
    },
    /**
     * open add modal
     */
    add() {
      this.currentId = null
      this.$refs.tabItemModal.open(true, 0, 0, 0, 0, 0)
    },

    /**
     * Open detail modal
     */
    gotoDetail(record) {
      this.currentId = record.id
      this.$refs.tabItemModal.open(false)
    },

    /**
     * Open multi add modal
     */
    addMulti() {
      this.$refs.addMultiFunctionItemModal.openModal()
    },

    /**
     * Custom css row not use
     */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    /**
     * Confirm delete modal
     */
    confirmToDelete(id) {
      if (id) {
        this.$confirm({
          title: this.$t('text.confirm_to_delete'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgRecord(id, USE_FLG_VALUE.no)
        })
      }
    },

    /**
     * Open confirm modal
     */
    confirmToEnable(id) {
      if (id) {
        this.$confirm({
          title: this.$t('text.confirm_to_enable'),
          okText: this.$t('common.yes'),
          okType: 'danger',
          cancelText: this.$t('common.no'),
          onOk: () => this.updateUseFlgRecord(id, USE_FLG_VALUE.yes)
        })
      }
    },

    /**
     * Delete record
     */
    async updateUseFlgRecord(id, flg) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          use_flg: flg
        }
        if (flg === USE_FLG_VALUE.no) {
          data.function_image_id = null
          data.end_y = 0
          data.end_x = 0
          data.start_y = 0
          data.start_x = 0
        }
        await this.$api.functionItem.updateUseFlgFunctionItem(id, data)
        this.$bus.$emit('itemEdited', flg)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.$emit('save', this.checkSwitch)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },
    /**
     * On save event
     */
    save() {
      this.$emit('save', this.checkSwitch)
    },

    /**
     * Validate required content check
     */
    checkRequired(rule, value, callback, item, field) {
      if (item[field] === undefined || item[field] === '') {
        this.$antdvalidate.checkRequired(rule, value, callback, item[field])
      } else {
        callback()
      }
    },

    onChangeSwitch() {
      this.$emit('save', this.checkSwitch)
    },

    customRow(record) {
      return {
        on: {
          dblclick: () => {
            this.currentId = record.id
            this.$refs.tabItemModal.open(false)
          }
        }
      }
    },

    openCopyModal() {
      this.$refs.tabItemCopyModal.openModal()
    },

    /**
     * Copy Url
     */
    copyItem(itemNum) {
      const url = new URL(window.location.href)
      url.searchParams.set('function_item_num', itemNum)
      url.hash = 'tab_items'
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    async syncHtmlId(record) {
      this.$store.dispatch('setLoading', true)

      try {
        const functionData = record.function
        if (!record.function.short_name) {
          this.$notification.error({
            message: this.$t('module.sampleCode_copy_null_short_name_err')
          })
          return
        }
        if (!record.functionItemHtmlId) {
          await this.$api.functionItem.syncHtml(record.id, functionData)
        } else {
          functionData.item_num = record.item_num
          await this.$api.functionItemHtmlId.update(record.functionItemHtmlId.id, functionData)
        }

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        this.$emit('save', this.checkSwitch)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    copyToClipBoard(data) {
      navigator.clipboard.writeText(data)
      this.$message.success(this.$t('module.functionItem.copy_message'))
    },

    /**
     * Convert String To Snake Case
     *
     * @param inputString
     *
     * @returns {string}
     */
    convertSnakeCase(inputString) {
      return inputString.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()
    },

    /**
     * Creates language key structure
     *
     * @param itemNumber
     * @param language
     *
     * @returns {string}
     */
    createLanguageKeyStructure(itemNumber, language) {
      const functionCode = this.version.function.code
      // find if user update new function's short name
      const functionShortName = this.functionItem.find(e => e.item_num === Number(itemNumber)).function.short_name
      if (itemNumber < 10) {
        itemNumber = itemNumber.toString().padStart(2, '0')
      }
      return functionCode + '.' + functionShortName + '.' + itemNumber + '.' + language
    },

    /**
     * Convert Translated Data To Language file format and copy to clipboard
     *
     * @param itemWithLabelText
     * @param responseTranslateArr
     *
     * @returns Object
     */
    convertTranslateData(itemWithLabelText, responseTranslateArr) {
      const result = {}
      if (responseTranslateArr.length > 0) {
        const responseEn = responseTranslateArr[0]
        const responseVi = responseTranslateArr[1]
        if (responseEn && Object.keys(responseEn).length > 0) {
          const enObj = {}
          const jaObj = {}
          const viObj = {}
          Object.entries(responseEn).forEach(([key, value]) => {
            const langKey = this.createLanguageKeyStructure(key, this.convertSnakeCase(value))
            enObj[langKey] = value
            jaObj[langKey] = itemWithLabelText[key]
            if (responseVi) {
              viObj[langKey] = responseVi[key]
            }
          })
          result.en = enObj
          result.ja = jaObj
          if (Object.keys(viObj).length > 0) {
            result.vi = viObj
          }
        }
      }
      return result
    },

    async saveTranslateKey(translateData) {
      try {
        const dataKey = []
        if (Object.keys(translateData).length > 0) {
          Object.entries(translateData).forEach(([key, value]) => {
            dataKey.push({
              project_id: this.$store.state.project.id,
              function_id: this.version.function_id,
              version_code: this.version.version_code,
              item_pk: key,
              key: this.convertSnakeCase(value)
            })
          })
        }
        if (dataKey.length > 0) {
          await this.$api.functionItemLanguageKey.multiStore(dataKey)
        }
      } catch (e) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Copy all language file content to clipboard
     */
    async copyLanguage() {
      this.$store.dispatch('setLoading', true)
      try {
        // TODO: convert function items data to object { *item_num: label_value }
        const itemWithLabelText = this.convertItemToJsonObject()
        // required function short name
        const functionShortName = this.functionItem[0].function.short_name
        if (!functionShortName) {
          await navigator.clipboard.writeText(this.$t('module.sampleCode_copy_null_short_name_err'))
          this.$message.error(this.$t('module.sampleCode_copy_null_short_name_err'))
          return
        }
        const itemHasLabelText = this.getFunctionItemHasLabelText()
        const itemNeedTranslate = this.getItemLabelNeedTranslate(itemHasLabelText.map(i => i.item_pk), this.itemLanguageKeys.map(i => i.item_pk))
        const message = 'Dịch đoạn tiếng Nhật sau sang tiếng Anh, sau đó dịch tiếng anh sang tiếng Việt và giữ nguyên format JSON' + JSON.stringify(itemWithLabelText)
        // TODO: Call gpt api
        const response = await this.chatAssistant(message)
        // get content inside {}
        const translateData = this.getTranslateObject(response)
        this.translateEng = translateData[0]
        const result = this.convertTranslateData(itemWithLabelText, translateData)
        if (itemNeedTranslate.length > 0 && Object.keys(this.translateEng).length > 0) {
          const itemNeedSave = {}
          itemNeedTranslate.forEach(i => {
            const itemKey = this.functionItem.find(item => item.item_pk === Number(i)).item_num
            itemNeedSave[i] = this.translateEng[itemKey]
          })
          await this.saveTranslateKey(itemNeedSave)
          this.$emit('copyLang')
        }
        // copy to clipboard
        if (Object.keys(result).length > 0) {
          this.copyToClipBoard(JSON.stringify(result, null, 2))
        }
      } catch (e) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        console.error(e)
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Convert function items data to object { *item_num: label_value }
     */
    convertItemToJsonObject() {
      return this.functionItem.reduce((result, item) => {
        if (item.functionItemProperties) {
          const labelValue = item.functionItemProperties.find(prop => prop.mst_item_property.name === 'Label Text')
          if (labelValue) {
            result[item.item_num] = labelValue.value
          }
        }
        return result
      }, {})
    },

    /**
     * Get Function Item Has LabelText
     */
    getFunctionItemHasLabelText() {
      return this.functionItem.filter(item => {
        return item.functionItemProperties && item.functionItemProperties.find(prop => prop.mst_item_property.name === 'Label Text')
      })
    },

    /**
     * Get item that has label and need translating by check diff between all items has label and item in function_item_language_keys table
     *
     * @param itemWithLabelText All items have a label
     * @param itemTranslatedPk All items which label were translated (in function_item_language_keys table)
     *
     * @returns {*}
     */
    getItemLabelNeedTranslate(itemWithLabelText, itemTranslatedPk) {
      const diff = itemWithLabelText.filter(x => !itemTranslatedPk.includes(Number(x)))
      return diff
    },

    /**
     * Find object in api answer
     *
     * @param response
     *
     * @returns {*[]}
     */
    getTranslateObject(response) {
      const regex = /\{([^}]+)\}/g
      const translateData = []
      let match

      while ((match = regex.exec(response)) !== null) {
        const jsonString = match[0]
        translateData.push(JSON.parse(jsonString))
      }
      return translateData
    },

    /**
     * Replace value in sample code and copy to clipboard
     *
     * @param record Row record
     */
    async copyTypeSampleCode(record) {
      try {
        // check require mst type sample_code
        let typeSampleCode = record.mstItemType.sample_code ? record.mstItemType.sample_code : ''
        if (!typeSampleCode) {
          this.$notification.error({
            message: this.$t('module.sampleCode_in_mst_type_not_found') + record.mstItemType.name
          })
          return
        }
        // replace space outside {} with \n
        typeSampleCode = typeSampleCode.replace(/(?<!{[^}]*)(\s+)(?![^{]*})/g, '\n')
        typeSampleCode = await this.handleSampleCode(record, typeSampleCode)
        if (typeSampleCode) {
          this.copyToClipBoard(typeSampleCode)
        }
      } catch (e) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        console.error(e)
      }
    },

    /**
     * Handle Sample Code
     *
     * @param record Function Item Record
     * @param typeSampleCode Result code
     *
     * @returns {*}
     */
    handleSampleCode(record, typeSampleCode) {
      typeSampleCode = this.replaceCodeByProperties(record, typeSampleCode)
      typeSampleCode = this.addTestIdToCode(record, typeSampleCode)
      typeSampleCode = this.removeUnnecessaryValue(typeSampleCode)
      return typeSampleCode
    },

    /**
     * Replace Code By Properties
     *
     * @param record Function Item Record
     * @param typeSampleCode Result code
     *
     * @returns {*}
     */
    replaceCodeByProperties(record, typeSampleCode) {
      const itemProperties = record.functionItemProperties
      const propsArr = []
      if (itemProperties.length > 0) {
        itemProperties.forEach(property => {
          const keyName = '{' + property.mst_item_property.name + '_value}'
          propsArr.push({
            [keyName]: property.value
          })
        })
      }
      if (propsArr.length > 0) {
        for (const e of propsArr) {
          const valueReplace = Object.values(e)
          const key = Object.keys(e)
          const itemHasLanguageKey = this.itemLanguageKeys.find(e => e.item_pk === record.item_pk)
          if (key[0] === '{Label Text_value}' && !itemHasLanguageKey) {
            this.$message.error(this.$t('module.functionItem.language_key_not_found'))
            return
          }
          typeSampleCode = this.handleReplacePropsValue(key[0], valueReplace[0], record, typeSampleCode, itemHasLanguageKey)
        }
      }
      return typeSampleCode
    },

    /**
     * Handle Replace Props Value
     *
     * @param replaceTarget Target to replace have _value
     * @param replaceValue Value of property to replace
     * @param record Function Item Record
     * @param typeSampleCode Result code
     * @param itemHasLanguageKey Language key to replace to Label Text_value
     *
     * @returns {*}
     */
    handleReplacePropsValue(replaceTarget, replaceValue, record, typeSampleCode, itemHasLanguageKey) {
      if (replaceTarget === '{Label Text_value}') {
        return typeSampleCode.replace(replaceTarget, this.createLanguageKeyStructure(record.item_num, itemHasLanguageKey.key))
      } else {
        return typeSampleCode.replace(replaceTarget, replaceValue)
      }
    },

    /**
     * Add title-id and input-id to code
     *
     * @param record Function item record
     * @param code Result code
     *
     * @returns {string}
     */
    addTestIdToCode(record, code) {
      if (record.functionItemHtmlId && code) {
        const titleId = record.functionItemHtmlId.title_id
        const inputId = record.functionItemHtmlId.input_id

        const index = code.lastIndexOf('/>')
        if (index !== -1) {
          if (code.includes('button')) {
            code = code.slice(0, index) + `button-id="${titleId}"\n` + code.slice(index)
          } else {
            code = code.slice(0, index) + ` title-id="${titleId}"\n input-id="${inputId}"\n` + code.slice(index)
          }
        }
      }
      return code
    },

    /**
     * Remove _value row left
     *
     * @param code
     *
     * @returns {*}
     */
    removeUnnecessaryValue(code) {
      if (code) {
        const lines = code.split('\n')

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('_value')) {
            lines.splice(i, 1)
            i--
          }
        }

        code = lines.join('\n')
      }
      return code
    },

    /**
     * Copy All Item Sample Code
     */
    copyAllItemSampleCode() {
      let result = ''
      this.functionItem.forEach(item => {
        let typeSampleCode = item.mstItemType.sample_code ? item.mstItemType.sample_code : ''
        // replace space outside {} with \n
        if (typeSampleCode) {
          typeSampleCode = typeSampleCode.replace(/(?<!{[^}]*)(\s+)(?![^{]*})/g, '\n')
          typeSampleCode = this.handleSampleCode(item, typeSampleCode)
          if (typeSampleCode) {
            result += typeSampleCode + '\n'
          }
        }
      })
      if (result) {
        this.copyToClipBoard(result)
      }
    },

    async syncAllItemHtmlIds() {
      this.$store.dispatch('setLoading', true)

      try {
        const data = []
        const functionShortName = this.functionItem[0].function.short_name
        if (!functionShortName) {
          this.$notification.error({
            message: this.$t('module.sampleCode_copy_null_short_name_err')
          })
          return
        }
        this.functionItem.forEach(item => {
          data.push({
            id: item.id,
            item_num: item.item_num,
            project_id: item.project_id,
            function_id: item.function_id,
            version_code: item.version_code,
            item_pk: item.item_pk,
            function: {
              code: item.function.code,
              short_name: item.function.short_name
            },
            functionItemHtmlId: item.functionItemHtmlId
          })
        })
        await this.$api.functionItem.resetAllHtmlId(data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        this.$emit('save', this.checkSwitch)
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
  .ant-table-tbody {
    .disabled-row {
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
  .anticon-copy > svg,
  .anticon-redo > svg {
    width: 1.3rem;
    height: 1.3rem;
  }
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
.margin-none {
  margin: 0;
}
.border-required {
  border: 1px solid #f5222d;
}
.disabled {
  pointer-events: none;
}
.switch-btn {
  margin-right: 15px;
}
.function-item-name {
  cursor: pointer;
  display: block;
}
.copy-btn {
  background-color: $warning-color;
}
.copy-icon {
  margin-left: 8px;
}
.copy-code-btn {
  background-color: $warning-color;
}
.copy-all-code-btn {
  background-color: #31be7d;
}
.reset-all-html-btn {
  :deep() {
    .anticon-redo > svg {
      width: 1rem;
      height: 1rem;
    }
  }
}
.link {
  color: #1890ff;
  cursor: pointer;
}
</style>
