<template>
    <div class="LoadingBar" :class="{ 'is-hidden': state.hidden, ...$modifiers }">
        <div class="LoadingBar_bar" :style="{ width: valueAnimation + '%' }">
            <div class="LoadingBar_indicator">
                {{ this.$props.max - Math.round(valueAnimation) }} restants
            </div>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'
import { TweenLite } from 'gsap'

export default {
    name: 'LoadingBar',
    mixins: [ base ],
    props: {
        value: { type: Number, default: 0 },
        max: { type: Number, default: 100 }
    },
    data: () => ({
        state: {
            hidden: false
        },
        valueAnimation: 0
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                TweenLite.to(this.$data, 2, { valueAnimation: v })
                setTimeout(() => this.$data.state.hidden = true, 5000)
            }
        }
    },
    methods: {
        reset () {
            this.$data.valueAnimation = 0
            this.$data.state.hidden = false
            
            TweenLite.to(this.$data, 2, { valueAnimation: this.$props.value })
            setTimeout(() => this.$data.state.hidden = true, 5000)
        }
    }
}
</script>