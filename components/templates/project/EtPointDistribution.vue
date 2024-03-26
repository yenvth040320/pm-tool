<template>
  <a-modal
    :visible="openModal"
    width="80%"
    :footer="null"
    @cancel="close"
  >
    <div class="content">
      <a-spin :spinning="loadModal">
        <a-card class="mb-4 no-border">
          <template slot="title">
            {{ $t('module.tab_schedule_point_distribute.function') + ': ' + this.function?.code + ' - ' + this.function.name }}
            <br />
            {{ $t('module.tab_schedule_point_distribute.version') + ': ' + model?.version_code + ' - ' + model.name }}
          </template>
          <a-form-model
            ref="form"
            :model="model"
            :label-col="{ sm: 16 }"
            :wrapper-col="{ sm: 8 }"
            @submit.prevent="handleSubmit"
          >
            <a-row
              type="flex"
            >
              <a-col
                :span="24"
                :md="24"
              >
                <a-row>
                  <a-col
                    :span="12"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.tab_schedule_point_distribute.total_point_distributed_for_function')"
                    >
                      <span class="link">
                        {{ getTotalPointDistributedForFunction(function_points, project_points) }}
                      </span>
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :span="12"
                    :md="12"
                  />
                </a-row>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-row>
                  <a-col
                    :span="12"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.tab_schedule_point_distribute.total_point_distributed_more')"
                    >
                      <a-input-number
                        v-model="inputPoint"
                        :step="0.01"
                        @keypress.native="preventAlphabetCharacterInput($event)"
                        @change="changeInputPoint"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :span="12"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.tab_schedule_point_distribute.total_point_dev_for_project')"
                    >
                      <span class="link">
                        {{ parseFloat(project_points.total_dev_points).toFixed(2) }}
                      </span>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-row>
                  <a-col
                    :span="12"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.tab_schedule_point_distribute.total_point_distributable')"
                    >
                      <span class="link">
                        {{ distributablePoint }}
                      </span>
                    </a-form-model-item>
                  </a-col>
                  <a-col
                    :span="12"
                    :md="12"
                  >
                    <a-form-model-item
                      :label="$t('module.tab_schedule_point_distribute.function_et_points_by_project')"
                    >
                      <span class="link">
                        {{ parseFloat(function_points.total_function_points_of_project).toFixed(2) }}
                      </span>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.tab_schedule_point_distribute.distribute_note')"
                  :label-col="{ sm: 6 }"
                  :wrapper-col="{ sm: 18 }"
                >
                  <a-textarea
                    v-model="description"
                    :rows="3"
                    :placeholder="$t('module.tab_schedule_point_distribute.distribute_note')"
                  />
                </a-form-model-item>
              </a-col>
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.tab_schedule_point_distribute.auto_calculate_by_percent')"
                  :label-col="{ sm: 6 }"
                  :wrapper-col="{ sm: 18 }"
                >
                  <a-checkbox
                    v-model="checkAuto"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-table
              ref="tabValidationTable"
              :columns="columns"
              :row-key="record => record.key"
              :data-source="model.children"
              :pagination="false"
              @change="handleTableChange"
            >
              <template
                slot="mst_life_cycle_id"
                slot-scope="text, record"
              >
                <div>
                  <span>{{ record?.mst_life_cycle?.name }}</span>
                </div>
              </template>
              <template
                slot="et_percent"
                slot-scope="text, record"
              >
                <div v-if="!record.key.startsWith('total')">
                  <a-input-number
                    v-model="record.mst_life_cycle.et_percent"
                    :step="0.01"
                    :disabled="!checkAuto"
                    @keypress.native="preventAlphabetCharacterInput($event)"
                    @change="changeEtPercent"
                  />
                  <span>{{ $t('module.tab_schedule_point_distribute.percent') }}</span>
                </div>
                <div v-if="record.key.startsWith('total')">
                  <div>
                    <span :class="[ totalEtPercent > 100 ? 'err' : 'link' ]">{{ totalEtPercent }} {{ $t('module.tab_schedule_point_distribute.percent') }}</span>
                  </div>
                </div>
              </template>
              <template
                slot="status"
                slot-scope="text, record"
              >
                <div>
                  <span>{{ record?.mst_life_cycle_status?.name }}</span>
                </div>
              </template>
              <template
                slot="add_point"
                slot-scope="text, record"
              >
                <div v-if="!record.key.startsWith('total')">
                  <div class="flex">
                    <a-form-model-item>
                      <a-input-number
                        v-model="record.point_et"
                        :step="0.01"
                        :disabled="checkAuto"
                        @keypress.native="preventAlphabetCharacterInput($event)"
                        @change="changeRowPointEt"
                      />
                    </a-form-model-item>
                    <span class="current_percent">
                      {{ '(' + ((!isNaN((typeof record.point_et === 'number' ? record.point_et : 0) / totalNewPoint) && parseFloat(totalNewPoint) !== 0) ? ((typeof record.point_et === 'number' ? record.point_et : 0) / totalNewPoint * 100).toFixed(2) : 0) + '%)' }}
                    </span>
                  </div>
                </div>
                <div v-if="record.key.startsWith('total')">
                  <span :class="[ totalNewPoint > inputPoint ? 'err' : 'link' ]">{{ totalNewPoint }}</span>
                </div>
              </template>
              <template
                slot="added_point"
                slot-scope="text, record"
              >
                <div v-if="!record.key.startsWith('total')">
                  <span>{{ record?.function_et_points ? calculateTotalPointEt(record.function_et_points) : 0 }}</span>
                </div>
              </template>
              <template
                slot="new_total_point"
                slot-scope="text, record"
              >
                <div v-if="!record.key.startsWith('total')">
                  <div>
                    <span>{{ ((typeof record.point_et === 'number' ? record.point_et : 0) + (record?.function_et_points ? calculateTotalPointEt(record.function_et_points) : 0)).toFixed(2) }}</span>
                  </div>
                </div>
              </template>
              <template
                slot="total_task_point"
                slot-scope="text, record"
              >
                <div v-if="!record.key.startsWith('total')">
                  <span>
                    {{ record.total_task_point }}
                  </span>
                </div>
              </template>
            </a-table>
            <div class="submit-btn-wrap">
              <a-button html-type="submit" type="primary" class="text-center">
                {{ $t('common.submit') }}
              </a-button>
            </div>
          </a-form-model>
        </a-card>
      </a-spin>
    </div>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import DataTable from '~/mixins/data-table'
import { LIFE_CYCLE_STATUS_CLOSED_VALUE } from '~/constants'

export default {
  components: {},

  mixins: [
    DataTable
  ],

  async fetch() {
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
    }
  },

  props: {
    mstLifeCycles: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      openModal: false,
      loadModal: false,
      visible: false,
      resource: 'functionEtPoint',
      model: {},
      function: {},
      version: {},
      project_points: {
        total_project_points: 0,
        total_dev_points: 0
      },
      inputPoint: 0,
      function_points: {
        total_points_of_function: 0,
        total_function_points_of_project: 0
      },
      project_id: +this.$route.params.id || 0,
      data: [],
      description: '',
      checkAuto: false,
      LIFE_CYCLE_STATUS_CLOSED_VALUE,
      totalEtPercent: 100,
      totalNewPoint: 0
    }
  },
  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.tab_schedule.mst_life_cycle_status_id'),
          dataIndex: 'mst_life_cycle_id',
          scopedSlots: { customRender: 'mst_life_cycle_id' }
        },
        {
          title: this.$t('module.tab_schedule_point_distribute.percent'),
          dataIndex: 'et_percent',
          scopedSlots: { customRender: 'et_percent' }
        },
        {
          title: this.$t('module.tab_schedule.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('module.tab_schedule_point_distribute.add_point'),
          dataIndex: 'add_point',
          scopedSlots: { customRender: 'add_point' }
        },
        {
          title: this.$t('module.tab_schedule_point_distribute.added_point'),
          dataIndex: 'added_point',
          scopedSlots: { customRender: 'added_point' }
        },
        {
          title: this.$t('module.tab_schedule_point_distribute.new_total_point'),
          dataIndex: 'new_total_point',
          scopedSlots: { customRender: 'new_total_point' }
        },
        {
          title: this.$t('module.tab_schedule_point_distribute.total_task_point'),
          dataIndex: 'total_task_point',
          scopedSlots: { customRender: 'total_task_point' }
        }
      ]
    },

    distributablePoint() {
      return this.getPointProjectLeft(this.function_points, this.project_points)
    }
  },
  watch: {
    checkAuto(val) {
      if (val) {
        this.getAutoPoint()
      }
      this.calTotalNewPoint()
    }
  },
  mounted() {
  },
  methods: {
    open(data) {
      this.description = ''
      this.inputPoint = 0
      this.checkAuto = false
      this.totalNewPoint = 0
      this.totalEtPercent = 100
      this.model = cloneDeep(data)
      this.function = data.function
      this.model.children = this.model.children.map(child => {
        if (child.mst_life_cycle_status_id === null) {
          const status = this.mstLifeCycles.find(cycle => cycle.id === child.mst_life_cycle_id)?.mstLifeCycleStatuses[0]
          if (status) {
            return { ...child, point_et: 0, mst_life_cycle_status_id: status.id, mst_life_cycle_status: status, total_task_point: this.countTaskPoint(child.tasks) }
          } else {
            return { ...child, point_et: 0, total_task_point: this.countTaskPoint(child.tasks) }
          }
        } else {
          return { ...child, point_et: 0, total_task_point: this.countTaskPoint(child.tasks) }
        }
      })
      this.getProjectPoints()
      this.getFunctionEtPoints()
      const totalEtPercent = this.model.children.reduce((total, item) => {
        const pointEt =
          typeof item.mst_life_cycle.et_percent === 'number' ? item.mst_life_cycle.et_percent : 0
        return total + pointEt
      }, 0)
      const totalPointAdd = this.model.children.reduce((total, item) => {
        const pointEt =
          typeof item.point_et === 'number' ? item.point_et : 0
        return total + pointEt
      }, 0)
      this.model.children.push({
        key: 'total',
        total_percent: totalEtPercent,
        total_add_point: totalPointAdd
      })
      this.totalEtPercent = totalEtPercent
      this.openModal = true
    },

    /**
     * Close the modal
     */
    close() {
      this.openModal = false
    },

    async getProjectPoints() {
      this.loadModal = true
      try {
        this.project_points = {}
        const params = {
          project_id: this.project_id
        }

        const { data: { result: { data } } } = await this.$api.projectEtPoint.getPoints({ params })
        this.project_points = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loadModal = false
      }
    },

    async getFunctionEtPoints() {
      try {
        this.function_points = {}
        const params = {
          project_id: this.project_id,
          function_id: this.function.id
        }

        const { data: { result: { data } } } = await this.$api.functionEtPoint.getPoints({ params })
        this.function_points = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    getTotalPointDistributedForFunction(functionPoints, projectPoints) {
      let result = 0
      if (projectPoints.total_project_points !== 0) {
        result = parseFloat(((functionPoints.total_points_of_function / projectPoints.total_project_points) * 100).toFixed(2))
      }
      const functionPointTotal = parseFloat(functionPoints.total_points_of_function).toFixed(2)
      const projectPointTotal = parseFloat(projectPoints.total_project_points).toFixed(2)
      return `${functionPointTotal} / ${projectPointTotal} (${result}%)`
    },

    getPointProjectLeft(functionPoints, projectPoints) {
      return parseFloat((projectPoints.total_project_points - functionPoints.total_function_points_of_project).toFixed(2))
    },

    /**
     * Calculate points in 1 life cycle
     */
    calculateTotalPointEt(pointEts) {
      if (pointEts.length > 0) {
        const total = pointEts.reduce((total, pointObj) => {
          const pointEt =
            typeof pointObj.point_et === 'number' ? pointObj.point_et : 0
          return total + pointEt
        }, 0)
        return Math.max(total.toFixed(2), 0)
      } else {
        return 0
      }
    },

    /**
     * Calculate points in tasks
     */
    countTaskPoint(data) {
      if (data.length > 0) {
        const total = data.reduce((total, item) => {
          const point = typeof item.approve_point === 'number'
            ? item.approve_point
            : 0
          return total + point
        }, 0)
        return total.toFixed(2)
      } else {
        return 0
      }
    },

    /**
     * Get point auto by percentage
     */
    getAutoPoint() {
      if (this.checkAuto) {
        this.model.children.forEach(child => {
          if (child?.mst_life_cycle_status?.closed === LIFE_CYCLE_STATUS_CLOSED_VALUE.no_handle) {
            child.point_et = 0
          } else {
            const result = (this.inputPoint * child?.mst_life_cycle?.et_percent) / 100
            child.point_et = !isNaN(result) ? Number(result) : 0
          }
        })
      }
    },

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
     * Calculate total et %
     */
    calTotalEtPercent() {
      const newArr = [...this.model.children]
      newArr.pop()
      this.totalEtPercent = (newArr.reduce((total, item) => {
        const etPercent =
          typeof item.mst_life_cycle.et_percent === 'number' ? item.mst_life_cycle.et_percent : 0
        return total + etPercent
      }, 0)).toFixed(2)
    },

    /**
     * Cal total point
     */
    calTotalNewPoint() {
      const newArr = [...this.model.children]
      newArr.pop()

      this.totalNewPoint = (newArr.reduce((total, item) => {
        const pointEt = typeof item.point_et === 'number'
          ? item.point_et
          : 0
        return total + pointEt
      }, 0)).toFixed(2)
    },

    /**
     * Trigger on changing et percentage
     */
    changeEtPercent() {
      this.calTotalEtPercent()
      this.getAutoPoint()
      this.calTotalNewPoint()
    },

    /**
     * Trigger on changing input point can be distributed
     */
    changeInputPoint() {
      // when changing input point can be distributed -> if is auto mode, calculate auto at all row
      if (this.checkAuto) {
        this.getAutoPoint()
      }
      // calculate total
      this.calTotalNewPoint()
    },

    /**
     * Trigger on changing point et at one row
     */
    changeRowPointEt() {
      // When changing point et at one row -> calculate total
      this.calTotalNewPoint()
    },

    /**
     * Submit form
     */
    async handleSubmit() {
      if (parseFloat(this.inputPoint) === 0) {
        this.$notification.error({
          message: this.$t('module.tab_schedule_point_distribute.required_total_point_distributed_more')
        })
        return
      }

      if (parseFloat(this.totalNewPoint) === 0) {
        this.$notification.error({
          message: this.$t('module.tab_schedule_point_distribute.required_point_distributed')
        })
        return
      }

      if (this.inputPoint && (this.inputPoint > this.distributablePoint)) {
        this.$notification.error({
          message: this.$t('module.tab_schedule_point_distribute.invalid_point_distribute')
        })
        return
      }

      if (this.inputPoint && (this.totalNewPoint > this.inputPoint)
      ) {
        this.$notification.error({
          message: this.$t('module.tab_schedule_point_distribute.invalid_point_distribute')
        })
        return
      }

      if (!this.description) {
        this.$notification.error({
          message: this.$t('module.tab_schedule_point_distribute.required_distribute_reason')
        })
        return
      }

      this.$store.dispatch('setLoading', true)
      try {
        let data = [...this.model.children]
        data.pop()
        data = data.map(itemData => {
          return { ...itemData, note: this.description, user_update_id: this.$auth.user.id }
        })
        for (const itemData of data) {
          const point = itemData?.function_et_points ? this.calculateTotalPointEt(itemData.function_et_points) : 0
          if (parseFloat(itemData.point_et) < 0 && ((parseFloat(itemData.point_et) * -1) > (point - itemData.total_task_point))) {
            this.$notification.error({
              message: `${itemData?.mst_life_cycle?.name} không cho phép giảm quá tổng số point đã sử dụng`
            })
            return
          }
        }
        await this.$api.project.distributePoint(data)
        this.$emit('save')
        this.openModal = false
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.error(_)
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
  .ant-form-item-label {
    text-align: left;
    font-weight: 500;
  }
  .ant-row-flex {
    flex-flow: column;
    align-items: center;
    width: 75%;
  }
  .ant-form-item {
    margin-left: 5px;
    margin-bottom: 0;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 2px 2px !important;
  }
}
.link {
  color: #1890ff;
}
.err {
  color: red;
  font-weight: 500;
  font-size: 17px;
}
.flex {
  display: flex;
}
.title-point {
  font-weight: 500;
}
.submit-btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.current_percent {
  margin-top: 8px;
  margin-left: 8px;
}
</style>
