<template>
    <div
        class="IdeaPack"
        :class="{ 'is-active': state.active }"
        :style="{ '--color-1': localPack.color1, '--color-2': localPack.color2 }"
    >
        <div class="IdeaPack_cover" @click="state.active = !state.active" :style="cover">
            <div class="IdeaPack_coverContainer">
                <p class="IdeaPack_previewLength">{{ ideas.length }}</p>
                <p class="ml-10 fx-shrink">{{ localPack.description }}</p>
            </div>

            <p class="IdeaPack_coverTitle">{{ localPack.title }}</p>

            <action-menu class="IdeaPack_options" :items="[
                { id: 0, label: 'Éditer', onClick: () => $emit('edit') },
                { id: 1, label: 'Supprimer', onClick: () => $emit('delete') },
            ]" v-if="updateMode" />
        </div>

        <div class="IdeaPack_ideas">
            <data-row
                class="IdeaPack_idea"
                v-for="value in displayedIdeas"
                :value="value"
                @input="(v) => value = v"
                @select="(v) => $emit('select', v)"
                @deselect="(v) => $emit('deselect', v)"
                @delete="onDeleteValue"
                :selectable="!updateMode"
                :selected="isSelected(value)"
                :key="value._id"
            />

            <data-row
                class="IdeaPack_idea"
                :new-row="true"
                @click.native="onAddIdea"
                v-if="canAdd && updateMode"
            />
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'
import patterns from '@/config/patterns'

import DataRow from '@/components/generators/DataRow'
import ActionMenu from '@/components/interactive/ActionMenu'

export default {
    name: 'IdeaPack',
    components: { DataRow, ActionMenu },
    props: {
        pack: { type: Object },
        updateMode: { type: Boolean, default: false },
        values: { type: Array },
        defaultValue: { type: Object }
    },
    data: () => ({
        state: {
            active: false
        },
        localPack: null
    }),
    computed: {
        canAdd () {
            let last = this.$data.localPack[this.$data.localPack.length - 1]
            return last && last.content ? last.content.main != '' : true
        },
        ideas () {
            return this.$data.localPack.ideas.filter(idea => idea.content)
        },
        displayedIdeas () {
            return this.ideas.slice(0, 2)
        },
        cover () {
            if (!this.$props.pack.pattern) return {}

            let patternUrl = ''
            let pattern = patterns[this.$props.pack.pattern.patternUrl]

            if (pattern) {
                patternUrl = pattern(
                    this.$props.pack.pattern.patternColor.replace('#', ''),
                    this.$props.pack.pattern.patternScale,
                    this.$props.pack.pattern.patternOpacity
                )
            }
            
            return {
                color: this.$props.pack.color2,
                backgroundColor: this.$props.pack.color1,
                backgroundImage: `url("${patternUrl}")`
            }
        }
    },
    watch: {
        pack: {
            immediate: true,
            deep: true, 
            handler (v) {
                this.$data.localPack = JSON.parse(JSON.stringify(v))
            }
        }
    },
    methods: {
        isSelected (option) {
            if (!option.content) return false
            return this.$props.values ? this.$props.values.filter(v => v.content && v.content.main == option.content.main).length > 0 : false
        },
        onDeleteValue (id) {
            this.$data.localPack.ideas = this.$data.localPack.ideas.filter(idea => idea._id != id)

            this.update()
        },
        onAddIdea () {
            this.$data.localPack.ideas.push({
                _id: shortid.generate(),
                new: true,
                content: null
            })

            this.update()
        },
        update (v) {
            this.$store.dispatch('kits/packs/post', {
                data: this.$data.localPack
            })
        }
    }
}
</script>