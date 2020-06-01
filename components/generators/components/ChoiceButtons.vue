<template>
    <div class="ChoiceButtons">
        <div
            class="ChoiceButtons_option"
            v-for="(option, name) in options"
            :class="{
                'is-selected': localValue == option
            }"
            :key="name"
            @click="onSelect(option)"
        >
            <p class="ChoiceButtons_content">
                {{ name }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChoiceButtons',
    props: {
        value: {},
        options: { type: Object }
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
        onSelect (value) {
            this.$data.localValue = value
            
            this.update()
        },
        update () {
            this.$emit('input', this.$data.localValue)
        }
    }
}
</script>