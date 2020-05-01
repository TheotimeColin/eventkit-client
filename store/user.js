export default {
    namespaced: true,
    state: () => ({
        loggedUser: null
    }),
    actions: {
        async register ({ commit }, params) {
            const response = await this.$axios.$post(`/user`, params.data)
            return response.email
        }
    }
}