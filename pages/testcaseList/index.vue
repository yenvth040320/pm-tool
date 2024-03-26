<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + (this.$store.state.category.name ? this.$store.state.category.name + ' / ': '') + $t('module.function') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          ghost
          title="Tạo mới"
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.function.category_id')"
              prop="category_id"
            >
              <a-select
                v-model="filters.category_id"
                :placeholder="$t('module.function.category_id')"
                :filter-option="filterOption"
                show-search
                @change="setCategory(filters.category_id)"
              >
                <a-select-option
                  v-for="(item, index) in categories"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.function.code')"
              prop="code"
            >
              <a-input
                v-model="filters.code"
                :placeholder="$t('module.function.code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.function.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.function.name')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.function.name_jp')"
              prop="name_jp"
            >
              <a-input
                v-model="filters.name_jp"
                :placeholder="$t('module.function.name_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              title="Tìm kiếm"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              title="Xoá điều kiện tìm kiếm"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->
      <div class="action-function">
        <div class="pb-4">
          <a-button
            html-type="button"
            type="primary"
            class="min-w-100"
            :disabled="loading"
            @click="toggleExpandAll"
          >
            <a-icon v-if="!allExpanded" type="plus" />
            <a-icon v-else type="minus" />
            {{ allExpanded ? $t('common.close_all_node') : $t('common.expand_all_node') }}
          </a-button>
        </div>
      </div>

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :loading="loading"
        :expanded-row-keys="expandedKeys"
        :pagination="pagination"
        :expand-row-by-click="false"
        :row-class-name="rowClassName"
        class="components-table-demo-nested"
        @expandedRowsChange="onExpand"
        @change="handleTableChange"
      >
        <template
          slot="name"
          slot-scope="text, record"
        >
          <NuxtLink :to="`/function/${record.id}/version/${record.latest_version}`">
            {{ '(' + record.latest_version + '): ' + record.name }}
          </NuxtLink>
        </template>
        <template
          slot="name_jp"
          slot-scope="text, record"
        >
          <NuxtLink
            v-if="record.name_jp"
            :to="`/function/${record.id}/version/${record.latest_version}`"
          >
            {{ '(' + record.latest_version + '): ' + record.name_jp }}
          </NuxtLink>
        </template>
        <template
          slot="testcase_number"
          slot-scope="text, record"
        >
          {{ record.latestTestcaseNumbers.length }}
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Chỉnh sửa"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>
        </template>

        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :data-source="record.versionFunctions"
          :row-class-name="rowClassNameChild"
          :row-key="item => item.id"
          :pagination="false"
        >
          <template
            slot="version_code"
            slot-scope="text, item"
          >
            <NuxtLink :to="`/function/${item.function_id}/version/${item.version_code}`">
              {{ item.version_code }}
            </NuxtLink>
          </template>
          <template
            slot="version_name"
            slot-scope="text, item"
          >
            <NuxtLink :to="`/function/${item.function_id}/version/${item.version_code}`">
              {{ item.name }}
            </NuxtLink>
          </template>
          <template
            slot="testcase_number"
            slot-scope="text, item"
          >
            {{ item.testcase_numbers.length }}
          </template>
          <template
            slot="description"
            slot-scope="text, item"
          >
            <div class="description-version">
              {{ item.description }}
            </div>
          </template>
          <template
            slot="testcase"
            slot-scope="text, item"
          >
            <NuxtLink :to="`/function/${item.function_id}/version/${item.version_code}#tab_testcase`">
              {{ $t('module.functionTestCase.goto_testcase') }}
            </NuxtLink>
          </template>
        </a-table>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <NotificationProjectNotSelectedVue />
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { USE_FLG, USE_FLG_VALUE, LOCL_FLG, LOCK_FLG_VALUE } from '~/constants'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    NotificationProjectNotSelectedVue
  },

  mixins: [
    DataTable
  ],
  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      params.category_id = this.$store.state.category.id ? this.$store.state.category.id : undefined
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }

      const { data: { result: { data, meta } } } = await this.repository.getFunctionTestcase({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 20
      }
      this.data = data
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'function',
      visible: false,
      currentId: 0,
      filters: {
        category_id: +this.$route.query.category_id || (this.$store.state.category.id ? this.$store.state.category.id : undefined),
        code: this.$route.query.code || undefined,
        name: this.$route.query.name || undefined,
        name_jp: this.$route.query.name_jp || undefined
      },
      defaultParams: {
        not_admin: 1,
        project_id: this.$store.state.project.id
      },
      USE_FLG,
      USE_FLG_VALUE,
      project: {},
      category: {},
      LOCL_FLG,
      LOCK_FLG_VALUE,
      notifiSelectProject: false,
      notifiSelectCategory: false,
      innerData: [],
      increase: false,
      categories: [],
      expandedKeys: [],
      allExpanded: false,
      checkedId: [],
      allChecked: false,
      errorFound: false
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          scopedSlots: { customRender: 'is_check' },
          dataIndex: 'is_check',
          width: 50
        },
        {
          title: this.$t('module.function.code'),
          dataIndex: 'code',
          sorter: true
        },
        {
          title: this.$t('module.function.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          sorter: true
        },
        {
          title: this.$t('module.function.name_jp'),
          dataIndex: 'name_jp',
          scopedSlots: { customRender: 'name_jp' },
          sorter: true
        },
        {
          title: this.$t('module.testcaseList.testcase_number'),
          scopedSlots: { customRender: 'testcase_number' }
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },
    headerInner() {
      return [
        {
          title: this.$t('module.versionFunction.version_code'),
          scopedSlots: { customRender: 'version_code' },
          dataIndex: 'version_code',
          width: 140
        },
        {
          title: this.$t('module.versionFunction.name'),
          scopedSlots: { customRender: 'version_name' },
          dataIndex: 'name',
          width: 200
        },
        {
          title: this.$t('module.functionTestCase'),
          scopedSlots: { customRender: 'testcase' },
          dataIndex: 'testcase',
          width: 200
        },
        {
          title: this.$t('module.versionFunction.description'),
          scopedSlots: { customRender: 'description' },
          dataIndex: 'description'
        },
        {
          title: this.$t('module.testcaseList.testcase_number'),
          scopedSlots: { customRender: 'testcase_number' }
        }
      ]
    },
    innerColumns() {
      return this.headerInner.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },
    isVersionDisabled() {
      return function(version) {
        return version.disabled
      }
    },
    allVersionsLocked() {
      return function(record) {
        return record.versionFunctions.some(version => version.design_lock_flg === LOCK_FLG_VALUE.no || version.code_lock_flg === LOCK_FLG_VALUE.no || version.testcase_lock_flg === LOCK_FLG_VALUE.no)
      }
    }
  },

  watch: {
    data: {
      handler: 'checkLockedVersions',
      deep: true
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    if (this.$store.state.project.id === 0) {
      this.notifiSelectProject = true
    }
    this.getCategories()
  },

  methods: {
    toggleExpandAll() {
      if (this.allExpanded) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.data.map(record => record.id)
      }
      this.allExpanded = !this.allExpanded
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.allExpanded = false
    },
    /**
     * Get categories
     */
    async getCategories() {
      const params = {
        not_limit: true,
        project_id: this.$store.state.project.id
      }
      const { data: { result: { data } } } = await this.$api.category.list({ params })
      this.categories = data
    },
    setCategory(categoryId) {
      const category = this.categories.find(item => item.id === categoryId)
      this.$store.dispatch('addCategory', {
        id: category.id,
        name: category.name
      })
    },
    checkLockedVersions() {
      if (this.data) {
        this.data.forEach(item => {
          const areAllVersionsLocked = item.versionFunctions.some(version => version.design_lock_flg === LOCK_FLG_VALUE.no || version.code_lock_flg === LOCK_FLG_VALUE.no || version.testcase_lock_flg === LOCK_FLG_VALUE.no)

          if (areAllVersionsLocked) {
            item.versionFunctions.forEach(version => {
              if (version.design_lock_flg === LOCK_FLG_VALUE.yes && version.code_lock_flg === LOCK_FLG_VALUE.yes && version.testcase_lock_flg === LOCK_FLG_VALUE.yes) {
                version.disabled = true
              }
            })
          }
        })
      }
    },
    /**
     * Go to new
     */
    gotoNew() {
      this.$router.push(`/${this.resource}/new`)
    },

    /**
     * Go to detail
     *
     * @param {Number} id
     */
    gotoDetail(id) {
      this.$router.push(`/${this.resource}/${id}`)
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    /**
     * Close dialog.
     *
     * @param {boolean} fetch - fetch status.
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        category_id: '',
        code: '',
        use_flg: '',
        description: '',
        description_jp: '',
        figma_link: '',
        latest_version: '',
        name: '',
        name_jp: '',
        order: '',
        project_id: ''
      }
      this.$store.dispatch('addCategory', {
        id: 0,
        name: ''
      })
      this.search()
    },

    /**
     * Set table class
     *
     * @param {array} record
     */
    rowClassName(record) {
      if (record.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    /**
     * Set table class
     *
     * @param {array} record
     */
    rowClassNameChild(record) {
      if (record.function.use_flg === USE_FLG_VALUE.no) {
        return 'disabled-row'
      } else {
        return null
      }
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    },

    /**
     * Lock version
     */
    async changeVersion(id, value, type) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {}
        if (type === 1) {
          data.design_lock_flg = value
        } else if (type === 2) {
          data.code_lock_flg = value
        } else {
          data.testcase_lock_flg = value
        }
        await this.$api.versionFunction.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        await this.$fetch()
        this.checkLockedVersions()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Increase version
     */
    increaseVersion(id) {
      this.$refs.increaseVersion.openModal(id)
    },

    save() {
      this.$fetch()
      this.checkLockedVersions()
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    checkFunctionItemHasLogic(functionItem) {
      if (functionItem) {
        for (let i = 0; i < functionItem.length; i++) {
          const item = functionItem[i]
          const typeName = item.mst_item_type.name
          if (typeName === 'select' || typeName === 'combo_box' || typeName === 'button') {
            if (item.function_event.length === 0 || (item.function_event.length > 0 && item.function_event.some(event => event.function_event_logicals.length === 0))) {
              return true
            }
          }
        }
      }

      return false
    },

    checkFunctionItemHasDataSource(functionItem) {
      for (let i = 0; i < functionItem.length; i++) {
        const item = functionItem[i]
        const typeName = item.mst_item_type.name
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
          if (item.function_item_write_datasources.length === 0 && item.function_item_read_datasources.length === 0) {
            return true
          }
        }
      }
      return false
    },

    checkFunctionHasLevel(functionItem) {
      if (functionItem) {
        for (let i = 0; i < functionItem.length; i++) {
          const item = functionItem[i]
          if (item.function_event.some(event => event.level_front_end === null && event.level_back_end === null)) {
            return true
          }
        }
      }

      return false
    },

    /**
     * On change check box.
     */
    onChangeCheckbox(id, e) {
      if (e.target.checked) {
        this.checkedId.push(id)
      } else {
        const indexToRemove = this.checkedId.indexOf(id)
        if (indexToRemove !== -1) {
          this.checkedId.splice(indexToRemove, 1)
        }
        this.allChecked = false
      }
    },

    checkedAll() {
      if (!this.allChecked) {
        this.checkedId = this.data.map(record => record.id)
      } else {
        this.checkedId = []
      }
      this.allChecked = !this.allChecked
    },

    checkAllVersion() {
      const filteredItems = this.data.filter(item => this.checkedId.includes(item.id))
      this.errorFound = filteredItems.some(item => {
        return item.versionFunctions.some(version => version.design_lock_flg === LOCK_FLG_VALUE.no || version.code_lock_flg === LOCK_FLG_VALUE.no || version.testcase_lock_flg === LOCK_FLG_VALUE.no)
      })
      if (this.errorFound) {
        this.$notification.error({
          message: this.$t('text.error_increase_all_version')
        })
      } else {
        this.confirmIncreaseAll()
      }
    },

    /**
     * Confirm to lock all version
     */
    confirmLockAll() {
      this.$confirm({
        title: this.$t('text.confirm_to_lock'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.lockAllVersion()
      })
    },

    confirmIncreaseAll() {
      this.$confirm({
        title: this.$t('text.confirm_to_increase'),
        okText: this.$t('common.yes'),
        okType: 'danger',
        cancelText: this.$t('common.no'),
        onOk: () => this.increaseAllVersion()
      })
    },

    async lockAllVersion() {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.checkedId.length > 0) {
          await this.repository.lockAllVersion({ id: this.checkedId })
          this.$fetch()
          // this.clearCheckbox()
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
     * Increase version
     */
    increaseAllVersion() {
      this.$refs.increaseAllVersion.openModal(this.checkedId)
    },

    clearCheckbox() {
      this.allChecked = false
      this.checkedId = []
    }
  }
}
</script>
<style lang="scss" scoped>
.description-version {
  word-wrap: break-word;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1.5em;
}
:deep() {
  .ant-table-tbody > tr > td {
    cursor: pointer;
  }
  .ant-table-tbody {
    .disabled-row {
      background-color: rgba(217, 217, 217, 0.5);
      td {
        text-decoration: line-through;
      }
    }
  }
  .anticon-dollar > svg,
  .anticon-interaction > svg,
  .anticon-ordered-list > svg,
  .anticon-api > svg {
    width: 1.4rem;
    height: 1.4rem;
  }
}
.icon-link {
  color: red;
}
.action-function {
  display: flex;
  justify-content: space-between;
}
</style>
