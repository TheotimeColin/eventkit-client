<template>
    <div class="ColorPicker">
        <div
            class="ColorPicker_option"
            v-for="option in options"
            :class="{ 'is-selected': value == option.value, [option.class]: true }"
            :key="option.id"
            @click="onSelect(option.value)"
        >
        </div>
    </div>
</template>

<script>
export default {
    name: 'ColorPicker',
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