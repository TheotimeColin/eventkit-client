export default {
    namespaced: true,
    state: () => ({
        project: null
    }),
    mutations: {
        update (state, value) {
            state.project = value
        },
        addDataRow (state) {
            let data = state.project.values.data.slice()
            state.project.values.data = data
        },
        updateTheme (state, theme) {
            state.project.values.theme = theme
        },
        updateData (state, data) {
            state.project.values.data = data
        }
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
        async save ({ state, dispatch }) {
            dispatch('post', {
                data: {
                    id: state.project.id,
                    values: state.project.values
                }
            })
        },
        async create ({ dispatch }, values) {
            return await dispatch('post', {
                data: { values }
            })
        }
    }
}