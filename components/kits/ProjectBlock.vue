<template>
    <nuxt-link
        class="ProjectBlock"
        :class="{ ...$modifiers, 'is-loading': !project }"
        :to="project ? (to ? localePath(to) : localePath({ name: 'kits-slug-id', params: { slug: kit.slug, id: project.id }})) : {}"
    >

        <div class="ProjectBlock_image" :style="style" v-if="project">
            <img :src="thumbnail.src" :alt="thumbnail.alt" v-if="thumbnail" />
        </div>

        <div class="ProjectBlock_content" v-if="title && project && kit">
            <div class="ProjectBlock_title">
                {{ title }}
            </div>

            <p class="ProjectBlock_excerpt" v-if="project && project.ideas">
                {{ project.kit.title }} - {{ project.ideas.length }} questions
            </p> 
        </div>

        <action-menu
            class="ProjectBlock_actions"
            :items="[
                { id: 0, label: $t('common.delete'), onClick: () => onDelete() }
            ]"
            v-if="project"
        />
    </nuxt-link>
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
                    this.$props.theme.colors.patternColor.replace('#', ''),
                    this.$props.theme.pattern.patternScale,
                    this.$props.theme.pattern.patternOpacity
                )
            }

            return {
                '--color': this.$props.theme.colors.color,
                '--font-family': this.$props.theme.font.fontFamily,
                '--background-color': this.$props.theme.colors.backgroundColor,
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