<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localData">
        <nav-bar class="DataEditor_nav" :modifiers="['secondary']" :current="state.current" :items="[
            { id: 'data', label: $t('comp.dataEditor.nav.ideas'), count: localData.length, onClick: () => state.current = 'data' },
            { id: 'idea', label: $t('comp.dataEditor.nav.creativeCenter'), fa: 'lightbulb', onClick: () => state.current = 'idea' }
        ]" />
        
        <div class="DataEditor_container" v-show="state.current == 'data'">
            <div class="DataEditor_list">
                <div class="p-30">
                    <div class="mb-20 d-flex fx-align-center fx-justify-between">
                        <div>
                            <select v-model="state.category">
                                <option
                                    v-for="category in ideaCategories"
                                    :value="category._id"
                                    :key="category._id"
                                    @select="state.category = category"
                                >
                                    {{ category.label }} ({{ category.ideas.length }})
                                </option>
                            </select>

                            <button-base
                                fa="plus"
                                :modifiers="['xs']"
                                @click.native="onAddCategory"
                            />
                        </div>

                        <div>
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

                            <button-base
                                fa="plus"
                                :modifiers="['s']"
                                @click="onAddRow()"
                            >{{ $t('comp.dataEditor.cta.add') }}</button-base>
                        </div>
                    </div>

                    <div v-for="(category, key) in ideaCategories" :key="key" v-show="state.category && state.category == key">
                        <input type="text" :value="category.label" @input="(v) => onUpdateCategory(key, { label: v.target.value })">
                    
                        <draggable :value="localData" handle=".handle" @start="state.drag = true" @end="() => { update(); state.drag = false; }">
                            <transition-group type="transition">
                                <data-row
                                    class="DataEditor_row"
                                    v-for="value in category.ideas"
                                    :value="value"
                                    :editable="true"
                                    @input="onUpdateValue"
                                    @select="(v) => $emit('select', v)"
                                    @delete="onDeleteValue"
                                    @submit="onAddRow()"
                                    :key="value._id"
                                >
                                    <template slot="tags">
                                        <div class="mr-5 text-right fx-no-shrink" v-if="value.tags">
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
                </div>
            </div>
            <div class="DataEditor_quickEdit">
                <quick-edit
                    :value="activeItem.content.main"
                    @input="(v) => onUpdateValue({ ...activeItem, content: { ...activeItem.content, main: v }})"
                    v-if="activeItem.content"
                />
            </div>
        </div>
        
        <div class="p-30" v-show="state.current == 'idea'">
            <creative-center
                :project="project"
                @select="(v) => $emit('select', v)"
            />
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import shortid from 'shortid'

import DataRow from '@/components/generators/DataRow'
import NavBar from '@/components/generators/NavBar'
import CreativeCenter from '@/components/generators/CreativeCenter'
import QuickEdit from '@/components/utils/QuickEdit'

export default {
    name: 'DataEditor',
    components: { DataRow, draggable, NavBar, CreativeCenter, QuickEdit },
    props: {
        project: { type: Object },
        selected: { type: String }
    },
    data: () => ({
        state: {
            category: { _id: '_default', label: `Par défaut` },
            drag: false,
            current: 'data'
        },
        localData: null
    }),
    computed: {
        reversed () {
            return this.$data.localData.reverse()
        },
        currentCategory () {
            return this.ideaCategories[this.$data.state.category]
        },
        ideaCategories () {
            let categories = {}

            this.reversed.forEach(idea => {
                let category = idea.category ? idea.category : { _id: '_default', label: `Par défaut` }

                if (!categories[category._id]) categories[category._id] = { ...category, ideas: [] }

                categories[category._id].ideas.push(idea)
            })

            return categories
        },
        activeItem () {
            let selected = this.$data.localData.find(i => i._id == this.$props.selected)
            return selected ? selected : this.$data.localData[this.$data.localData.length - 1]
        }
    },
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localData = v.ideas.slice()
            }
        }
    },
    methods: {
        onAddRow (category = false) {
            let values = {
                _id: shortid.generate(),
                new: true,
                content: { main: '' }
            }

            if (category) {
                values.category = category
            } else {
                values.category = this.currentCategory
            }

            this.$data.localData.unshift(values)
            this.update()
        },
        onAddCategory () {
            let category = {
                _id: shortid.generate(),
                label: `Name me !`,
                new: true,
                ideas: []
            }
            
            this.$data.state.category = category._id
            this.onAddRow(category)
        },
        onUpdateCategory (id, value) {
            this.$data.localData = this.$data.localData.map(data => {
                if (data.category && data.category._id == id) data.category = { ...data.category, ...value }
                return data
            })

            this.update()
        },
        onUpdateValue (value) {
            this.$data.localData = this.$data.localData.map(data => {
                return data._id == value._id ? value : data
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
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
    }

    .DataEditor_container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: hidden;
    }

    .DataEditor_list {
        overflow: auto;
        flex-grow: 1;
    }

    .DataEditor_quickEdit {
        flex-shrink: 0;
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