<template>
  <div>
    <a-button v-if="isShowSearchForm" @click="isShowSearchForm = false">
      <a-icon type="minus" />
    </a-button>
    <a-button v-if="!isShowSearchForm" @click="isShowSearchForm = true">
      <a-icon type="plus" />
    </a-button>
    <a-form-model
      v-if="isShowSearchForm"
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
            :label="$t('module.lifeCycle.category')"
            prop="category_id"
          >
            <a-select
              v-model="filters.category_id"
              :placeholder="$t('module.lifeCycle.category')"
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
            :label="$t('module.tab_process.code')"
            prop="code"
          >
            <a-input
              v-model="filters.code"
              :placeholder="$t('module.tab_process.code')"
            />
          </a-form-model-item>
        </a-col>
        <a-col
          :span="24"
          :md="12"
        >
          <a-form-model-item
            :label="$t('module.lifeCycle.reviewer_user_id')"
            prop="reviewer_user_id"
          >
            <a-select
              v-model="filters.reviewer_user_id"
              mode="single"
              :disabled="loading"
              :placeholder="$t('module.lifeCycle.reviewer_user_id')"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col
          :span="24"
          :md="12"
        >
          <a-form-model-item
            :label="$t('module.lifeCycle.name_description')"
            prop="name_description"
          >
            <a-input
              v-model="filters.name_description"
              :placeholder="$t('module.lifeCycle.name_description')"
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

    <a-table
      :columns="columns"
      :row-key="record => record.key"
      :data-source="functionData"
      :loading="loading"
      bordered
      :pagination="false"
      :scroll="{ x: 900, y: 700 }"
      @change="handleTableChange"
    >
      <template
        slot="code"
        slot-scope="text, record"
      >
        <span>
          {{ record.code ? record.code : (record.version_code ?? '') }}
        </span>
      </template>
      <template
        slot="total_point"
        slot-scope="text, record"
      >
        <span v-if="record.key.startsWith('child')" class="lifecycle-status" @click="openPointDistributionForm(record)">
          {{ getTotalPoint(record) }}
        </span>
      </template>

      <template v-for="(slotName, index) in scopedSlotNames" :slot="'status_table_' + index" slot-scope="text, record">
        <div
          v-if="slotName && record.key.startsWith('child')"
          :key="index"
        >
          <span v-if="record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).mst_life_cycle_status_id" class="lifecycle-status" @click="updateStatus(record, index)">
            {{ record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.mst_life_cycle_status?.name }}

          </span>
          <span v-else class="to_update" @click="updateStatus(record, index)">
            Update
          </span>
        </div>
      </template>
      <template v-for="(slotName, index) in scopedSlotNames" :slot="'reviewer_user_id_' + index" slot-scope="text, record">
        <div
          v-if="record.key.startsWith('child')"
          :key="index"
        >
          <span v-if="record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).reviewer_user_id" class="lifecycle-status" @click="updateReviewerUser(record, index)">
            {{ record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.reviewer_user?.name }}

          </span>
          <span v-else class="to_update" @click="updateReviewerUser(record, index)">
            Update
          </span>
        </div>
      </template>
      <template v-for="(slotName, index) in scopedSlotNames" :slot="'start_' + index" slot-scope="text, record">
        <div
          v-if="record.key.startsWith('child')"
          :key="index"
        >
          <span v-if="record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).start_date" class="lifecycle-status" @click="updateRangeDate(record, index)">
            {{ getDate(record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.start_date) }}
          </span>
          <span v-else class="to_update" @click="updateRangeDate(record, index)">
            Update
          </span>
        </div>
      </template>
      <template v-for="(slotName, index) in scopedSlotNames" :slot="'end_' + index" slot-scope="text, record">
        <div
          v-if="record.key.startsWith('child')"
          :key="index"
        >
          <span v-if="record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).end_date" class="lifecycle-status" @click="updateRangeDate(record, index)">
            {{ getDate(record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.end_date) }}
          </span>
          <span v-else class="to_update" @click="updateRangeDate(record, index)">
            Update
          </span>
        </div>
      </template>

      <template v-for="(slotName, index) in scopedSlotNames" :slot="'point_et_' + index" slot-scope="text, record">
        <span v-if="record.key.startsWith('child')" :key="index" class="lifecycle-status" @click="updatePointEt(record, index)">
          {{ record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.function_et_points ? calculateTotalPointEt(record?.version_function_life_cycles.find(item => item.mst_life_cycle_id === index)?.function_et_points) : 0 }} (+)
        </span>
      </template>
    </a-table>
    <!-- end main-table -->
    <ModalPointEt ref="modalPointEt" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <ModalMstLifeCycleStatus ref="modalMstLifeCycleStatus" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <ModalReviewerUserId ref="modalReviewerUserId" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <ModelRangeDate ref="modelRangeDate" :mst-life-cycles="mstLifeCycles" :users="users" @save="save" />
    <EtPointDistributionTabProcess ref="etPointDistribution" :mst-life-cycles="mstLifeCycles" @save="save" />
  </div>
</template>
<script>
import moment from 'moment-timezone'
import ModalPointEt from './ModalPointEt.vue'
import ModalMstLifeCycleStatus from './ModalMstLifeCycleStatus.vue'
import ModelRangeDate from './ModelRangeDate.vue'
import ModalReviewerUserId from './ModalReviewerUserId.vue'
import EtPointDistributionTabProcess from '~/components/templates/project/EtPointDistributionTabProcess'
import DataTable from '~/mixins/data-table'
import { USE_FLG, USE_FLG_VALUE, LOCL_FLG, LOCK_FLG_VALUE } from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
    ModalPointEt,
    ModalMstLifeCycleStatus,
    ModalReviewerUserId,
    ModelRangeDate,
    EtPointDistributionTabProcess
  },

  mixins: [
    DataTable
  ],
  props: {
    users: {
      type: [Array],
      default: () => []
    },

    categories: {
      type: [Array],
      default: () => []
    }
  },
  async fetch() {
    this.$store.dispatch('setLoading', true)
    try {
      const params = this.$route.query
      params.project_id = this.id
      params.not_limit = true
      params.is_process = true
      const { data: { result: { data } } } = await this.$api.function.getDataTabProcess({ params })
      this.functions = data
      this.modifyChildrenData(this.functions)
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
      resource: 'versionFunctionLifeCycle',
      visible: false,
      id: +this.$route.params.id || 0,
      currentId: 0,
      filters: {
        category_id: +this.$route.query.category_id || (this.$store.state.category.id ? this.$store.state.category.id : undefined),
        code: '',
        reviewer_user_id: undefined,
        name_description: undefined
      },
      USE_FLG,
      USE_FLG_VALUE,
      LOCL_FLG,
      LOCK_FLG_VALUE,
      mstLifeCycleStatus: [],
      functions: [],
      functionData: [],
      isShowSearchForm: true,
      mstLifeCycles: []
    }
  },

  /**
   * Computed event.
   */
  computed: {
    scopedSlotNames() {
      const slotNames = []
      if (this.mstLifeCycles.length > 0) {
        this.mstLifeCycles.forEach(column => {
          slotNames[column.id] = {
            status_table: 'status_table_' + column.id,
            reviewer_user_id: 'reviewer_user_id_' + column.id,
            start: 'start_' + column.id,
            end: 'end_' + column.id,
            point_et: 'point_et_' + column.id
          }
        })
      }

      return slotNames
    },
    additionalColumns() {
      return this.mstLifeCycles.map(column => ({
        title: column.name,
        dataIndex: column.id,
        width: 430,
        scopedSlots: { customRender: `${this.convertToKebabCase(column.name)}_${column.id}` },
        children: [
          {
            title: this.$t('module.tab_process.status_table'),
            scopedSlots: { customRender: 'status_table_' + column.id },
            width: 100
          },
          {
            title: this.$t('module.tab_process.reviewer_user_id'),
            scopedSlots: { customRender: 'reviewer_user_id_' + column.id },
            width: 100
          },
          {
            title: this.$t('module.tab_process.start'),
            scopedSlots: { customRender: 'start_' + column.id },
            width: 88
          },
          {
            title: this.$t('module.tab_process.end'),
            scopedSlots: { customRender: 'end_' + column.id },
            width: 88
          },
          {
            title: this.$t('module.tab_process.point_et'),
            scopedSlots: { customRender: 'point_et_' + column.id },
            width: 54
          }
        ]
      }))
    },
    columns() {
      const mergedColumns = [...this.header, ...this.additionalColumns]

      return mergedColumns
    },
    header() {
      return [
        {
          dataIndex: 'index',
          fixed: 'left',
          width: 35
        },
        {
          title: this.$t('module.tab_process.code_table'),
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' },
          fixed: 'left',
          width: 105
        },
        {
          title: this.$t('module.tab_process.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          fixed: 'left',
          width: 150
        },
        {
          title: this.$t('module.tab_process.total_point'),
          dataIndex: 'total_point',
          scopedSlots: { customRender: 'total_point' },
          fixed: 'left',
          width: 80
        }
      ]
    }
  },

  watch: {
  },

  created() {
    this.getMstLifeCycles()
  },

  /**
   * Mounted event.
   */
  mounted() {
  },

  methods: {
    async getMstLifeCycles() {
      try {
        const params = {
          project_id: this.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    convertToKebabCase(inputString) {
      const cleanedString = inputString.replace(/[^\w\s-]/g, '')
      const lowercaseString = cleanedString.toLowerCase()
      const kebabCaseString = lowercaseString.replace(/\s+/g, '-')
      return kebabCaseString
    },
    modifyChildrenData(val) {
      this.functionData = val.map(parent => {
        const uncheckParent = this.mstLifeCycles.map(lifeCycle => ({
          project_id: this.id,
          function_id: parent.id,
          version_code: null,
          mst_life_cycle_id: lifeCycle.id,
          mst_life_cycle: {
            id: lifeCycle.id,
            name: lifeCycle.name,
            et_percent: lifeCycle.et_percent
          },
          mst_life_cycle_status_id: undefined,
          reviewer_user_id: undefined,
          start_date: null,
          end_date: null,
          key: 'cycle_' + this.id + '_' + parent.id + '_' + lifeCycle.id
        }))

        const mapIdsParent = parent.version_function_life_cycles.map(i => i.mst_life_cycle_id)
        const pushParent = uncheckParent.filter(item => !mapIdsParent.includes(item.mst_life_cycle_id))
        const parentWithCycles = parent.version_function_life_cycles.map(cycle => ({
          ...cycle,
          key: 'cycle_' + cycle.id
        }))

        const childrenWithCycles = parent.children.map(child => {
          const uncheck = this.mstLifeCycles.map(lifeCycle => ({
            project_id: this.id,
            function_id: parent.id,
            version_code: child.version_code,
            mst_life_cycle_id: lifeCycle.id,
            mst_life_cycle: {
              id: lifeCycle.id,
              name: lifeCycle.name,
              et_percent: lifeCycle.et_percent
            },
            mst_life_cycle_status_id: undefined,
            reviewer_user_id: undefined,
            start_date: null,
            end_date: null,
            tasks: [],
            key: 'cycle_' + this.id + '_' + parent.id + '_' + child.version_code + '_' + lifeCycle.id
          }))

          const mapIds = child.version_function_life_cycles.map(i => i.mst_life_cycle_id)
          const pushChild = uncheck.filter(item => !mapIds.includes(item.mst_life_cycle_id))
          const childWithCycles = child.version_function_life_cycles.map(cycle => ({
            ...cycle,
            key: 'cycle_' + cycle.id
          }))

          const childWithKeys = {
            ...child,
            key: 'child' + child.id,
            version_function_life_cycles: [...childWithCycles, ...pushChild]
          }

          return childWithKeys
        })

        const parentWithKeys = {
          ...parent,
          key: 'parent' + parent.id,
          version_function_life_cycles: [...parentWithCycles, ...pushParent],
          children: childrenWithCycles
        }

        return parentWithKeys
      })
    },

    updateStatus(record, index) {
      this.$refs.modalMstLifeCycleStatus.open(record, index)
    },

    updateReviewerUser(record, index) {
      this.$refs.modalReviewerUserId.open(record, index)
    },

    updateRangeDate(record, index) {
      this.$refs.modelRangeDate.open(record, index)
    },

    async updateOrCreateRecord(record) {
      this.$store.dispatch('setLoading', true)
      try {
        let data = {}
        for (const cycle of record.version_function_life_cycles) {
          if (
            cycle.mst_life_cycle_status_id !== undefined ||
              cycle.reviewer_user_id !== undefined ||
              cycle.start_date !== null ||
              cycle.end_date !== null
          ) {
            data = cycle
          }
        }
        if (Object.keys(data).length > 0) {
          if (data.id) {
            await this.repository.update(data.id, data)
          } else {
            await this.repository.create(data)
          }

          this.$notification.success({
            message: this.$t('text.successfully')
          })

          this.$fetch()
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
      this.$fetch()
    },

    /**
     * Get date
     */
    getDate(value) {
      if (value) {
        return moment(String(value)).format('DD-MM-YYYY')
      } else {
        return ''
      }
    },
    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        category_id: undefined,
        code: '',
        reviewer_user_id: undefined,
        name_description: ''
      }

      this.search()
    },

    calculateTotalPointEt(pointEts) {
      if (pointEts.length > 0) {
        const total = pointEts.reduce((total, pointObj) => total + pointObj.point_et, 0)
        return Math.max(total, 0)
      } else {
        return 0
      }
    },

    setCategory(categoryId) {
      const category = this.categories.find(item => item.id === categoryId)
      this.$store.dispatch('addCategory', {
        id: category.id,
        name: category.name
      })
    },
    /**
       * Search data.
       */
    search() {
      this.modifyChildrenData(this.functions)
      const filteredData = this.functionData.filter(item => {
        const { code, children } = item
        const versionFunctionLifeCycles = item.version_function_life_cycles

        // Check conditions for category and description
        const categoryConditionMet = !this.filters.category_id || item.category_id === this.filters.category_id

        // Check conditions for versionFunctionLifeCycles array
        const versionFunctionConditionMet = versionFunctionLifeCycles.some(cycle => {
          return (
            (!this.filters.reviewer_user_id || (cycle.reviewer_user_id === this.filters.reviewer_user_id)) &&
            (!this.filters.name_description ||
          (item.description && item.description.toLowerCase().includes(this.filters.name_description.toLowerCase())) ||
          (item.name.toLowerCase().includes(this.filters.name_description.toLowerCase())))
          )
        })

        // Check conditions for children
        const childrenConditionMet = children.some(child => {
          const { version_function_life_cycles: childVersionFunctionLifeCycles } = child
          return childVersionFunctionLifeCycles.some(cycle => {
            return (
              (!this.filters.reviewer_user_id || (cycle.reviewer_user_id === this.filters.reviewer_user_id)) &&
              (!this.filters.name_description ||
            (child.description && child.description.toLowerCase().includes(this.filters.name_description.toLowerCase())) ||
            (child.name.toLowerCase().includes(this.filters.name_description.toLowerCase())))
            )
          })
        })
        // Check other conditions
        return (
          (!this.filters.code || code.toLowerCase().includes(this.filters.code.toLowerCase())) && categoryConditionMet &&
      (versionFunctionConditionMet || childrenConditionMet)
        )
      })

      this.functionData = filteredData
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    updatePointEt(record, index) {
      try {
        if (record.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).mst_life_cycle_status_id === undefined || record.version_function_life_cycles.find(item => item.mst_life_cycle_id === index).mst_life_cycle_status_id === null) {
          throw new Error('Hãy update trạng thái trước.')
        } else {
          this.$refs.modalPointEt.open(record, index)
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.error_insert_point')
        })
      }
    },
    openPointDistributionForm(record) {
      this.$refs.etPointDistribution.open(record)
    },

    getTotalPoint(record) {
      let totalPoint = 0

      for (const lifeCycle of record.version_function_life_cycles) {
        for (const etPoint of lifeCycle.function_et_points || []) {
          totalPoint += etPoint.point_et
        }
      }

      return totalPoint.toFixed(2)
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
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 7px 7px;
  }
  .lifecycle-status {
    color: #1890ff;
  }
  .icon-link {
    color: red;
  }
}
.to_update {
  color: red;
}
</style>
