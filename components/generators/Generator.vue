<template>
    <div class="Generator">
        <div class="Generator_header" v-if="project">
            <p class="ft-title-l">
                <b>{{ project ? project.id : 'Nouveau projet' }}</b>
            </p>

            <div class="d-flex fx-align-center" v-if="project">
                <p class="ft-s text-right mr-10">
                    Dernière sauvegarde :<br>
                    {{ saveWarning ? '⚠️ ' : '' }}{{ lastSaved }}
                </p>
                <button-base class="ml-10" @click="$store.dispatch('generators/save')">
                    Sauvegarder
                </button-base>
            </div>
        </div>

        <div class="Generator_container">
            <nav-bar class="Generator_navBar" :modifiers="['vertical', 'l']" :current="state.step" :items="[
                { id: 'config', fa: 'fill-drip', onClick: () => state.step = 'config' },
                { id: 'data', fa: 'list-ol', onClick: () => state.step = 'data' },
                { id: 'print', fa: 'print', onClick: () => state.step = 'print' },
                { id: 'share', fa: 'heart', onClick: () => state.step = 'share' }
            ]" v-if="project" />

            <kickstart class="Generator_kickstart" @create="$emit('create')" v-if="!project" />

            <div class="Generator_left" v-if="project">
                <div class="Generator_overflow">
                    <configurator
                        class="Generator_configurator"
                        :project="project"
                        :initTheme="initTheme"
                        v-if="project && state.step == 'config'"
                    />

                    <data-editor
                        class="Generator_dataEditor"
                        :project="project"
                        @select="(v) => selected = v"
                        v-if="project && state.step == 'data'"
                    />

                    <sharer
                        :project="project"
                        :init-theme="initTheme"
                        v-if="project && state.step == 'share'"
                    />
                </div>
            </div>

            <div class="Generator_previewer" v-if="project">
                <div class="Generator_premiumAlert" v-show="isPremium">
                    ⭐ Votre configuration comporte des éléments premium.
                    <link-base>En savoir plus</link-base>
                </div>
                
                <div class="Generator_previewOptions" v-if="project">
                    <button-base @click="state.print = !state.print">
                        {{ state.print ? 'Mode individuel' : 'Mode page' }}
                    </button-base>
                </div>
                
                <previewer
                    :project="project"
                    :init-theme="initTheme"
                    :selected="selected"
                    :print="state.print"
                    v-if="project"
                />
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

import NavBar from '@/components/generators/NavBar'
import Configurator from '@/components/generators/Configurator'
import Previewer from '@/components/generators/Previewer'
import DataEditor from '@/components/generators/DataEditor'
import Kickstart from '@/components/generators/Kickstart'
import Sharer from '@/components/generators/Sharer'

export default {
    name: 'Generator',
    components: { NavBar, Kickstart, Sharer, Configurator, Previewer, DataEditor },
    props: {
        project: { type: Object },
        initTheme: { type: Object }
    },
    data: () => ({
        state: {
            step: 'share',
            print: false,
            creative: false
        },
        steps: {
            config: {
                id: 'config',
                active: true
            },
            data: {
                id: 'data',
                active: false
            }
        },
        step: 0,
        selected: 'default'
    }),
    computed: {
        currentStep () {
            return this.$data.steps[Object.keys(this.$data.steps)[this.$data.step]]
        },
        isPremium () {
            let isPremium = false 

            if (this.$props.project) {
                Object.keys(this.$props.project.theme).forEach(key => {
                    let config = this.$props.initTheme[key]
                    let value = this.$props.project.theme[key]

                    if (config.options) {
                        let valueFound = true

                        config.options.forEach(option => {
                            let optionValue = config.defining ? value[config.defining] : value
                            let optionConfig = config.defining ? option.value[config.defining] : option.value

                            if (JSON.stringify(optionValue) == JSON.stringify(optionConfig)) {
                                valueFound = true

                                if (option.premium && JSON.stringify(value) !== JSON.stringify(config.defaultValue)) {
                                    isPremium = true
                                }
                            }
                        })
                        
                        if (config.custom && !valueFound) isPremium = true
                    }

                    if (config.premium && value !== config.defaultValue) isPremium = true
                })
            }

            return isPremium
        },
        lastSaved () {
            let date = this.$props.project ? this.$props.project.modifiedDate : new Date()
            return  dayjs(date).fromNow()
        },
        saveWarning () {
            let date = this.$props.project ? this.$props.project.modifiedDate : new Date()
            return dayjs(new Date()).diff(date, 'minutes') > 10
        }
    },
    methods: {
       nextStep () {
           this.$data.step += 1
       },
       previousStep () {
           this.$data.step -= 1
       }
    }
}
</script>