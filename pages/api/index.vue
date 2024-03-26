<template>
  <div>
    <a-card class="mb-4">
      <template slot="title">
        {{ (this.$store.state.project.name ? this.$store.state.project.name + ' / ': '') + (this.$store.state.apiCategory.name ? this.$store.state.apiCategory.name + ' / ': '') + $t('module.api') }}
      </template>

      <template slot="extra">
        <a-button
          html-type="button"
          type="primary"
          title="Tạo mới"
          ghost
          @click="gotoNew()"
        >
          <font-awesome-icon
            icon="plus-circle"
            class="mr-1"
          />
          {{ $t('common.new') }}
        </a-button>
        <a-button
          html-type="button"
          type="primary"
          ghost
          @click="gotoCopyUrl()"
        >
          {{ $t('common.copy_url') }}
        </a-button>
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
              :label="$t('module.api.code')"
              prop="code"
            >
              <a-input
                v-model="filters.code"
                :placeholder="$t('module.api.code')"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="24"
            :md="12"
          >
            <a-form-model-item
              :label="$t('module.api.name')"
              prop="name"
            >
              <a-input
                v-model="filters.name"
                :placeholder="$t('module.api.name')"
              />
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
              title="Tìm kiếm"
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
              title="Xoá điều kiện tìm kiếm"
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
      <div v-if="data.length > 0" class="pb-4">
        <a-button
          html-type="button"
          type="primary"
          class="min-w-100"
          :disabled="loading"
          @click="toggleExpandAll"
        >
          <a-icon v-if="!allExpanded" type="plus" />
          <a-icon v-else type="minus" />
          {{ allExpanded ? $t('common.close_all_node') : $t('common.expand_all_node') }}
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="data"
        :loading="loading"
        :expanded-row-keys="expandedKeys"
        :pagination="pagination"
        :expand-row-by-click="true"
        class="components-table-demo-nested"
        @expandedRowsChange="onExpand"
        @change="handleTableChange"
      >
        <template
          slot="name"
          slot-scope="text, item"
        >
          <NuxtLink :to="`/api/${item.id}/version/${item.version[0].version_code}`">
            {{ item.name }}
          </NuxtLink>
        </template>
        <template
          slot="name_jp"
          slot-scope="text, item"
        >
          <NuxtLink :to="`/api/${item.id}/version/${item.version[0].version_code}`">
            {{ item.name_jp }}
          </NuxtLink>
        </template>
        <template
          slot="use_flg"
          slot-scope="text, record"
        >
          <div
            v-for="(item, index) in USE_FLG[$nuxt.$i18n.locale]"
            :key="index"
          >
            <div v-if="item.value === record.use_flg">
              {{ item.label }}
            </div>
          </div>
        </template>
        <template
          slot="action"
          slot-scope="text, record"
        >
          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Chỉnh sửa"
            :disabled="loading"
            @click="gotoDetail(record.id)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </a-button>

          <a-button
            html-type="button"
            type="primary"
            size="small"
            title="Tăng version"
            :disabled="loading || allVersionsLocked(record)"
            @click="increaseVersion(record.id)"
          >
            <a-icon type="diff" />
          </a-button>

          <a-button
            v-if="record.use_flg === USE_FLG_VALUE.no"
            html-type="button"
            type="danger"
            title="Xoá"
            size="small"
            :disabled="loading"
            @click="confirmToDelete(record.id)"
          >
            <font-awesome-icon icon="trash-alt" />
          </a-button>
        </template>
        <a-table
          slot="expandedRowRender"
          slot-scope="record"
          :columns="innerColumns"
          :data-source="record.version"
          :row-key="item => item.id"
          :pagination="false"
        >
          <template
            slot="version_code"
            slot-scope="text, item"
          >
            <NuxtLink :to="`/api/${item.api_id}/version/${item.version_code}`">
              {{ item.version_code }}
            </NuxtLink>
          </template>
          <template
            slot="version_name"
            slot-scope="text, item"
          >
            <NuxtLink :to="`/api/${item.api_id}/version/${item.version_code}`">
              {{ item.name }}
            </NuxtLink>
          </template>
          <template
            slot="lock_flg"
            slot-scope="text, item"
          >
            <div
              v-for="(lock, index) in LOCL_FLG[$nuxt.$i18n.locale]"
              :key="index"
            >
              <div v-if="lock.value === item.lock_flg">
                {{ lock.label }}
              </div>
            </div>
          </template>

          <template
            slot="action"
            slot-scope="text, item"
          >
            <a-button
              v-if="item.lock_flg === LOCK_FLG_VALUE.no"
              html-type="button"
              type="primary"
              title="Khoá version"
              size="small"
              :disabled="loading"

              @click="changeVersion(item.id, LOCK_FLG_VALUE.yes)"
            >
              <font-awesome-icon icon="lock" />
            </a-button>
            <a-button
              v-if="item.lock_flg === LOCK_FLG_VALUE.yes"
              html-type="button"
              type="primary"
              size="small"
              title="Mở version"
              :disabled="loading || isVersionDisabled(item)"
              @click="changeVersion(item.id, LOCK_FLG_VALUE.no)"
            >
              <font-awesome-icon :icon="['fas', 'lock-open']" />
            </a-button>
          </template>
        </a-table>
      </a-table>
      <!-- end main-table -->
    </a-card>

    <a-modal v-model="notifiSelectCategory" class="modal-notifi" :centered="true" :cancel-text="$t('common.ok')" @cancel="hiddenModalNotifiCategory">
      <p class="text">
        {{ $t('module.api.category_not_selected_yet.error') }}
      </p>
    </a-modal>
    <NotificationProjectNotSelectedVue />
    <IncreaseVersion ref="increaseVersion" @save="save" />

    <!-- end modal-detail -->
  </div>
</template>
<script>

import DataTable from '~/mixins/data-table'
import { USE_FLG, USE_FLG_VALUE, LOCL_FLG, LOCK_FLG_VALUE } from '~/constants'
import NotificationProjectNotSelectedVue from '~/components/templates/popupNotification/NotificationProjectNotSelected.vue'
import IncreaseVersion from '~/components/templates/api/IncreaseVersion.vue'

export default {
  /**
   * Declare components.
   */
  components: {
    NotificationProjectNotSelectedVue,
    IncreaseVersion
  },

  mixins: [
    DataTable
  ],

  /**
   * Init data for component.
   */
  data() {
    return {
      resource: 'api',
      visible: false,
      currentId: 0,
      filters: {
        project_id: this.$route.query.project_id || this.$store.state.project.id || 0,
        api_category_id: this.$route.query.api_category_id || this.$store.state.apiCategory.id || 0,
        code: this.$route.query.code || '',
        name: this.$route.query.name || ''
      },
      defaultParams: {
        not_admin: 1,
        api_category_id: this.$route.query.api_category_id || this.$store.state.apiCategory.id || 0,
        project_id: this.$route.query.project_id || this.$store.state.project.id || 0
      },
      USE_FLG,
      USE_FLG_VALUE,
      LOCL_FLG,
      LOCK_FLG_VALUE,
      notifiSelectCategory: false,
      innerData: [],
      disabledVersions: [],
      expandedKeys: [],
      allExpanded: false,
      project_id: +this.$route.query.project_id || this.$store.state.project.id || 0,
      api_category_id: +this.$route.query.api_category_id || this.$store.state.apiCategory.id || 0
    }
  },

  /**
   * Computed event.
   */
  computed: {
    header() {
      return [
        {
          title: this.$t('module.api.code'),
          dataIndex: 'code',
          sorter: true
        },
        {
          title: this.$t('module.api.name'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          sorter: true
        },
        {
          title: this.$t('module.api.name_jp'),
          dataIndex: 'name_jp',
          scopedSlots: { customRender: 'name_jp' },
          sorter: true
        },
        {
          title: this.$t('module.api.use_flg'),
          dataIndex: 'use_flg',
          scopedSlots: { customRender: 'use_flg' },
          sorter: true
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },
    headerInner() {
      return [
        {
          title: this.$t('module.versionApi.version_code'),
          scopedSlots: { customRender: 'version_code' },
          dataIndex: 'version_code'
        },
        {
          title: this.$t('module.versionApi.name'),
          scopedSlots: { customRender: 'version_name' },
          dataIndex: 'name'
        },
        {
          title: this.$t('module.versionApi.lock_flg'),
          scopedSlots: { customRender: 'lock_flg' },
          dataIndex: 'lock_flg'
        },
        {
          title: this.$t('common.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 140
        }
      ]
    },
    innerColumns() {
      return this.headerInner.map(item => {
        item.sortOrder = null
        if (this.$route.query.order_by === item.dataIndex && this.$route.query.order_type) {
          item.sortOrder = +this.$route.query.order_type === 1 ? 'ascend' : 'descend'
        }
        return item
      })
    },
    isVersionDisabled() {
      return function(version) {
        return version.disabled
      }
    },
    allVersionsLocked() {
      return function(record) {
        return record.version.some(version => version.lock_flg === LOCK_FLG_VALUE.no)
      }
    }
  },
  watch: {
    data: {
      handler: 'checkLockedVersions',
      deep: true
    }
  },
  /**
   * Mounted event.
   */
  mounted() {
    if (this.$store.state.project.id !== 0 && this.$store.state.apiCategory.id === 0) {
      this.notifiSelectCategory = true
    }
    this.showDetailProject()
    this.showDetailApiCategory()
  },

  methods: {
    async showDetailProject() {
      try {
        if (this.project_id !== this.$store.state.project.id) {
          const { data: { result: { data } } } = await this.$api.project.show(this.project_id)
          this.project = data
          this.$store.dispatch('addProject', {
            id: this.project_id,
            name: this.project.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    async showDetailApiCategory() {
      try {
        if (this.api_category_id !== this.$store.state.apiCategory.id) {
          const { data: { result: { data } } } = await this.$api.apiCategory.show(this.api_category_id)
          this.apiCategory = data
          this.$store.dispatch('addApiCategory', {
            id: this.api_category_id,
            name: this.apiCategory.name
          })
        }
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      }
    },

    /**
     * Goto copy url
     */
    gotoCopyUrl() {
      const currentURL = new URL(window.location.href)
      const host = currentURL.origin
      const path = '/api'
      const url = new URL(host + path)
      url.searchParams.set('project_id', this.$store.state.project.id)
      url.searchParams.set('api_category_id', this.$store.state.apiCategory.id)
      const newUrl = url.href
      navigator.clipboard.writeText(newUrl)
      this.$message.success(this.$t('module.q&a.copy_url_successful'))
    },
    toggleExpandAll() {
      if (this.allExpanded) {
        this.expandedKeys = []
      } else {
        this.expandedKeys = this.data.map(record => record.id)
      }
      this.allExpanded = !this.allExpanded
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.allExpanded = false
    },
    checkLockedVersions() {
      if (this.data) {
        this.data.forEach(api => {
          const areAllVersionsLocked = api.version.some(version => version.lock_flg === LOCK_FLG_VALUE.no)

          if (areAllVersionsLocked) {
            api.version.forEach(version => {
              if (version.lock_flg === LOCK_FLG_VALUE.yes) {
                version.disabled = true
              }
            })
          }
        })
      }
    },
    /**
     * hidden modal
     */
    hiddenModalNotifiCategory() {
      this.$router.push('/apiCategory')
      this.notifiSelectCategory = false
    },

    /**
     * Show detail
     *
     * @param {number} id - Item Id.
     */
    showDetail(id) {
      this.currentId = id
      this.visible = true
    },

    /**
     * Close dialog.
     *
     * @param {boolean} fetch - fetch status.
     */
    closeDialog(fetch) {
      this.visible = false
      if (fetch) {
        this.$fetch()
      }
    },

    /**
     * On clear form search.
     */
    reset() {
      this.filters = {
        project_id: '',
        api_category_id: '',
        code: '',
        name: '',
        name_jp: '',
        order: '',
        use_flg: ''
      }
      this.search()
    },

    /**
     * Search data.
     */
    search() {
      if (this.$route.query.page) {
        this.$route.query.page = undefined
      }
      this.replaceQuery(this.filters)
    },
    /**
     * Go to version detail
     *
     * @param {Number} id
     */
    gotoVersionDetail(id) {
      this.$router.push(`/versionApi/${id}`)
    },

    async changeVersion(id, value) {
      this.$store.dispatch('setLoading', true)

      try {
        const data = {
          lock_flg: value
        }
        await this.$api.versionApi.update(id, data)

        this.$notification.success({
          message: this.$t('text.successfully')
        })

        await this.$fetch()
        this.checkLockedVersions()
      } catch (_) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
      } finally {
        this.$store.dispatch('setLoading', false)
      }
    },

    save() {
      this.$fetch()
      this.checkLockedVersions()
    },
    /**
     * Increase version
     */
    increaseVersion(id) {
      this.$refs.increaseVersion.openModal(id)
    }
  }
}
</script>

<style lang="scss" scoped>

:deep() {
  .ant-table-tbody > tr > td {
    cursor: pointer;
  }
}
</style>
