import Vuex from 'vuex'

// import global from '@/store/modules/global'
// import files from '@/store/modules/files'
import articles from '@/store/modules/articles'

new Vuex.Store({
    state: () => ({
        test: true
    }),
	modules: {
        articles
	}
})