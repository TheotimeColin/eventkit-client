<template>
    <div class="Page Page--full GeneratorPage">
        <div class="Page_content">
            <generator
                :project="project"
                :config="initConfig"
                @create="onCreate"
            />
        </div>
    </div>
</template>

<script>
import Generator from '@/components/generators/Generator'
import initConfig from '@/config/conversation-starters'

const initValues = {
    theme: {
        theme: 'default',
        background: '#ef476f',
        pattern: { patternUrl: '', patternColor: 'ffffff', patternOpacity: 1, patternScale: 1 },
        font: { fontFamily: '"Lato"' },
        color: '#000000',
        size: { x: 65, y: 65 },
        title: 'Starter n°',
        footer: 'Créé sur eventkit.social'
    },
    data: [
        { id: 'default', main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 'sdqsd', main: `Quel est le meilleur conseil qu'on t'aies jamais donné ?` },
        { id: 'sdqsds', main: `Quel serait ton boulot de rêve ?` },
    ]
}

export default {
    name: 'ConversationStarters',
    layout: 'fullpage',
    components: { Generator },
    async fetch () {
        let project = null

        if (this.$route.params.id) {
            project = await this.$store.dispatch('generators/get', {
                query: { id: this.$route.params.id }
            })
        }
    },
    data: () => ({
        initConfig
    }),
    computed: {
        project () {
            return this.$store.state.generators.project
        }
    },
    methods: {
        async onCreate () {
            let newProject = await this.$store.dispatch('generators/create', initValues)
            this.$router.push({ name: 'kits-generators-id', params: { id: newProject.id } })
        }
    }
}
</script>