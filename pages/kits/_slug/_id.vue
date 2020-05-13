<template>
    <div class="Page Page--full GeneratorPage">
        <div class="Page_content" v-if="kit">
            <kickstarter :kit="kit" v-if="!project && state.loaded" />

            <generator
                :project="project"
                :init-theme="initTheme"
                v-if="project && state.loaded"
            />
        </div>
    </div>
</template>

<script>
import Kickstarter from '@/components/generators/Kickstarter'
import Generator from '@/components/generators/Generator'
import KITS from '@/config/kits'

export default {
    name: 'ConversationStarters',
    layout: 'fullpage',
    components: { Generator, Kickstarter },
    async fetch () {
        let project = null

        if (this.$route.params.slug) {
            this.$data.kit = await this.$store.dispatch('kits/get', {
                query: { slug: this.$route.params.slug }
            })
        }

        if (this.$route.params.id) {
            let query = {
                id: this.$route.params.id
            }

            if (this.$cookies.get('anonymous-id') && !this.user) query.userAnonymous = this.$cookies.get('anonymous-id')

            project = await this.$store.dispatch('kits/project/get', { query })
        }

        this.state.loaded = true
    },
    data: () => ({
        state: {
            loaded: false
        },
        kit: null
    }),
    computed: {
        user () {
            return this.$store.state.auth.user
        },
        project () {
            return this.$store.getters['kits/project/getProject']
        },
        initTheme () {
            return this.project ? KITS[this.project.kit.slug].theme : {}
        },
        slug () {
            return this.$route.params.slug
        }
    },
    beforeDestroy () {
        this.$store.commit('kits/project/destroyProject')
    },
    watch: {
        project (v) {
            if (v) {
                this.$router.push(this.localePath({ name: 'kits-slug-id', params: { slug: this.slug, id: v.id } }))
            }
        }
    }
}
</script>