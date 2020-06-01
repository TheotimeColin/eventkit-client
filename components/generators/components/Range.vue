<template>
    <div class="RangeSlider">
        <p class="RangeSlider_label ft-s">
            <b v-if="label">{{ label }}</b>
            <span v-if="valueDisplay">{{ localValue }}</span>
            <span v-if="unitDisplay">{{ unit }}</span>
        </p>
        
        <range-slider
            class="RangeSlider_input fx-grow"
            :disabled="disabled"
            type="range" :min="min" :max="max" :step="step" :value="localValue" @input="(v) => onUpdate(v)"
        />
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
        valueDisplay: { type: Boolean, default: false },
        defaultValue: { type: Number, default: 1 },
        label: { type: String },
        unit: { type: String },
        unitValue: { type: Boolean, default: false },
        unitDisplay: { type: Boolean, default: false },
        min: { type: Number },
        max: { type: Number },
        step: { type: Number },
        disabled: { type: Boolean, default: false }
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
                this.$data.localValue = parseFloat(v)
            }
        }
    },
    methods: {
        onUpdate: throttle(50, function (v) {
            if (this.$props.unit && this.$props.unitValue) v += this.$props.unit

            this.$emit('input', v)
        })
    }
}
</script>