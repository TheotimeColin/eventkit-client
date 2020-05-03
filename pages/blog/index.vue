<template>
    <div class="BlogPage Page bg-bg">
        <div class="Page_content bg-bg">
            <div class="bg-bg pv-40 o-hidden">
                <simple-slider class="Wrapper">
                    <div v-for="(category, i) in categories" :key="i">
                        <category-block
                            :modifiers="['s']"
                            :title="category.title"
                            :subtitle="category.description"
                            :thumbnail="category.thumbnail"
                            :selectable="true"
                            :selected="category.selected || noSelection"
                            :checked="category.selected"
                            class="category-block"
                            @click.native="selectCategory(category)"
                        />
                    </div>
                </simple-slider>
            </div>

            <div class="bg-bg-xweak o-hidden p-relative">
                <div class="Wrapper pv-20">
                    <div class="max-width-m">
                        <transition-group :name="state.mounted ? 'appear-simple' : 'none'">
                            <article-summary
                                v-for="article in articlesResult"
                                :title="article.title"
                                :id="article.id"
                                :slug="article.slug"
                                :published-date="article.publishedDate"
                                :read-time="article.readTime"
                                :excerpt="article.excerpt"
                                :thumbnail="article.thumbnail"
                                class="article-summary"
                                :key="article.id"
                            />
                        </transition-group>
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
        state: {
            mounted: false
        },
        categories: []
    }),
    computed: {
        articles () {
            return this.$store.state.articles.collection
        },
        articlesResult () {
            if (this.noSelection) return this.articles
            
            return this.articles.filter(article => {
                let selected = false 

                this.selectedCategories.forEach(category => {
                    if (article.category && category.id == article.category.id) selected = true
                })

                return selected
            })
        },
        selectedCategories () {
            return this.$data.categories.filter(category => category.selected)
        },
        noSelection () {
            return this.selectedCategories.length <= 0
        }
    },
    watch: {
        selectedCategories (v) {
            let allSelected = v.length >= this.$data.categories.length
            this.$router.push({ query: { category: v.length > 0 && !allSelected ? v.map(c => c.slug).join(',') : undefined }})
        }
    },
    mounted () {
        const initialCategories = this.$route.query.category ? this.$route.query.category.split(',') : []

        this.$data.categories = this.$store.state['article-categories'].collection.map(c => ({
            ...c,
            selected: initialCategories.filter(i => c.slug == i).length > 0
        }))

        this.$nextTick(() => this.$data.state.mounted = true)
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
        width: 350px;
    }

    .article-summary {
        margin: 60px 0;
    }
</style>