export default {
    namespaced: true,
    state: () => ({
        fetched: false,
        items: {},
        collection: []
    }),
    mutations: {
        updatePack (state, value) {
            
        },
        update (state, value) {
            let items = JSON.parse(JSON.stringify(state.items))
            items[value._id] = value

            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
        },
        refresh (state, value) {
            let items = {}
            value.forEach(value => items[value._id] = value)

            state.collection = Object.keys(items).map(key => items[key])
            state.items = items
            state.fetched = true
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
            const response = await this.$axios.$get(`/kits/packs`)
            commit('refresh', response.packs)

            return response.packs
        },
        async get ({ commit }, params = { query: {} }) {
            try {
                let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
                const response = await this.$axios.$get(`/kits/packs?${query}`)

                commit('update', response.packs[0])

                return response.packs[0]
            } catch (e) { console.warn(e) }
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/kits/packs`, params.data)

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

            return response.pack
        }
    }
}