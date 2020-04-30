<template>
    <div class="ArticleAuthor" @mouseenter="onHover(true)" @mouseleave="onHover(false)">
        <div class="ArticleAuthor_image">
            <img :src="image">
        </div>
        <div class="ArticleAuthor_text">
            <p>{{ name }}</p>
            <p class="ArticleAuthor_description">{{ published }}</p>
        </div>
    </div>
</template>

<script>
import utils from '@/mixins/utils'

export default {
    name: 'ArticleAuthor',
    mixins: [ utils ],
    props: {
        image: { type: String, default: 'https://secure.meetupstatic.com/photos/member/3/b/d/b/member_291615323.jpeg' },
        name: { type: String, default: '' },
        published: { type: String, default: '' },
        description: { type: String, default: '' }
    },
    methods: {
        onHover (v) {
            this.onContext(v, {
                cover: this.$props.image,
                title: this.$props.name,
                description: this.$props.description,
                to: { name: 'about' }
            })
        }
    }
}
</script>