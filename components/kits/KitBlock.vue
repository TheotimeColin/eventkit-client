<template>
    <nuxt-link
        class="ArticleBlock"
        :class="{ ...$modifiers }"
        :to="to ? to : { name: 'blog-slug', params: { slug, id } }">

        <div class="ArticleBlock_image" :style="style">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail" />
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
import patterns from '@/config/patterns'

export default {
    name: 'ArticleBlock',
    components: { Tag },
    mixins: [ base ],
    props: {
        id: { type: Number },
        slug: { type: String },
        to: { type: Object },
        title: { type: String },
        excerpt: { type: String },
        thumbnail: { type: Object },
        theme: { type: Object },
        excerptLength: { type: Number, default: 85 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        },
        style () {
            if (!this.$props.theme) return {}

            let patternUrl = ''
            let pattern = patterns[this.$props.theme.pattern.patternUrl]
            if (pattern) {
                patternUrl = pattern(
                    this.$props.theme.pattern.patternColor.replace('#', ''),
                    this.$props.theme.pattern.patternScale,
                    this.$props.theme.pattern.patternOpacity
                )
            }

            return {
                '--background-color': this.$props.theme.background,
                '--background-image': `url("${patternUrl}")`
            }
        }
    }
}
</script>