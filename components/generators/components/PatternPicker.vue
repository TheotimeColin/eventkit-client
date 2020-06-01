<template>
    <div class="ColorPicker">
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker">
                <div class="ColorPicker_sticky">
                    <div class="ColorPicker_range">
                        <p class="mb-5">{{ $t(`comp.patternPicker.scale`) }}</p>
                        <range-slider class="RangeSlider_input" min="1" max="500" :value="value.patternScale * 100" @input="onScale" />
                    </div>

                    <div class="ColorPicker_range">
                        <p class="mb-5">{{ $t(`comp.patternPicker.opacity`) }}</p>
                        <range-slider class="RangeSlider_input" min="1" max="100" :value="value.patternOpacity * 100" @input="onOpacity" />
                    </div>
                </div>
            </div>
            
            <div class="ColorPicker_colors">
                <div class="row-2xs fx-wrap">
                    <div class="col-12 mb-5" v-for="(pattern, name) in patterns" :key="name">
                        <div
                            class="ColorPicker_palette ColorPicker_palette--pattern"
                            :class="{
                                'is-selected': value.patternUrl == name
                            }"
                            :style="{
                                '--pattern': pattern,
                                '--background-color': theme.colors.backgroundColor,
                                '--color': theme.colors.color,
                                '--font': theme.font.fontFamily
                            }"
                            @click="onSelect(name)"
                        >
                            {{ name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PATTERNS from '@/config/patterns'
import patternMixin from '@/utils/pattern-mixin'
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'

import { throttle } from 'throttle-debounce';

export default {
    name: 'PatternPicker',
    mixins: [ patternMixin ],
    components: { RangeSlider },
    props: {
        value: {},
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
            let patterns = {}

            Object.keys(PATTERNS).map(patternId => {
                patterns[patternId] = this.$pattern({
                    patternUrl: patternId,
                    patternOpacity: 1,
                    patternScale: 0.5,
                    color: this.$props.theme.colors.patternColor
                })
            })

            return patterns
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