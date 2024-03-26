<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ $t('module.entityHistory') }}
      </template>

      <a-form-model
        ref="form"
        :model="filters"
        :label-col="{ sm: 6 }"
        :wrapper-col="{ sm: 18 }"
        class="mb-4"
        @submit.prevent="search"
      >
        <a-row
          type="flex"
          :gutter="30"
        >
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.entityHistory.type')"
              prop="type"
            >
              <a-select
                v-model="filters.type"
                :placeholder="$t('module.entityHistory.type')"
              >
                <a-select-option
                  v-for="(item, index) in ENTITY_HISTORY_TYPE"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :md="24"
            class="text-center"
          >
            <a-button
              html-type="submit"
              type="primary"
              class="min-w-100"
            >
              <font-awesome-icon
                icon="search"
                class="mr-1"
              />
              {{ $t('common.search') }}
            </a-button>

            &nbsp;
            <a-button
              html-type="button"
              type="default"
              class="min-w-100"
              @click="reset"
            >
              <font-awesome-icon
                icon="eraser"
                class="mr-1"
              />
              {{ $t('common.clear') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form-model>
      <!-- end main-search -->

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template
          slot="type"
          slot-scope="text, record"
        >
          <span>
            {{ ENTITY_HISTORY_TYPE_VALUE[record.type] }}
          </span>
        </template>
        <template
          slot="description_before"
          slot-scope="text, record"
        >
          <div v-if="record.entity_id">
            {{ convertEntityHistory(record.description_before)?.name }}
          </div>
          <div v-if="record.entity_relationship_id">
            {{ convertRelationHistory(record.description_before) }}
          </div>
        </template>
        <template
          slot="description_after"
          slot-scope="text, record"
        >
          <div v-if="record.entity_id">
            {{ convertEntityHistory(record.description_after)?.name }}
          </div>
          <div v-if="record.entity_relationship_id">
            {{ convertRelationHistory(record.description_after) }}
          </div>
        </template>
        <template
          slot="update_user_id"
          slot-scope="text, record"
        >
          <div>
            {{ record.updateUser.name }}
          </div>
        </template>
      </a-table>
      <!-- end main-table -->
    </a-card>
  </div>
</template>
<script>
import DataTable from '~/mixins/data-table'
import {
  ENTITY_RELATION,
  ENTITY_RELATION_1_SYMBOLS,
  ENTITY_RELATION_2_SYMBOLS,
  ENTITY_RELATION_VALUE,
  ENTITY_RELATION_TYPE,
  ENTITY_RELATION_TYPE_VALUE,
  ENTITY_HISTORY_TYPE_VALUE,
  ENTITY_HISTORY_TYPE
} from '~/constants'

export default {
  /**
   * Declare components.
   */
  components: {
  },

  /**
   * Declare mixins.
   */
  mixins: [
    DataTable
  ],

  async fetch() {
    this.$store.dispatch('setLoading', true)

    try {
      const params = this.$route.query
      if (this.defaultParams && typeof this.defaultParams === 'object') {
        Object.entries(this.defaultParams).forEach(([key, value]) => {
          params[key] = value
        })
      }
      params.project_id = this.$store.state.project.id

      const { data: { result: { data, meta } } } = await this.repository.list({ params })
      this.pagination = {
        ...this.pagination,
        total: meta ? meta.total : data.length,
        current: params.page ? +params.page : 1,
        pageSize: params.limit ? +params.limit : 40
      }
      this.data = data
    } catch (_) {
      this.$notification.error({
        message: this.$t('text.something_wrong')
      })
    } finally {
      this.$store.dispatch('setLoading', false)
    }
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'entityHistory',
      visible: false,
      filters: {
        type: this.$route.query.type || ''
      },
      entities: [],
      entityRelationships: [],
      ENTITY_RELATION_VALUE,
      ENTITY_RELATION_1_SYMBOLS,
      ENTITY_RELATION_2_SYMBOLS,
      ENTITY_RELATION,
      ENTITY_RELATION_TYPE,
      ENTITY_RELATION_TYPE_VALUE,
      ENTITY_HISTORY_TYPE_VALUE,
      ENTITY_HISTORY_TYPE
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 60
        },
        {
          title: this.$t('module.entityHistory.update_user_id'),
          dataIndex: 'update_user_id',
          scopedSlots: { customRender: 'update_user_id' },
          width: 150
        },
        {
          title: this.$t('module.entityHistory.type'),
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          width: 100
        },
        {
          title: this.$t('module.entityHistory.description_before'),
          dataIndex: 'description_before',
          scopedSlots: { customRender: 'description_before' }
        },
        {
          title: this.$t('module.entityHistory.description_after'),
          dataIndex: 'description_after',
          scopedSlots: { customRender: 'description_after' }
        }
      ]
    }
  },

  /**
   * Mounted event.
   */
  created() {
    this.getEntities()
  },

  /**
   * Methods.
   */
  methods: {
    /**
     * List Entity.
     */
    async getEntities() {
      try {
        const params = {
          project_id: this.$store.state.project.id,
          not_limit: true
        }
        const { data: { result: { data } } } = await this.$api.entity.list({ params })
        this.entities = data
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        type: ''
      }
      this.search()
    },

    search() {
      this.replaceQuery(this.filters)
    },

    convertEntityHistory(data) {
      if (data) {
        return JSON.parse(data)
      }
    },

    convertRelationHistory(data) {
      if (data) {
        const parseData = JSON.parse(data)
        const result = `"${(this.entities.find(i => i.id === parseData.entity_id_1)?.name ?? '')}" ${ENTITY_RELATION_1_SYMBOLS[parseData.relation_1]}${ENTITY_RELATION_TYPE_VALUE[parseData.type]}${ENTITY_RELATION_2_SYMBOLS[parseData.relation_2]} "${(this.entities.find(i => i.id === parseData.entity_id_2)?.name ?? '')}" : "${(parseData.relation_label ?? '')}"`
        return result
      }
    }
  }
}
</script>
