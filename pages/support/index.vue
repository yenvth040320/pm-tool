<template>
  <a-row class="main-row">
    <a-col :span="5">
      <a-card>
        <ul>
          <li
            v-for="(menu, index) in menus"
            :key="index"
          >
            <span
              :class="[ menu.link ? 'link' : '' ]"
              @click="showMenuMd(menu.link)"
            >
              {{ $t(menu.title) }}
            </span>
            <span
              v-if="menu.menus.length > 0"
            >
              <ul>
                <li
                  v-for="(item, indexChild) in menu.menus"
                  :key="indexChild"
                >
                  <span
                    :class="[ item.link ? 'link' : '' ]"
                    @click="showMenuMd(item.link)"
                  >
                    {{ $t(item.title) }}
                  </span>
                </li>
              </ul>
            </span>
          </li>
        </ul>
      </a-card>
    </a-col>
    <a-col :span="18" class="md-content">
      <a-card v-if="mdPath">
        <mark-down
          ref="markdown"
          :file-name="mdPath"
        />
      </a-card>
    </a-col>
  </a-row>
</template>
<script>
import { get } from 'lodash'
import MarkDown from '~/components/templates/support/MarkDown.vue'
export default {
  components: {
    MarkDown
  },

  /**
   * Init data for component.
   */
  data() {
    return {
      mdPath: ''
    }
  },
  computed: {
    menus() {
      const staticMenu = [
        {
          icon: 'home',
          id: 0,
          link: '/',
          menus: [],
          parent_id: 0,
          position: 0,
          title: 'common.home'
        }
      ]
      const dynamicMenu = get(this, '$auth.user.menus', [])
      const menu = [...staticMenu, ...dynamicMenu]
      menu.sort((a, b) => a.position - b.position)
      return menu
    }
  },

  /**
   * Methods.
   */
  methods: {
    showMenuMd(link) {
      let filename = ''
      if (link === '/') {
        filename = 'index'
      } else {
        const sanitizedLink = link.startsWith('/') ? link.substring(1) : link
        filename = sanitizedLink.replace(/\//g, '-').replace(/(^|-)([a-z])/g, (_, prefix, match) => prefix + match.toUpperCase())
      }
      this.mdPath = filename
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  ul {
    list-style-type: disc;
    padding-inline-start: 40px;
    cursor: pointer;
  }
  ul ul {
    list-style-type: circle;
    margin-block-start: 0;
    margin-block-end: 0;
  }
}
.md-content {
  margin-left: 3%;
}
.link {
  color: $primary-color;
  cursor: pointer;
}
</style>
