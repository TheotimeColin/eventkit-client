<template>
    <div
        class="IdeaPack"
        :class="{ 'is-active': state.active }"
        :style="{ '--color-1': localPack.color1, '--color-2': localPack.color2 }"
    >
        <div class="IdeaPack_cover" @click="state.active = !state.active">
            <div class="IdeaPack_coverContainer">
                <p class="IdeaPack_coverTitle">{{ localPack.title }}</p>

                <div class="IdeaPack_previewLength">
                    <b>{{ ideas.length }}</b>
                    <p class="fx-shrink">{{ localPack.description }}</p>
                </div>

                <div class="IdeaPack_preview">
                    <div class="IdeaPack_previewRail">
                        <p class="IdeaPack_previewItem" v-for="value in ideas.slice(0, 5)" :key="value._id">
                            {{ value.content.main }}
                        </p>
                        <p class="IdeaPack_previewItem" v-for="(value, i) in ideas.slice(0, 5)" :key="value._id + i">
                            {{ value.content.main }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="IdeaPack_ideas">
            <data-row
                class="IdeaPack_idea"
                v-for="value in localPack.ideas"
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

import DataRow from '@/components/generators/DataRow'

export default {
    name: 'IdeaPack',
    components: { DataRow },
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
            this.$store.dispatch('generators/packs/post', {
                data: this.$data.localPack
            })
        }
    }
}
</script>