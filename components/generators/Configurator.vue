<template>
    <div class="Configurator">
        <div class="Configurator_theme">
            <div
                class="Configurator_row"
                v-for="(item, key) in config.theme"
                :class="{ 'is-disabled': configCondition(item) }"
                :key="key"
            >
                <p class="mb-10">{{ item.label }}</p>

                <component
                    :is="item.type"
                    :premium="item.premium"
                    :options="item.options"
                    :default-value="item.defaultValue"
                    v-model="item.value"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ChoiceButtons from '@/components/generators/components/ChoiceButtons'
import ColorPicker from '@/components/generators/components/ColorPicker'
import PatternPicker from '@/components/generators/components/PatternPicker'
import InputText from '@/components/generators/components/InputText'

export default {
    name: 'Configurator',
    components: { ChoiceButtons, PatternPicker, ColorPicker, InputText },
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

                    if (value != condition) {
                        item.value = item.defaultValue
                        disabled = true
                    }
                })
            }

            return disabled
        }
    }
}
</script>

<style lang="scss"> 
    .Configurator_row {
        padding: 20px 0;
        border-bottom: 1px solid var(--color-border);
    }

    .Configurator_row.is-disabled {
        opacity: 0.25;
        pointer-events: none;
    }
</style>