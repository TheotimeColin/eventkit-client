<template>
    <div class="ColorPicker">
        <div
            v-for="option in options"
            class="ColorPicker_option"
            :class="{
                'ColorPicker_custom': option.custom,
                'is-selected': option.custom ? value == custom : value == option.value,
                'is-active': state.custom
            }"
            :style="{ '--background': option.thumb ? option.thumb : (option.custom ? custom : option.value) }"
            @click="onSelect(option.custom ? custom : option.value, option.custom)"
            :ref="option.custom ? 'custom' : 'color'"
            :key="option.id"
        >
            <p class="ColorPicker_premium" v-if="option.premium">⭐</p>
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
        colorPicker: null,
        custom: '#ffffff'
    }),
    mounted () {
        if (this.$refs.custom) {
            this.$data.colorPicker = AColorPicker.createPicker(this.$refs.custom[0], {
                showHSL: false,
                showRGB: false,
                showHEX: false
            })

            this.$data.colorPicker.on('change', (e) => {
                this.$data.custom = e.color
                this.onSelect(this.$data.custom)
            })
        }

        document.addEventListener('click', (e) => {
            if (!e.target || !this.$refs.custom) return
            
            if (!this.$refs.custom[0].contains(e.target)) this.$data.state.custom = false
        })
    },
    methods: {
        onSelect (value, custom) {
            if (custom) this.$data.state.custom = true

            this.$emit('input', value)
        }
    }
}
</script>