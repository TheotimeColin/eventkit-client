import {
    getQuery
} from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({
        loggedUser: null
    }),
    actions: {
        async register ({ commit }, params) {
            const response = await this.$axios.$post(`/user`, params.data)
            return response
        },
        async reset ({ commit }, params) {
            const response = await this.$axios.$get(`/user/reset?${getQuery(params.query)}`)
            return response
        },
        async setPassword ({ commit }, params) {
            const response = await this.$axios.$post(`/user/reset`, params.data)
            return response
        }
    }
}