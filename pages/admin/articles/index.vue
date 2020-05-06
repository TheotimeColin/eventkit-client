<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <button-base :to="{ name: 'admin-articles-id', params: { id: 'new' } }">
                    Nouvel article
                </button-base>

                <div class="row fx-wrap">
                    <div class="col-4" v-for="article in articles" :key="article.id">
                        <article-block-actions
                            class="article-block"
                            :article="article"
                            @delete="onDelete(article.id)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleBlockActions from '@/components/admin/articles/ArticleBlockActions'

export default {
    name: 'HomePage',
    layout: 'admin',
    components: { ArticleBlockActions },
    async fetch () {
        await this.$store.dispatch('articles/fetch', {
            query: { published: false }
        })
    },
    data: () => ({
        featured: null
    }),
    computed: {
        articles () {
            return this.$store.state.articles.collection
        }
    },
    methods: {
        async onDelete (id) {
            await this.$store.dispatch('articles/delete', {
                data: { id }
            })

            this.$store.dispatch('articles/fetch', {
                query: { published: false }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>