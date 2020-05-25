import shortid from 'shortid'

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
        updateProject (state, data) {
            state.project = {
                ...state.project,
                ...data
            }
        },
        updateTheme (state, theme) {
            state.project.theme = theme
        },
        updateData (state, data) {
            state.project.ideas = data
        },
        destroyProject (state) {
            state.project = null
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
        async fetch ({ commit }, params = { query: {} }) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`/kits/projects?${query}`)

            return response.projects
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
        async save ({ state, dispatch }, params) {
            let formData = new FormData()

            if (params && params.zip) {
                formData.append(`zip`, params.zip)
            }

            formData.append('id', state.project.id)
            formData.append('title', state.project.title)
            formData.append('description', state.project.description)
            formData.append('ideas', JSON.stringify(state.project.ideas))
            formData.append('theme', JSON.stringify(state.project.theme))
            formData.append('template', state.project.template)

            return await dispatch('post', {
                data: formData
            })
        },
        async delete ({ commit }, params) {
            const response = await this.$axios.$delete(`/kits/projects`, {
                data: params.data
            })
        },
        async create ({ dispatch }, { theme, ideas = [], kit, title, user }) {
            if (!user) {
                let id = shortid.generate()
                user = id
            }

            return await dispatch('post', {
                data: { theme, ideas, kit, user, title }
            })
        },
        async unlock ({ state, commit }) {
            const response = await this.$axios.$post(`/kits/projects`, {
                id: state.project.id, unlock: true
            })

            if (response.project) {
                commit('update', response.project)
                return response.project
            } else {
                return null
            }
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