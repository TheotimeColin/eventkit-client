<template>
    <div
        class="KitSection"
    >
        <div class="KitSection_image">
            <img :src="thumbnail.src">
        </div>
        <div class="KitSection_content">
            <div>
                <p class="ft-title-xl">
                    <b>{{ title }}</b>
                </p>

                <p class="mt-10">{{ shortExcerpt }}</p>
            </div>

            <div class="KitSection_tags">
                <tag class="KitSection_tag" v-for="(tag, i) in tags" :modifiers="['outline']" :title="tag" :key="i" />
            </div>
            
            <div class="KitSection_actions">
                <button-base :modifiers="['secondary']">
                    En savoir plus
                </button-base>
                <button-base :modifiers="[]">
                    Créer un kit personnalisé
                </button-base>
            </div>

            <action-menu class="KitSection_options" :items="[
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
    name: 'KitSection',
    components: { ActionMenu, Tag },
    props: {
        id: { type: String },
        editable: { type: Boolean, default: false },
        tags: { type: Array, default: () => [] },
        to: { type: Object },
        title: { type: String },
        excerpt: { type: String },
        thumbnail: { type: Object },
        excerptLength: { type: Number, default: 80 }
    },
    computed: {
        shortExcerpt () {
            let excerpt = this.$props.excerpt.substr(0, this.$props.excerpt.lastIndexOf(' ', this.$props.excerptLength));
            return this.$props.excerpt.length > this.$props.excerptLength ? excerpt + '...' : this.$props.excerpt
        }
    }
}
</script>