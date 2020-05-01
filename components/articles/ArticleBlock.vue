<template>
    <nuxt-link class="ArticleBlock" :to="{ name: 'blog-id', params: { id } }">
        <div class="ArticleBlock_image">
            <img :src="thumbnail" :alt="title" v-if="thumbnail">

            <div class="ArticleBlock_tags">
                <p class="Tag" v-if="category">
                    {{ category.title }}
                </p>
                
                <p class="Tag" v-if="readTime">
                    {{ readTime }} min.
                </p>
            </div>
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
        id: { type: Number },
        title: { type: String },
        excerpt: { type: String },
        category: { type: Object },
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