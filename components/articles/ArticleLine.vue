<template>
    <nuxt-link class="ArticleLine" :to="localePath({ name: 'blog-slug', params: { slug, id } })">
        <div class="ArticleLine_number">
            {{ rankingString }}
        </div>
        <div class="ArticleLine_content">
            <div class="ArticleLine_title">{{ title }}</div>
            <!-- <div class="ArticleBlock_excerpt" v-if="excerpt">{{ shortExcerpt.slice() }}</div> -->
        </div>
    </nuxt-link>
</template>

<script>
export default {
    name: 'ArticleLine',
    props: {
        id: { type: Number },
        slug: { type: String },
        ranking: { type: Number, default: 0 },
        title: { type: String },
        excerpt: { type: String },
        excerptLength: { type: Number, default: 85 }
    },
    computed: {
        rankingString () {
            return this.$props.ranking < 10 ? '0' + this.$props.ranking : this.$props.ranking
        },
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>