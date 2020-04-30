require('dotenv').config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#00CCFF' },
  /*
  ** Global CSS
  */
  css: [
      "@/assets/scss/global.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth'
  ],
  env: {
    API_URL: process.env.NUXT_ENV_API_URL
  },
  auth: {
    redirect: {
        login: '/dashboard',
        logout: '/',
        callback: '/dashboard',
        home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'post', propertyName: 'token' },
          logout: { url: process.env.NUXT_ENV_API_URL + '/logout', method: 'post' },
          user: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'get', propertyName: 'user' }
        }
      }
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
      baseURL: process.env.NUXT_ENV_API_URL
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
