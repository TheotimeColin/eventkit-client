export default {
    namespaced: true,
    state: () => ({
    }),
    actions: {
        async createCustomer ({ commit }, params) {
            const response = await this.$axios.$post(`/premium`, params.data)

            console.log(response)
            return response
        }
    }
}