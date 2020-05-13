<template>
    <div class="Page">
        <div class="Page_content">
            <div class="pv-40 bg-bg o-hidden" v-if="projects.length > 0">
                <div class="Wrapper">
                    <p class="ft-title-xl mb-20"><b>Mes derniers projets</b></p>
                    <simple-slider>
                        <div class="width-project-block" v-for="project in projects" :key="project.id">
                            <project-block
                                :title="project.title ? project.title : project.id"
                                :theme="project.theme"
                                :kit="project.kit"
                                :project="project"
                                @delete="getProjects"
                                :to="{ name: 'kits-slug-id', params: { slug: project.kit.slug, id: project.id } }"
                            />
                        </div>
                    </simple-slider>
                </div>
            </div>

            <div class="pv-40">
                <div class="Wrapper">
                    <div class="row fx-wrap">
                        <div class="col-6" v-for="kit in kits" :key="kit._id">
                            <kit-block
                                class="mv-40"
                                :id="kit._id"
                                :slug="kit.slug"
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
import KitBlock from '@/components/kits/KitBlock'

export default {
    name: 'KitList',
    components: { ProjectBlock, SimpleSlider, KitBlock },
    async fetch () {
        await this.$store.dispatch('kits/fetch')

        await this.getProjects()
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
        getProjects () {
            return new Promise(async resolve => {
                let query = {}

                if (this.$store.state.auth.user) {
                    query.user = this.$store.state.auth.user._id
                } else if (this.$cookies.get('anonymous-id')) {
                    query.userAnonymous = this.$cookies.get('anonymous-id')
                }
                
                if (query.user || query.userAnonymous) {
                    this.$data.projects = await this.$store.dispatch('kits/project/getUserProjects', { query })
                }

                resolve()
            })
        }
    }
}
</script>