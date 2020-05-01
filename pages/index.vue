<template>
    <div class="HomePage Page bg-bg-xweak">
        <div class="Page_content">
            <div class="pv-60">
                <div class="Wrapper">
                    <div class="row-l fx-center">
                        <div class="col-7">
                            <article-featured
                                :title="featured.title"
                                :slug="featured.slug"
                                :read-time="featured.readTime"
                                :excerpt="featured.excerpt"
                                :thumbnail="featured.cover"
                                v-if="featured"
                            />
                        </div>
                        <div class="col-5">
                            <div class="HomePage_popular">
                                <div class="d-flex fx-align-center fx-justify-between mb-20">
                                    <p class="ft-title-l">
                                        <b>Articles populaires</b>
                                    </p>
                                    <button-inline :to="{ name: 'blog' }">
                                        Plus d'articles
                                    </button-inline>
                                </div>

                                <div>
                                    <article-line
                                        class="HomePage_popularArticle"
                                        v-for="(article, i) in popular" 
                                        :ranking="i + 1"
                                        :title="article.title"
                                        :slug="article.slug"
                                        :excerpt="article.excerpt"
                                        :key="article.id"
                                    />
                                </div>
                            </div>
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
                                :thumbnail="article.thumbnail"
                                class="article-block"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleBlock from '@/components/articles/ArticleBlock'
import ArticleFeatured from '@/components/articles/ArticleFeatured'
import ArticleLine from '@/components/articles/ArticleLine'

export default {
    name: 'HomePage',
    components: { ArticleBlock, ArticleFeatured, ArticleLine },
    async fetch () {
        await this.$store.dispatch('modules/articles/fetch')
    },
    computed: {
        featured () {
            return this.$store.state.modules.articles.items[0]
        },
        articles () {
            return this.$store.state.modules.articles.items
        },
        popular () {
            return this.$store.state.modules.articles.items.slice(0, 5)
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>
