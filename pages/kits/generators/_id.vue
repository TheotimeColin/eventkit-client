<template>
    <div class="Page Page--full GeneratorPage">
        <generator
            :project="project"
            @create="onCreate"
            @update="onUpdate"
            @save="onSave"
        />
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
        { id: 0, main: 'Quel est le pire film que tu aies jamais vu ?' },
        { id: 1, main: 'Quel est le pire film que tu aies jamais vu ?' },
    ]
}

export default {
    name: 'ConversationStarters',
    components: { Generator },
    async fetch () {
        let project = null

        if (this.$route.params.id) {
            project = await this.$store.dispatch('generators/get', {
                query: { id: this.$route.params.id }
            })

            this.$data.project = {
                ...JSON.parse(JSON.stringify(project)),
                config: initConfig
            }
        }
    },
    data: () => ({
        project: null
    }),
    methods: {
        onUpdate (values) {
            this.$data.project.values = values
        },
        async onSave () {
            let project = await this.$store.dispatch('generators/post', {
                data: {
                    id: this.$data.project.id,
                    values: this.$data.project.values
                }
            })

            this.$data.project = {
                ...JSON.parse(JSON.stringify(project)),
                config: initConfig
            }
        },
        async onCreate () {
            let newProject = await this.$store.dispatch('generators/post', {
                data: { values: initValues }
            })
            
            this.$router.push({ name: 'kits-generators-id', params: { id: newProject.id } })

            this.$data.project = {
                ...JSON.parse(JSON.stringify(newProject)),
                config: initConfig
            }
        }
    }
}
</script>