<template>
    <div class="ChoiceButtons">
        <div
            class="ChoiceButtons_option"
            v-for="option in fixedOptions"
            :class="{
                'is-selected': JSON.stringify(localValue) === JSON.stringify(option.value),
                'is-premium': option.premium && !isPremium
            }"
            :key="option.id"
            @click="onSelect(option.value)"
        >
            <p class="ChoiceButtons_content">
                {{ option.label }}
            </p>
        </div>

        <div
            class="ChoiceButtons_custom"
            v-for="option in customOptions"
            :class="{
                'is-selected': JSON.stringify(localValue) === JSON.stringify(option.value),
                'is-premium': option.premium
            }"
            :key="option.id"
        >
            <div class="d-flex fx-align-center mr-10" v-for="(custom, key) in option.custom" :key="key">
                <p class="mr-10">{{ custom.label }}</p>

                <input class="ChoiceButtons_customInput" type="number" step="0.5" v-model="localValue[key]" @change="update" v-if="custom.type == 'input'">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChoiceButtons',
    props: {
        value: {},
        options: { type: Array },
        isPremium: { type: Boolean, default: false }
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
    computed: {
        fixedOptions () {
            return this.$props.options.filter(v => !v.custom)
        },
        customOptions () {
            return this.$props.options.filter(v => v.custom)
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