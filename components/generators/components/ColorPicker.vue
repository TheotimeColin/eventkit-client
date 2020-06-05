<template>
    <div class="ColorPicker">
        <div v-for="(group, key) in colorGroups" :key="key">
            <div
                v-for="color in group.colors"
                class="ColorPicker_color"
                :style="{ '--background-color': color.value }"
                @click="onSelect(color.value)"
                :key="color.value"
            ></div>
        </div>
    </div>
</template>

<script>
import COLORS from '@/config/kits/common/colors'
const APalettePicker = require('a-color-picker')

export default {
    name: 'ColorPicker',
    components: {},
    props: {
        value: {}
    },
    data: () => ({
        state: {},
        localValue: '',
        colorPicker: null,
        COLORS: COLORS
    }),
    watch: {
        value: {
            immediate: true,
            handler (v) {
                this.$data.localValue = v
                if (this.$data.colorPicker) this.$data.colorPicker.color = this.$props.value
            }
        }
    },
    computed: {
        colorGroups () {
            let groups = {}
            
            COLORS.forEach(color => {
                if (!groups[color.family]) groups[color.family] = { colors: [] }
                groups[color.family].colors.push(color)
            })

            return groups
        }
    },
    mounted () {
        if (this.$refs.custom) {
            this.$data.colorPicker = APalettePicker.createPicker(this.$refs.custom, {
                showHSL: false,
                showRGB: false
            })

            this.$data.colorPicker.on('change', (e) => {
                this.$data.localValue  = e.color
                this.onSelect()
            })
        }
    },
    methods: {
        onSelect (v) {
            this.$data.localValue = v
            this.$emit('input', this.$data.localValue)
        }
    }
}
</script>