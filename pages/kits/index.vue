<template>
    <div class="Page">
        <div class="Page_content">
            <div class="Wrapper">
                <!-- <simple-slider>
                    <div class="width-article-block" v-for="kit in kits" :key="kit.id">
                        <kit-block
                            :title="kit.title"
                            :excerpt="kit.excerpt"
                            :thumbnail="kit.thumbnail"
                            :to="{ name: 'kits-slug-id', params: { slug: kit.slug  } }"
                        />
                    </div>
                 </simple-slider> -->

                 <simple-slider>
                    <div class="width-article-block" v-for="project in projects" :key="project.id">
                        <kit-block
                            :title="project.id"
                            :theme="project.theme"
                            :excerpt="project.kit.title"
                            :to="{ name: 'kits-slug-id', params: { slug: project.kit.slug, id: project.id } }"
                        />
                    </div>
                </simple-slider>
            </div>
        </div>    
    </div>
</template>

<script>
import KitBlock from '@/components/kits/KitBlock'
import SimpleSlider from '@/components/interactive/SimpleSlider'

export default {
    name: 'KitList',
    components: { KitBlock, SimpleSlider },
    async fetch () {
        await this.$store.dispatch('kits/fetch')
        
        this.$data.projects = await this.$store.dispatch('kits/project/getUserProjects', {
            query: { user: this.$store.state.auth.user._id }
        })
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