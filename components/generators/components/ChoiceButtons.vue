<template>
    <div class="ChoiceButtons">
        <div
            class="ChoiceButtons_option"
            v-for="option in options"
            :class="{
                'is-selected': JSON.stringify(value) === JSON.stringify(option.value),
                'is-premium': option.premium
            }"
            :key="option.id"
            @click="onSelect(option.value)"
        >
            <p class="ChoiceButtons_content">
                {{ option.label }}
            </p>

            <p class="ChoiceButtons_premium" v-show="option.premium">⭐</p>
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