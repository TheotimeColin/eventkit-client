import {
    getQuery
} from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({

    }),
    actions: {
        async delete ({ commit }) {
            const response = await this.$axios.$delete(`/user`)
            return response
        }
    }
}