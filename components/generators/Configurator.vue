<template>
    <div class="Configurator" v-if="localTheme">
        <div class="Configurator_theme">
            <nav-bar class="Configurator_nav" :modifiers="['secondary']" :items="nav" :current="state.active" />
            
            <div class="p-30">
                <div class="Configurator_group" v-for="(group, key) in configurators" :key="key" v-show="state.active == key">
                    <div
                        class="Configurator_row"
                        v-for="(component, key) in group"
                        :key="key"
                    >
                        <p class="ft-xs" v-if="component.displayLabel">
                            <b>{{ $t(`comp.configurator.components.${key}`) }}</b>
                        </p>

                        <component
                            :is="component.type"
                            :options="component.options"
                            :default-value="component.value"
                            :theme="localTheme"
                            v-bind="{ ...(component.props ? component.props : {}) }"
                            v-model="localTheme[key]"
                            @input="$emit('update', localTheme)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBar from '@/components/generators/NavBar'
import ChoiceButtons from '@/components/generators/components/ChoiceButtons'
import ColorPicker from '@/components/generators/components/ColorPicker'
import PatternPicker from '@/components/generators/components/PatternPicker'
import FontPicker from '@/components/generators/components/FontPicker' 
import InputText from '@/components/generators/components/InputText'
import Range from '@/components/generators/components/Range'

const GROUPS = {
    pattern: { position: 2, fa: 'chess-board' },
    colors: { position: 1, fa: 'fill-drip' },
    format: { position: 4, fa: 'ruler' },
    text: { position: 3, fa: 'text' },
}

export default {
    name: 'Configurator',
    components: { NavBar, ChoiceButtons, PatternPicker, ColorPicker, InputText, Range, FontPicker },
    props: {
        initTheme: { type: Object },
        theme: { type: Object }
    },
    data: () => ({
        state: {
            active: ''
        },
        localTheme: null
    }),
    computed: {
        configurators () {
            let configurators = {}

            Object.keys(this.$props.initTheme.options).forEach(optionId => {
                let option = this.$props.initTheme.options[optionId]

                if (option.type) {
                    if (!configurators[option.group]) configurators[option.group] = {}
                    configurators[option.group][optionId] = option
                }
            })

            return configurators
        },
        nav () {
            return Object.keys(this.configurators).map(key => ({
                ...GROUPS[key],
                id: key,
                label: this.$t(`comp.configurator.nav.${key}`),
                onClick: () => this.$data.state.active = key
            })).sort((a, b) => a.position - b.position)
        }
    },
    watch: {
        theme: {
            immediate: true,
            deep: true,
            handler (v) {
                if (v) this.$data.localTheme = JSON.parse(JSON.stringify(v))
            }
        }
    },
    mounted () {
        this.$data.state.active = this.nav[0].id
    }
}
</script>

<style lang="scss"> 
    .Configurator_row {
        padding: 20px 0;
        border-bottom: 1px solid var(--color-border);

        &:first-child {
            padding-top: 0;
        }
    }

    .Configurator_nav {
        position: sticky;
        top: 0;
        z-index: 8;
        width: 100%;
    }

    .Configurator_row.is-disabled {
        opacity: 0.25;
        pointer-events: none;
    }
</style>