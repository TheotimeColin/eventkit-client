<template>
    <div class="ReactionButton">
        

        <div class="ReactionButton_button" @click="onClick">
            <p class="ReactionButton_emoji">{{ emoji }}</p>

            <emoji-particle
                class="Reaction_particle"
                v-for="(particle, i) in particles"
                :emoji="particle.emoji"
                :is-active="particle.active"
                :key="i"
                @done="particle.active = false"
            />

            <div class="ReactionButton_title" v-if="title">
                {{ title }}
            </div>
        </div>

        <div class="ReactionButton_count">
            {{ count + clicks }}
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

import EmojiParticle from '@/components/interactive/EmojiParticle'

export default {
    name: 'ReactionButton',
    components: { EmojiParticle },
    mixins: [ base ],
    props: {
        title: { type: String },
        emoji: { type: String },
        count: { type: Number }
    },
    data: () => ({
        clicks: 0,
        particles: []
    }),
    mounted () {
        for(let i = 0; i < 10; i++) {
            this.$data.particles.push({
                active: false,
                emoji: this.$props.emoji
            })
        }
    },
    methods: {
        onClick () {
            this.generateParticles()
            
            this.$data.clicks += 1 
            this.$emit('click')
        },
        generateParticles () {
            let available = this.$data.particles.filter(p => !p.active).slice(0, 3)
            available.forEach(a => a.active = true)
        }
    }
}
</script>