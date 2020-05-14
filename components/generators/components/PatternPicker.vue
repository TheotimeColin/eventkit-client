<template>
    <div class="ColorPicker">
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker">
                <div class="ColorPicker_sticky">
                    <div class="ColorPicker_range" v-show="value.patternUrl && value.patternUrl != ''">
                        <p>Taille</p>
                        <input type="range" min="1" max="500" @input="onScale" ref="scale">
                        <p>{{ Math.round(scale * 100) }}%</p>
                    </div>

                    <div class="ColorPicker_range" v-show="value.patternUrl && value.patternUrl != ''">
                        <p>Transparence</p>
                        <input type="range" min="1" max="100" @input="onOpacity" ref="opacity">
                        <p>{{ Math.round(opacity * 100) }}%</p>
                    </div>
                </div>
            </div>
            
            <div class="ColorPicker_colors">
                <div class="row-xs fx-wrap">
                    <div class="col-12 mb-10" v-for="option in patterns" :key="option.id">
                        <div
                            class="ColorPicker_palette ColorPicker_palette--pattern"
                            :class="{
                                'is-selected': value.patternUrl == option.value.patternUrl,
                                'is-premium': option.premium && !isPremium
                            }"
                            :style="{
                                '--pattern': option.background,
                                '--background-color': theme.colors.backgroundColor,
                                '--color': theme.colors.color,
                                '--font': theme.font.fontFamily
                            }"
                            @click="onSelect(option.value.patternUrl)"
                        >
                            {{ option.label }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import patterns from '@/config/patterns'
import { throttle } from 'throttle-debounce';

export default {
    name: 'PatternPicker',
    props: {
        value: {},
        options: { type: Array },
        theme: {},
        isPremium: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            custom: false
        },
        url: '',
        opacity: 0.5,
        scale: 1,
    }),
    mounted () {
        this.$data.url = this.$props.value.patternUrl
        this.$data.opacity = this.$props.value.patternOpacity
        this.$data.scale = this.$props.value.patternScale
    },
    computed: {
        patterns () {
            return this.options.map(p => {
                let pattern = patterns[p.value.patternUrl]
                
                return {
                    ...p,
                    background: pattern ? `url("${pattern(this.$props.theme.colors.patternColor.replace('#', ''), 1, 1)}")` : ''
                }
            })
        }
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