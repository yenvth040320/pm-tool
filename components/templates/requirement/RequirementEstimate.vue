<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4 no-border">
        <template slot="extra">
          <a-button
            v-if="isHasPermision"
            html-type="button"
            type="primary"
            @click="gotoApproveAll()"
          >
            {{ $t('module.requirement.estimate.approve_all') }}
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            @click="gotoExport()"
          >
            {{ $t('module.requirement.estimate.export') }}
          </a-button>
        </template>
        <div class="total-header">
          <div class="total-point">
            <p class="title">
              {{ $t('module.requirement.dev_point_et') }}:
              {{ pointETDev }}
            </p>
            <p class="title">
              {{ $t('module.requirement.com_point_et') }}:
              {{ pointETCom }}
            </p>
            <p class="title">
              {{ $t('module.requirement.pm_point_et') }}:
              {{ pointETManager }}
            </p>
          </div>
          <div>
            <p class="title">
              {{ $t('module.requirement.estimate.count_bug_internal') }}
              {{ pointETInternal }}
            </p>
            <p class="title">
              {{ $t('module.requirement.estimate.count_bug_customers') }}
              {{ pointETCustomers }}
            </p>
          </div>
        </div>
        <div>
          <div v-for="(data, index) in requirementFunctions" :key="index">
            <RequirementEstimateComponent :data-function="data" :max-count-record="getCountMax(data)" :is-has-permision="isHasPermision" @success="success" @save="save" />
          </div>
        </div>
        <div class="title-joint-work">
          <JointWorkComponent
            v-if="mstLifeCyclesData.length > 0"
            :id="id"
            :mst-life-cycles="mstLifeCyclesData"
            :is-has-permision="isHasPermision"
            @success="success"
            @save="save"
          />
        </div>
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import moment from 'moment-timezone'
import RequirementEstimateComponent from '~/components/templates/requirement/RequirementEstimateComponent'
import JointWorkComponent from '~/components/templates/requirement/JointWorkComponent'
import { MST_LIFECYCLE_TYPE_VALUE, APPROVE_STATUS_VALUE, DEFAULT_TIMEZONE, FORMAT_DATE_FULL, SORT } from '~/constants'
export default {
  components: {
    RequirementEstimateComponent,
    JointWorkComponent
  },
  props: {
    id: {
      type: [Number, String],
      default: 0
    },
    model: {
      type: [Object],
      default: () => {}
    }
  },

  data() {
    return {
      resource: 'requirement',
      requirementFunctions: [],
      requirement: [
      ],
      functionRelationshipItem: [],
      functions: [],
      functionIds: [],
      functionItem: [],
      dataWork: [],
      mstLifeCycles: [],
      mstLifeCyclesData: [],
      isHasPermision: false,
      MST_LIFECYCLE_TYPE_VALUE,
      requirementEstimates: [],
      requirementEstimateCurrent: [],
      APPROVE_STATUS_VALUE,
      DEFAULT_TIMEZONE,
      FORMAT_DATE_FULL,
      SORT,
      loading: false
    }
  },

  computed: {
    pointETInternal() {
      if (this.requirementEstimates.length > 0) {
        const totalETTime = this.requirementEstimates.reduce((acc, estimate) => {
          return acc + estimate.et_time
        }, 0)
        return Math.floor(totalETTime / 4)
      }
      return 0
    },
    pointETCustomers() {
      if (this.requirementEstimates.length > 0) {
        const totalETTime = this.requirementEstimates.reduce((acc, estimate) => {
          return acc + estimate.et_time
        }, 0)
        return Math.floor(totalETTime / 8)
      }
      return 0
    },

    pointETDev() {
      return this.calculateETValue()
    },
    pointETManager() {
      return this.calculatePercentageETValue(10)
    },
    pointETCom() {
      return this.calculatePercentageETValue(10)
    },
    pointETTest() {
      return this.calculatePercentageETValue(10)
    }
  },

  watch: {
  },
  created() {
    this.$bus.$on('callListRequirementFunction', editedData => {
      this.getListRequirementFunction()
    })
  },

  async mounted() {
    await Promise.all([
      this.getMstLifeCycle()
    ]).then(() => {
      this.getListRequirementEstimates()
    })
    this.getListRequirementFunction()
    this.checkPermissionApprove()
  },

  methods: {
    /**
     * Get list requirement function
     */
    async getListRequirementFunction() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.requirement_id = this.id
        params.requirementEstimate = true
        params.not_limit = true

        const { data: { result: { data } } } = await this.$api.requirementFunction.list({ params })
        this.requirementFunctions = data
        this.requirementFunctions.sort((a, b) => {
          if (a.function && b.function) {
            if (a.function.code < b.function.code) {
              return -1
            }
            if (a.function.code > b.function.code) {
              return 1
            }
            return 0
          }
        })
        this.transformData()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List MstLifeCycle
     */
    async getMstLifeCycle() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          requirementEstimate: true,
          order_by: 'wbs',
          order_type: SORT.asc,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.mstLifeCycle.list({ params })
        this.mstLifeCycles = data.map(record => {
          const children = record.children ? record.children : []

          return {
            ...record,
            children
          }
        })
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * List requirement estimate
     */
    async getListRequirementEstimates() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.requirement_id = this.id
        params.order_by = 'id'
        params.order_type = SORT.asc
        params.not_limit = true
        const { data: { result: { data } } } = await this.$api.requirementEstimate.list({ params })
        this.requirementEstimates = data
        await this.transformData()
        await this.transformDataCommon()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    transformData() {
      if (this.mstLifeCycles.length === 0) {
        return
      }

      const copiedMstLifeCycles = [...this.mstLifeCycles.filter(item => {
        return item.type === MST_LIFECYCLE_TYPE_VALUE.group_function
      })]

      this.requirementFunctions = this.requirementFunctions.map(record => {
        const matchingEstimates = this.requirementEstimates.filter(estimate => {
          return (
            estimate.function_id === record.function_id &&
        estimate.version_code === record.version_code &&
        estimate.requirement_id === record.requirement_id
          )
        })

        const updatedMstLifeCycles = copiedMstLifeCycles.map(mstLifeCycle => {
          const filteredEstimates = matchingEstimates.filter(estimate => {
            return estimate.mst_life_cycle_id === mstLifeCycle.id
          })

          return {
            ...mstLifeCycle,
            children: filteredEstimates
          }
        })

        return {
          ...record,
          mstLifeCycles: updatedMstLifeCycles
        }
      })
    },

    transformDataCommon() {
      if (this.mstLifeCycles.length === 0) {
        return
      }

      const copiedMstLifeCycles = [...this.mstLifeCycles.filter(item => {
        return item.type === MST_LIFECYCLE_TYPE_VALUE.no_group_function
      })]

      const matchingEstimates = this.requirementEstimates.filter(estimate => {
        return (
          estimate.function_id === null &&
        estimate.version_code === null)
      })

      this.mstLifeCyclesData = copiedMstLifeCycles.map(mstLifeCycle => {
        const filteredEstimates = matchingEstimates.filter(estimate => {
          return estimate.mst_life_cycle_id === mstLifeCycle.id
        })

        return {
          ...mstLifeCycle,
          children: filteredEstimates
        }
      })
    },

    calculateETValue() {
      if (this.requirementEstimates.length > 0) {
        const totalET = this.requirementEstimates.reduce((acc, estimate) => {
          return acc + parseFloat(estimate.et_time)
        }, 0)

        return parseFloat(totalET.toFixed(2))
      }
      return 0
    },
    calculatePercentageETValue(percentage) {
      const totalETTime = this.calculateETValue()
      return ((totalETTime * percentage) / 100).toFixed(2)
    },

    async updatePointRequirement() {
      try {
        const data = {
          dev_point_et: parseFloat(this.pointETDev),
          pm_point_et: parseFloat(this.pointETManager),
          com_point_et: parseFloat(this.pointETCom),
          test_point_et: parseFloat(this.pointETTest),
          et_internal: parseFloat(this.pointETDev) + parseFloat(this.pointETCom) + parseFloat(this.pointETManager)
        }
        if (parseFloat(this.model.dev_point_et) !== data.dev_point_et) {
          await this.$api.requirement.updatePoint(this.id, data)
        }
        this.$bus.$emit('updatePointRequirement')
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    success() {
      this.getListRequirementEstimates()
    },

    async save() {
      await this.getListRequirementEstimates()
      this.updatePointRequirement()
    },

    async checkPermissionApprove() {
      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        const { data: { result: { data } } } = await this.$api.user.checkUser({ params })
        this.isHasPermision = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    getCountMax(data) {
      return Math.max(data.requirement_function_events?.length, data.requirement_function_items?.length)
    },

    /**
     * Go to add function
     */
    async gotoApproveAll() {
      try {
        const data = {
          requirement_id: this.id
        }
        await this.$api.requirementEstimate.approveAll(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getListRequirementEstimates()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Export excel
     */
    async gotoExport() {
      try {
        const dataExport = {
          pointEt: {
            point_et_dev: this.pointETDev,
            point_et_com: this.pointETCom,
            point_et_test: this.pointETTest,
            bug_internal: this.pointETInternal,
            bug_customer: this.pointETCustomers
          },
          requirementFunctions: [...this.requirementFunctions],
          taskCommon: this.mstLifeCyclesData
        }
        if (dataExport.requirementFunctions.length > 0) {
          dataExport.requirementFunctions.forEach(item => {
            delete item.requirement_function_events
            delete item.requirement_function_items
          })
        }
        const filteredRequirementFunctions = dataExport.requirementFunctions.filter(item => {
          return item.mstLifeCycles.some(lifecycle => lifecycle.children && lifecycle.children.length > 0)
        })
        filteredRequirementFunctions.forEach(item => {
          item.mstLifeCycles = item.mstLifeCycles.filter(lifecycle => lifecycle.children && lifecycle.children.length > 0)
        })
        const filteredTaskCommon = dataExport.taskCommon.filter(item => item.children && item.children.length > 0)
        dataExport.requirementFunctions = filteredRequirementFunctions
        dataExport.taskCommon = filteredTaskCommon

        const rawData = await this.$api.requirementEstimate.exportEstimate(dataExport, { responseType: 'arraybuffer' })
        const date = moment().tz(DEFAULT_TIMEZONE).format(FORMAT_DATE_FULL)
        const fileName = this.$t('common.csv_name') + this.model.title + date
        this.$csv.download({ rawData, fileName })
      } catch (error) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
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
.open_btn {
  margin-left: 10px;
}
.title {
  font-weight: 700;
}
.total-header {
  display: flex;
  justify-content: space-between;
}
</style>
