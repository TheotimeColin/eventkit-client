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
        collection: [],
        tags: {
            items: {},
            collection: []
        }
    }),
    mutations: {
        refresh (state, value) {
            let { collection, items } = refreshCollection(value)

            state.collection = collection
            state.items = items
            state.fetched = true
        },
        update (state, value) {
            let { collection, items } = updateOne(state.items, value)

            state.collection = collection
            state.items = items
        },
        updateTag (state, value) {
            let { collection, items } = updateOne(state.tags.items, value)

            state.tags.collection = collection
            state.tags.items = items
        },
        updateTags (state, value) {
            let { collection, items } = refreshCollection(value)

            state.tags.collection = collection
            state.tags.items = items
        }
    },
    actions: {
        async fetch ({ commit }, params = { query: {} }) {
            try {
                const response = await this.$axios.$get(`/kits/ideas?${getQuery(params.query)}`)
                commit('refresh', response.ideas)

                return response.ideas
            } catch (e) { console.warn(e) }
        },
        async get ({ commit }, params = { query: {} }) {
            try {
                let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
                const response = await this.$axios.$get(`/kits/ideas?${query}`)

                commit('update', response.ideas[0])

                return response.ideas[0]
            } catch (e) { console.warn(e) }
        },
        async post ({ commit }, params) {
            try {
                const response = await this.$axios.$post(`/kits/ideas`, params.data)
                
                commit('update', response.idea)
                commit('utils/addNotification', {
                    type: response.status ? 'success' : 'error'
                }, { root: true })

                return response.idea
            } catch (e) { console.warn(e) }
        },
        async save ({ commit, state }, params) {
            try {
                const response = await this.$axios.$post(`/kits/ideas`, state.items[params.id])
                
                commit('update', response.idea)
                commit('utils/addNotification', {
                    type: response.status ? 'success' : 'error'
                }, { root: true })

                return response.idea
            } catch (e) { console.warn(e) }
        },
        async fetchTags ({ commit }, params = { query: {} }) {
            try {
                const response = await this.$axios.$get(`/kits/ideas/tags?${getQuery(params.query)}`)

                commit('updateTags', response.tags)
                return response.tags
            } catch (e) { console.warn(e) }
        },
        async postTag ({ commit }, params) {
            try {
                const response = await this.$axios.$post(`/kits/ideas/tags`, params.data)

                commit('updateTag', response.tag)
                return response.tag
            } catch (e) { console.warn(e) }
        }
    }
}