export default {
    namespaced: true,
    state: () => ({
    }),
    actions: {
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