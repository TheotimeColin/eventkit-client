<template>
    <nuxt-link class="ArticleBlock" :to="{ name: 'blog-slug', params: { slug: slug } }">
        <div class="ArticleBlock_image">
            <img :src="cover" :alt="title" v-if="cover">

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
    </nuxt-link>
</template>

<script>
export default {
    name: 'ArticleBlock',
    props: {
        title: { type: String },
        excerpt: { type: String },
        slug: { type: String },
        readTime: { type: Number },
        cover: { type: String },
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