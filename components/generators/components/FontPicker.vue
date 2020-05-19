<template>
    <div class="ColorPicker">
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker">
                <div class="ColorPicker_sticky">
                    <div class="ColorPicker_range">
                        <p>Taille</p>
                        <range-slider class="RangeSlider" min="1" max="200" :value="value.elementScale * 100" @input="onScale" />
                    </div>
                </div>
            </div>
            
            <div class="ColorPicker_colors">
                <div class="row-2xs fx-wrap">
                    <div class="col-6 mb-3" v-for="(option, i) in fonts" :key="i">
                        <div
                            class="ColorPicker_palette ColorPicker_palette--font"
                            :class="{
                                'is-selected': option.value.fontFamily == value.fontFamily,
                                'is-premium': option.premium
                            }"
                            :style="{
                                '--pattern': patternUrl,
                                '--background-color': theme.colors.backgroundColor,
                                '--color': theme.colors.color,
                                '--font': option.value.fontFamily,
                                '--font-normalize': option.value.fontNormalize
                            }"
                            @click="onFontSelect(option.value)"
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
import fonts from '@/config/kits/common/fonts'
import patterns from '@/config/patterns'

import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'

export default {
    name: 'PatternPicker',
    components: { RangeSlider },
    props: {
        value: {},
        options: { type: Array },
        theme: {}
    },
    data: () => ({
        state: {
            custom: false
        },
        fonts: fonts,
        values: {
            fontFamily: '',
            elementScale: 1
        }
    }),
    mounted () {
        this.$data.values = {
            ...this.$props.theme.font
        }
    },
    computed: {
        patternUrl () {
            let value = ''
            let pattern = patterns[this.$props.theme.pattern.patternUrl]

            if (pattern) value = pattern(
                this.$props.theme.colors.patternColor.replace('#', ''), 0.5, 1
            )

            return `url("${value}")`
        }
    },
    methods: {
        onScale (v) {
            this.$data.values.elementScale = (v / 100).toFixed(2)
            this.update()
        },
        onFontSelect (v) {
            this.$data.values = { ...v }
            this.update()
        },
        update () {
            this.$emit('input', { 
                ...this.$data.values
            })
        }
    }
}
</script>