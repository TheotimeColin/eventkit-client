export default {
    namespaced: true,
    state: () =>({
        flashes: []
    }),
    mutations: {
        addFlash (state, value) {
            state.flashes = [
                ...state.flashes,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    ...value
                }
            ]
        },
        removeFlash (state, id) {
            let result = state.flashes.slice()
            result = result.filter(flash => flash.id !== id)

            state.flashes = result
        }
    },
    actions: {},
    getters: {
        flashes: (state) => {
            return state.flashes
        }
    }
}