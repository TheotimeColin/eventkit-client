<template>
    <div class="Range">
        <div v-for="(option, i) in options" :key="i">
            <div class="d-flex fx-align-center">
                <p class="pr-10" v-if="option.label">{{ option.label }}</p>
                <range-slider
                    class="RangeSlider fx-grow"
                    type="range" min="1" max="200" :value="value * 100" @input="onUpdate" />
            </div>
        </div>
    </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'

export default {
    name: 'Range',
    components: { RangeSlider },
    props: {
        value: {},
        options: { type: Array }
    },
    data: () => ({
        localValue: null
    }),
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) { this.$data.localValue = v }
        }
    },
    methods: {
        onUpdate (v) {
            this.$data.localValue = v
            this.$emit('input', (this.$data.localValue / 100).toFixed(2))
        }
    }
}
</script>