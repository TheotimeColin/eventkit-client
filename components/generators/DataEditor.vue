<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localData">
        <nav-bar class="DataEditor_nav" :modifiers="['secondary']" :current="state.current" :items="[
            { id: 'data', label: 'Cartes', count: localData.length, onClick: () => state.current = 'data' },
            { id: 'idea', label: 'Packs idées', fa: 'lightbulb', onClick: () => state.current = 'idea' }
        ]" />

        <div class="p-20">
            <template v-if="state.current == 'data'">
                <data-row
                    class="DataEditor_row"
                    :new-row="true"
                    @click.native="onAddRow"
                    v-if="canAdd"
                />

                <draggable v-model="localData" handle=".handle" @start="state.drag = true" @end="() => { update(); state.drag = false; }">
                    <transition-group type="transition">
                        <data-row
                            class="DataEditor_row"
                            v-for="value in reversed"
                            :value="value"
                            @input="onUpdateValue"
                            @select="(v) => $emit('select', v)"
                            @delete="onDeleteValue"
                            @submit="onAddRow"
                            :key="value._id"
                        />
                    </transition-group>
                </draggable>
            </template>
            <template v-if="state.current == 'idea'">
                <creative-center
                    :project="project"
                    @select="(v) => selected = v"
                />
            </template> 
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import shortid from 'shortid'

import DataRow from '@/components/generators/DataRow'
import NavBar from '@/components/generators/NavBar'
import CreativeCenter from '@/components/generators/CreativeCenter'

export default {
    name: 'DataEditor',
    components: { DataRow, draggable, NavBar, CreativeCenter },
    props: {
        project: { type: Object }
    },
    data: () => ({
        state: {
            drag: false,
            current: 'data'
        },
        localData: null
    }),
    computed: {
        canAdd () {
            let last = this.$data.localData[this.$data.localData.length - 1]
            return last ? last.content || last.disabled : true
        },
        reversed () {
            return this.$data.localData.reverse()
        }
    },
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localData = JSON.parse(JSON.stringify(v.ideas))
            }
        }
    },
    methods: {
        onAddRow () {
            this.$data.localData.unshift({
                _id: shortid.generate(),
                new: true,
                content: null
            })
            
            this.update()
        },
        onUpdateValue (value) {
            this.$data.localData = this.$data.localData.map(data => {
                return data._id == value.id ? value : data
            })

            this.update()
        },
        onDeleteValue (id) {
            this.$data.localData = this.$data.localData.filter(data => data._id != id)

            this.update()
        },
        update () {
            let position = 0
            this.$store.commit('generators/updateData', this.reversed)
        }
    }
}
</script>

<style lang="scss" scoped>
    .DataEditor {
        position: relative
    }

    .DataEditor_row {
        margin-bottom: 5px;
    }

    .DataEditor_nav {
        position: sticky;
        top: 0;
        z-index: 8;
        width: 100%;
        background-color: var(--color-bg-light);
        border-bottom: 1px solid var(--color-border);
    }

    .DataEditor.is-dragging {

        .DataEditor_row:not(.sortable-chosen) {
            opacity: 0.5;
        }
    }
</style>