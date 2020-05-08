<template>
    <div class="Range">
        <div v-for="(option, i) in options" :key="i">
            <div class="d-flex fx-align-center">
                <p class="pr-10">{{ option.label }}</p>
                <input class="fx-grow" type="range" min="1" max="200" :value="localValue * 100" @input="onUpdate">
                <p class="pl-10">{{ Math.round(value * 100) }}%</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Range',
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
        onUpdate (e) {
            this.$data.localValue = e.target.value
            this.$emit('input', (this.$data.localValue / 100).toFixed(2))
        }
    }
}
</script>