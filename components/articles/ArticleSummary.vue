<template>
    <nuxt-link
        :to="localePath({ name: 'blog-slug', params: { slug, id } })"
        class="ArticleSummary"
        @mouseenter.native="state.hover = true"
        @mouseleave.native="state.hover = false"
    >
        <div class="ArticleSummary_image">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail">
            
            <div class="ArticleSummary_tags">
                <p class="Tag Tag--s" v-if="readTime">
                    {{ readTime }} min. de lecture
                </p>
            </div>
        </div>

        <div class="ArticleSummary_content">
            <div class="ArticleSummary_text">
                <p class="ArticleSummary_date">{{ date }}</p>
                <div class="ArticleSummary_title">{{ title }}</div>
                <div class="ArticleSummary_excerpt" v-if="excerpt">{{ shortExcerpt.slice() }}</div>
            </div>
            <div class="ArticleSummary_cta">
                <button-inline :class="{ 'is-hover': state.hover }">
                    Lire l'article
                </button-inline>
            </div>
        </div>
    </nuxt-link>
</template>
 
<script>
import dayjs from 'dayjs'

export default {
    name: 'ArticleSummary',
    props: {
        id: { type: Number },
        slug: { type: String },
        title: { type: String },
        publishedDate: { type: String },
        excerpt: { type: String },
        readTime: { type: Number },
        thumbnail: { type: Object },
        excerptLength: { type: Number, default: 250 }
    },
    data: () => ({
        state: {
            hover: false
        }
    }),
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        },
        date () {
            return dayjs(this.$props.publishedDate).fromNow()
        }
    }
}
</script>