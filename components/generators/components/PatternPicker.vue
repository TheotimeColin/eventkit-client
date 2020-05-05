<template>
    <div class="ColorPicker">
        <div
            v-for="option in options"
            class="ColorPicker_option"
            :class="{
                'is-selected': value.patternUrl == option.value.patternUrl
            }"
            :style="{ '--background': option.value.patternUrl }"
            @click="onSelect(option.value.patternUrl)"
            :key="option.id"
        >
            <p class="ColorPicker_premium" v-if="option.premium">⭐</p>
        </div>

        <div class="ColorPicker_range" v-show="value.patternUrl && value.patternUrl != ''">
            <input type="range" min="0" max="100" @input="onOpacity" ref="opacity">
        </div>

        <div class="ColorPicker_range" v-show="value.patternUrl && value.patternUrl != ''">
            <input type="range" min="0" max="500" @input="onScale" ref="scale">
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

export default {
    name: 'PatternPicker',
    props: {
        value: {},
        options: { type: Array }
    },
    data: () => ({
        url: '',
        opacity: 0.5,
        scale: 1
    }),
    mounted () {
    },
    methods: {
        onSelect (value) {
            this.$data.url = value

            this.update()
        },
        onOpacity: throttle(50, function () {
            this.$data.opacity = this.$refs.opacity.value / 100

            this.update()
        }),
        onScale: throttle(100, function () {
            this.$data.scale = this.$refs.scale.value / 100

            this.update()
        }),
        update () {
            this.$emit('input', {
                patternUrl: this.$data.url,
                patternOpacity: this.$data.opacity,
                patternScale: this.$data.scale
            })
        }
    }
}
</script>