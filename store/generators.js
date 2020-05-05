export default {
    namespaced: true,
    state: () => ({
        project: null
    }),
    mutations: {
        update (state, value) {
            state.project = value
        },
    },
    actions: {
        async get ({ commit }, params) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`/generators/projects?${query}`)
            if (response.project) {                
                commit('update', response.project)
                return response.project
            } else {
                return null
            }
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/generators/projects`, params.data)
            if (response.project) {
                commit('update', response.project)
                return response.project
            } else {
                return null
            }
        },
    }
}