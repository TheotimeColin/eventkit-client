import {
    updateOne,
    deleteOne,
    refreshCollection,
    getQuery
} from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        fetched: false,
        items: {},
        collection: []
    }),
    mutations: {
        update (state, value) {
            let { collection, items } = updateOne(state.items, value)

            state.collection = collection
            state.items = items
        },
        refresh (state, value) {
            let { collection, items } = refreshCollection(value)

            state.collection = collection
            state.items = items
            state.fetched = true
        },
        delete (state, value) {
            let { collection, items } = deleteOne(state.collection, value)

            state.collection = collection
            state.items = items
        }
    },
    actions: {
        async fetch ({ commit }, params = { query: {} }) {
            let query = getQuery(params.query)
            const response = await this.$axios.$get(`/kits?${encodeURI(query)}`)

            commit('refresh', response.kits)

            return response.kits
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/kits`, params.data)

            console.log(response)

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

            return response.kit
        },
        async get ({ state, commit }, params) {
            let query = getQuery(params.query)
            const response = await this.$axios.$get(`/kits?${encodeURI(query)}`)
            
            let result = response.kits[0]
            if (!result) return false

            commit('update', response.kits[0])
            return response.kits[0]
        },
    }
}