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
            value.forEach(value => items[value._id] = value)

            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
        },
        delete (state, value) {
            let items = state.collection.slice()
            items = items.filter(item => item != value)

            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
        }
    },
    actions: {
        async fetch ({ commit }) {
            const response = await this.$axios.$get(`/reactions`)

            commit('refresh', response.reactions)

            return response.reactions
        },
        async get ({ commit }, params) {
            if (state.items[params.query.id]) {
                return JSON.parse(JSON.stringify(state.items[params.query.id]))
            } else {
                let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
                const response = await this.$axios.$get(`/reactions?${query}`)

                commit('update', response.reactions[0])

                return response.reactions[0]
            }
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/reactions`, params.data)

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

            return response.reaction
        },
        async delete ({ commit }, params) {
            const response = await this.$axios.$delete(`/reactions`, {
                data: params.data
            })

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

            commit('delete', params.data.id)

            return response.status
        }
    }
}