<template>
    <div class="ColorPicker">
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker">
                <div class="ColorPicker_sticky">
                    <div class="ColorPicker_range">
                        <p>Taille</p>
                        <range-slider class="RangeSlider" min="1" max="500" :value="value.patternScale * 100" @input="onScale" />
                    </div>

                    <div class="ColorPicker_range">
                        <p>Transparence</p>
                        <range-slider class="RangeSlider" min="1" max="100" :value="value.patternOpacity * 100" @input="onOpacity" />
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
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'

import { throttle } from 'throttle-debounce';

export default {
    name: 'PatternPicker',
    components: { RangeSlider },
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
        opacity: 1,
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
        onOpacity: throttle(50, function (e) {
            this.$data.opacity = e / 100
            this.update()
        }),
        onScale: throttle(100, function (e) {
            this.$data.scale = e / 100
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