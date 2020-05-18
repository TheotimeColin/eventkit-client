<template>
    <div class="CreativeCenter">
        <div class="">
            <data-row
                v-for="idea in ideas"
                :value="idea"
                :key="idea._id"
                :selectable="true"
                @select="onSelect"
                @deselect="onDeselect"
            />
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'
import DataRow from '@/components/generators/DataRow'

export default {
    name: 'CreativeCenter',
    components: { DataRow },
    props: {
        project: { type: Object }
    },
    async mounted () {
        await this.$store.dispatch('kits/ideas/fetch', {
            query: { kit: this.$props.project.kit._id }
        })
    },
    computed: {
        ideas () {
            return this.$store.state.kits.ideas.collection.filter(v => v.content)
        }
    },
    methods: {
        onSelect (v) {
            this.$store.commit('kits/project/addData', {
                ...v,
                original: v,
                _id: shortid.generate(),
                new: true
            })
        },
        onDeselect (v) {
            let toRemove = this.$props.project.ideas.filter(idea => idea.content && idea.content.main == v.content.main)

            toRemove.forEach(remove => {
                this.$store.commit('kits/project/removeData', remove)
            })
        }
    }
}
</script>