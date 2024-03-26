<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 7 }"
    :wrapper-col="{ sm: 16 }"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div class="p-4">
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.item_pk')"
              prop="item_pk"
            >
              <a-select
                v-model="model.item_pk"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.functionTestCase.item_pk')"
                @change="handleItemChange"
              >
                <a-select-option
                  v-for="item in functionItem"
                  :key="item.item_pk"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.event_pk')"
              prop="event_pk"
            >
              <a-select
                v-model="model.event_pk"
                show-search
                :disabled="loading"
                :filter-option="filterOption"
                :placeholder="$t('module.functionTestCase.event_pk')"
                @change="handleEventChange"
              >
                <a-select-option
                  v-for="item in filteredEvents"
                  :key="item.event_pk"
                >
                  {{ item.mstEvent?.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.logic_pk')"
              prop="logic_pk"
            >
              <a-tree-select
                v-model="model.logic_pk"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="Please select"
                allow-clear
                :tree-data="filteredLogic"
                tree-default-expand-all
              >
                <template
                  slot="action"
                  slot-scope="{ title }"
                >
                  <span class="menu-tree__title">
                    {{ $t(title) }}
                  </span>
                </template>
              </a-tree-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check')"
              prop="content_check"
            >
              <a-textarea
                v-model="model.content_check"
                :placeholder="$t('module.functionTestCase.content_check')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.content_check_jp')"
              prop="content_check_jp"
            >
              <a-textarea
                v-model="model.content_check_jp"
                :placeholder="$t('module.functionTestCase.content_check_jp')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result')"
              prop="expect_result"
            >
              <a-textarea
                v-model="model.expect_result"
                :placeholder="$t('module.functionTestCase.expect_result')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('module.functionTestCase.expect_result_jp')"
              prop="expect_result_jp"
            >
              <a-textarea
                v-model="model.expect_result_jp"
                :placeholder="$t('module.functionTestCase.expect_result_jp')"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          :title="id ? 'Cập nhật' : 'Tạo mới'"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

            &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          title="Huỷ bỏ"
          @click="cancel"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import { cloneDeep } from 'lodash'
import DataForm from '~/mixins/data-form'
import { LOGIC_TYPE_VALUE } from '~/constants'

export default {
  mixins: [DataForm],

  props: {
    version: {
      type: [Object],
      default: () => {}
    },

    functionItem: {
      type: [Array],
      default: () => []
    },
    functionEvents: {
      type: [Array],
      default: () => []
    },
    functionEventLogics: {
      type: [Array],
      default: () => []
    }
  },
  /**
       * Init data for component.
       */
  data: () => ({
    resource: 'functionTestCase',
    filteredLogic: [],
    filteredEvents: [],
    LOGIC_TYPE_VALUE,
    value: undefined
  }),

  /**
       * Computed event.
       */
  computed: {
    formRules() {
      return {
        content_check: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.content_check') }),
            trigger: ['change', 'blur']
          }
        ],
        expect_result: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.expect_result') }),
            trigger: ['change', 'blur']
          }
        ],

        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.item_pk') }),
            trigger: ['change', 'blur']
          }
        ],

        event_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.event_pk') }),
            trigger: ['change', 'blur']
          }
        ],
        logic_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionTestCase.logic_pk') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
  },

  /**
   * List of methods.
   */
  methods: {
    /**
     * Get event follow item
     */
    handleItemChange() {
      this.filteredEvents = this.functionEvents.filter(event => event.item_pk === this.model.item_pk)
      this.model.event_pk = null
      this.filteredLogic = []
    },

    /**
     * Get logic follow event
     */
    handleEventChange() {
      const data = this.functionEventLogics.filter(logic => logic.event_pk === this.model.event_pk)

      const recursive = (parentLogicPK = 0, parent = null) => {
        const list = cloneDeep(data.filter(item => item.parent_logic_pk === parentLogicPK))

        return list.map(item => {
          const children = recursive(item.logic_pk, item.event_pk)
          let titleLogic = ''
          if (item.logic_type === LOGIC_TYPE_VALUE.sequence) {
            titleLogic = item.logic_detail
          } else if (item.logic_type === LOGIC_TYPE_VALUE.goto) {
            titleLogic = this.$t('module.functionEventLogical.goto') + ': ' + item.functionGoto?.name
          } else if (item.logic_type === LOGIC_TYPE_VALUE.if) {
            titleLogic = this.$t('module.functionEventLogical.if') + ' (' + item.conditions + ')'
          } else if (item.logic_type === LOGIC_TYPE_VALUE.elseif) {
            titleLogic = this.$t('module.functionEventLogical.elseif') + ' (' + item.conditions + ')'
          } else {
            titleLogic = this.$t('module.functionEventLogical.else')
          }
          const logicItem = {
            key: item.logic_pk,
            title: titleLogic,
            value: item.logic_pk,
            scopedSlots: {
              title: 'action'
            },
            children
          }

          return logicItem
        })
      }
      this.filteredLogic = recursive()
    },

    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        id: this.model.id,
        project_id: this.$store.state.project.id,
        function_id: this.version.function_id,
        version_code: this.version.version_code,
        item_pk: this.model.item_pk,
        event_pk: this.model.event_pk,
        logic_pk: this.model.logic_pk,
        content_check: this.model.content_check,
        content_check_jp: this.model.content_check_jp,
        expect_result: this.model.expect_result,
        expect_result_jp: this.model.expect_result_jp
      }

      return model
    },
    cancel() {
      this.model = {}
      this.$emit('cancel')
    },
    /**
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },
    /**
   * Validate before submit
   */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            if (this.model.id) {
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }

            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.model = {}

            this.$emit('save')
          } catch (_) {
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
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
      }
      .ant-col {
        margin-bottom: 5px;
      }
    }
    </style>
