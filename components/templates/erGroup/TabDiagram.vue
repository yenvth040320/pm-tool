<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4">
        <template slot="title">
          <a-form-model
            ref="form"
            :model="filters"
            :label-col="{ sm: 3 }"
            :wrapper-col="{ sm: 10 }"
            @submit.prevent="search"
          >
            <a-row>
              <a-form-model-item
                :label="$t('module.erGroup')"
                prop="er_group_id"
              >
                <a-select
                  v-model="filters.er_group_id"
                  :placeholder="$t('module.erGroup')"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="(item, index) in listErGroup"
                    :key="index"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
                <a-button
                  html-type="submit"
                  type="primary"
                  class="min-w-100 search-btn"
                  title="Tạo mới"
                >
                  <font-awesome-icon
                    icon="search"
                    class="mr-1"
                  />
                  {{ $t('common.search') }}
                </a-button>
              </a-form-model-item>
            </a-row>
            <a-row>
              <a-form-model-item
                :label="$t('module.tab_diagram.related_entity')"
                prop="related_entity"
              >
                <a-checkbox v-model="filters.related_entity" />
              </a-form-model-item>
            </a-row>
          </a-form-model>
        </template>
        <Diagram ref="diagram" />
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Diagram from '~/components/templates/MermaidDiagram/Diagram'
import {
  ENTITY_RELATION,
  ENTITY_RELATION_1_SYMBOLS,
  ENTITY_RELATION_2_SYMBOLS,
  ENTITY_RELATION_VALUE,
  ENTITY_RELATION_TYPE,
  ENTITY_RELATION_TYPE_VALUE,
  COLUMN_DATA_TYPE_VALUE,
  SORT
} from '~/constants'
export default {
  components: {
    Diagram
  },

  /**
   * Init data for component.
   */
  data: () => ({
    ENTITY_RELATION_VALUE,
    ENTITY_RELATION_1_SYMBOLS,
    ENTITY_RELATION_2_SYMBOLS,
    ENTITY_RELATION,
    ENTITY_RELATION_TYPE,
    ENTITY_RELATION_TYPE_VALUE,
    COLUMN_DATA_TYPE_VALUE,
    SORT,
    listErGroup: [],
    dataEntity: [],
    filterDiagram: [],
    relation2Arr: [],
    diagramData: '',
    filters: {
      er_group_id: undefined,
      related_entity: true
    }
  }),

  /**
   * Computed event.
   */
  computed: {
    ...mapState({
      loading: 'loading'
    })
  },

  created() {
    this.fetchDataErGroup()
    this.getListEntity()
  },

  mounted() {},

  methods: {
    /**
     * Filter select box option
     */
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase()) === true
      )
    },

    /**
     * Fetch data Er Group
     */
    async fetchDataErGroup() {
      this.$store.dispatch('setLoading', true)

      try {
        const params = {
          project_id: this.$store.state.project.id
        }
        const { data: { result: { data } } } = await this.$api.erGroup.list({ params })
        this.listErGroup = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Get list entity
     */
    async getListEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          order_by: 'position',
          order_type: SORT.asc
        }

        const { data: { result: { data } } } = await this.$api.entity.getEntityRelation({ params })
        this.dataEntity = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Search
     */
    async search() {
      this.filterDiagram = this.dataEntity.filter(i => i.er_group_id === this.filters.er_group_id)
      // Identify table in relation 2 to show db columns
      this.relation2Arr = []
      this.filterDiagram.forEach(itemData => {
        if (itemData.relation1 && itemData.relation1.length > 0) {
          const entityIdsOfItem = itemData.relation1.map(relation => relation.entity_id_2)
          this.relation2Arr.push(...entityIdsOfItem)
        }
      })
      await this.convertDiagramCode()
      await this.$refs.diagram.render(this.diagramData, 'diagram')
    },

    /**
     * Convert data to mermaid diagram code
     */
    convertDiagramCode() {
      if (this.filters.related_entity) {
        let er = 'erDiagram\n'
        this.filterDiagram.forEach(itemData => {
          if (itemData.relation1.length > 0) {
            itemData.relation1.forEach(relation => {
              if (this.filterDiagram.find(i => i.id === relation.entity_id_2)) {
                er += `"*${itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "*${this.dataEntity.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
              } else {
                er += `"*${itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "${this.dataEntity.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
              }
            })
          } else {
            er += `"*${itemData.name}"\n`
          }
        })
        let tableCode = ''
        this.dataEntity.forEach(i => {
          if (i.er_group_id === this.filters.er_group_id || this.relation2Arr.includes(i.id)) {
            if (i.table.length > 0) {
              i.table.forEach(tableItem => {
                let tableName = ''
                if (i.er_group_id === this.filters.er_group_id) {
                  tableName = `"*${i.name}"`
                } else {
                  tableName = `"${i.name}"`
                }
                let columnCode = ''
                if (tableItem.columns.length > 0) {
                  tableItem.columns.forEach(columnItem => {
                    columnCode += ` ${COLUMN_DATA_TYPE_VALUE[columnItem.data_type]} ${columnItem.name} "${columnItem.description ?? ''}"\n`
                  })
                }
                const fullTableCode = `${tableName} {\n${columnCode}\n}\n`
                tableCode += fullTableCode
              })
            }
          }
        })
        this.diagramData = er + tableCode
      } else {
        let er = 'erDiagram\n'
        this.filterDiagram.forEach(itemData => {
          if (itemData.relation1.length > 0) {
            itemData.relation1.forEach(relation => {
              if (this.filterDiagram.find(i => i.id === relation.entity_id_2)) {
                er += `"*${itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "*${this.dataEntity.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
              } else {
                er += `"*${itemData.name}"\n`
              }
            })
          } else {
            er += `"*${itemData.name}"\n`
          }
        })
        let tableCode = ''
        this.dataEntity.forEach(i => {
          if (i.er_group_id === this.filters.er_group_id) {
            if (i.table.length > 0) {
              i.table.forEach(tableItem => {
                const tableName = `"*${i.name}"`
                let columnCode = ''
                if (tableItem.columns.length > 0) {
                  tableItem.columns.forEach(columnItem => {
                    columnCode += ` ${COLUMN_DATA_TYPE_VALUE[columnItem.data_type]} ${columnItem.name} "${columnItem.description ?? ''}"\n`
                  })
                }
                const fullTableCode = `${tableName} {\n${columnCode}\n}\n`
                tableCode += fullTableCode
              })
            }
          }
        })
        this.diagramData = er + tableCode
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
  .ant-card-head-title {
    padding-bottom: 0;
  }
}
.search-btn {
  margin-left: 10px;
  top: -1px;
}
</style>
