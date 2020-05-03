<template>
    <nuxt-link
        class="ArticleBlock"
        :class="{ ...$modifiers }"
        :to="{ name: 'blog-slug', params: { slug, id } }">
        <div class="ArticleBlock_image">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail" />

            <div class="ArticleBlock_tags">
                <Tag :modifiers="['s']" :title="category.title" :id="category.id" v-if="category" />

                <p class="Tag Tag--s" v-if="readTime">
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
import Tag from '@/components/utils/Tag'
import base from '@/utils/base'

export default {
    name: 'ArticleBlock',
    components: { Tag },
    mixins: [ base ],
    props: {
        id: { type: Number },
        slug: { type: String },
        title: { type: String },
        excerpt: { type: String },
        category: { type: Object },
        readTime: { type: Number },
        thumbnail: { type: Object },
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