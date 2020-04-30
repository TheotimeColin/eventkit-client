<template>
    <div class="HomePage Page bg-bg-xweak">
        <div class="Page_content">
            <div class="pv-60">
                <div class="Wrapper">
                    <div class="row">
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

export default {
    name: 'HomePage',
    components: { ArticleBlock, ArticleFeatured },
    async fetch () {
        await this.$store.dispatch('modules/articles/fetch')
    },
    computed: {
        featured () {
            return this.$store.state.modules.articles.items[0]
        },
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
