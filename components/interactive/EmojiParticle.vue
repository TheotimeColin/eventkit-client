<template>
    <div class="EmojiParticle" :class="{ 'is-start': state.start }" :style="direction">
        {{ emoji }}
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'EmojiParticle',
    mixins: [ base ],
    props: {
        emoji: { type: String },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            start: false
        },
        direction: {}
    }),
    watch: {
        isActive: {
            immediate: true,
            handler (v) {
                if (v) this.setDirection()
            }
        }
    },
    methods: {
        setDirection () {
            let positionBounds = [10, 30]
            let scaleBounds = [0.5, 1]
            let rotateBounds = [0, 40]
            let transitionBounds = [480, 500]

            let positionX = Math.floor(Math.random()*2) == 1 ? 1 : -1
            let positionY = Math.floor(Math.random()*2) == 1 ? 1 : -1

            this.$data.direction = {
                '--x': Math.round((Math.random() * positionBounds[1]) + positionBounds[0]) * positionX + 'px',
                '--y': Math.round((Math.random() * positionBounds[1]) + positionBounds[0]) * positionY + 'px',
                '--scale': ((Math.random() * scaleBounds[1]) + scaleBounds[0]).toFixed(2),
                '--rotation': Math.round((Math.random() * rotateBounds[1]) + rotateBounds[0]) * positionX + 'deg',
                '--transition': Math.round((Math.random() * transitionBounds[1]) + transitionBounds[0]) + 'ms',
            }

            this.$nextTick(() => this.$data.state.start = true)

            setTimeout(() => {
                this.$data.state.start = false
                this.$emit('done')
            }, transitionBounds[1])
        }
    }
}
</script>