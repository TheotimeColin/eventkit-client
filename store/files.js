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
        async fetch ({ commit }, params) {
            let query = Object.keys(params.query).map(key => `${key}=${params.query[key]}`).join('&')
            const response = await this.$axios.$get(`/files?${query}`)
            
            return response.files
        },
        async post ({ commit }, params) {
            let formData = new FormData()

            if (params.folder) formData.append('folder', params.folder)
            params.files.forEach(file => {
                formData.append('files', file.data.file)

                delete file.data.file

                Object.keys(file.data).forEach(key => {
                    let data = file.data[key]

                    if (key == 'sizes') {
                        data.forEach(size => {
                            Object.keys(size).forEach(sizeKey => {
                                let sizeData = size[sizeKey]
                                formData.append(`file[${file.id}][${key}][${size.type}][${sizeKey}]`, sizeData)
                            })
                            
                        })
                    } else {
                        formData.append(`file[${file.id}][${key}]`, data)
                    }
                    
                })
            })

            const response = await this.$axios.$post(`/files`, formData)
            return response.files
        }
    }
}