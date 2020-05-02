<template>
    <div class="BlogPage Page bg-bg">
        <div class="Page_content bg-bg">
            <div class="bg-bg pv-40 o-hidden">
                <simple-slider>
                    <div v-for="(category, i) in categories" :key="i">
                        <category-block
                            :modifiers="['s']"
                            :title="category.title"
                            :subtitle="category.subtitle"
                            :selected="category.selected || noSelection"
                            :checked="category.selected"
                            class="category-block"
                            @click.native="selectCategory(category)"
                        />
                    </div>
                </simple-slider>
            </div>

            <div class="bg-bg-xweak">
                <div class="Wrapper pv-20">
                    <div class="max-width-m">
                        <div v-for="article in articles" :key="article.id">
                            <article-summary
                                :title="article.title"
                                :id="article.id"
                                :slug="article.slug"
                                :published-date="article.publishedDate"
                                :read-time="article.readTime"
                                :excerpt="article.excerpt"
                                :thumbnail="article.thumbnail"
                                class="article-summary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CategoryBlock from '@/components/utils/CategoryBlock'
import ArticleSummary from '@/components/articles/ArticleSummary'
import SimpleSlider from '@/components/interactive/SimpleSlider'

export default {
    name: 'BlogPage',
    components: { CategoryBlock, ArticleSummary, SimpleSlider },
    async fetch () {
        await this.$store.dispatch('articles/fetch')
        await this.$store.dispatch('article-categories/fetch')
    },
    data: () => ({
        categories: []
    }),
    computed: {
        articles () {
            return this.$store.state.articles.collection
        },
        noSelection () {
            return this.$data.categories.filter(category => category.selected).length <= 0
        }
    },
    mounted () {
        this.$data.categories = this.$store.state['article-categories'].collection.map(c => ({
            ...c,
            selected: false
        }))
    },
    methods: {
        selectCategory (category) {
            this.$data.categories = this.$data.categories.map(c => ({
                ...c,
                selected: c.id == category.id ? !c.selected : c.selected
            }))
        }
    }
}
</script>

<style lang="scss" scoped>
    .category-block {
        width: 300px;
        user-select: none;
        -webkit-user-drag: none;
    }

    .article-summary {
        margin: 60px 0;
    }
</style>