<template>
    <div class="Range">
        <div>
            <p class="mb-5 ft-s">
                <span v-if="options.label"><b>{{ options.label }}</b></span>
                <span v-if="options.display">{{ localValue }}</span>
                <span v-if="options.unit">{{ options.unit }}</span>
            </p>
            <range-slider
                class="RangeSlider fx-grow"
                type="range" :min="options.min" :max="options.max" :step="options.step" :value="localValue" @input="onUpdate" />
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
        options: { type: Object }
    },
    data: () => ({
        throttle,
        localValue: null
    }),
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.localValue = parseFloat(v).toFixed(1)
            }
        }
    },
    methods: {
        onUpdate: throttle(50, function (v) {
            if (this.$props.options.unit) v += this.$props.options.unit

            this.$emit('input', v)
        })
    }
}
</script>