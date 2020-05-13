<template>
    <component
        :is="slug ? 'nuxt-link' : 'div'"
        class="CategoryBlock"
        :class="{ 'CategoryBlock--selectable': selectable, 'is-selected': selected, 'is-checked': checked, ...$modifiers }"
        :to="localePath({ name: 'blog-slug', params: { slug, id } })"
    >
        <div class="CategoryBlock_image">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail">
        </div>
        <div class="CategoryBlock_content">
            <div class="CategoryBlock_title">{{ title }}</div>
            <div class="CategoryBlock_description">{{ subtitle }}</div>
        </div>

        <input class="CategoryBlock_check" type="checkbox" :checked="checked" v-if="selectable">
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
        selectable: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        checked: { type: Boolean, default: false },
        title: { type: String },
        subtitle: { type: String },
        thumbnail: { type: Object },
    }
}
</script>