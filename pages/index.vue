<template>
    <div class="HomePage">
        <div class="pv-100 bg-bg-xweak">
            <div class="Wrapper">
                <div class="row">
                    <div class="col-7">
                        <!-- <article-featured
                            :title="featured.title"
                            :slug="featured.slug"
                            :read-time="featured.readTime"
                            :excerpt="featured.excerpt"
                            :cover="featured.cover"
                            v-if="featured"
                        /> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="pv-60 bg-bg-weak">
            <div class="Wrapper">
                <div class="row fx-wrap">
                    <div class="col-4" v-for="article in articles" :key="article.id">
                        <article-block
                            :title="article.title"
                            :slug="article.slug"
                            :read-time="article.readTime"
                            :excerpt="article.excerpt"
                            :cover="article.cover"
                            class="article-block"
                            
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleBlock from '@/components/articles/ArticleBlock'
// import ArticleFeatured from '@/components/ArticleFeatured'

export default {
    name: 'HomePage',
    components: { ArticleBlock },
    async fetch () {
        await this.$store.dispatch('modules/articles/fetch')
    },
    data: () => ({
        featured: null
    }),
    computed: {
        articles () {
            return this.$store.state.modules.articles.items
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>
