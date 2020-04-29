<template>
    <div class="ArticlePage">
        <div v-if="article">
            <div class="ArticlePage_cover">
                <img :src="article.cover">
            </div>

            <div class="Wrapper">
                <div class="max-width-s">
                    <h1 class="ft-title-3xl color-ft-strong mt-60">{{ article.title }}</h1>
                    <p class="ArticlePage_excerpt mt-20">{{ article.excerpt }}</p>

                    <div class="TextBody mt-60" v-html="article.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticlePage',
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
