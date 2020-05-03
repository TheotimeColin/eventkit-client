import shortid from "shortid"

export default {
    namespaced: true,
    state: () => ({
        confirm: {},
        notifications: []
    }),
    mutations: {
        confirmPrompt (state, value) {
            state.confirm = value
        },
        addNotification (state, value) {
            state.notifications.push({
                id: shortid.generate(),
                text: value.type == 'error' ? 'Une erreur est survenue, merci de réessayer.' : 'Succès !',
                ...value
            })
        },
        removeNotification (state, id) {
            let notifications = state.notifications.slice()
            state.notifications = notifications.filter(n => n.id !== id)
        }
    }
}