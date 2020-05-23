require('dotenv').config()
const getRoutes = require('./utils/get-routes');

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
 serverMiddleware: [
    'redirect-ssl'
 ],
  head: {
    title: `eventKit, jeux personnalisables à imprimer chez soi gratuitement`,
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: `Rends tes événements inoubliables grâce aux conseils et idées d'animations d'eventKit. Que ça soit pour ta prochaine soirée, mariage, Meetup ou événement professionnel.` }
    ],
    link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
        { src: '//assets.pinterest.com/js/pinit.js', async: true, defer: true, ['data-pin-tall']: 'true', ['data-pin-round']: 'true' }
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
    '@/assets/scss/global.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
      '~/plugins/base.js'
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
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'nuxt-stripe-module',
    ['@nuxtjs/google-analytics', {
        id: 'UA-165347177-1'
    }],
    ['@nuxtjs/sitemap', {
        hostname: process.env.BASE_URL,
        gzip: true,
        exclude: [
            '/account',
            '/kits',
            '/premium',
            '/kits/**',
            '/about',
            '/admin',
            '/account/**',
            '/admin/**'
        ],
        routes () {
            return getRoutes()
        }
    }]
  ],
  i18n: {
    locales: [
        { code: 'fr', iso: 'fr-FR', file: 'fr.js' },
        { code: 'en', iso: 'en-EN', file: 'en.js' }
    ],
    langDir: '/translations/',
    defaultLocale: 'fr',
    lazy: true
  },
  env: {
    API_URL: process.env.NUXT_ENV_API_URL
  },
  stripe: {
    publishableKey: process.env.STRIPE_KEY,
  },
  auth: {
    redirect: {
        logout: '/',
        login: false,
        home: false,
        callback: false
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
    extend (config, ctx) {
    }
  }
}
