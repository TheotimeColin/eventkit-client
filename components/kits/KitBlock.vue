<template>
    <div
        class="KitBlock"
        :class="{ 'KitBlock--compact': compact }"
    >
        <div class="KitBlock_image" v-if="thumbnail">
            <img :src="thumbnail.src">
        </div>

        <div class="KitBlock_content">
            <div>
                <p class="KitBlock_title">
                    <b>{{ title }}</b>
                </p>

                <div class="KitBlock_tags" v-if="tags && tags.length > 0">
                    <tag class="KitBlock_tag" v-for="(tag, i) in tags" :modifiers="['outline', 's']" :title="tag" :key="i" />
                </div>

                <div class="mt-10 mb-30">
                    {{ shortExcerpt }}

                    <link-base :to="{ name: 'kits-slug', params: { slug } }">
                        {{ $t('common.readMore') }}
                    </link-base>
                </div>
            </div>
            
            <div class="KitBlock_actions">
                <button-base :modifiers="['s', 'secondary']" :to="{ name: 'kits-slug-id', params: { slug, id: 'new' } }">
                    {{ $t('comp.kitBlock.create') }}
                </button-base>
            </div>

            <action-menu class="KitBlock_options" :items="[
                { label: $t('common.edit'), to: localePath({ name: 'admin-kits-id', params: { id } }) },
                { label: $t('common.delete'), to: localePath({ name: 'admin-kits-id', params: { id } }) }
            ]" v-if="editable" />
        </div>
    </div>
</template>

<script>
import ActionMenu from '@/components/interactive/ActionMenu'
import Tag from '@/components/utils/Tag'

export default {
    name: 'KitBlock',
    components: { ActionMenu, Tag },
    props: {
        id: { type: String },
        slug: { type: String },
        compact: { type: Boolean, default: false },
        editable: { type: Boolean, default: false },
        tags: { type: Array, default: () => [] },
        title: { type: String },
        excerpt: { type: String },
        thumbnail: { type: Object },
        theme: { type: Object },
        excerptLength: { type: Number, default: 120 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>