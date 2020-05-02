<template>
    <component
        :is="slug ? 'nuxt-link' : 'div'"
        class="CategoryBlock"
        :class="{ 'is-selected': selected, ...$modifiers }"
        :to="{ name: 'blog-slug', params: { slug, id } }"
    >
        <div class="CategoryBlock_image">
            <img :src="thumbnail" :alt="title" v-if="thumbnail">
        </div>
        <div class="CategoryBlock_content">
            <div>
                <div class="CategoryBlock_title">{{ title }}</div>
                <div class="CategoryBlock_description">{{ subtitle }}</div>
            </div>

            <input type="checkbox" :checked="checked">
        </div>
    </component>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'CategoryBlock',
    mixins: [ base ],
    props: {
        id: { type: Number },
        slug: { type: String },
        selected: { type: Boolean, default: false },
        checked: { type: Boolean, default: false },
        title: { type: String },
        subtitle: { type: String },
        thumbnail: { type: String },
    }
}
</script>