<template>
    <div class="HomePage Page bg-bg">
        <div class="Page_content">
            <div class="pb-60">
                <div class="Wrapper">
                    <div class="row-xs fx-center fx-align-stretch">
                        <div class="col-8">
                            <article-block
                                :modifiers="['image', 'full']"
                                :title="featured.title"
                                :id="featured.id"
                                :slug="featured.slug"
                                :read-time="featured.readTime"
                                :excerpt="featured.excerpt"
                                :excerpt-length="300"
                                :thumbnail="featured.cover"
                                v-if="featured"
                            />
                        </div>
                        <div class="col-4">
                            <div class="HomePage_popular">
                                <article-block
                                    :modifiers="['image']"
                                    class="HomePage_popularArticle"
                                    v-for="(article, i) in popular.slice(1, 3)" 
                                    :ranking="i + 1"
                                    :thumbnail="article.cover"
                                    :title="article.title"
                                    :read-time="article.readTime"
                                    :id="article.id"
                                    :slug="article.slug"
                                    :key="article.id"
                                />
                                <!-- <div class="d-flex fx-align-center fx-justify-between mb-20">
                                    <p class="ft-title-l">
                                        <b>Articles populaires</b>
                                    </p>
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
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pv-20 bg-bg-weak o-hidden">
                <div class="Wrapper">
                    <div class="mv-40" v-for="category in categories" :key="category.id">
                        <div class="d-flex fx-align-center fx-justify-between">
                            <nuxt-link class="ft-title-l mr-20 mb-5" :to="{ name: 'blog', query: { category: category.slug } }">
                                <b>{{ category.subtitle }}</b>
                            </nuxt-link>
                            <button-inline :to="{ name: 'blog', query: { category: category.slug } }">
                                Plus d'articles
                            </button-inline>
                        </div>

                        <simple-slider>
                            <div class="col-4" v-for="article in category.articles" :key="article.id">
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
                        </simple-slider>
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
import SimpleSlider from '@/components/interactive/SimpleSlider'

export default {
    name: 'HomePage',
    components: { SimpleSlider, ArticleBlock, ArticleFeatured, ArticleLine },
    async fetch () {
        await this.$store.dispatch('articles/fetch')
        await this.$store.dispatch('article-categories/fetch')
    },
    computed: {
        featured () {
            return this.popular[0] ? this.popular[0] : false
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
                articles: category.articles.map(article => this.$store.state.articles.items[article.id]).filter(a => a)
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
