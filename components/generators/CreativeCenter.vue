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
        if (!this.$store.state.generators.packs.fetched) {
            await this.$store.dispatch('generators/packs/fetch')
        }
        
        this.$data.packs = this.$store.state.generators.packs.collection
    },
    methods: {
        onSelect (pack, v) {
            this.$store.commit('generators/addData', {
                ...v,
                _id: shortid.generate(),
                pack: {
                    ...pack,
                    ideas: []
                },
                new: true
            })
        },
        onDeselect (v) {
            // this.$store.commit('generators/removeData', v)
        }
    }
}
</script>