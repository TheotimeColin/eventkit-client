<template>
    <div class="ColorPicker">
        <div
            class="ColorPicker_option"
            v-for="option in options"
            :class="{ 'is-selected': value == option.value }"
            :style="{ '--background': option.thumb ? option.thumb : option.value }"
            :key="option.id"
            @click="onSelect(option.value)"
        >
        </div>

        <div
            class="ColorPicker_option ColorPicker_custom"
            :class="{ 'is-selected': value == custom, 'is-active': state.custom }"
            :style="{ '--background': custom }"
            @click="state.custom = true"
            ref="custom"
        >
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
        this.$data.colorPicker = AColorPicker.createPicker(this.$refs.custom, {})
        this.$data.colorPicker.on('change', (e) => {
            this.$data.custom = e.color
            this.onSelect(this.$data.custom)
        })

        document.addEventListener('click', (e) => {
            if (!this.$refs.custom.contains(e.target)) this.$data.state.custom = false
        })
    },
    methods: {
        onSelect (value) {
            this.$emit('input', value)
        }
    }
}
</script>