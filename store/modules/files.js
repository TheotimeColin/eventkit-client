export default {
    namespaced: true,
    state: () => ({
        library: []
    }),
    mutations: {
        updateLibrary (state, files) {
            state.library = files
        }
    },
    actions: {
        async getFiles ({ commit }, value) {
            // let response = await FilesService.fetchFiles(value)
            // commit('updateLibrary', response.files)
        },
        async postFiles ({ commit }, value) {
            // let response = await FilesService.uploadFiles(value)
            
            // return response
        }
    }
}