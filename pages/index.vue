<template>
    <div class="HomePage Page bg-bg">
        <div class="Page_content">
            <section class="HomePage_heading" :style="{ '--background': activePage.background }">
                <div class="Wrapper HomePage_titles">
                    <h1 class="ft-title-4xl"><b>Créer, imprimer, découper</b></h1>
                    <p class="ft-l width-xs mv-40">
                        Animez tes événements grâce à nos icebreakers & jeux 100% personnalisables, à imprimer de chez toi. C'est gratuit !
                    </p>
                    <button-base to="kits" :style="{'--background': activePage.accent }">Créer mon kit</button-base>
                </div>

                <div class="HomePage_sliderContainer">
                    <div
                        class="HomePage_sliderPage"
                        v-for="(page, j) in pages"
                        :class="{ 'is-active': j == previous || j == active, 'is-front': j == active }"
                        :key="j"
                    >
                        <div class="HomePage_sliderCard" v-for="i in 12" :key="i">
                            <img :src="page.items[0]">
                        </div>
                    </div>
                </div>
            </section>

            <div class="pv-100 bg-bg">
                <div class="Wrapper">
                    <div class="row">
                        <div class="col-4">

                        </div>
                        <div class="col-6">
                            <h2 class="ft-title-2xl">
                                <b>À quoi ça sert un icebreaker ?</b>
                            </h2>

                            <p class="mt-40 ft-l">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce turpis erat, pretium nec erat nec. Consectetur adipiscing elit. Fusce turpis erat, pretium nec erat nec.
                            </p>
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
                            <div class="width-article-block" v-for="article in category.articles" :key="article.id">
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
import SimpleSlider from '@/components/interactive/SimpleSlider'

import pink1 from '@/assets/img/cards/pink-1.gif'
import blue1 from '@/assets/img/cards/blue-1.gif'
import white1 from '@/assets/img/cards/white-1.gif'
import yellow1 from '@/assets/img/cards/yellow-1.gif'

export default {
    name: 'HomePage',
    components: { SimpleSlider, ArticleBlock },
    async fetch () {
        await this.$store.dispatch('articles/fetch')
        await this.$store.dispatch('article-categories/fetch')
    },
    data: () => ({
        assets: { pink1 },
        pages: [
            {
                accent: '#ff0054',
                background: '#F8EDF8',
                items: [ pink1 ]
            },
            {
                accent: '#028090',
                background: '#E2F7FF',
                items: [ blue1 ]
            },
            {
                accent: '#fdba25',
                background: '#fff2c8',
                items: [ yellow1 ]
            },
            {
                accent: '#414382',
                background: '#F7F2FF',
                items: [ white1 ]
            }
        ],
        previous: 0,
        active: 0
    }),
    computed: {
        activePage () {
            return this.$data.pages[this.$data.active]
        },
        articles () {
            return this.$store.state.articles.collection
        },
        categories () {
            return this.$store.state['article-categories'].collection.map(category => ({
                ...category,
                articles: category.articles.map(article => this.$store.state.articles.items[article.id]).filter(a => a)
            }))
        }
    },
    mounted () {
        setInterval(() => {
            this.$data.previous = this.$data.active
            this.$data.active = this.$data.active >= this.$data.pages.length - 1 ? 0 : this.$data.active + 1

            setTimeout(() => this.$data.previous = null, 2000)
        }, 5000)
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>
