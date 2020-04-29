export default {
    namespaced: true,
    state: () => ({
        items: []
    }),
    mutations: {
        update (state, value) {
            state.items = value
        }
    },
    actions: {
        async fetch ({ commit }) {
            const response = await this.$axios.$get(`${process.env.NUXT_ENV_SERVER_URL}/articles`)
            commit('update', response.articles)

            return response
        },
        async get ({ commit }, params) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`${process.env.NUXT_ENV_SERVER_URL}/articles?${query}`)

            return response.articles
        }
    }
}