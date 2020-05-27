<template>
    <div class="Page Page--admin Admin">
        <div class="Page_content">
            <div class="Wrapper">
                <navbar :current="state.current" :items="kits.map(kit => ({
                    id: kit._id,
                    label: kit.title,
                    onClick: () => state.current = kit._id
                }))" />

                <div v-for="kit in kits" :key="kit._id">
                    <template v-if="state.current == kit._id">
                        <div>
                            <tag
                                v-for="tag in tags.filter(t => t.kit == kit._id && t.type == 'category')"
                                :modifiers="['outline', 'selectable']"
                                class="mv-10 mh-5"
                                :key="tag._id"
                                :title="tag.label"
                                :selected="filters.categories.indexOf(tag._id) >= 0"
                                @click.native="onFilter({ categories: { value: tag._id, push: true }})"
                            />
                        </div>

                        <div>
                            <tag
                                v-for="tag in tags.filter(t => t.kit == kit._id && t.type == 'tag')"
                                :modifiers="['outline', 'selectable']"
                                class="mv-10 mh-5"
                                :key="tag._id"
                                :title="tag.label"
                                :selected="filters.tags.indexOf(tag._id) >= 0"
                                @click.native="onFilter({ tags: { value: tag._id, push: true }})"
                            />
                        </div>

                        <div class="text-right">
                            <button-base
                                fa="plus"
                                :modifiers="['s']"
                                @click.native="() => onAddIdea(kit)"
                            >
                                Ajouter
                            </button-base>
                        </div>
                        <div class="d-flex fx-align-stretch" v-for="value in filterIdeas(kit.ideas)" :key="value._id">
                            <data-row
                                class="fx-grow"
                                :value="value"
                                @input="onUpdateIdea"
                                @blur="() => save(value._id)"
                                @submit="() => save(value._id)"
                            >
                                <template slot="footer">
                                    <div class="p-3 text-right">
                                        <tag
                                            v-for="tag in value.tags.filter(t => t.type == 'category')"
                                            :modifiers="['s', 'outline', 'blue']"
                                            :title="tag.label"
                                            :key="tag._id"
                                        />

                                        <tag
                                            v-for="tag in value.tags.filter(t => t.type == 'tag')"
                                            :modifiers="['s', 'outline']"
                                            :title="tag.label"
                                            :key="tag._id"
                                        />
                                    </div>
                                </template>
                            </data-row>

                            <input
                                type="checkbox"
                                :checked="value.kickstarter"
                                @change="(v) => onUpdateIdea({ ...value, kickstarter: true })"
                            />

                            <select-search
                                action="kits/ideas/fetchTags"
                                :params="{ query: { kit: kit._id, type: 'category' }, push: true }"
                                :options="tags.filter(t => t.kit == kit._id && t.type =='category')"
                                :modifiers="['left']"
                                :create="true"
                                :multiple="true"
                                :unset="true"
                                label-key="label"
                                :value="value.tags"
                                @input="(v) => onUpdateTags(value, v, 'category')"
                                @create="(v) => onCreateTag(v, kit._id, 'category')"
                            />

                            <select-search
                                action="kits/ideas/fetchTags"
                                :params="{ query: { kit: kit._id, type: 'tag' }, push: true }"
                                :options="tags.filter(t => t.kit == kit._id && t.type =='tag')"
                                :modifiers="['left']"
                                :create="true"
                                :multiple="true"
                                :unset="true"
                                label-key="label"
                                :value="value.tags"
                                @input="(v) => onUpdateTags(value, v, 'tag')"
                                @create="(v) => onCreateTag(v, kit._id, 'tag')"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'

import SelectSearch from '@/components/utils/SelectSearch'
import Navbar from '@/components/generators/NavBar'
import DataRow from '@/components/generators/DataRow'
import Tag from '@/components/utils/Tag'

export default {
    name: 'HomePage',
    layout: 'admin',
    components: { SelectSearch, Navbar, DataRow, Tag },
    async fetch () {
        await this.$store.dispatch('kits/fetch')
        await this.$store.dispatch('kits/ideas/fetch')
        await this.$store.dispatch('kits/ideas/fetchTags')
    },
    data: () => ({
        kits: [],
        filters: {
            tags: [],
            categories: []
        },
        state: {
            current: ''
        }
    }),
    computed: {
        allKits () {
            return this.$store.state.kits.collection
        },
        ideas () {
            return this.$store.state.kits.ideas.collection
        },
        tags () {
            return this.$store.state.kits.ideas.tags.collection
        }
    },
    watch: {
        ideas: {
            deep: true,
            immediate: true,
            async handler (ideas) {
                let kits = this.allKits.map(k => ({
                    ...k, ideas: k.ideas ? k.ideas : []
                }))

                await Promise.all(ideas.map(idea => {
                    if (!idea.kit) return

                    let search = kits.find(k => k._id == idea.kit._id)
                    if (search.ideas) {
                        search.ideas.push(idea)
                    } else {
                        search.ideas = [ idea ]
                    }

                    return true
                }))

                if (this.$data.state.current == '' && kits[0]) this.$data.state.current = kits[0]._id
                this.$data.kits = kits.slice()
            }
        }
    },
    methods: {
        async onAddIdea (kit) {
            this.$store.dispatch('kits/ideas/post', { data: {
                id: shortid.generate(),
                new: true,
                content: {},
                default: false,
                tags: [
                    ...this.$data.filters.tags,
                    ...this.$data.filters.categories
                ],
                kit: kit._id
            }})
        },
        onUpdateIdea (idea) {
            this.$store.commit('kits/ideas/update', idea)
        },
        onUpdateTags (idea, tags, type) {
            this.$store.commit('kits/ideas/update', {
                ...idea,
                tags: [
                    ...tags,
                    ...idea.tags.filter(tag => tag.type != type)
                ]
            })

            this.save(idea._id)
        },
        async onCreateTag (value, kit, type) {
            let tag = await this.$store.dispatch('kits/ideas/postTag', {
                data: { label: value, type, kit }
            })
        },
        async save (ideaId) {
            await this.$store.dispatch('kits/ideas/save', { id: ideaId })
        },
        onFilter (query) {
            Object.keys(query).forEach(key => {
                let value = query[key].value

                if (query[key].push) {
                    let exists = this.$data.filters[key] ? this.$data.filters[key].indexOf(value) : null

                    if (this.$data.filters[key]) {
                        if (exists >= 0) {
                            this.$data.filters[key].splice(exists, 1)
                        } else {
                            this.$data.filters[key].push(value)
                        }
                    } else {
                        this.$data.filters[key] = [ value ]
                    }
                }
            })
        },
        filterIdeas (items) {
            let result = items 

            if (this.$data.filters.categories) {
                result = result.filter(i => this.$data.filters.categories.length <= 0 || i.tags.filter(t => this.$data.filters.categories.indexOf(t._id) >= 0).length > 0)
            }

            if (this.$data.filters.tags) {
                result = result.filter(i => this.$data.filters.tags.length <= 0 || i.tags.filter(t => this.$data.filters.tags.indexOf(t._id) >= 0).length > 0)
            }

            return result.reverse()
        }
    } 
}
</script>

<style lang="scss" scoped>

</style>