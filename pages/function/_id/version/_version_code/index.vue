<template>
  <a-card class="mb-4">
    <template slot="title">
      <span v-if="version.version_code && version.function.name">
        <span>{{ $store.state.project.name + ' / ' }}</span>
        <a @click="goToCategory">{{ $store.state.category.name }}</a>
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
    <template slot="extra">
      <div class="button-wrap">
        <div class="export-btn">
          <a-button class="excel-btn" @click="exportFile">
            <a-icon type="file-excel" />
          </a-button>
        </div>
        <a class="goto-testcase" @click="gotoTestCase(version)">
          {{ $t('module.functionTestCase.goto_testcase') }}
        </a>
      </div>
    </template>
    <a-tabs v-model="activeKey" @change="changeTab">
      <a-tab-pane key="1" :tab="$t('module.versionFunction.version_tab')" class="tab-pane">
        <version-function-form v-if="version.id" :version="version" />
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('module.versionFunction.overview_tab')" class="tab-pane">
        <overview-form
          v-if="
            version.id ||
              functionItem.length > 0 ||
              mstType.length > 0 ||
              mstProperty.length > 0
          "
          :id="version.function_id"
          :version="version"
          :function-item="functionItem"
          :mst-type="mstType"
          :mst-property="mstProperty"
          @save="save"
        />
      </a-tab-pane>
      <a-tab-pane key="3" :tab="$t('module.versionFunction.layout_tab')">
        <function-image-form
          :function-item="functionItem"
          :version-id="id"
          :version="version"
          :refresh="true"
          @handleOK="handleOK"
        />
      </a-tab-pane>
      <a-tab-pane key="4" :tab="$t('module.versionFunction.items_tab')">
        <tab-item
          :version-code="version.version_code"
          :function-id="version.function.id"
          :version="version"
          :function-item="functionItem"
          :mst-property="mstProperty"
          :mst-type="mstType"
          :required-property="requiredProperty"
          :item-language-keys="itemLanguageKeys"
          @save="saveFunctionItem"
          @copyLang="fetchItemLanguageKey(id, version_code)"
        />
      </a-tab-pane>
      <a-tab-pane key="5" tab="Item Design">
        <ImageFunctionItem
          :version-code="version.version_code"
          :function-id="version.function.id"
          :version="version"
          :function-item="functionItem"
          :mst-property="mstProperty"
          :mst-type="mstType"
          :required-property="requiredProperty"
          @save="saveFunctionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="6" :tab="$t('module.versionFunction.validator_tab')">
        <function-item-validation-form
          v-if="version.id || functionItem.length > 0 || mstProperty.length > 0"
          :version="version"
          :function-item="functionItem"
          :mst-item-property="mstProperty"
          @save="save"
        />
      </a-tab-pane>
      <a-tab-pane key="7" :tab="$t('module.versionFunction.message_tab')">
        <tab-message :version="version" @save="save" />
      </a-tab-pane>
      <a-tab-pane key="8" :tab="$t('module.versionFunction.logic_tab')">
        <function-event-form
          :version="version"
          :function-items="functionItem"
          @save="save"
        />
      </a-tab-pane>
      <a-tab-pane key="9" :tab="$t('module.versionFunction.useCase_tab')">
        <FunctionUseCase
          :version="version"
          @success="success"
          @save="saveFunctionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="10" :tab="$t('module.versionFunction.datasource_tab')">
        <FunctionItemDatasource
          :version="version"
          :function-items="functionItem"
          :apis="apis"
          @success="success"
          @save="saveFunctionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="11" :tab="$t('module.tab_function_entity')">
        <tab-function-entity
          ref="tabFunctionEntity"
          :function-item="functionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="12" :tab="$t('module.sequenceDiagram')">
        <SequenceDiagramForm
          :version="version"
          :function-items="functionItem"
          @success="success"
          @save="saveFunctionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="13" :tab="$t('module.design_frontend')">
        <DesignFrontend
          :version-code="version.version_code"
          :function-id="version.function.id"
          :version="version"
          :function-item="functionItem"
          :mst-property="mstProperty"
          @save="saveFunctionItem"
        />
      </a-tab-pane>
      <a-tab-pane key="14" :tab="$t('module.test_case_matrix.tab_title')">
        <TabTestcaseMatrix :version="version" :function-items="functionItem" />
      </a-tab-pane>

      <a-tab-pane key="15" :tab="$t('module.versionFunction.relationship')">
        <TabRelationship :version="version" :function-items="functionItem" :mst-type="mstType" @save="save" />
      </a-tab-pane>

      <a-tab-pane key="16" :tab="$t('module.versionFunction.q&a_tab')">
        <TabQA :version="version" :function-items="functionItem" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import TabItem from '~/components/templates/versionFunction/TabItem.vue'
import TabMessage from '~/components/templates/versionFunction/TabMessage.vue'
import FunctionImageForm from '~/components/templates/functionImage/FunctionImageForm.vue'
import VersionFunctionForm from '~/components/templates/versionFunction/VersionFunctionForm.vue'
import FunctionItemValidationForm from '~/components/templates/functionItemValidation/FunctionItemValidationForm.vue'
import FunctionEventForm from '~/components/templates/functionEvent/FunctionEventForm.vue'
import OverviewForm from '~/components/templates/function/OverviewForm.vue'
import FunctionItemDatasource from '~/components/templates/versionFunction/FunctionItemDatasource.vue'
import SequenceDiagramForm from '~/components/templates/FunctionSequenceDiagram/SequenceDiagramForm.vue'
import FunctionUseCase from '~/components/templates/versionFunction/FunctionUseCase.vue'
import ImageFunctionItem from '~/components/templates/function/ImageFunctionItem'
import TabFunctionEntity from '~/components/templates/versionFunction/TabFunctionEntity'
import TabRelationship from '~/components/templates/versionFunction/TabRelationship.vue'
import TabQA from '~/components/templates/versionFunction/TabQA.vue'
import TabTestcaseMatrix from '~/components/templates/testCase/TabTestcaseMatrix'
import DesignFrontend from '~/components/templates/function/DesignFrontend'
import { API_ROOT_URL, DEFAULT_TITLE, SORT, USE_FLG_VALUE } from '~/constants'

export default {
  components: {
    TabItem,
    TabMessage,
    FunctionImageForm,
    VersionFunctionForm,
    FunctionItemValidationForm,
    FunctionEventForm,
    OverviewForm,
    FunctionItemDatasource,
    ImageFunctionItem,
    FunctionUseCase,
    TabFunctionEntity,
    SequenceDiagramForm,
    TabRelationship,
    TabQA,
    TabTestcaseMatrix,
    DesignFrontend
  },

  beforeDestroy() {
    document.title = DEFAULT_TITLE
  },

  data() {
    return {
      id: +this.$route.params.id || 0,
      version_code: +this.$route.params.version_code || 0,
      SORT,
      version: {
        function: {
          id: 0,
          name: '',
          name_jp: '',
          code: '',
          short_name: '',
          category: {
            id: 0,
            name: ''
          }
        }
      },
      functionItem: [],
      mstProperty: [],
      mstType: [],
      requiredProperty: [],
      itemLanguageKeys: [],
      USE_FLG_VALUE,
      apis: [],
      activeKey: '1',
      DEFAULT_TITLE
    }
  },
  watch: {
    id(newId) {
      this.getDetail(newId, this.version_code)
    },
    version_code(val) {
      this.getDetail(this.id, val)
    }
  },

  created() {
    this.fetchItemLanguageKey(this.id, this.version_code)
  },

  /**
   * Mounted event.
   */
  async mounted() {
    await this.getDetail(this.id, this.version_code)

    await Promise.all([
      this.getFunctionItem(true),
      this.getMstPropertyData(),
      this.getMstTypeData()
    ])
  },

  methods: {
    /**
     * Go to version detail
     */
    gotoTestCase(version) {
      this.$router.push({
        name: 'function-id-version-version_code-test_case',
        params: { id: version.function_id, version_code: version.version_code }
      })
    },

    /**
     * Get item detail
     *
     * @param {Number} id
     * @param {Number} versionCode
     */
    async getDetail(id, versionCode) {
      this.$store.dispatch('setLoading', true)

      try {
        if (id && versionCode) {
          const params = {
            function_id: id,
            version_code: versionCode
          }
          const {
            data: {
              result: { data }
            }
          } = await this.$api.versionFunction.getDetail({ params })
          this.version = data
          const thatVersion = this.version
          thatVersion.max_image_width = 0
          thatVersion.max_image_height = 0
          if (this.version && this.version.images.length > 0) {
            for (let i = 0; i < this.version.images.length; i++) {
              const imageCanvas = this.version.images[i]
              const image = new Image()
              image.src = API_ROOT_URL + imageCanvas.image_path
              image.addEventListener('load', function() {
                imageCanvas.width = image.naturalWidth
                imageCanvas.height = image.naturalHeight
                thatVersion.max_image_width = Math.max(
                  image.naturalWidth,
                  thatVersion.max_image_width
                )
                thatVersion.max_image_height =
                  thatVersion.max_image_height + image.naturalHeight
              })
            }
          }
          this.$store.dispatch('addProject', {
            id: this.version.project.id,
            name: this.version.project.name
          })
          this.$store.dispatch('addCategory', {
            id: this.version.function.category.id,
            name: this.version.function.category.name
          })
          const tabCheck = window.location.hash.substring(1)
          if (tabCheck === 'tab_version') {
            this.activeKey = '1'
          } else if (tabCheck === 'tab_info') {
            this.activeKey = '2'
          } else if (tabCheck === 'tab_images') {
            this.activeKey = '3'
          } else if (tabCheck === 'tab_items') {
            this.activeKey = '4'
          } else if (tabCheck === 'tab_validations') {
            this.activeKey = '6'
          } else if (tabCheck === 'tab_messages') {
            this.activeKey = '7'
          } else if (tabCheck === 'tab_logics') {
            this.activeKey = '8'
          } else if (tabCheck === 'tab_useCase') {
            this.activeKey = '9'
          } else if (tabCheck === 'tab_datasources') {
            this.activeKey = '10'
          } else if (tabCheck === 'tab_function_entity') {
            this.activeKey = '11'
          } else if (tabCheck === 'tab_sequence_diagram') {
            this.activeKey = '12'
          } else if (tabCheck === 'tab_design_frontend') {
            this.activeKey = '13'
          } else if (tabCheck === 'tab_testcase') {
            this.activeKey = '14'
          } else if (tabCheck === 'tab_relationships') {
            this.activeKey = '15'
          } else if (tabCheck === 'tab_qa') {
            this.activeKey = '16'
          }
          if (this.version) {
            document.title = this.version.function.code
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
    handleOK() {
      this.getDetail(this.id, this.version_code)
    },
    save() {
      this.getFunctionItem(true)
    },
    success() {
      this.getFunctionItem(true)
    },
    /**
     * Get full data function item
     */
    async getFunctionItem(useFlg) {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.version_code = this.version.version_code
        params.function_id = this.version.function_id
        params.order_by = 'item_num'
        params.order_type = SORT.asc
        if (useFlg) {
          params.use_flg = USE_FLG_VALUE.yes
        }

        const {
          data: {
            result: { data }
          }
        } = await this.$api.functionItem.list({ params })
        this.functionItem = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get Mst Property Data
     */
    async getMstPropertyData() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.order_type = SORT.asc
        params.not_limit = true
        params.use_flg = USE_FLG_VALUE.yes
        const {
          data: {
            result: { data }
          }
        } = await this.$api.mstItemProperty.list({ params })
        this.mstProperty = data
        this.requiredProperty = this.mstProperty.filter(
          item => item.required === 1
        )
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Get Mst Type Data
     */
    async getMstTypeData() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.order_type = SORT.asc
        params.not_limit = true
        params.use_flg = USE_FLG_VALUE.yes
        const {
          data: {
            result: { data }
          }
        } = await this.$api.mstItemType.list({ params })
        this.mstType = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    saveFunctionItem(val) {
      this.getFunctionItem(val)
    },

    goToCategory() {
      this.$router.push({ name: 'function' })
    },

    changeTab(key) {
      const hash = {
        1: 'tab_version',
        2: 'tab_info',
        3: 'tab_images',
        4: 'tab_items',
        5: 'item_design',
        6: 'tab_validations',
        7: 'tab_messages',
        8: 'tab_logics',
        9: 'tab_useCase',
        10: 'tab_datasources',
        11: 'tab_function_entity',
        12: 'tab_sequence_diagram',
        13: 'tab_design_frontend',
        14: 'tab_testcase',
        15: 'tab_relationships',
        16: 'tab_qa'
      }

      const newHash = hash[key]
      const url = new URL(window.location.href)
      url.hash = newHash
      url.search = ''
      const newUrl = url.href
      window.history.replaceState(null, '', newUrl)
    },

    async exportFile() {
      try {
        const fileDownload = require('js-file-download')
        const params = {}
        params.project_id = this.$store.state.project.id
        params.version_code = this.version.version_code
        params.function_id = this.version.function_id
        const rawData = await this.$api.function.exportExcel(params, {
          responseType: 'blob'
        })
        const fileName =
          '[' +
          this.version.function.code +
          ']' +
          ':' +
          this.version.function.name +
          '.xlsx'
        fileDownload(rawData.data, fileName)
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async fetchItemLanguageKey(functionId, versionCode) {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.function_id = functionId
        params.version_code = versionCode
        const { data: { result: { data } } } = await this.$api.functionItemLanguageKey.list({ params })
        this.itemLanguageKeys = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.goto-testcase {
  font-weight: 700;
  font-size: 16px;
}
.excel-btn {
  background-color: rgb(49, 190, 125);
}
.button-wrap {
  display: flex;
  .export-btn {
    margin-right: 10px;
  }
}
/deep/ {
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0 0 0 0;
    padding: 12px 6px;
    border-right: 1px solid #d9d9d9;
  }
  .ant-tabs-nav .ant-tabs-tab:last-child {
    border-right: none;
  }
}
</style>
