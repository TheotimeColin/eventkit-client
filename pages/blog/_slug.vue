<template>
    <div class="ArticlePage Page">
        <div class="Page_content" v-if="article">
            <div class="Wrapper pt-100">
                <article class="max-width-s">
                    <h1 class="ArticlePage_title">{{ article.title }}</h1>

                    <article-author
                        class="mt-40 mb-20"
                        name="Théotime Colin"
                        published="Publié le 2 avril 2020"
                        description="Théotime a organisé plus de 50 Meetups dans la région Parisienne"
                    />
                    
                    <div class="ArticlePage_cover">
                        <img :src="article.cover">
                    </div>

                    <legend class="ArticlePage_excerpt mt-20">
                        {{ article.excerpt }}
                        Tentez aussi ces <link-base href="test" :context="{ title: article.title, description: article.excerpt, cover: article.cover }">5 astuces</link-base> pour améliorer le référencement de votre Meetup.
                    </legend>

                    <div class="TextBody mt-60" v-html="article.content"></div>
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
