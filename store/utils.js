export default {
    namespaced: true,
    state: () => ({
        confirm: {}
    }),
    mutations: {
        confirmPrompt (state, value) {
            state.confirm = value
        }
    }
}