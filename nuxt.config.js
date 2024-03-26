import icons from './constants/icons'

require('dotenv').config()

export default {
  // Mode: https://nuxtjs.org/api/configuration-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Digidinos',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Digidinos' },
      { name: 'og:title', content: 'Digidinos' },
      { name: 'og:site_name', content: 'Digidinos' },
      { name: 'og:description', content: 'Digidinos' },
      { name: 'apple-mobile-web-app-title', content: 'Digidinos' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~/assets/less/theme.less', lang: 'less' },
    { src: '~/assets/scss/style.scss', lang: 'scss' },
    { src: 'vue-json-pretty/lib/styles.css' },
    { src: 'jsondiffpatch/dist/formatters-styles/html.css' },
    { src: 'jsondiffpatch/dist/formatters-styles/annotated.css' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/antd',
    '~/plugins/api',
    '~/plugins/persistedState.client.js',
    '~/plugins/localstorageClear.js',
    '~/plugins/validate.js',
    '~/plugins/vue-json-pretty',
    '~/plugins/jsondiffpatch.js',
    '~/plugins/sqlParser.js',
    '~/plugins/eventBus.js',
    '~/plugins/busIndex.js',
    '~/plugins/firebase.js',
    '~/plugins/ck-editor',
    '~/plugins/csv/index.js',
    '~/plugins/syncfusion/index.js',
    '~/plugins/syncfusion/license-key.js'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment'
  ],

  // Fontawesome configuration: https://go.nuxtjs.dev/pwa
  fontawesome: {
    icons
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://auth.nuxtjs.org
    '@nuxtjs/auth',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://i18n.nuxtjs.org
    '@nuxtjs/i18n',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
    'cookie-universal-nuxt'
  ],

  // Auth module configuration: https://auth.nuxtjs.org
  auth: {
    localStorage: false,
    redirect: {
      login: '/login',
      logout: '/login',
      home: false
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'result.data.access_token' },
          user: { url: '/auth/me', method: 'get', propertyName: 'result.data' },
          logout: { url: '/auth/logout', method: 'post' }
        }
      }
    },
    cookie: {
      options: {
        maxAge: 30 * 24 * 60 * 60 // seconds
      }
    },
    plugins: [
      '~/plugins/api.js'
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_BASE_URL
  },

  // i18n module configuration: https://i18n.nuxtjs.org/
  i18n: {
    locales: [
      // { code: 'ja', iso: 'ja-JP' },
      // { code: 'en', iso: 'en-US' },
      { code: 'vi', iso: 'vi-VN' }
    ],
    defaultLocale: 'vi',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'vi',
      messages: {
        // ja: require('./assets/locales/ja.json'),
        // en: require('./assets/locales/en.json'),
        vi: require('./assets/locales/vi.json')
      },
      silentTranslationWarn: true
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Style resources module configuration: https://github.com/nuxt-community/style-resources-module
  styleResources: {
    scss: [
      '~/assets/scss/_variables.scss',
      '~/assets/scss/_mixins.scss'
    ]
  }
}
