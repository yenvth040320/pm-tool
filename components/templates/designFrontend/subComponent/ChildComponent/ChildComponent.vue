<template>
  <div>
    <table class="table table-wrap" style="width: 100%">
      <thead class="thead-dark">
        <tr>
          <th scope="col">
            {{ $t('module.design_frontend.component.component_child.name') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.component_child.props') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.component_child.emit') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.component_child.des') }}
          </th>
          <th scope="col">
            {{ $t('module.design_frontend.component.component_child.setting') }}
          </th>
        </tr>
      </thead>
      <tr
        v-for="(item, index) in model.componentChilds"
        :key="index"
        class="tbody"
      >
        <td>
          <a-form-model-item
            :prop="'componentChilds.' + index + '.child_component_id'"
            :rules="{
              required: true,
              message: $t('validation.required', {
                field: $t(
                  'module.design_frontend.component.component_child.name'
                )
              }),
              trigger: ['change', 'blur']
            }"
          >
            <a-select
              v-model="item.child_component_id"
              mode="single"
              :placeholder="
                $t('module.design_frontend.component.component_child.name')
              "
              show-search
              :filter-option="filterOption"
              allow-clear
              @change="changeComponentChild($event, index)"
            >
              <a-select-option
                v-for="(item, index) in components"
                :key="index"
                :value="item.id"
              >
                {{ item.component_name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </td>
        <td>
          <div v-for="item in item.props" :key="item.id">
            {{ `- ${item.name ? item.name : item.props_name} ( ${item.mapping ? item.mapping : item.value_mapping} )` }}
          </div>
        </td>
        <td>
          <div v-for="item in item.emits" :key="item.id">
            {{ `- ${item.name ? item.name : item.emit_name} ( ${item.mapping ? item.mapping : item.function_mapping
            } )` }}
          </div>
        </td>
        <td>
          <a-form-model-item
            :prop="'componentChilds.' + index + '.description'"
          >
            <a-input v-model="item.description" />
          </a-form-model-item>
        </td>
        <td>
          <a @click="settingProps(item, index)">Props</a><br />
          <a @click="settingEmit(item, index)">Emit</a>
        </td>
        <td class="icon-remove">
          <a-icon
            type="minus"
            class="icon icon-minus"
            @click="removeRow(index)"
          />
        </td>
      </tr>
    </table>
    <div>
      <a-icon type="plus" class="icon icon-plus" @click="addRow" />
    </div>

    <!-- Modal setting -->
    <setting-popup
      :visible="visible"
      :data="
        isProps
          ? model.componentChilds[index]?.props
          : model.componentChilds[index]?.emits
      "
      :col1="isProps ? `module.design_frontend.component.component_child.props_name` : `module.design_frontend.component.component_child.event_name`"
      :col2="isProps ? `module.design_frontend.component.component_child.value_mappings` : `module.design_frontend.component.component_child.function_mappings`"
      :title="isProps ? `module.design_frontend.component.component_child.setting_props` : `module.design_frontend.component.component_child.setting_emit`"
      @save="save"
      @close="save"
    />
  </div>
</template>
<script>
import SettingPopup from './SettingPopup.vue'
export default {
  components: { SettingPopup },
  props: {
    model: {
      type: [Object],
      default: () => []
    },
    components: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      index: null,
      isProps: false
    }
  },
  computed: {},
  methods: {
    changeComponentChild(value, index) {
      this.model.componentChilds[index].props = []
      this.model.componentChilds[index].emits = []
    },

    save() {
      this.visible = false
    },

    async settingProps(item, index) {
      if (item.child_component_id === '') {
        this.$notification.error({
          message: this.$t('Vui lòng chọn component')
        })
        return
      }
      const data = await this.$api.component.show(item.child_component_id)
      const newData = data.data.result.data
      if (newData.props.length > 0) {
        this.model.componentChilds[index].props = []
        newData.props.forEach(item => {
          this.model.componentChilds[index].props.push({
            name: item.props_name,
            mapping: ''
          })
        })
      }
      this.index = index
      this.visible = true
      this.isProps = true
    },

    async settingEmit(item, index) {
      if (item.child_component_id === '') {
        this.$notification.error({
          message: this.$t('Vui lòng chọn component')
        })
        return
      }
      const data = await this.$api.component.show(item.child_component_id)
      const newData = data.data.result.data
      if (newData.emits.length > 0) {
        this.model.componentChilds[index].emits = []
        newData.emits.forEach(item => {
          this.model.componentChilds[index].emits.push({
            name: item.emit_name,
            mapping: ''
          })
        })
      }
      this.index = index
      this.visible = true
      this.isProps = false
    },

    addRow() {
      this.$emit('addRow', 'componentChilds')
    },

    removeRow(index) {
      this.$emit('removeRow', 'componentChilds', index)
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
.thead-dark > tr > th {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 10px 10px;
  word-wrap: break-word;
}
.thead-dark {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
}
td {
  border: 1px solid #e8e8e8;
  padding: 10px 10px;
  word-wrap: break-word;
  word-break: break-all;
  transition: background 0.3s;
  cursor: pointer;
}
.icon-remove {
  width: 10px !important;
  border-top: none !important;
  border-right: none !important;
  border-bottom: none !important;
  .icon-minus {
    color: red;
    font-size: 20px;
  }
}
.icon-plus {
  color: rgb(34, 182, 227);
  :hover {
    cursor: pointer;
  }
  display: flex;
  justify-content: end;
  margin-right: 35px;
  margin-top: 10px;
  font-size: 20px;
}
</style>
