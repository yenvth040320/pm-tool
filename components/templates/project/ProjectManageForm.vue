<template>
  <a-form-model
    ref="form"
    :model="model"
    :rules="formRules"
    @submit.prevent="handleSubmit"
  >
    <a-spin :spinning="loading">
      <div>
        <a-row
          type="flex"
          :gutter="30"
        >
          <!-- employee list -->
          <a-col
            :span="24"
            :md="24"
          >
            <a-table
              :columns="columns"
              :data-source="model.listEmployees"
              :pagination="false"
              :row-key="String(Math.random())"
            >
              <span slot="customTitleMeetingTask">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('module.manage_member.approve_meeting_task') }}
                  </template>
                  <font-awesome-icon :icon="['fas', 'handshake']" />
                </a-tooltip>
              </span>
              <span slot="customTitleTask">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('module.manage_member.approve_task') }}
                  </template>
                  <a-icon type="check" />
                </a-tooltip>
              </span>
              <span slot="customTitleCustomerSupport">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('module.manage_member.customer_support') }}
                  </template>
                  <a-icon type="wechat" />
                </a-tooltip>
              </span>
              <span slot="customTitleRequirementFunction">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('module.manage_member.approve_requirement_function') }}
                  </template>
                  <a-icon type="cloud-sync" />
                </a-tooltip>
              </span>
              <span slot="customTitleApproveEt">
                <a-tooltip>
                  <template slot="title">
                    {{ $t('module.manage_member.approve_et') }}
                  </template>
                  <a-icon type="clock-circle" />
                </a-tooltip>
              </span>
              <template
                slot="employee"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="Math.random().toString(36)"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.user_id`"
                  :rules="{
                    required: true,
                    message: $t('validation.required', { field: $t('module.manage_member.employees') }),
                    trigger: ['change', 'blur'],
                  }"
                >
                  <a-select
                    v-model="item.user_id"
                    mode="single"
                    :disabled="loading"
                    :placeholder="$t('module.manage_member.employees_select_placeholder')"
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
              </template>

              <template
                slot="role"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.role_id`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.role_id`"
                  :rules="{
                    required: true,
                    message: $t('validation.required', { field: $t('user.roles') }),
                    trigger: ['change', 'blur'],
                  }"
                >
                  <a-select
                    v-model="item.role_id"
                    mode="multiple"
                    :disabled="loading"
                    :placeholder="$t('module.manage_member.role_select_placeholder')"
                  >
                    <a-select-option
                      v-for="role in roles"
                      :key="role.id"
                      :value="role.id"
                    >
                      {{ role.name }}
                    </a-select-option>
                    <font-awesome-icon
                      slot="prefix"
                      icon="map-marker-alt"
                      class="width-1x"
                      style="color:rgba(0,0,0,.25)"
                    />
                  </a-select>
                </a-form-model-item>
              </template>

              <template
                slot="approve_meeting_task"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_meeting_task`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_meeting_task`"
                >
                  <a-checkbox v-model="item.approve_meeting_task" @change="changeCheckbox(item, 'approve_meeting_task', $event)" />
                </a-form-model-item>
              </template>

              <template
                slot="approve_task"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_task`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_task`"
                >
                  <a-checkbox v-model="item.approve_task" @change="changeCheckbox(item, 'approve_task', $event)" />
                </a-form-model-item>
              </template>

              <template
                slot="customer_support"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.customer_support`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.customer_support`"
                >
                  <a-checkbox v-model="item.customer_support" @change="changeCheckbox(item, 'customer_support', $event)" />
                </a-form-model-item>
              </template>

              <template
                slot="approve_et"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_et`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_et`"
                >
                  <a-checkbox v-model="item.approve_et" @change="changeCheckbox(item, 'approve_et', $event)" />
                </a-form-model-item>
              </template>

              <template
                slot="approve_requirement_function"
                slot-scope="item"
              >
                <a-form-model-item
                  :key="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_requirement_function`"
                  :prop="`listEmployees.` + model.listEmployees.indexOf(item) + `.approve_requirement_function`"
                >
                  <a-checkbox v-model="item.approve_requirement_function" @change="changeCheckbox(item, 'approve_requirement_function', $event)" />
                </a-form-model-item>
              </template>

              <span
                slot="action"
                slot-scope="item"
              >
                <a-button
                  html-type="button"
                  type="danger"
                  size="small"
                  :disabled="loading"
                  @click="deleteRow(item)"
                >
                  <font-awesome-icon
                    icon="trash-alt"
                    class="width-1x"
                  />
                </a-button>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </div>

      <!-- Bottom function -->
      <div class="text-right pb-4">
        <template>
          <div class="col-md-6 col-md-offset-3">
            <ul class="list-group" />
          </div>
          <a-button
            style="margin-top:20px;"
            html-type="button"
            type="primary"
            class="min-w-100"
            @click="add"
          >
            {{ $t('module.manage_member.employees_add') }}
          </a-button>
        </template>
      </div>

      <div
        class="text-center p-3"
        style="margin-bottom:3px"
      >
        <a-button
          html-type="submit"
          type="primary"
          class="min-w-100"
        >
          {{ id ? $t('common.update') : $t('common.add') }}
        </a-button>

        &nbsp;
        <a-button
          html-type="button"
          type="default"
          class="min-w-100"
          @click="$emit('goBack')"
        >
          {{ $t('common.cancel') }}
        </a-button>
      </div>
    </a-spin>
  </a-form-model>
</template>

<script>
import DataForm from '~/mixins/data-form'
import { SORT, APPROVE, APPROVE_ET } from '~/constants'

export default {
  mixins: [DataForm],
  data() {
    return {
      SORT,
      APPROVE,
      APPROVE_ET,
      listEmployees: [],
      resource: 'project',
      model: {
        listEmployees: [],
        id: '',
        name: ''
      },
      roles: [],
      users: [],
      deleteItem: []
    }
  },
  computed: {
    formRules() {
      return {}
    },
    columns() {
      return [
        {
          title: this.$t('module.manage_member.employees'),
          scopedSlots: { customRender: 'employee' },
          className: 'employee-col',
          width: '15%'
        },
        {
          title: this.$t('user.roles'),
          scopedSlots: { customRender: 'role' },
          className: 'role-col',
          width: '55%'
        },
        {
          scopedSlots: { customRender: 'approve_meeting_task' },
          slots: { title: 'customTitleMeetingTask' },
          width: '5%',
          align: 'center'
        },
        {
          slots: { title: 'customTitleTask' },
          scopedSlots: { customRender: 'approve_task' },
          width: '5%',
          align: 'center'
        },
        {
          slots: { title: 'customTitleCustomerSupport' },
          scopedSlots: { customRender: 'customer_support' },
          width: '5%',
          align: 'center'
        },
        {
          slots: { title: 'customTitleApproveEt' },
          scopedSlots: { customRender: 'approve_et' },
          width: '5%',
          align: 'center'
        },
        {
          slots: { title: 'customTitleRequirementFunction' },
          scopedSlots: { customRender: 'approve_requirement_function' },
          width: '5%',
          align: 'center'
        },
        {
          title: 'Action',
          key: 'action',
          className: 'text-center',
          width: '5%',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.getEmployee()
    this.getRoleList()
  },

  methods: {
    /**
     * Get item detail
     *
     * @param {Number} id
     */
    async getDetail(id) {
      this.$store.dispatch('setLoading', true)

      try {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
        if (id) {
          const { data: { result: { data } } } = await this.repository.listMemberOfProject(id)
          if (data.users) {
            const userRoles = {}
            data.users.forEach(item => {
              const { id, pivot } = item
              const roleId = pivot.role_id
              if (userRoles[id]) {
                userRoles[id].role_id.push(roleId)
              } else {
                userRoles[id] = {
                  user_id: id,
                  role_id: [roleId]
                }
              }
            })
            const roles = Object.values(userRoles)
            if (data.userApproves) {
              roles.forEach(role => {
                const find = data.userApproves.find(i => i.user_id === role.user_id)
                if (find) {
                  role.approve_meeting_task = !!find.approve_meeting_task
                  role.approve_task = !!find.approve_task
                  role.customer_support = !!find.customer_support
                  role.approve_et = !!find.approve_et
                  role.approve_requirement_function = !!find.approve_requirement_function
                  role.approve_id = find.id
                } else {
                  role.approve_meeting_task = false
                  role.customer_support = false
                  role.approve_task = false
                  role.approve_et = false
                  role.approve_requirement_function = false
                  role.approve_id = 0
                }
              })
            }
            this.model.listEmployees = []
            this.model.listEmployees = roles
          }
          this.model.name = data.name
          this.model.id = data.id
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
     * Filter in select box
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * push list 1 row table employee Project
     */
    add() {
      this.model.listEmployees.push({
        user_id: undefined,
        role_id: undefined,
        approve_meeting_task: false,
        customer_support: false,
        approve_task: false,
        approve_et: false,
        approve_requirement_function: false,
        approve_id: 0
      })
    },

    async getRoleList() {
      try {
        const params = {}
        const { data: { result: { data } } } = await this.$api.role.list({ params })
        this.roles = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * delete seletect user
     */
    deleteRow(item) {
      const index = this.model.listEmployees.indexOf(item)
      this.model.listEmployees.splice(index, 1)
    },

    /**
     * get list user
     */
    async getEmployee() {
      this.$store.dispatch('setLoading', true)
      try {
        const params = {
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.user.list({ params })
        this.users = data
      } catch (_) {
        console.error(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Validate before submit
     */
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.$store.dispatch('setLoading', true)
          try {
            const params = {
              id: this.model.id,
              employees: this.model.listEmployees
            }
            await this.$api.project.saveMember(this.model.id, params)
            this.$notification.success({
              message: this.$t('text.successfully')
            })
            this.getDetail(this.id)
            this.$bus.$emit('addMember')
          } catch (_) {
            console.error(_)
            this.$notification.error({
              message: this.$t('text.something_wrong')
            })
          } finally {
            this.$store.dispatch('setLoading', false)
          }
        }
      })
    },

    /**
     * On change checkbox
     *
     * @param item
     * @param field
     * @param e
     */
    changeCheckbox(item, field, e) {
      if (e.target.checked) {
        item[field] = APPROVE.yes
      } else {
        item[field] = APPROVE.no
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ant-form-item {
  margin: 0px !important;
}
.mb-10 {
  margin-bottom: 10px !important;
  margin-top: 10px !important;
}
.inp {
  min-height: 90px;
}

/deep/ {
  .ant-table-tbody > tr > td {
    padding: 5px 10px 5px 5px;
  }
  // <= 767
  @include mq(max_sm) {
    .ant-table-tbody > tr > td {
      padding: 5px 5px 5px 5px;
    }
    .ant-table-content .ant-calendar-picker-icon, .ant-calendar-picker-clear {
      display: none;
      opacity: 1;
    }
    .ant-table-content .ant-calendar-picker-input.ant-input {
      width: 110px;
    }
    .employee-col, .role-col {
      width: 110px;
    }
  }
  .ant-table-content .ant-calendar-picker {
    max-width: 120px;
  }
  .anticon-check > svg ,
  .anticon-wechat > svg ,
  .anticon-cloud-sync > svg ,
  .anticon-clock-circle > svg ,
  .fa-handshake {
    width: 1.75rem;
    height: 1.75rem;
    cursor: pointer;
  }
}
</style>
