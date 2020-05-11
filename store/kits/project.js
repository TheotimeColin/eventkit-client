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
            let data = state.project.ideas.slice().filter(v => v._id !== idea._id)
            
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
            const response = await this.$axios.$get(`/kits/projects?${query}`)
            
            if (response.projects[0]) {                
                commit('update', response.projects[0])
                return response.projects[0]
            } else {
                return null
            }
        },
        async getUserProjects ({ commit }, params) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`/kits/projects?${query}`)

            return response.projects             
        },
        async post ({ commit }, params) {
            const response = await this.$axios.$post(`/kits/projects`, params.data)

            commit('utils/addNotification', {
                type: response.status ? 'success' : 'error'
            }, { root: true })

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
        async create ({ dispatch }, { theme, ideas = [], kit, user }) {
            return await dispatch('post', {
                data: { theme, ideas, kit, user }
            })
        }
    },
    getters: {
        getProject (state) {
            let position = 0

            return state.project ? {
                ...state.project,
                ideas: state.project.ideas.map(idea => {
                    if (!idea.disabled) position++
                    return { ...idea, position }
                })
            } : null
        }
    }
}