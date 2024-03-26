<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4 no-border">
        <template slot="title">
          <div v-if="dataOrigin.length > 0">
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
              @click="handleSubmit()"
            >
              {{ $t('common.submit') }}
            </a-button>
          </div>
        </template>
        <template slot="extra">
          <a-button
            v-if="isHasPermision"
            html-type="button"
            type="primary"
            :disabled="areAllApproved()"
            @click="gotoApproveAll()"
          >
            {{ $t('module.requirement.estimate.approve_all') }}
          </a-button>
          <a-button
            html-type="button"
            type="primary"
            title="Thêm màn hình bị ảnh hưởng"
            @click="gotoAddFunction()"
          >
            <font-awesome-icon
              icon="plus-circle"
              class="mr-1"
            />
            {{ $t('module.requirement.button_add') }}
          </a-button>
        </template>
        <div>
          <div class="text-heading pb-3">
            <div v-if="requirementFunctions.length > 0">
              {{ $t('module.requirement.approve_status') }}:
              <span v-if="areAllApproved()">{{ $t('module.requirement.function.text_approved') }}</span>
              <span v-else>{{ $t('module.requirement.function.text_not_approved') }}</span>
            </div>
            <div>
              <span v-if="userAllApproved()">{{ $t('module.requirement.function.approve_user') }}:</span>
              <span>{{ userAllApproved() }}</span>
            </div>
          </div>
          <RequirementFunction ref="childComponentRef" :requirement-functions="requirementFunctions" @deleteRecord="deleteRecord" @addRecord="addRecord" />
        </div>

        <div v-if="requirementFunctions.length > 0" class="text-center p-3">
          <a-button
            html-type="submit"
            type="primary"
            class="min-w-100"
            @click="handleSubmit()"
          >
            {{ $t('common.submit') }}
          </a-button>
        </div>
        <ModalAddFunction ref="modalAddFunction" @save="save" />
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import { APPROVE_STATUS_ANALYTICS, SORT } from '~/constants'
import RequirementFunction from '~/components/templates/requirementFunction/RequirementFunction.vue'
import ModalAddFunction from '~/components/templates/requirement/ModalAddFunction.vue'
export default {
  components: {
    ModalAddFunction,
    RequirementFunction
  },

  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },

  data() {
    return {
      resource: 'requirement',
      requirementFunctions: [],
      dataOrigin: [],
      APPROVE_STATUS_ANALYTICS,
      requirement: [
      ],
      functionRelationshipItem: [],
      functions: [],
      functionIds: [],
      isHasPermision: false,
      SORT,
      loading: false
    }
  },

  /**
   * Computed event.
   */
  computed: {
  },

  watch: {
  },
  created() {
  },

  mounted() {
    this.getListRequirementFunction()
    this.checkPermissionApprove()
  },

  methods: {
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
    /**
     * Go to add function
     */
    gotoAddFunction() {
      this.$refs.modalAddFunction.openModal(this.id, this.requirementFunctions)
    },

    save(data) {
      this.functionIds = data
      this.getListFunction()
    },

    async getListFunction() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          ids: this.functionIds,
          isTabAnalytics: true,
          order_by: 'code',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.function.getListFunction({ params })
        this.functions = data
        this.addFunctionToListFunctionInfluence()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    addFunctionToListFunctionInfluence() {
      this.requirementFunctions = this.requirementFunctions.filter(reqFunc => {
        return this.functions.some(func => func.id === reqFunc.function_id)
      })
      this.functions.forEach(func => {
        const exists = this.requirementFunctions.some(reqFunc => reqFunc.function_id === func.id)
        if (!exists) {
          const funcData = { ...func }
          delete funcData.lastest_version
          this.requirementFunctions.push({
            all_item: 0,
            all_logic: 0,
            function: funcData,
            function_id: func.id,
            project_id: func.project_id,
            requirementFunctionEvents: [],
            requirementFunctionItems: [],
            requirement_id: this.id,
            version_code: func.latest_version,
            versionFunction: func.lastest_version
          })
        }
      })
      this.convertData()
    },

    /**
     * Get list requirement function
     */
    async getListRequirementFunction() {
      this.loading = true

      try {
        const params = {}
        params.project_id = this.$store.state.project.id
        params.requirement_id = this.id
        params.not_limit = true

        const { data: { result: { data } } } = await this.$api.requirementFunction.list({ params })
        this.requirementFunctions = data
        this.dataOrigin = data
        this.convertData()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.loading = false
      }
    },

    convertData() {
      this.requirementFunctions = this.mergeArrays(this.requirementFunctions)
      this.requirementFunctions = this.requirementFunctions.map(record => {
        const hasItems = record.requirementFunctionItems && record.requirementFunctionItems.length > 0
        const itemPks = hasItems ? record.requirementFunctionItems.map(item => item.item_pk) : record.item_pks || []

        const hasEvents = record.requirementFunctionEvents && record.requirementFunctionEvents.length > 0
        const eventPks = hasEvents ? record.requirementFunctionEvents.map(item => item.event_pk) : record.event_pks || []

        return {
          ...record,
          item_pks: itemPks,
          event_pks: eventPks,
          functionRelationshipItems: []
        }
      })
    },

    mergeArrays(data) {
      data.forEach(item => {
        if (item.function) {
          item.function.function_relationship_source = item.function.function_relationship_source.map(val => {
            if (val.function_id_source === item.function_id) {
              return {
                function: val.function_target
              }
            }
          }).filter(Boolean)
          item.function.function_relationship_target = item.function.function_relationship_target.map(val => {
            if (val.function_id_target === item.function_id) {
              return {
                function: val.function_source
              }
            }
          }).filter(Boolean)
        }
      })
      return data.map(item => {
        if (!item.functionRelationships) {
          return {
            ...item,
            functionRelationships: item.function ? item.function.function_relationship_source.concat(item.function.function_relationship_target) : []
          }
        } else {
          return {
            ...item
          }
        }
      })
    },

    findItemToDelete(funcId) {
      const result = this.requirementFunctions.find(func => func.function_id === funcId)
      if (result && result.id) {
        this.confirmToDelete(result.id)
      }
    },

    async handleSubmit() {
      try {
        const dataRequirementFunction = [...this.requirementFunctions]
        const hasInvalidReason = dataRequirementFunction.some(item => {
          return item.reason === '' || item.reason === null || item.reason === undefined
        })
        if (hasInvalidReason) {
          this.$notification.error({
            message: this.$t('text.required_reason')
          })
        } else {
          dataRequirementFunction.forEach(item => {
            if (item.versionFunction.function_items.length > 0 && item.versionFunction.function_items.length === item.item_pks.length) {
              item.all_item = 1
            } else {
              item.all_item = 0
            }
            const eventOfGroup = item.versionFunction.function_items.flatMap(item =>
              item.function_event.map(event => event.event_pk)
            )
            if (eventOfGroup.length === item.event_pks.length) {
              item.all_logic = 1
            } else {
              item.all_logic = 0
            }
            delete item.functionRelationships
            delete item.functionRelationshipItems
            delete item.function
            delete item.versionFunction
            delete item.requirement
          })
          const data = {
            requirement_id: this.id,
            requirementFunction: dataRequirementFunction
          }
          await this.$api.requirementFunction.createItemAndEvent(data)
          this.$notification.success({
            message: this.$t('text.successfully')
          })
          this.getListRequirementFunction()
          this.$bus.$emit('callListRequirementFunction')
        }
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    deleteRecord(index) {
      this.requirementFunctions.splice(index, 1)
    },

    addRecord(data) {
      const version = { ...data?.version }
      delete version.function
      this.requirementFunctions.push({
        all_item: 0,
        all_logic: 0,
        function: data?.version?.function,
        function_id: data?.version?.function_id,
        project_id: data?.version?.project_id,
        requirementFunctionEvents: [],
        requirementFunctionItems: data.functionItems ? data.functionItems : [],
        requirement_id: this.id,
        version_code: data?.version?.version_code,
        versionFunction: version
      })
      this.convertData()
    },

    async gotoApproveAll() {
      try {
        const data = {
          requirement_id: this.id
        }
        await this.$api.requirementFunction.approveAll(data)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
        this.getListRequirementFunction()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    areAllApproved() {
      return this.requirementFunctions.every(rf => rf.approve_status === 1)
    },

    userAllApproved() {
      const firstApprovedRecord = this.requirementFunctions.find(rf => rf.approve_status === 1)
      return firstApprovedRecord ? firstApprovedRecord.approveUser.name : ''
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
.text-heading {
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}
</style>
