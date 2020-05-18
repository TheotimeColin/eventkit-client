<template>
    <div class="CreativeCenter">
        <div class="CreativeCenter_filters">
            <div class="col-4">
                <p class="ft-s mb-5"><b>Catégories</b></p>
                <div class="CreativeCenter_tagGroup">
                    <tag
                        v-for="tag in tags.filter(t => t.type == 'category')"
                        :modifiers="['outline', 'selectable']"
                        class="CreativeCenter_tag"
                        :key="tag._id"
                        :title="tag.label"
                        :selected="filters.categories.indexOf(tag._id) >= 0"
                        @click.native="onFilter({ categories: { value: tag._id, push: true }})"
                    />
                </div>
            </div>

            <div class="col-8">
                <p class="ft-s mb-5"><b>Tags</b></p>
                <div class="CreativeCenter_tagGroup">
                    <tag
                        v-for="tag in tags.filter(t => t.type == 'tag')"
                        :modifiers="['outline', 'selectable', 's']"
                        class="CreativeCenter_tag"
                        :key="tag._id"
                        :title="tag.label"
                        :selected="filters.tags.indexOf(tag._id) >= 0"
                        @click.native="onFilter({ tags: { value: tag._id, push: true }})"
                    />
                </div>
            </div>
        </div>

        <div class="p-20">
            <data-row
                v-for="idea in filterIdeas(ideas)"
                :value="idea"
                :key="idea._id"
                :selectable="true"
                :selected="isSelected(idea)"
                @select="onSelect"
                @deselect="onDeselect"
            />
        </div>

        <div class="CreativeCenter_pagination">
            <button-base :modifiers="['xs', 'secondary']" :disabled="page == 0" @click="page--">Précédent</button-base>

            <div class="ft-s ft-weak">Page {{ page + 1 }} / {{ maxPage }}</div>

            <button-base :modifiers="['s']" @click="page++" :disabled="(page + 1) == maxPage">Suivant</button-base>
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'
import DataRow from '@/components/generators/DataRow'
import Tag from '@/components/utils/Tag'

export default {
    name: 'CreativeCenter',
    components: { DataRow, Tag },
    async fetch () {
        await this.$store.dispatch('kits/ideas/fetch', {
            query: { kit: this.$props.project.kit._id }
        })

        await this.$store.dispatch('kits/ideas/fetchTags', {
            query: { kit: this.$props.project.kit._id }
        })
    },
    props: {
        project: { type: Object },
        displayCount: { type: Number, default: 10 }
    },
    data: () => ({
        filters: {
            tags: [], categories: []
        },
        page: 0,
        maxPage: 0
    }),
    computed: {
        ideas () {
            return this.$store.state.kits.ideas.collection.filter(v => v.content)
        },
        tags () {
            return this.$store.state.kits.ideas.tags.collection
        }
    },
    methods: {
        onSelect (v) {
            let idea = {
                ...v,
                original: v,
                _id: shortid.generate(),
                new: true
            }

            this.$store.commit('kits/project/addData', idea)
            this.$emit('select', idea)
        },
        onDeselect (v) {
            let toRemove = this.$props.project.ideas.filter(idea => idea.content && idea.content.main == v.content.main)

            toRemove.forEach(remove => {
                this.$store.commit('kits/project/removeData', remove)
            })
        },
        isSelected (v) {
            if (!v.content) return false
            return this.$props.project.ideas.filter(idea => JSON.stringify(idea.content) == JSON.stringify(v.content)).length > 0
        },
        onFilter (query) {
            this.$data.page = 0
            
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

            this.$data.maxPage = Math.ceil(result.length / this.$props.displayCount)
            result = result.slice(this.$data.page * this.$props.displayCount, (this.$data.page + 1) * this.$props.displayCount)

            return result
        }
    }
}
</script>