<template>
    <div class="Configurator">
        <div class="Configurator_theme Form">
            <div
                class="Configurator_row Form_row"
                v-for="(item, key) in config.theme.choices"
                :class="{ 'is-disabled': configCondition(item) }"
                :key="key"
            >
                <p class="mb-10">{{ item.label }}</p>

                <component
                    :is="item.type"
                    :options="item.options"
                    v-model="item.value"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ChoiceButtons from '@/components/generators/components/ChoiceButtons'
import ColorPicker from '@/components/generators/components/ColorPicker'

export default {
    name: 'Configurator',
    components: { ChoiceButtons, ColorPicker },
    props: {
        config: { type: Object }
    },
    watch: {
        config: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$emit('update', v)
            }
        }
    },
    methods: {
        configCondition (item) {
            let disabled = false

            if (item.conditions) {
                Object.keys(item.conditions).forEach(key => {
                    let condition = item.conditions[key]
                    let path = key.split('.')

                    let value = this.$props.config
                    path.forEach(key => value = value[key])

                    if (value != condition) disabled = true
                })
            }

            return disabled
        }
    }
}
</script>

<style lang="scss">
    .Configurator_row.is-disabled {
        opacity: 0.5;
        pointer-events: none;
    }
</style>