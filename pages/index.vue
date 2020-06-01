<template>
    <div class="HomePage Page bg-bg">
        <div class="Page_content">
            <section class="HomePage_heading" :style="{ '--background': activePage.background }">
                <div class="Wrapper HomePage_titles">
                    <h1 class="ft-title-4xl max-width-s"><b>{{ $t('pages.home.main') }}</b></h1>
                    <p class="ft-l width-xs mt-20 mb-40" v-html="$t('pages.home.subtitle')"></p>

                    <button-base to="kits" :style="{'--background': activePage.accent }">
                        {{ $t('pages.home.cta') }}
                    </button-base>
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

            <div class="pv-60 bg-bg-light o-hidden">
                <div class="Wrapper">
                   <simple-slider>
                       <template slot="title">
                            <div class="d-flex fx-align-end">
                                <nuxt-link class="ft-title-xl mr-20 line-1" :to="localePath({ name: 'kits' })">
                                    <b>{{ $t('pages.home.kits') }}</b>
                                </nuxt-link>

                                <button-inline :to="localePath({ name: 'kits' })">
                                    {{ $t('common.seeAll') }}
                                </button-inline>
                            </div>
                        </template>

                        <div class="width-kit-block" v-for="kit in kits" :key="kit._id">
                            <kit-block
                                :id="kit._id"
                                :slug="kit.slug"
                                :title="kit.title"
                                :compact="true"
                                :excerpt="kit.excerpt"
                                :thumbnail="kit.thumbnail"
                            />
                        </div>
                    </simple-slider>
                </div>
            </div>

            <div class="pv-20 bg-bg-weak o-hidden">
                <div class="Wrapper">
                    <div class="mv-40" v-for="category in categories" :key="category.id">
                        <simple-slider>
                            <template slot="title">
                                <div class="d-flex fx-align-end">
                                    <nuxt-link class="ft-title-xl mr-20 line-1" :to="localePath({ name: 'blog', query: { category: category.slug } })">
                                        <b>{{ category.subtitle }}</b>
                                    </nuxt-link>

                                    <button-inline :to="localePath({ name: 'blog', query: { category: category.slug } })">
                                        {{ $t('pages.home.articles') }}
                                    </button-inline>
                                </div>
                            </template>
                            <div class="width-article-block" v-for="article in category.articles" :key="article.id">
                                <article-block
                                    :title="article.title"
                                    :category="category"
                                    :id="article.id"
                                    :slug="article.slug"
                                    :read-time="article.readTime"
                                    :excerpt="article.excerpt"
                                    :thumbnail="article.thumbnail"
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
import KitBlock from '@/components/kits/KitBlock'

import pink1 from '@/assets/img/cards/pink-1.gif'
import blue1 from '@/assets/img/cards/blue-1.gif'
import white1 from '@/assets/img/cards/white-1.gif'
import yellow1 from '@/assets/img/cards/yellow-1.gif'

export default {
    name: 'HomePage',
    components: { SimpleSlider, ArticleBlock, KitBlock },
    async fetch () {
        await this.$store.dispatch('articles/fetch')
        await this.$store.dispatch('article-categories/fetch')
        await this.$store.dispatch('kits/fetch')
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
        kits () {
            return this.$store.state.kits.collection
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
    },
    head () {
        return {
            htmlAttrs: { prefix: 'og: http://ogp.me/ns#' },
            title: this.$t(`pages.home.title`),
            meta: [
                { hid: 'description', name: 'description', content: this.$t(`seo.description`) },
                { property: 'og:description', content: this.$t(`pages.home.subtitle`) }
            ]
        }
    }
}
</script>