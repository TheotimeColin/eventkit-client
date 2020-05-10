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
            const response = await this.$axios.$get(`/generators/packs`)
            commit('refresh', response.packs)

            return response.packs
        },
        // async get ({ commit }, params) {
        //     if (state.items[params.query.id]) {
        //         return JSON.parse(JSON.stringify(state.items[params.query.id]))
        //     } else {
        //         let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
        //         const response = await this.$axios.$get(`/articles?${query}`)

        //         commit('update', response.categories[0])

        //         return response.categories[0]
        //     }
        // },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/generators/packs`, params.data)

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

            return response.pack
        },
        // async delete ({ commit }, params) {
        //     const response = await this.$axios.$delete(`/articles/categories`, {
        //         data: params.data
        //     })

        //     commit('utils/addNotification', {
        //         type: response.status ? 'success' : 'error'
        //     }, { root: true })

        //     commit('delete', params.data.id)

        //     return response.status
        // }
    }
}