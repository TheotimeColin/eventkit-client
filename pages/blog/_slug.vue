<template>
    <div class="ArticlePage Page">
        <div class="Page_content" v-if="article">
            <div class="Wrapper pt-60">
                <article class="max-width-s">
                    <h1 class="ArticlePage_title">{{ article.title }}</h1>

                    <legend class="ArticlePage_excerpt mt-10">
                        {{ article.excerpt }}
                    </legend>

                    <article-author
                        class="mt-60 mb-20"
                        name="Théotime Colin"
                        published="Publié le 2 avril 2020"
                        description="Théotime a organisé plus de 50 Meetups dans la région Parisienne"
                    />
                    
                    <div class="ArticlePage_cover">
                        <img :src="article.cover">
                    </div>

                    <div class="TextBody mt-60 mb-100" v-html="article.content"></div>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleAuthor from '@/components/articles/ArticleAuthor'
import LinkBase from '@/components/base/LinkBase'

export default {
    name: 'ArticlePage',
    components: { ArticleAuthor, LinkBase },
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
        const search = await this.$store.dispatch('modules/articles/get', {
            query: { slug: this.$route.params.slug }
        })

        if (search[0]) this.$data.article = search[0]
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
