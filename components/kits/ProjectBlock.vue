<template>
    <div
        class="ProjectBlock"
        :class="{ ...$modifiers }"
    >

        <div class="ProjectBlock_image" :style="style">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail" />
        </div>

        <div class="ProjectBlock_content">
            <div>
                <div class="ProjectBlock_title">
                    {{ title }}
                </div>

                <p class="ProjectBlock_excerpt" v-if="project && project.ideas">
                    {{ project.kit.title }} - {{ project.ideas.length }} questions
                </p>
            </div>

            <div class="ProjectBlock_cta">
                <button-base
                    :modifiers="['xs', 'secondary']"
                    :to="to ? to : { name: 'kits-slug-id', params: { slug: kit.slug, id: project.id } }"
                >
                    Éditer
                </button-base>
            </div>
        </div>

        <action-menu
            class="ProjectBlock_actions"
            :items="[
                { id: 0, label: 'Supprimer', onClick: () => onDelete() }
            ]"
        />
    </div>
</template>

<script>
import Tag from '@/components/utils/Tag'
import ActionMenu from '@/components/interactive/ActionMenu'
import base from '@/utils/base'
import patterns from '@/config/patterns'

export default {
    name: 'ProjectBlock',
    components: { Tag, ActionMenu },
    mixins: [ base ],
    props: {
        id: { type: String },
        to: { type: Object },
        title: { type: String },
        thumbnail: { type: Object },
        theme: { type: Object },
        project: { type: Object },
        kit: { type: Object }
    },
    computed: {
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
                '--color': this.$props.theme.color,
                '--font-family': this.$props.theme.font.fontFamily,
                '--background-color': this.$props.theme.background,
                '--background-image': `url("${patternUrl}")`
            }
        }
    },
    methods: {
        onDelete () {
            this.$store.commit('utils/confirmPrompt', {
                active: true,
                onConfirm: async () => {
                    await this.$store.dispatch('kits/project/delete', {
                        data: { _id: this.$props.project._id }
                    })

                    this.$emit('delete')
                },
                confirmText: 'Supprimer'
            })
            
        }
    }
}
</script>