<template>
    <nuxt-link :to="{ name: 'blog-slug', params: { slug, id } }" class="ArticleFeatured">
        <div class="ArticleFeatured_image">
            <img :src="thumbnail" :alt="title" v-if="thumbnail">
        </div>

        <div class="ArticleFeatured_content">
            <div>
                <div class="ArticleFeatured_title">{{ title }}</div>
                <div class="ArticleFeatured_excerpt" v-if="excerpt">{{ shortExcerpt.slice() }}</div>
            </div>
        </div>
    </nuxt-link>
</template>
 
<script>
export default {
    name: 'ArticleFeatured',
    props: {
        id: { type: Number },
        slug: { type: String },
        title: { type: String },
        excerpt: { type: String },
        readTime: { type: Number },
        thumbnail: { type: String },
        excerptLength: { type: Number, default: 150 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>

<style>
</style>
