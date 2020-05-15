<template>
    <div
        class="KitBlock"
    >
        <div class="KitBlock_image">
            <img :src="thumbnail.src">
        </div>
        <div class="KitBlock_content">
            <div>
                <p class="ft-title-xl">
                    <b>{{ title }}</b>
                </p>

                <p class="mt-10">{{ shortExcerpt }}</p>
            </div>

            <div class="KitBlock_tags">
                <tag class="KitBlock_tag" v-for="(tag, i) in tags" :modifiers="['outline']" :title="tag" :key="i" />
            </div>
            
            <div class="KitBlock_actions">
                <button-base :modifiers="['secondary', 's']" :to="{ name: 'kits-slug', params: { slug } }">
                    En savoir plus
                </button-base>
                <button-base :modifiers="['s']" :to="{ name: 'kits-slug-id', params: { slug, id: 'new' } }">
                    Créer un kit personnalisé
                </button-base>
            </div>

            <action-menu class="KitBlock_options" :items="[
                { label: 'Éditer', to: { name: 'admin-kits-id', params: { id } }},
                { label: 'Supprimer', to: { name: 'admin-kits-id', params: { id } }}
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
        slug: { type: String },
        editable: { type: Boolean, default: false },
        tags: { type: Array, default: () => [] },
        to: { type: Object },
        title: { type: String },
        excerpt: { type: String },
        thumbnail: { type: Object },
        excerptLength: { type: Number, default: 200 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>