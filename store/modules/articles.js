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
            const response = await this.$axios.$get(`/articles`)
            commit('update', response.articles)

            return response
        },
        async get ({ commit }, params) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`/articles?${query}`)

            return response.articles
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/articles`, params.data)
            return response.article
        },
        async delete ({ commit }, params) {
            const response = await this.$axios.$delete(`/articles`, {
                data: params.data
            })

            return response.status
        }
    }
}