export default {
    namespaced: true,
    state: () => ({
        items: {},
        collection: []
    }),
    mutations: {
        update (state, value) {
            let items = JSON.parse(JSON.stringify(state.items))
            items[value.id] = value
            
            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
        },
        refresh (state, value) {
            let items = {}
            value.forEach(value => items[value.id] = value)

            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
        }
    },
    actions: {
        async fetch ({ commit }) {
            const response = await this.$axios.$get(`/articles`)
            commit('refresh', response.articles)

            return response
        },
        async get ({ state, commit }, params) {
            if (state.items[params.query.id]) {
                return JSON.parse(JSON.stringify(state.items[params.query.id]))
            } else {
                let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
                const response = await this.$axios.$get(`/articles?${query}`)
                
                commit('update', response.articles[0])

                return response.articles[0]
            }
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
    },
}