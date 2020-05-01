<template>
    <div class="ArticlePage Page">
        <div class="Page_content" v-if="article">
            <article>
                <header class="ArticlePage_header">
                    <div class="ArticlePage_cover">
                        <img :src="article.cover">
                    </div>
                    
                    <div class="ArticlePage_titles">
                        <div class="ArticlePage_titlesContainer">
                            

                            <h1 class="ArticlePage_title">{{ article.title }}</h1>

                            <legend class="ArticlePage_excerpt mt-10">
                                {{ article.excerpt }}
                            </legend>

                            <div>
                                <Tag
                                    class="mt-40"
                                    :title="article.category.title"
                                    :id="article.category.id"
                                    v-if="article.category"
                                />
                            </div>

                            <article-author
                                class="mt-20"
                                name="Théotime Colin"
                                :published="publishedDate"
                                description="Théotime a organisé plus de 50 Meetups dans la région Parisienne"
                            />
                        </div>
                    </div>
                </header>

                <div class="ArticlePage_body TextBody" v-html="article.content"></div>
            </article>
        </div>
    </div>
</template>

<script>
import ArticleAuthor from '@/components/articles/ArticleAuthor'
import LinkBase from '@/components/base/LinkBase'
import Tag from '@/components/utils/Tag'

import dayjs from 'dayjs'

export default {
    name: 'ArticlePage',
    components: { ArticleAuthor, LinkBase, Tag },
    data: () => ({
        article: null
    }),
    head () {
        if (!this.article) return

        return {
            title: this.article.title,
            meta: [
                { hid: 'description', name: 'description', content: this.article.excerpt }
            ]
        }
    },
    async fetch () {
        const search = await this.$store.dispatch('articles/get', {
            query: { id: this.$route.params.id, hitCount: true }
        })

        this.$data.article = search
        history.pushState({}, null, this.$data.article.slug)
    },
    computed: {
        publishedDate () {
            let date = dayjs(this.$data.article.publishedDate)
            return `${date.format('D MMM YYYY')} (mis à jour ${date.fromNow()})`
        }
    },
    watch: {
        article: {
            deep: true,
            handler () {
                const metaDescription = document.querySelector('meta[name="description"]')
                if (this.$data.article.title) document.title = this.$data.article.title
                if (this.$data.article.excerpt) metaDescription.setAttribute('content', this.$data.article.excerpt)
            }
        }
    }
}
</script>
