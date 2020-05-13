<template>
    <div class="ArticleBlock ArticleBlock--actions">
        <div class="ArticleBlock_image">
            <img :src="article.thumbnail.src" :alt="article.thumbnail.alt" v-if="article.thumbnail">

            <p class="Tag ArticleBlock_read">
                {{ article.readTime }} min.
            </p>
        </div>
        <div class="ArticleBlock_content">
            <div>
                <div class="ArticleBlock_title">{{ article.title }}</div>
                <div class="ArticleBlock_excerpt" v-if="article.excerpt">{{ shortExcerpt }}</div>
            </div>
        </div>
        <div class="ArticleBlock_stats">
            Vues : {{ article.hitCount }}

            <div class="d-inline-block mh-10" v-for="reaction in article.reactions" :key="reaction._id">
                {{ reaction.type.emoji }} {{ reaction.uniqueCount }}
            </div>
        </div>
        <div class="ArticleBlock_actions">
            <p><button-base :to="{ name: 'blog-slug', params: { slug: article.slug, id: article.id } }" target="_blank">Voir</button-base></p>
            <p><button-base :to="{ name: 'admin-articles-id', params: { id: article.id } }">Éditer</button-base></p>
            <p><span @click="$store.commit('utils/confirmPrompt', {
                active: true,
                onConfirm: () => $emit('delete'),
                confirmText: 'Supprimer'
            })">Supprimer</span></p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleBlock',
    props: {
        article: { type: Object },
        excerptLength: { type: Number, default: 100 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.article.excerpt.substr(0, this.$props.article.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.article.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.article.excerpt
        }
    }
}
</script>