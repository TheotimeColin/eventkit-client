<template>
    <div class="pv-60 bg-bg-weak Admin">
        <div class="Wrapper">
            <nuxt-link :to="{ name: 'admin-articles-id', params: { id: 'new' } }">Nouvel article</nuxt-link>

            <div class="row fx-wrap">
                <div class="col-4" v-for="article in articles" :key="article.id">
                    <article-block-actions
                        class="article-block"
                        :id="article.id"
                        :title="article.title"
                        :slug="article.slug"
                        :read-time="article.readTime"
                        :excerpt="article.excerpt"
                        :thumbnail="article.thumbnail"
                        @delete="onDelete(article.id)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleBlockActions from '@/components/admin/articles/ArticleBlockActions'

export default {
    name: 'HomePage',
    components: { ArticleBlockActions },
    async fetch () {
        await this.$store.dispatch('modules/articles/fetch')
    },
    data: () => ({
        featured: null
    }),
    computed: {
        articles () {
            return this.$store.state.modules.articles.items
        }
    },
    methods: {
        async onDelete (id) {
            await this.$store.dispatch('modules/articles/delete', {
                data: { id }
            })

            this.$store.dispatch('modules/articles/fetch')
        }
    }
}
</script>

<style lang="scss" scoped>
    .article-block {
        margin: 20px 0;
    }
</style>