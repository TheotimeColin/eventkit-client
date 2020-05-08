<template>
    <div class="CreativeCenter">
        <div class="CreativeCenter_header">💡 Creative center</div>

        <div class="">
            <div class="p-20">
                <idea-pack
                    class="CreativeCenter_pack"
                    v-for="pack in ideaPacks"
                    :pack="pack"
                    :values="project.values.data"
                    :key="pack.id"
                    @select="onSelect"
                    @deselect="onDeselect"
                />
            </div>
        </div>
    </div>
</template>

<script>
import IdeaPack from '@/components/interactive/IdeaPack'

const ideaPacks = [
    { id: 'cs-spicy-1', emoji: '🌶️', title: 'Spicy #1', description: `questions hot`, color1: '#cb3066', color2: '#ff4f4f', content: [
        { id: 'ccvv', main: 'Raconte ton pire date !' },
        { id: 'zzzz', main: 'Quelle est ta position préférée ?' },
        { id: 'zerr', main: `As-tu un crush sur quelqu'un ici présent ?` },
        { id: 'uiph', main: `Raconte ton pire plan cul.` },
        { id: 'cvhu', main: `T'es-tu déjà fait surprendre pendant l'acte ?` },
        { id: 'cscvv', main: 'Raconte ton pire date !' },
        { id: 'zszzz', main: 'Quelle est ta position préférée ?' },
        { id: 'zessrr', main: `As-tu un crush sur quelqu'un ici présent ?` },
        { id: 'usiph', main: `Raconte ton pire plan cul.` },
        { id: 'cvshu', main: `T'es-tu déjà fait surprendre pendant l'acte ?` }
    ]},
    { id: 'cs-spicy-2', emoji: '🍀', title: 'Inspire #1', description: `questions feel-good`, color1: '#64b3f4', color2: '#b5d875', content: [
        { id: 'x', main: 'Quel est ton plus grand accomplissement ?' },
        { id: 'zzxczz', main: 'Comment bâtir un monde meilleur ?' },
        { id: 'qsd', main: `Quel est l'obstacle dans ta vie qui t'a fait le plus grandir ?` },
        { id: 'uisph', main: `De quelle personne es-tu le/la plus reconnaissant(e)` },
        { id: 'csdvhu', main: `Qu'est-ce qui te rappelle la chance d'être en vie ?` },
        { id: 'ccsqsvv', main: `Raconte une rencontre avec un inconnu qui t'a marqué(e)` },
        { id: 'zzsdszz', main: `Quel est le meilleur conseil que tu peux donner` },
        { id: 'zessrr', main: `Quelle citation te représente le plus ?` }
    ]}
]

export default {
    name: 'CreativeCenter',
    components: { IdeaPack },
    props: {
        project: { type: Object }
    },
    data: () => ({
        ideaPacks
    }),
    computed: {

    },
    methods: {
        onSelect (v) {
            this.$store.commit('generators/addData', v)
        },
        onDeselect (v) {
            this.$store.commit('generators/removeData', v)
        }
    }
}
</script>