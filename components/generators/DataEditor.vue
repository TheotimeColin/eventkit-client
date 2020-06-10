<template>
    <div class="DataEditor" :class="{ 'is-dragging': state.drag }" v-if="localCategories">
        <nav-bar class="DataEditor_nav" :modifiers="['secondary']" :current="state.current" :items="[
            { id: 'data', label: $t('comp.dataEditor.nav.ideas'), count: allIdeas.length, onClick: () => state.current = 'data' },
            { id: 'idea', label: $t('comp.dataEditor.nav.creativeCenter'), fa: 'lightbulb', onClick: () => state.current = 'idea' }
        ]" />
        
        <div class="DataEditor_container" v-show="state.current == 'data'">
            <div class="DataEditor_list">
                <div class="p-20">
                    <div class="d-flex fx-align-center fx-justify-between b-bottom">
                        <div class="Input--s">  
                            <div class="Input_container">
                                <select class="Input_element" v-model="state.category">
                                    <option
                                        v-for="category in localCategories"
                                        :value="category._id"
                                        :key="category._id"
                                    >
                                        {{ category.label }} ({{ category.ideas.length }})
                                    </option>
                                    <option value="_new">
                                        {{ $t('comp.dataEditor.category.create') }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr class="mv-20">

                    <div v-for="category in localCategories" :key="category._id" v-show="state.category && state.category == category._id">
                        <div class="row-s mb-10" v-if="category._id != '_default'">
                            <div class="col-6">
                                <input-text
                                    :modifiers="['s']"
                                    :label="$t('comp.dataEditor.category.title')"
                                    :value="category.label"
                                    @input="(v) => onUpdateCategory(category._id, { label: v })"
                                />
                            </div>

                            <div class="col-6 text-right">
                                <link-base
                                    :modifiers="['simple', 'xs']"
                                    class="color-ft-weak mr-10"
                                    @click.native="$store.commit('utils/confirmPrompt', {
                                        active: true,
                                        description: $t('comp.dataEditor.category.deleteAll'),
                                        onConfirm: onDeleteAll,
                                        confirmText: $t('comp.dataEditor.cta.delete')
                                    })"
                                >
                                    {{ $t('comp.dataEditor.category.delete') }}
                                </link-base>

                                <button-base
                                    fa="plus"
                                    :modifiers="['s']"
                                    @click="onAddRow()"
                                >{{ $t('comp.dataEditor.cta.add') }}</button-base>
                            </div>
                        </div>
                    

                        <div>
                            <data-row
                                class="DataEditor_row"
                                v-for="value in category.ideas"
                                :value="value"
                                :editable="true"
                                @input="onUpdateValue"
                                @select="(v) => $emit('select', v)"
                                @delete="() => onDeleteValue(value)"
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
                        </div>
                    </div>
                </div>
            </div>
            <div class="DataEditor_quickEdit" v-if="currentItem && currentItem.content">
                <quick-edit
                    :value="currentItem.content.main"
                    @input="(v) => onUpdateValue({ ...currentItem, content: { ...currentItem.content, main: v }})"
                />
            </div>
        </div>
        
        <div class="p-20" v-show="state.current == 'idea'">
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
import InputText from '@/components/form/InputText'

export default {
    name: 'DataEditor',
    components: { DataRow, draggable, NavBar, CreativeCenter, QuickEdit, InputText },
    props: {
        project: { type: Object },
        selected: { type: String }
    },
    data: () => ({
        state: {
            category: '_default',
            drag: false,
            current: 'data'
        },
        localData: null,
        localCategories: []
    }),
    computed: {
        allIdeas () {
            let result = []

            this.$data.localCategories.forEach(category => {
                result = [ ...category.ideas, ...result ]
            })
            return result
        },
        currentCategory () {
            return this.$data.localCategories.find(c => c._id == this.$data.state.category)
        },
        currentItem () {
            if (!this.currentCategory) return false

            let selected = this.allIdeas.find(i => i._id == this.$props.selected)
            return selected ? selected : this.allIdeas[this.allIdeas.length - 1]
        }
    },
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localCategories = JSON.parse(JSON.stringify(v.ideaCategories))
            }
        },
        ['state.category'] (v) {
            if (v == '_new') this.onAddCategory()
        }
    },
    methods: {
        onAddRow () {
            let value = {
                _id: shortid.generate(),
                new: true,
                content: { main: '' },
                category: this.$data.state.category
            }
            
            this.$data.localCategories = this.$data.localCategories.map(category => {
                if (category._id == this.$data.state.category) category.ideas.push(value)
                return category
            })

            this.update()
        },
        onAddCategory () {
            let category = {
                _id: shortid.generate(),
                label: this.$t('comp.dataEditor.category.new'),
                new: true,
                ideas: []
            }

            this.$data.localCategories.push(category)
            this.$data.state.category = category._id

            this.onAddRow()
        },
        onUpdateCategory (id, value) {
            this.$data.localCategories = this.$data.localCategories.map(category => {
                return (category._id == id ? { ...category, ...value } : category)
            })

            this.update()
        },
        onUpdateValue (value) {
            this.$store.commit('kits/project/updateIdea', value)
        },
        onDeleteValue (value) {
            this.$store.commit('kits/project/deleteIdea', value)
        },
        onDeleteAll () {
            this.$data.localCategories = this.$data.localCategories.filter(category => category._id != this.$data.state.category)

            this.update()
        },
        update () {
            this.$store.commit('kits/project/updateData', this.$data.localCategories)
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