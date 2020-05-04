<template>
    <div class="ChoiceButtons">
        <div
            class="ChoiceButtons_option"
            v-for="option in options"
            :class="{ 'is-selected': value == option.value }"
            :key="option.id"
            @click="onSelect(option.value)"
        >
            <p class="ChoiceButtons_content">
                {{ option.label }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChoiceButtons',
    props: {
        value: {},
        options: { type: Array }
    },
    methods: {
        onSelect (value) {
            this.$emit('input', value)
        }
    }
}
</script>