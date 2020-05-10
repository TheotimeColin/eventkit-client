export default {
    namespaced: true,
    state: () => ({
        active: [],
    }),
    mutations: {
        open (state, value) {
            let active = state.active.slice()

            active.push(value)
            state.active = active
        },
        close (state, value) {
            let active = state.active.slice()
            active = active.filter(v => v.id == value)

            state.active = active
        }
    }
}