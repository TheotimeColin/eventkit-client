<template>
    <div class="ColorPicker">
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker">
                <div class="ColorPicker_sticky">
                    <nav-bar :modifiers="['s', 'selector', 'vertical']" :current="state.current" :items="Object.keys(options).map(key => ({
                        id: key, color: value[key], label: options[key].label, onClick: () => state.current = key
                    }))" />
                    
                    <div ref="custom"></div>
                </div>
            </div>
            
            <div class="ColorPicker_colors">
                <div class="row-xs fx-wrap">
                    <div v-for="(palette, i) in palettes" class="col-6 mb-10 col-12@s" :key="i">
                        <div
                            class="ColorPicker_palette"
                            :style="{
                                '--background-color': palette.values.backgroundColor,
                                '--color': palette.values.color,
                                '--pattern': patternUrl(palette.values.patternColor),
                                '--font': theme.font.fontFamily
                            }"
                            @click="onSelectPalette(palette.values)"
                        >
                            {{ palette.label }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import palettes from '@/config/kits/common/palettes'
import patterns from '@/config/patterns'

import NavBar from '@/components/generators/NavBar'
const AColorPicker = require('a-color-picker')

export default {
    name: 'ColorPicker',
    components: { NavBar },
    props: {
        value: {},
        theme: {},
        options: { type: Object }
    },
    data: () => ({
        state: {
            custom: false,
            current: ''
        },
        localValue: '',
        colorPicker: null,
        palettes: palettes
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.$data.localValue = v
                if (this.$data.colorPicker) this.$data.colorPicker.color = this.$props.value[this.$data.state.current]
            }
        },
        ['state.current'] (v) {
            this.$data.colorPicker.color = this.$props.value[v]
        }
    },
    mounted () {
        this.$data.state.current = Object.keys(this.$props.options)[0]

        if (this.$refs.custom) {
            this.$data.colorPicker = AColorPicker.createPicker(this.$refs.custom, {
                showHSL: false,
                showRGB: false
            })

            this.$data.colorPicker.on('change', (e) => {
                this.$data.localValue[this.$data.state.current] = e.color
                this.onSelect()
            })
        }
    },
    methods: {
        onSelectPalette (v) {
            this.$data.localValue = v
            this.onSelect()
        },
        onSelect () {
            this.$emit('input', this.$data.localValue)
        },
        patternUrl (color) {
            let value = ''
            let pattern = patterns[this.$props.theme.pattern.patternUrl]

            if (pattern) value = pattern(
                color.replace('#', ''), 1, 1
            )

            return `url("${value}")`
        }
    }
}
</script>