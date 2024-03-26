<template>
  <div>
    <a-card
      v-for="(record, index) in requirementFunctions"
      :key="index"
      class="mb-4"
    >
      <template slot="title">
        <span>
          {{ '[' + record?.function?.code + ']: ' + record?.function?.name + '/version: ' + record.version_code }}
        </span>
      </template>
      <template slot="extra">
        <a-button
          v-if="record.approve_status === 0"
          html-type="button"
          type="danger"
          title="Xoá"
          class="min-w-100"
          @click="deleteRecord(index)"
        >
          {{ $t('common.delete') }}
        </a-button>
      </template>
      <a-row
        type="flex"
        :gutter="30"
      >
        <a-col
          :span="24"
          :md="24"
        >
          <a-form-model
            ref="form"
            :model="record"
            :rules="formRules"
          >
            <a-form-model-item
              :label="$t('module.requirement.reason_text')"
              prop="reason"
              :wrapper-col="{ sm: 24 }"
            >
              <a-textarea
                v-model="record.reason"
                :rows="3"
                :placeholder="$t('module.requirement.reason')"
              />
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
      <a-row
        type="flex"
        :gutter="30"
        class="container-function"
      >
        <a-col
          :span="24"
          :md="24"
        >
          <div class="text-heading function-header" />
        </a-col>
        <a-col
          :span="24"
          :md="24"
        >
          <a-row>
            <a-col
              :span="24"
              :md="12"
            >
              <a-form-model-item
                prop="item_pks"
              >
                <div class="analytics-requirement">
                  <a-checkbox-group
                    v-model="record.item_pks"
                    name="item_pks"
                    @change="findFunctionInfluence(record)"
                  >
                    <div v-if="record?.versionFunction?.function_items.length > 0" class="category-wrapper">
                      <div class="category-check">
                        <input
                          type="checkbox"
                          :disabled="record.approve_status === 1"
                          :checked="record.all_item === 1"
                          class="check-all-btn"
                          @change="checkAllItem(record, $event)"
                        />
                        <h4 class="category-check__title">
                          {{ $t('module.functionItem.check_all') }}
                        </h4>
                      </div>
                    </div>

                    <div
                      v-for="item in record?.versionFunction?.function_items"
                      :key="item.item_pk"
                    >
                      <a-checkbox :value="item.item_pk" :disabled="record.approve_status === 1">
                        <a :href="`/function/${item.function_id}/version/${item.version_code}?function_item_num=${item.item_num}#tab_items`" target="_blank">
                          {{ item.item_num }}. {{ item.name +': (' + item.mst_item_type.name + ')' }}
                        </a>
                      </a-checkbox>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="24"
              :md="12"
            >
              <a-form-model-item
                prop="event_pks"
              >
                <div style="display: flex">
                  <a-checkbox-group
                    v-model="record.event_pks"
                    name="event_pks"
                  >
                    <div v-if="shouldShowCategoryWrapper(record?.versionFunction?.function_items)" class="category-wrapper">
                      <div class="category-check">
                        <input
                          type="checkbox"
                          class="check-all-btn"
                          :disabled="record.approve_status === 1"
                          :checked="record.all_logic === 1"
                          @change="checkAllEvent(record, $event)"
                        />
                        <h4 class="category-check__title">
                          {{ $t('module.functionEvent.check_all') }}
                        </h4>
                      </div>
                    </div>

                    <div
                      v-for="item in record?.versionFunction?.function_items"
                      :key="item.item_pk"
                    >
                      <div v-for="event in item.function_event" :key="event.event_pk">
                        <a-checkbox :value="event.event_pk" :disabled="record.approve_status === 1">
                          <a :href="`/function/${item.function_id}/version/${item.version_code}?function_event_id=${event.id}#tab_logics`" target="_blank">
                            {{ item.item_num + '. ' + item.name + ': (' + item.mst_item_type.name + ') On => ' + event.mst_event.name }}

                          </a>
                        </a-checkbox>
                      </div>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row
        type="flex"
        :gutter="30"
      >
        <a-col
          :span="24"
          :sm="12"
        >
          <div class="text-heading">
            {{ $t('module.requirement.text_influenced_by_relationships') }}
          </div>
          <InfluenceFunctionRelationship :record="record" :requirement-functions="requirementFunctions" @addRecord="addRecord" @deleteRecord="deleteRecord" />
        </a-col>

        <a-col
          :span="24"
          :sm="12"
          class="col__footer--right"
        >
          <div class="text-heading">
            {{ $t('module.requirement.text_influenced_by_apis') }}
          </div>
          <InfluenceFunctionDatasource :record="record" :requirement-functions="requirementFunctions" @addRecord="addRecord" @deleteRecord="deleteRecord" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import InfluenceFunctionRelationship from '~/components/templates/requirementFunction/InfluenceFunctionRelationship.vue'
import InfluenceFunctionDatasource from '~/components/templates/requirementFunction/InfluenceFunctionDatasource.vue'

export default {
  components: {
    InfluenceFunctionRelationship,
    InfluenceFunctionDatasource
  },
  props: {
    requirementFunctions: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
    }
  },

  /**
   * Computed event.
   */
  computed: {
    formRules() {
      return {
        reason: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.requirement.reason') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    requirementFunctions(val) {
      this.getFunctionInfluence(val)
    }
  },
  mounted() {
  },

  methods: {
    getFunctionInfluence(val) {
      val.forEach(element => {
        if (element.item_pks && element.item_pks.length > 0) {
          this.findFunctionInfluence(element)
        }
      })
    },
    /**
     * Hide checkbox select all when without item and event
     */
    shouldShowCategoryWrapper(functionItem) {
      if (functionItem) {
        return (
          functionItem.length > 0 &&
            functionItem.some(
              item => item.function_event && item.function_event.length > 0
            )
        )
      }
    },

    /**
     * Check all item
     */
    checkAllItem(record, event) {
      const checked = event.target.checked
      if (checked) {
        const itemOfGroup = record.versionFunction.function_items.map(item => {
          return item.item_pk
        })
        const diff = itemOfGroup.filter(x => !record.item_pks.includes(x))
        record.item_pks.push(...diff)
        record.all_item = 1
      } else {
        record.item_pks = record.item_pks.filter(x => !record.versionFunction.function_items.map(item => item.item_pk).includes(x))
        record.all_item = 0
      }
      this.findFunctionInfluence(record)
    },

    /**
     * Check all event
     */
    checkAllEvent(record, event) {
      const checked = event.target.checked
      if (checked) {
        const eventOfGroup = record.versionFunction.function_items.flatMap(item =>
          item.function_event.map(event => event.event_pk)
        )

        const diff = eventOfGroup.filter(x => !record.event_pks.includes(x))
        record.event_pks.push(...diff)
        record.all_logic = 1
      } else {
        record.event_pks = record.event_pks.filter(x => {
          return !record.versionFunction.function_items.some(item =>
            item.function_event.some(event => event.event_pk === x)
          )
        })
        record.all_logic = 0
      }
    },

    /**
       * Find function influence
       */
    async findFunctionInfluence(record) {
      try {
        const params = { ...record }
        delete params.versionFunction
        delete params.requirement
        delete params.function
        delete params.functionRelationships
        if (params.requirementFunctionItems) {
          delete params.requirementFunctionItems
        }

        if (params.requirementFunctionEvents) {
          delete params.requirementFunctionEvents
        }

        if (params.functionRelationshipItems) {
          delete params.functionRelationshipItems
        }
        const { data: { result: { data } } } = await this.$api.requirementFunction.getListFunctionInfluence({ params })

        record.functionRelationshipItems = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    deleteRecord(index) {
      this.$emit('deleteRecord', index)
    },

    addRecord(record) {
      this.$emit('addRecord', record)
    }
  }
}
</script>
<style lang="scss" scoped>
.open_btn {
  margin-left: 10px;
}
.check-all-btn {
  width: 21px;
  height: 21px;
  cursor: pointer;
}
.category-check {
  display: flex;
  .category-check__title {
    margin-left: 10px;
  }
}
.category-wrapper {
  display: flex;
  div {
    margin-left: 10px;
  }
}
.text-heading {
  font-weight: 500;
  font-size: 16px;
}
.function-header {
  display: flex;
  justify-content: space-between;
}
.container-function {
  background-color: #ffd;
}
:deep() {
  .ant-card-body {
    padding: 0 24px 24px 24px
  }
}
</style>
