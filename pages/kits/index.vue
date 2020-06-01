<template>
    <div class="Page">
        <div class="Page_content">
            <div class="pv-40 bg-blue-xweak o-hidden" v-if="user">
                <div class="Wrapper">
                    <simple-slider v-if="!state.loaded">
                        <template slot="title">
                            <p class="ft-title-xl"><b>{{ $t('pages.kits.projects') }}</b></p>
                        </template>

                        <project-block
                            class="width-project-block"
                            v-for="i in 5" :key="i"
                        />
                    </simple-slider>

                    <simple-slider v-if="state.loaded">
                        <template slot="title">
                            <p class="ft-title-xl"><b>{{ $t('pages.kits.projects') }}</b></p>
                        </template>
                            
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

        setTimeout(() => this.$data.state.loaded = true, 500)
    },
    data: () => ({
        state: {
            loaded: false
        },
        projects: []
    }),
    mounted () {
        setTimeout(() => this.$data.state.loaded = true, 500)
    },
    computed: {
        user () {
            return this.$store.state.auth.user
        },
        kits () {
            return this.$store.state.kits.collection
        }
    },
    methods: {
        getProjects () {
            if (!this.$store.state.auth.user) return []

            return new Promise(async resolve => {
                this.$data.projects = await this.$store.dispatch('kits/project/getUserProjects', { query: {} })

                resolve()
            })
        }
    },
    head () {
        return {
            htmlAttrs: { prefix: 'og: http://ogp.me/ns#' },
            title: this.$t(`pages.kits.title`) + this.$t(`seo.titleEnd`),
            meta: [
                { hid: 'description', name: 'description', content: this.$t(`seo.description`) },
                { property: 'og:description', content: this.$t(`seo.description`) }
            ]
        }
    }
}
</script>