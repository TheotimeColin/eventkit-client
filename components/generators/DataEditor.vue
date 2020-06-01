<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localData">
        <nav-bar class="DataEditor_nav" :modifiers="['secondary']" :current="state.current" :items="[
            { id: 'data', label: $t('comp.dataEditor.nav.ideas'), count: localData.length, onClick: () => state.current = 'data' },
            { id: 'idea', label: $t('comp.dataEditor.nav.creativeCenter'), fa: 'lightbulb', onClick: () => state.current = 'idea' }
        ]" />
        
        <div class="p-30" v-show="state.current == 'data'">
            <div class="mb-20 d-flex fx-align-center fx-justify-between">
                <button-base
                    fa="plus"
                    :modifiers="['s']"
                    @click.native="onAddRow"
                >{{ $t('comp.dataEditor.cta.add') }}</button-base>

                <button-base
                    fa="times"
                    :modifiers="['xs', 'secondary']"
                    @click.native="$store.commit('utils/confirmPrompt', {
                        active: true,
                        onConfirm: onDeleteAll,
                        confirmText: $t('comp.dataEditor.cta.delete')
                    })"
                >
                    {{ $t('comp.dataEditor.cta.deleteAll') }}
                </button-base>
            </div>

            <draggable v-model="localData" handle=".handle" @start="state.drag = true" @end="() => { update(); state.drag = false; }">
                <transition-group type="transition">
                    <data-row
                        class="DataEditor_row"
                        v-for="value in reversed"
                        :value="value"
                        :editable="true"
                        @input="onUpdateValue"
                        @select="(v) => $emit('select', v)"
                        @delete="onDeleteValue"
                        @submit="onAddRow"
                        :key="value._id"
                    >
                        <template slot="tags">
                            <div class="mr-5 text-right fx-no-shrink">
                                <span
                                    v-for="tag in value.tags.filter(t => t.type == 'tag')"
                                    class="mr-5"
                                    :key="tag._id"
                                >{{ tag.emoji ? tag.emoji : tag.label }}</span>
                            </div>
                        </template>
                    </data-row>
                </transition-group>
            </draggable>
        </div>
        
        <creative-center
            :project="project"
            @select="(v) => $emit('select', v)"
            v-show="state.current == 'idea'"
        />
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
        onDeleteAll () {
            this.$data.localData = []

            this.update()
        },
        update () {
            let position = 0
            this.$store.commit('kits/project/updateData', this.reversed)
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
    }

    .DataEditor.is-dragging {

        .DataEditor_row:not(.sortable-chosen) {
            opacity: 0.5;
        }
    }
</style>