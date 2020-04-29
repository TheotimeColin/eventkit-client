<template>
    <div class="ArticleBlock ArticleBlock--actions">
        <div class="ArticleBlock_image">
            <img :src="thumbnail" :alt="title" v-if="thumbnail">

            <p class="Tag ArticleBlock_read">
                {{ readTime }} min.
            </p>
        </div>
        <div class="ArticleBlock_content">
            <div>
                <div class="ArticleBlock_title">{{ title }}</div>
                <div class="ArticleBlock_excerpt" v-if="excerpt">{{ shortExcerpt.slice() }}</div>
            </div>
        </div>
        <div class="ArticleBlock_actions">
            <p><nuxt-link :to="{ name: 'blog-slug', params: { slug } }" target="_blank">Voir</nuxt-link></p>
            <p><nuxt-link :to="{ name: 'admin-articles-id', params: { id } }">Éditer</nuxt-link></p>
            <p @click="$emit('delete')">Supprimer</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleBlock',
    props: {
        id: { type: Number },
        title: { type: String },
        excerpt: { type: String },
        slug: { type: String },
        readTime: { type: Number },
        thumbnail: { type: String },
        excerptLength: { type: Number, default: 85 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>