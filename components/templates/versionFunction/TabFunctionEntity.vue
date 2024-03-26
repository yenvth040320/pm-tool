<template>
  <div>
    <a-spin :spinning="loading">
      <a-card class="mb-4">
        <template slot="title">
          <a-button
            v-if="datasourceEntity.length > 0"
            html-type="submit"
            type="primary"
            class="min-w-100"
            @click="saveImage"
          >
            <a-icon type="save" />
            {{ $t('module.tab_function_entity.save_image') }}
          </a-button>
        </template>
        <p>{{ $t('module.tab_function_entity.er_diagram_vn') }}</p>
        <Diagram ref="diagramVn" />

        <a-divider />
        <p>{{ $t('module.tab_function_entity.er_diagram_jp') }}</p>
        <Diagram ref="diagramJp" />
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import * as htmlToImage from 'html-to-image'
import { mapState } from 'vuex'
import Diagram from '~/components/templates/MermaidDiagram/Diagram'
import {
  COLUMN_DATA_TYPE_VALUE,
  ENTITY_RELATION_1_SYMBOLS,
  ENTITY_RELATION_2_SYMBOLS,
  ENTITY_RELATION_TYPE_VALUE,
  SORT
} from '~/constants'
export default {
  components: { Diagram },
  props: {
    functionItem: {
      type: [Array],
      default: () => []
    }
  },

  data() {
    return {
      COLUMN_DATA_TYPE_VALUE,
      ENTITY_RELATION_1_SYMBOLS,
      ENTITY_RELATION_2_SYMBOLS,
      ENTITY_RELATION_TYPE_VALUE,
      SORT,
      entityArr: [],
      datasourceEntity: [],
      entityList: [],
      showEntityArr: [],
      mermaidCodeVn: '',
      mermaidCodeJp: '',
      project_id: this.$store.state.project.id,
      function_id: this.$route.params.id,
      version_code: this.$route.params.version_code
    }
  },

  computed: {
    ...mapState({
      loading: 'loading'
    })
  },

  watch: {
    functionItem(newValue) {
      this.getFunctionEntity()
    }
  },

  created() {
    this.getListEntity()
  },

  mounted() {
    this.getFunctionEntity()
  },

  methods: {
    async getListEntity() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true,
          order_by: 'id',
          order_type: SORT.asc
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entityList = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async getFunctionEntity() {
      const resultArr = []
      this.functionItem.forEach(item => {
        if (item.functionItemWriteDatasources && item.functionItemWriteDatasources.length > 0) {
          item.functionItemWriteDatasources.forEach(write => {
            const entityId = write?.api_parameter_datasource?.db_table?.entity_id
            if (entityId) {
              resultArr.push(entityId)
            }
          })
        }
        if (item.functionItemReadDatasources && item.functionItemReadDatasources.length > 0) {
          item.functionItemReadDatasources.forEach(read => {
            const entityId = read?.api_response_datasource?.db_table?.entity_id
            if (entityId) {
              resultArr.push(entityId)
            }
          })
        }
      })
      this.entityArr = resultArr.filter((value, index, self) => self.indexOf(value) === index)
      if (this.entityArr.length > 0) {
        this.$store.dispatch('setLoading', true)
        try {
          const params = {
            project_id: this.$store.state.project.id,
            order_by: 'position',
            order_type: SORT.asc,
            ids: this.entityArr
          }
          const { data: { result: { data } } } = await this.$api.entity.getEntityRelation({ params })
          this.datasourceEntity = data
          let mapId = []
          mapId = this.datasourceEntity.map(i => i.id)
          this.showEntityArr = mapId
          await this.convertToMermaidCode()
          await this.$refs.diagramVn.render(this.mermaidCodeVn, 'vn')
          await this.$refs.diagramJp.render(this.mermaidCodeJp, 'jp')
        } catch (_) {
          this.$notification.error({
            message: this.$t('text.something_wrong')
          })
        } finally {
          this.$store.dispatch('setLoading', false)
        }
      }
    },

    /**
     * Convert data to mermaid code
     */
    convertToMermaidCode() {
      const getName = () => {
        let er = 'erDiagram\n'
        this.datasourceEntity.forEach(itemData => {
          if (itemData.relation1.length > 0) {
            itemData.relation1.forEach(relation => {
              if (this.showEntityArr.includes(relation.entity_id_2)) {
                er += `"${itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "${this.entityList.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
              } else {
                er += `"${itemData.name}"\n`
              }
            })
          } else {
            er += `"${itemData.name}"\n`
          }
        })
        let tableCode = ''
        this.datasourceEntity.forEach(i => {
          if (i.table.length > 0) {
            i.table.forEach(tableItem => {
              const tableName = `"${i.name}"`
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
        })
        return er + tableCode
      }
      const getNameJP = () => {
        let er = 'erDiagram\n'
        this.datasourceEntity.forEach(itemData => {
          if (itemData.relation1.length > 0) {
            itemData.relation1.forEach(relation => {
              if (this.showEntityArr.includes(relation.entity_id_2)) {
                er += `"${itemData.name_jp ?? itemData.name}" ${ENTITY_RELATION_1_SYMBOLS[relation.relation_1]}${ENTITY_RELATION_TYPE_VALUE[relation.type]}${ENTITY_RELATION_2_SYMBOLS[relation.relation_2]} "${this.entityList.find(i => i.id === relation.entity_id_2).name_jp ?? this.entityList.find(i => i.id === relation.entity_id_2).name}" : "${(relation.relation_label ?? '')}"\n`
              } else {
                er += `"${itemData.name_jp ?? itemData.name}"\n`
              }
            })
          } else {
            er += `"${itemData.name ?? itemData.name}"\n`
          }
        })
        let tableCode = ''
        this.datasourceEntity.forEach(i => {
          if (i.table.length > 0) {
            i.table.forEach(tableItem => {
              const tableName = `"${i.name_jp ?? i.name}"`
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
        })
        return er + tableCode
      }
      this.mermaidCodeVn = getName()
      this.mermaidCodeJp = getNameJP()
    },

    /**
     * Save Diagram Image
     */
    async saveImage() {
      this.$store.dispatch('setLoading', true)
      try {
        let imageFileJP = ''
        let imageFileVN = ''
        const chartElementJP = this.$refs.diagramJp.$el.querySelector('svg')
        const dataUrlJP = await htmlToImage.toPng(chartElementJP)
        imageFileJP = this.convertBase64ToFile(dataUrlJP, 'diagram-jp.png')

        const chartElementVN = this.$refs.diagramVn.$el.querySelector('svg')
        const dataUrlVN = await htmlToImage.toPng(chartElementVN)
        imageFileVN = this.convertBase64ToFile(dataUrlVN, 'diagram-vn.png')

        const formData = new FormData()
        formData.append('versionCode', this.version_code)
        formData.append('projectId', this.project_id)
        formData.append('functionId', this.function_id)
        formData.append('imageUrlVN', imageFileVN, 'diagram-vn.png')
        formData.append('imageUrlJP', imageFileJP, 'diagram-jp.png')

        await this.$api.versionFunction.updateDiagramImage(formData)
        this.$notification.success({
          message: this.$t('text.successfully')
        })
      } catch (_) {
        console.log(_)
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    /**
     * Covert base64 to file
     */
    convertBase64ToFile(dataUrl, nameImg, typeImg = 'image/png') {
      const base64ImageData = dataUrl.split(',')[1]
      const binaryImageData = atob(base64ImageData)

      const uint8Array = new Uint8Array(binaryImageData.length)
      for (let i = 0; i < binaryImageData.length; i++) {
        uint8Array[i] = binaryImageData.charCodeAt(i)
      }

      const imageBlob = new Blob([uint8Array], { type: typeImg })
      const imageFile = new File([imageBlob], nameImg, { type: typeImg })
      return imageFile
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
