<template>
  <div>
    <a-drawer
      :title="$t('title.create_sequence_diagram')"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form-model
        ref="form"
        layout="vertical"
        :model="model"
        :rules="formRules"
        @submit.prevent="handleSubmit"
      >
        <a-spin :spinning="loading">
          <div class="p-4">
            <a-row
              type="flex"
              :gutter="30"
            >
              <!-- select actor -->
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.function_usecase.actor')"
                  prop="actor_id"
                >
                  <a-select
                    v-model="model.actor_id"
                    allow-clear
                    :placeholder="$t('module.function_usecase.actor')"
                    :filter-option="filterOption"
                    mode="multiple"
                  >
                    <a-select-option
                      v-for="(item) in actors"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- End select actor -->

              <!-- Select function item -->
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.functionItem')"
                  prop="item_pk"
                >
                  <a-select
                    v-model="model.item_pk"
                    allow-clear
                    :placeholder="$t('module.functionItem')"
                    show-search
                    show-arrow
                    :filter-option="filterOption"
                  >
                    <a-select-option
                      v-for="(item, index) in functionItems"
                      :key="index"
                      :value="item.item_pk"
                    >
                      {{ item.item_num }}: {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- End select function item -->

              <!-- Select event -->
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.mstEvent')"
                  prop="mst_event_id"
                >
                  <a-select
                    v-model="model.mst_event_id"
                    allow-clear
                    :placeholder="$t('module.mstEvent')"
                    show-search
                  >
                    <a-select-option
                      v-for="item in mstEvents"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- End select event -->

              <!-- select api -->
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.apis')"
                  prop="api_id"
                >
                  <a-select
                    v-model="model.api_id"
                    allow-clear
                    :placeholder="$t('module.apis')"
                    show-search
                    show-arrow
                    @change="handleVersionAPiChange()"
                  >
                    <a-select-option
                      v-for="(item, index) in apis"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- End select api -->
              <!-- select api version -->
              <a-col
                :span="24"
                :md="24"
              >
                <a-form-model-item
                  :label="$t('module.versionApi')"
                  prop="api_version_code"
                >
                  <a-select
                    v-model="model.api_version_code"
                    allow-clear
                    :placeholder="$t('module.versionApi')"
                    show-search
                    show-arrow
                  >
                    <a-select-option
                      v-for="(item, index) in apiVersions"
                      :key="index"
                      :value="item.version_code"
                    >
                      {{ $t('module.relationship.version_code') }}: {{ item.version_code }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- End select api version -->
            </a-row>
            <div class="text-center">
              <a-button :style="{ marginRight: '8px' }" title="Huỷ bỏ" @click="$emit('onClose')">
                {{ $t('common.cancel') }}
              </a-button>
              <a-button
                html-type="submit"
                type="primary"
                class="min-w-100"
              >
                {{ $t('common.submit') }}
              </a-button>
            </div>
          </div>
        </a-spin>
      </a-form-model>
    </a-drawer>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'
import { PROPERTY_TYPE_VALUE } from '~/constants'
import DataForm from '~/mixins/data-form'
export default {
  components: {
  },
  mixins: [DataForm],
  props: {
    version: {
      type: [Object],
      default: () => {}
    },
    functionItems: {
      type: [Array],
      default: () => []
    },
    mstEvents: {
      type: [Array],
      default: () => []
    },
    itemFunctionSequence: {
      type: [Object],
      default: () => {}
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      resource: 'functionSequenceDiagram',
      model: {},
      listBranches: [],
      listSourceCodes: [],
      listTrees: [],
      listClasses: [],
      listClassProperties: [],
      filteredTrees: [],
      apis: [],
      apiVersions: [],
      PROPERTY_TYPE_VALUE,
      actors: {}
    }
  },

  /**
   * Computed event.
   */
  computed: {
    ...mapState({
      loading: 'loading'
    }),
    formRules() {
      return {
        actor_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.function_usecase.actor') }),
            trigger: ['change', 'blur']
          }
        ],
        api_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.apis') }),
            trigger: ['change', 'blur']
          }
        ],
        api_version_code: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.versionApi') }),
            trigger: ['change', 'blur']
          }
        ],
        item_pk: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.functionItem') }),
            trigger: ['change', 'blur']
          }
        ],
        mst_event_id: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('module.mstEvent') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  watch: {
    itemFunctionSequence(item) {
      if (item !== undefined) {
        this.update = true
        this.model = cloneDeep(item)
        this.getListApiVersions()
      } else {
        this.update = false
      }
    }
  },

  /**
   * Mounted event.
   */
  mounted() {
    this.setDrawerTitle()
    this.getListActors()
    this.getListApis()
  },
  methods: {

    /**
     *Get list api
    */
    async getListApis() {
      try {
        this.$store.dispatch('setLoading', true)
        const params = {
          all: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.api.list({ params })
        this.apis = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     *Get list api
    */
    async getListApiVersions() {
      try {
        this.$store.dispatch('setLoading', true)
        const params = {
          all: true,
          project_id: this.$store.state.project.id,
          api_id: this.model.api_id
        }
        const { data: { result: { data } } } = await this.$api.versionApi.list({ params })
        this.apiVersions = data
        if (this.apiVersions.length > 0) {
          this.model.api_version_code = this.apiVersions[0].version_code
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
       * Get source code
       */
    async getSourceCode() {
      try {
        const params = {
          all: true,
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.sourceCode.list({ params })
        this.listSourceCodes = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    handleVersionAPiChange() {
      this.getListApiVersions()
      delete this.model.api_version_code
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
     *Get list actor
    */
    async getListActors() {
      const { data: { result: { data } } } = await this.$api.actor.list({ params: { all: true } })
      this.actors = data
    },

    /**
     * Set title
     */
    setDrawerTitle() {
      this.drawerTitle = this.$t('module.functionEventLogical')
      this.formCurrent = this.$t('module.functionEventLogical.logic_pk')
    },
    disableButton(data) {
      this.disableElse = data
    },

    /**
     * Shows the drawer and sets the data for editing.
     */

    showDrawer(data) {
      this.visible = true
      if (data) {
        this.model = cloneDeep(data)
      } else {
        this.model = {}
      }
    },

    /**
     * Saves the changes by emitting a 'save' event.
     */
    save() {
      this.$emit('save')
    },

    /**
     * Closes the drawer and resets variables.
     */
    onClose() {
      this.visible = false
      this.model = {}
    },
    /**

    /**
       * Validate before submit
       */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)

          try {
            const data = this.getModel()
            data.project_id = this.$store.state.project.id
            data.function_id = this.version.function_id
            data.version_code = this.version.version_code
            if (this.model.id) {
              delete this.model.api
              delete this.model.actors
              delete this.model.mstEvent
              delete this.model.function
              delete this.model.functionItem
              await this.repository.update(this.model.id, data)
            } else {
              await this.repository.create(data)
            }
            this.$emit('save')
            this.onClose()
            this.$notification.success({
              message: this.$t('text.successfully')
            })
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
    .ant-form-item {
        margin-bottom: 24px;
    }
    .action {
      .ant-btn-danger {
        height: 31.99px;
        padding: 0 10px;
      }
      .button {
        margin: 5px;
      }
    }
    .choose-file-label::before {
      position: absolute;
      color: #f5222d;
      top: 7%;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .choose-file-label {
      .ant-form-item-label {
        padding-left: 10px;
      }
    }
    .error-message {
      color: #f5222d;
    }
  }
  </style>
