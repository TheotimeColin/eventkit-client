<template>
    <div class="ColorPicker">
        <label class="d-block mb-20 ft-s">
            <input type="checkbox" v-model="state.custom"> Afficher sélecteur de couleurs
        </label>

        <div class="ColorPicker_container">
            <div class="ColorPicker_picker" v-show="state.custom">
                <div ref="picker"></div>
            </div>
            <div class="ColorPicker_colors">
                <div
                    v-for="option in patterns"
                    class="ColorPicker_option ColorPicker_option--pattern"
                    :class="{
                        'is-selected': value.patternUrl == option.value.patternUrl,
                        'is-premium': option.premium
                    }"
                    :style="{ '--background': option.background }"
                    @click="onSelect(option.value.patternUrl)"
                    :key="option.id"
                >
                </div>

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
    </div>
</template>

<script>
import patterns from '@/config/patterns'
import { throttle } from 'throttle-debounce';
const AColorPicker = require('a-color-picker')


export default {
    name: 'PatternPicker',
    props: {
        value: {},
        options: { type: Array }
    },
    data: () => ({
        state: {
            custom: false
        },
        url: '',
        opacity: 0.5,
        scale: 1,
        color: '#00ff00',
        colorPicker: null
    }),
    mounted () {
        this.$data.url = this.$props.value.patternUrl
        this.$data.opacity = this.$props.value.patternOpacity
        this.$data.color = this.$props.value.patternColor
        this.$data.scale = this.$props.value.patternScale

        if (this.$refs.picker) {
            this.$data.colorPicker = AColorPicker.createPicker(this.$refs.picker, {
                showHSL: false
            })

            this.$data.colorPicker.on('change', (e) => {
                this.$data.color = e.color
                this.update()
            })
        }
    },
    computed: {
        patterns () {
            return this.options.map(p => {
                let pattern = patterns[p.value.patternUrl]

                return {
                    ...p,
                    background: pattern ? `url("${pattern('a5a5a5', 0.5)}")` : ''
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
                patternColor: this.$data.color,
                patternUrl: this.$data.url,
                patternOpacity: this.$data.opacity,
                patternScale: this.$data.scale
            })
        }
    }
}
</script>