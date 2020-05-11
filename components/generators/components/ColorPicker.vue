<template>
    <div class="ColorPicker">
        <label class="d-block mb-20 ft-s">
            <input type="checkbox" v-model="state.custom"> Afficher sélecteur de couleurs
        </label>
        <div class="ColorPicker_container">
            <div class="ColorPicker_picker" v-show="state.custom">
                <div ref="custom"></div>
            </div>
            
            <div class="ColorPicker_colors">
                <div
                    v-for="option in options"
                    class="ColorPicker_option"
                    :class="{
                        'is-premium': option.premium,
                        'is-selected': value == option.value,
                        'is-active': state.custom
                    }"
                    :style="{ '--background': option.thumb ? option.thumb : option.value }"
                    @click="onSelect(option.value)"
                    ref="color"
                    :key="option.id"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
const AColorPicker = require('a-color-picker')

export default {
    name: 'ColorPicker',
    props: {
        value: {},
        options: { type: Array }
    },
    data: () => ({
        state: {
            custom: false
        },
        localValue: '',
        colorPicker: null,
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.$data.localValue = v
                if (this.$data.colorPicker && v.includes('#')) this.$data.colorPicker.color = v
            }
        }
    },
    mounted () {
        if (this.$refs.custom) {
            this.$data.colorPicker = AColorPicker.createPicker(this.$refs.custom, {
                showHSL: false
            })

            this.$data.colorPicker.color = this.$data.localValue

            this.$data.colorPicker.on('change', (e) => {
                this.$data.localValue = e.color
                this.onSelect()
            })
        }
    },
    methods: {
        onSelect (value) {
            if (value) this.$data.localValue = value

            this.$emit('input', this.$data.localValue)
        }
    }
}
</script>