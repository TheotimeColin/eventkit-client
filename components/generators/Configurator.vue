<template>
    <div class="Configurator" v-if="theme">
        <div class="Configurator_theme">
            <nav-bar class="Configurator_nav" :modifiers="['secondary']" :items="nav" :current="state.active" />
            
            <div class="p-40">
                <div class="Configurator_group" v-for="(group, key) in availableOptions" :key="key" v-show="state.active == key">
                    <div
                        class="Configurator_row"
                        v-for="(item, key) in group"
                        :key="key"
                    >
                        <p class="mb-10" v-if="item.label"><b>{{ item.label }}</b></p>

                        <component
                            :is="item.type"
                            :premium="item.premium"
                            :is-premium="hasPremium"
                            :options="item.options"
                            :theme="theme"
                            :default-value="item.defaultValue"
                            v-model="theme[key]"
                            @input="$store.commit('kits/project/updateTheme', theme)"
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
    pattern: { position: 2, label: 'Motif', fa: 'chess-board' },
    colors: { position: 1, label: 'Couleurs', fa: 'fill-drip' },
    format: { position: 4, label: 'Format', fa: 'ruler' },
    text: { position: 3, label: 'Textes', fa: 'text' },
}

export default {
    name: 'Configurator',
    components: { NavBar, ChoiceButtons, PatternPicker, ColorPicker, InputText, Range, FontPicker },
    props: {
        initTheme: { type: Object },
        project: { type: Object },
        hasPremium: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            active: ''
        },
        theme: null
    }),
    computed: {
        availableOptions () {
            let theme = {}

            Object.keys(this.$props.initTheme).forEach(key => {
                let value = this.$props.initTheme[key]
                if (!value.static) {
                    if (!theme[value.group]) theme[value.group] = {}
                    theme[value.group][key] = value
                }
            })

            return theme
        },
        nav () {
            return Object.keys(this.availableOptions).map(key => ({
                ...GROUPS[key],
                id: key,
                onClick: () => this.$data.state.active = key
            })).sort((a, b) => a.position - b.position)
        }
    },
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.theme = JSON.parse(JSON.stringify(v.theme))
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
        background-color: var(--color-bg-light);
        border-bottom: 1px solid var(--color-border);
    }

    .Configurator_row.is-disabled {
        opacity: 0.25;
        pointer-events: none;
    }
</style>