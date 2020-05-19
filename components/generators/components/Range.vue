<template>
    <div class="Range">
        <div v-for="(option, i) in options" :key="i">
            <div class="d-flex fx-align-center">
                <p class="pr-10" v-if="option.label">{{ option.label }}</p>
                <range-slider
                    class="RangeSlider fx-grow"
                    type="range" :min="option.min" :max="option.max" :step="option.step" :value="value" @input="onUpdate" />
            </div>
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

import RangeSlider from 'vue-range-slider'

export default {
    name: 'Range',
    components: { RangeSlider },
    props: {
        value: {},
        defaultValue: { type: Number, default: 1 },
        options: { type: Array }
    },
    data: () => ({
        throttle,
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
        onUpdate: throttle(50, function (v) {
            this.$data.localValue = v
            this.$emit('input', this.$data.localValue.toFixed(2))
        })
    }
}
</script>