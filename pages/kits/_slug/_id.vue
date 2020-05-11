<template>
    <div class="Page Page--full GeneratorPage">
        <div class="Page_content">
            <generator
                :project="project"
                :init-theme="initTheme"
                @create="onCreate"
            />
        </div>
    </div>
</template>

<script>
import Generator from '@/components/generators/Generator'
import initTheme from '@/config/conversation-starters'

const defaultTheme =  {
    theme: 'default',
    background: '#ef476f',
    pattern: { patternUrl: '', patternColor: 'ffffff', patternOpacity: 1, patternScale: 1 },
    font: { fontFamily: '"Lato"' },
    color: '#000000',
    size: { x: 65, y: 65, margin: 7.5 },
    title: 'Starter n°',
    footer: 'Créé sur eventkit.social',
    elementScale: 1
}

export default {
    name: 'ConversationStarters',
    layout: 'fullpage',
    components: { Generator },
    async fetch () {
        let project = null

        if (this.$route.params.id) {
            project = await this.$store.dispatch('kits/project/get', {
                query: { id: this.$route.params.id }
            })
        }
    },
    data: () => ({
        initTheme
    }),
    computed: {
        project () {
            return this.$store.getters['kits/project/getProject']
        }
    },
    methods: {
        async onCreate () {
            let newProject = await this.$store.dispatch('kits/project/create', {
                kit: this.$route.params.slug,
                theme: defaultTheme,
                user: this.$store.state.auth.user ? this.$store.state.auth.user._id : undefined,
                ideas: [
                    { id: '0', content: { main: 'Comment faire ?' }, new: true }
                ]
            })

            this.$router.push({ name: 'kits-slug-id', params: { slug: 'conversation-starters', id: newProject.id } })
        }
    }
}
</script>