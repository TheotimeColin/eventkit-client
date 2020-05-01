export default {
    namespaced: true,
    state: () => ({
        current: null,
        left: false
    }),
    mutations: {
        set (state, value) {
            state.left = false
            state.current = value
        },
        leave (state) {
            state.left = true
        }
    }
}