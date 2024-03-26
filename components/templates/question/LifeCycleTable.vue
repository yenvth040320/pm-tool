<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-table
          bordered
          :data-source="dataMstLifeCyclePartOne"
          :columns="columns"
          :row-key="record => record.key || record.id"
          :pagination="false"
        >
          <template slot="no" slot-scope="text, record">
            {{ record.index }}
          </template>
          <template slot="name" slot-scope="text, record">
            {{ record?.mstLifeCycle?.name }}
          </template>
          <template slot="status" slot-scope="text, record">
            <a-select
              v-model="record.mst_life_cycle_status_id"
              show-search
              :filter-option="filterOption"
              allow-clear
              @change="changeLifeCycleStatus(record)"
            >
              <a-select-option
                v-for="(item, index) in listMstLifeCycles.find(item => item.id === record.mst_life_cycle_id)?.mst_life_cycle_statuses"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-table>
      </a-col>
      <a-col :span="12">
        <a-table
          bordered
          :data-source="dataMstLifeCyclePartTwo"
          :columns="columns"
          :row-key="record => record.key || record.id"
          :pagination="false"
        >
          <template slot="no" slot-scope="text, record">
            {{ record.index }}
          </template>
          <template slot="name" slot-scope="text, record">
            {{ record?.mstLifeCycle?.name }}
          </template>
          <template slot="status" slot-scope="text, record">
            <a-select
              v-model="record.mst_life_cycle_status_id"
              show-search
              :filter-option="filterOption"
              allow-clear
              @change="changeLifeCycleStatus(record)"
            >
              <a-select-option
                v-for="(item, index) in listMstLifeCycles.find(item => item.id === record.mst_life_cycle_id)?.mst_life_cycle_statuses"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>
<script>

export default {
  props: {
    dataMstLifeCycleManage: {
      type: Array,
      default: () => []
    },
    listMstLifeCycles: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
    }
  },

  computed: {
    columns() {
      return [
        {
          title: 'STT',
          scopedSlots: { customRender: 'no' }
        },
        {
          title: this.$t('Công đoạn'),
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Trạng thái',
          scopedSlots: { customRender: 'status' }
        }
      ]
    },

    dataMstLifeCyclePartOne() {
      return this.dataMstLifeCycleManage.slice(0, Math.floor(this.dataMstLifeCycleManage.length / 2))
    },

    dataMstLifeCyclePartTwo() {
      return this.dataMstLifeCycleManage.slice(Math.floor(this.dataMstLifeCycleManage.length / 2))
    }
  },

  watch: {},

  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Change mst life cycle status
     *
     * @param record
     */
    changeLifeCycleStatus(record) {
      this.$emit('changeLifeCycleStatus', record)
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
