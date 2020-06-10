import shortid from 'shortid'

export default {
    namespaced: true,
    state: () => ({
        project: null
    }),
    mutations: {
        updateIdea (state, value) {
            let project = JSON.parse(JSON.stringify(state.project))
            project.ideaCategories = project.ideaCategories.map(category => {
                if (category._id == value.category) {
                    category.ideas = category.ideas.map(idea => ({
                        ...(idea._id == value._id ? value : idea)
                    }))
                    
                    if (!category.ideas.find(i => i._id == value._id)) category.ideas.push(value)
                }
                
                return category
            })

            state.project = project
        },
        deleteIdea (state, value) {
            let project = JSON.parse(JSON.stringify(state.project))
            project.ideaCategories = project.ideaCategories.map(category => {
                if (category._id == value.category) category.ideas = category.ideas.filter(idea => idea._id != value._id)
                return category
            })

            state.project = project
        },
        update (state, value) {
            state.project = value
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
            let project = JSON.parse(JSON.stringify(state.project))
            project.ideaCategories = data
            
            state.project = project
        },
        addData (state, idea) {
            let ideas = state.project.ideas.slice()
            ideas.push(idea)
            
            state.project = {
                ...state.project,
                ideas
            }
        },
        removeData (state, idea) {
            let data = state.project.ideas.slice().filter(v => v._id !== idea._id)
            
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
            formData.append('ideaCategories', JSON.stringify(state.project.ideaCategories))
            formData.append('theme', JSON.stringify(state.project.theme))
            formData.append('template', state.project.template)
            formData.append('templateTags', state.project.templateTags)

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

            let formData = new FormData()

            formData.append('title', title)
            formData.append('user', user)
            formData.append('ideas', JSON.stringify(ideas))
            formData.append('theme', JSON.stringify(theme))
            formData.append('kit', kit)

            return await dispatch('post', {
                data: formData
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
            return state.project ? {
                ...state.project
            } : null
        }
    }
}