require('dotenv').config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: `eventKit, le blog des créateurs de lien social`,
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: `Rends tes événements inoubliables grâce aux conseils et idées d'animations d'eventKit. Que ça soit pour ta prochaine soirée, mariage, Meetup ou événement professionnel.` }
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
    ['@nuxtjs/google-analytics', {
        id: 'UA-165347177-1'
    }]
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
    extend (config, ctx) {
    }
  }
}
