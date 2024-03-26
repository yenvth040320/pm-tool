<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    :label-col="{ sm: 6 }"
    :wrapper-col="{ sm: 18 }"
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
              :label="$t('role.name')"
              prop="name"
            >
              <a-input
                v-model="model.name"
                :placeholder="$t('role.name')"
              />
            </a-form-model-item>
          </a-col>

          <a-col
            :span="24"
            :md="20"
          >
            <a-form-model-item
              :label="$t('role.permissions')"
              prop="permissions"
            >
              <div style="display: flex">
                <a-checkbox-group
                  v-model="model.permission_ids"
                  name="permissions"
                >
                  <a-collapse
                    v-if="permissions.length"
                    v-model="activeKey"
                    expand-icon-position="right"
                  >
                    <a-collapse-panel
                      v-for="group in permissions"
                      :key="`${group.name}`"
                      :header="group.name"
                    >
                      <div class="category-wrapper">
                        <div class="category-check">
                          <input
                            type="checkbox"
                            class="check-all-btn"
                            @change="checkAll(group, $event)"
                          />
                          <h4 class="category-check__title">
                            {{ $t('module.role.check_all') }}
                          </h4>
                        </div>
                        <div class="category-check">
                          <input
                            type="checkbox"
                            class="check-all-btn"
                            @change="checkByCategory(group, ['index', 'show', 'getByIdAndVersion', 'getApiUsed', 'getDataSchedule', 'getDataProcess', 'getRelationship', 'listMemberOfProject', 'getSupportMember', 'getDataManage', 'getListVersion', 'getApiSequenceDiagram',
                                                             'listComponentFlowBranch', 'getFunctionList', 'getFunctionVersionList', 'getListCaseTest', 'getFunctionTestcaseMatrix', 'getFunctionTestcaseDetail', 'getMethodCall', 'getListFile', 'getListFunction', 'exportExcel',
                                                             'getListFunctionItem', 'getGroupMember', 'getPermissions', 'getPoints', 'exportReportExcel', 'tab_schedule'], $event)"
                          />
                          <h4 class="category-check__title">
                            {{ $t('module.role.check_list') }}
                          </h4>
                        </div>
                        <div class="category-check">
                          <input
                            type="checkbox"
                            class="check-all-btn"
                            @change="checkByCategory(group, ['store', 'createApiParameterJson', 'createApiResponseJson' , 'createDbTableSql', 'createLogicByTreeText', 'createMulti', 'increaseVersion', 'syncBranch', 'mergeComponent', 'saveCaseTest', 'autoCreate', 'saveTabTestcaseMatrix', 'multiStore',
                                                             'analyticsDataGitlab', 'syncDataGitlab', 'updateOrCreate', 'increaseMultiVersion', 'lockAllVersion', 'updateDatasource', 'copySelectedData', 'updateData', 'updateDataSource', 'syncHtmlId', 'copy', 'multiAddDefault', 'uploadToFunction', 'autoClassifyLevel',
                                                             'updateClassifyLevel', 'distributePoint', 'copyMstData', 'saveProjectMember', 'copyTestcase', 'copyCodeTestcase', 'copyAllCodeTestcase'], $event)"
                          />
                          <h4 class="category-check__title">
                            {{ $t('module.role.check_add') }}
                          </h4>
                        </div>
                        <div class="category-check">
                          <input
                            type="checkbox"
                            class="check-all-btn"
                            @change="checkByCategory(group, ['update', 'updateApiParameterJson', 'updateResponse', 'updateDbTableSql', 'updateItemNum', 'updatePosition', 'multiUpdate', 'updateOrderCaseTest', 'updateOrder', 'changePosition', 'updateOrCreate', 'updateDiagramImage', 'updateDescription', 'updateDatasource', 'updateData', 'updateDataSource',
                                                             'replace', 'updateContentJp', 'updateClassifyLevel', 'saveProjectMember', 'saveRequirementSchedule', 'updateOrder', 'updateContent'], $event)"
                          />
                          <h4 class="category-check__title">
                            {{ $t('module.role.check_update') }}
                          </h4>
                        </div>
                        <div class="category-check">
                          <input
                            type="checkbox"
                            class="check-all-btn"
                            @change="checkByCategory(group, ['destroy', 'updateUseFlgResponse', 'updateUseFlgParameter', 'updateUseFlgDbTable', 'deleteGroupAction', 'deleteComponentRelationship', 'deleteCaseTest', 'clearCacheBrach', 'updateUseFlg'], $event)"
                          />
                          <h4 class="category-check__title">
                            {{ $t('module.role.check_delete') }}
                          </h4>
                        </div>
                      </div>

                      <div
                        v-for="permission in group.permissions"
                        :key="permission.id"
                      >
                        <a-checkbox :value="permission.id">
                          {{ $t(convertName(permission.name)) }}
                        </a-checkbox>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                </a-checkbox-group>
                <a-button v-if="activeKey.length === 0" class="open_btn" type="primary" @click="expandAllCollapses">
                  {{ $t('common.expand_all_node') }}
                </a-button>
                <a-button v-if="activeKey.length > 0" class="open_btn" type="primary" @click="activeKey = []">
                  {{ $t('common.close_all_node') }}
                </a-button>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>

      <div class="text-center p-3">
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.create') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import {
  USER_MODULE,
  ROLE_MODULE,
  PROJECT_MODULE,
  SETTINGS_MODULE,
  BASIC_DESIGN_MODULE,
  TEST_MODULE,
  API_MODULE,
  DB_MODULE,
  BA_MODULE,
  SOURCE_CODE_MODULE
} from '~/constants'

export default {
  mixins: [DataForm],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const { data: { result: { data } } } = await this.$api.role.getPermissions()
      const parents = [...new Set(data.map(item => item.name.split('.')[0]))]
      const arr = []
      parents.forEach(entry => {
        if (USER_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.user'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (ROLE_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.role'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (PROJECT_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.project'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (SETTINGS_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.setting'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (BASIC_DESIGN_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.basic_design'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (TEST_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.testing'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (API_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.api'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (DB_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.database'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (BA_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.BA'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
        if (SOURCE_CODE_MODULE.includes(entry)) {
          arr.push({
            name: this.$t('module.source_code'),
            permissions: data.filter((item, index) => item.name.startsWith(`${entry}.`))
          })
        }
      })
      this.permissions = arr.reduce((acc, curr) => {
        const existingItem = acc.find(item => item.name === curr.name)
        if (existingItem) {
          existingItem.permissions.push(...curr.permissions)
        } else {
          acc.push(curr)
        }
        return acc
      }, [])
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  data: () => ({
    resource: 'role',
    USER_MODULE,
    ROLE_MODULE,
    PROJECT_MODULE,
    SETTINGS_MODULE,
    BASIC_DESIGN_MODULE,
    TEST_MODULE,
    SOURCE_CODE_MODULE,
    API_MODULE,
    DB_MODULE,
    BA_MODULE,
    indeterminate: true,
    permissions: [],
    activeKey: []
  }),

  computed: {
    formRules() {
      return {
        name: [
          {
            required: true,
            message: this.$t('validation.required', { field: this.$t('role.name') }),
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },

  methods: {
    /**
     * Get model
     *
     * @returns {Object}
     */
    getModel() {
      const model = {
        name: this.model.name,
        permissions: this.model.permission_ids
      }

      return model
    },

    /**
     * Set model
     *
     * @param {Object} data
     */
    setModel(data) {
      data.permission_ids = data.permissions ? data.permissions.map(item => item.id) : []
      this.model = data
    },

    convertName(name) {
      const common = name.split('.')
      if (common[1]) {
        switch (common[1]) {
          case 'index':
            return `${common[0]} - Danh sách ${common[0]}`
          case 'store':
            return `${common[0]} - Thêm ${common[0]}`
          case 'show':
            return `${common[0]} - Chi tiết ${common[0]}`
          case 'update':
            return `${common[0]} - Cập nhật ${common[0]}`
          case 'destroy':
            return `${common[0]} - Xóa ${common[0]}`
          default:
            return name
        }
      }
    },

    /**
     * Open all
     */
    expandAllCollapses() {
      this.activeKey = this.permissions.map(group => group.name)
    },

    checkAll(group, event) {
      const checked = event.target.checked
      if (checked) {
        const permissionOfGroup = group.permissions.map(group => {
          return group.id
        })
        const diff = permissionOfGroup.filter(x => !this.model.permission_ids.includes(x))
        this.model.permission_ids.push(...diff)
      } else {
        this.model.permission_ids = this.model.permission_ids.filter(x => !group.permissions.map(group => group.id).includes(x))
      }
    },

    checkByCategory(groups, key, event) {
      const checked = event.target.checked
      const permissionOfGroup = []
      groups.permissions.forEach(group => {
        if (key.includes(group.name.split('.')[1])) {
          permissionOfGroup.push(group.id)
        }
      })
      if (checked) {
        const diff = permissionOfGroup.filter(x => !this.model.permission_ids.includes(x))
        this.model.permission_ids.push(...diff)
      } else {
        this.model.permission_ids = this.model.permission_ids.filter(x => !permissionOfGroup.includes(x))
      }
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
</style>
