export default {
    namespaced: true,
    state: () => ({
        project: null
    }),
    mutations: {
        update (state, value) {
            state.project = value
        },
        addData (state, idea) {
            let data = state.project.ideas.slice()
            data.push(idea)
            
            state.project.ideas = data
        },
        removeData (state, idea) {
            let data = state.project.ideas.slice().filter(v => v.id !== idea.id)
            
            state.project.ideas = data
        },
        addDataRow (state) {
            let data = state.project.ideas.slice()
            state.project.ideas = data
        },
        updateTheme (state, theme) {
            state.project.theme = theme
        },
        updateData (state, data) {
            state.project.ideas = data
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
                    ideas: state.project.ideas,
                    theme: state.project.theme
                }
            })
        },
        async create ({ dispatch }, theme) {
            return await dispatch('post', {
                data: { theme }
            })
        }
    }
}