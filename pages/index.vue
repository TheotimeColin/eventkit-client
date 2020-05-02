<template>
    <div class="HomePage Page bg-bg">
        <div class="Page_content">
            <div class="pt-60">
                <div class="Wrapper">
                    <div class="row-l fx-center">
                        <div class="col-7">
                            <article-featured
                                :title="featured.title"
                                :id="featured.id"
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
                                        :id="article.id"
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
            <div class="pv-20 bg-bg-weak">
                <div class="Wrapper">
                    <div class="mv-40" v-for="category in categories" :key="category.id">
                        <div class="d-flex fx-align-center fx-justify-between">
                            <p class="ft-title-l"><b>{{ category.subtitle }}</b></p>
                            <button-inline :to="{ name: '' }">
                                Plus d'articles
                            </button-inline>
                        </div>
                        <div class="row fx-wrap">
                            <div class="col-4" v-for="article in category.articles.slice(0, 3)" :key="article.id">
                                <article-block
                                    :title="article.title"
                                    :category="category"
                                    :id="article.id"
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
        await this.$store.dispatch('articles/fetch')
        await this.$store.dispatch('article-categories/fetch')
    },
    computed: {
        featured () {
            return this.articles[0]
        },
        articles () {
            return this.$store.state.articles.collection
        },
        popular () {
            let articles = this.articles.slice()
            return articles.sort((a, b) => b.hitCount - a.hitCount).slice(0, 5)
        },
        categories () {
            return this.$store.state['article-categories'].collection.map(category => ({
                ...category,
                articles: category.articles.map(article => this.$store.state.articles.items[article.id])
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>
