<template>
    <div class="CreativeCenter">
        <div class="">
            <idea-pack
                class="CreativeCenter_pack"
                v-for="pack in packs"
                :pack="pack"
                :values="project.ideas"
                :key="pack.id"
                @select="(v) => onSelect(pack, v)"
                @deselect="onDeselect"
            />
        </div>
    </div>
</template>

<script>
import shortid from 'shortid'

import IdeaPack from '@/components/interactive/IdeaPack'

export default {
    name: 'CreativeCenter',
    components: { IdeaPack },
    props: {
        project: { type: Object }
    },
    data: () => ({
        packs: null
    }),
    async mounted () {
        if (!this.$store.state.kits.packs.fetched) {
            await this.$store.dispatch('kits/packs/fetch')
        }
        
        this.$data.packs = this.$store.state.kits.packs.collection
    },
    methods: {
        onSelect (pack, v) {
            this.$store.commit('kits/project/addData', {
                ...v,
                original: v,
                _id: shortid.generate(),
                pack: {
                    ...pack,
                    ideas: []
                },
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