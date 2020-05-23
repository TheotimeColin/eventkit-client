export default {
    namespaced: true,
    state: () => ({
        information: {
            fetched: false,
        }
    }),
    mutations: {
        updateInformation (state, value) {

            state.information = {
                ...value,
                fetched: true
            }
        }
    },
    actions: {
        async getInfo ({ commit, state }) {
            if (state.information.fetched) return state.information

            const response = await this.$axios.$get(`/premium`)

            commit('updateInformation', response.information)

            return response.information
        },
        async createCustomer ({ commit }, params) {
            const response = await this.$axios.$post(`/premium`, params.data)
            return response
        },
        async getPortal ({ commit }, params) {
            const response = await this.$axios.$post(`/premium/portal`, params.data)
            return response
        }
    }
}