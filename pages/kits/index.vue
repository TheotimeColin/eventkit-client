<template>
    <div class="Page">
        <div class="Page_content">
                <div class="pv-40 bg-bg" v-if="projects.length > 0">
                    <div class="Wrapper">
                        <p class="ft-title-xl mb-20"><b>Mes derniers projets</b></p>
                        <simple-slider>
                            <div class="width-article-block" v-for="project in projects" :key="project.id">
                                <project-block
                                    :title="project.title"
                                    :theme="project.theme"
                                    :kit="project.kit"
                                    :project="project"
                                    :to="{ name: 'kits-slug-id', params: { slug: project.kit.slug, id: project.id } }"
                                />
                            </div>
                        </simple-slider>
                    </div>
                </div>

                <div class="pv-40">
                    <div class="Wrapper">
                        <div class="row">
                            <div class="col-6" v-for="kit in kits" :key="kit._id">
                                <kit-section
                                    class="mv-40"
                                    :id="kit._id"
                                    :title="kit.title"
                                    :tags="['3 variations', 'Tout public']"
                                    :excerpt="kit.excerpt"
                                    :thumbnail="kit.thumbnail"
                                />
                            </div>
                        </div>
                    </div>
                </div>
        </div>    
    </div>
</template>

<script>
import ProjectBlock from '@/components/kits/ProjectBlock'
import SimpleSlider from '@/components/interactive/SimpleSlider'
import KitSection from '@/components/kits/KitSection'

export default {
    name: 'KitList',
    components: { ProjectBlock, SimpleSlider, KitSection },
    async fetch () {
        await this.$store.dispatch('kits/fetch')

        let query = {}

        if (this.$store.state.auth.user) {
            query.user = this.$store.state.auth.user._id
        } else if (this.$cookies.get('anonymous-id')) {
            query.userAnonymous = this.$cookies.get('anonymous-id')
        }
        
        if (query.user || query.userAnonymous) {
            this.$data.projects = await this.$store.dispatch('kits/project/getUserProjects', { query })
        }
    },
    data: () => ({
        projects: []
    }),
    computed: {
        kits () {
            return this.$store.state.kits.collection
        }
    },
    methods: {

    }
}
</script>