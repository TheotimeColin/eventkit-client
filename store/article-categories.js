export default {
    namespaced: true,
    state: () => ({
        items: {},
        collection: []
    }),
    mutations: {
        update (state, value) {
            let items = { ...state.items }
            items[value.id] = value

            state.items = items
            state.collection = Object.keys(items).map(key => items[key])
        },
        refresh (state, value) {
            let items = {}
            value.forEach(value => items[value.id] = value)

            state.items = items
            state.collection = Object.keys(items).map(key => items[key])
        }
    },
    actions: {
        async fetch ({ commit }) {
            const response = await this.$axios.$get(`/articles/categories`)
            commit('refresh', response.categories)

            return response.categories
        },
        async get ({ commit }, params) {
            if (state.items[params.query.id]) {
                return state.items[params.query.id]
            } else {
                let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
                const response = await this.$axios.$get(`/articles?${query}`)

                commit('update', response.categories[0])

                return response.categories[0]
            }
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/articles/categories`, params.data)
            return response.category
        },
        async delete ({ commit }, params) {
            const response = await this.$axios.$delete(`/articles/categories`, {
                data: params.data
            })

            return response.status
        }
    }
}