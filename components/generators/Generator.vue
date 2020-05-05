<template>
    <div class="Generator">
        <div class="Generator_container">
            <div class="Generator_left">
                <div class="Generator_overflow">
                    <div v-if="!project">
                        Welcome

                        <button-base @click="$emit('create')">
                            Créer mon projet
                        </button-base>
                    </div>

                    <configurator
                        :project="project"
                        @update="(v) => $emit('update', v)"
                        v-if="project && currentStep.id == 'config'"
                    />
                </div>

                <div class="Generator_footer">
                    <div class="Generator_premiumAlert" v-show="isPremium">
                        ⭐ Votre configuration comporte des éléments premium.
                        <link-base>En savoir plus</link-base>
                    </div>

                    <div class="Generator_actions" v-if="project">
                        <button-base :disabled="step == 0" @click="previousStep">
                            Étape précédente
                        </button-base>

                        <div class="d-flex fx-align-center">
                            <p class="ft-s text-right">
                                Dernière sauvegarde :<br>
                                {{ lastSaved }}
                            </p>
                            <button-base class="ml-10" @click="$emit('save')">
                                Sauvegarder
                            </button-base>
                            <button-base class="ml-10"  @click="nextStep">
                                Prochaine étape
                            </button-base>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Generator_previewer">
                <div class="Generator_previewOptions">
                    <button-base @click="state.print = !state.print">
                        Mode page
                    </button-base>
                </div>
                
                <previewer :project="project" :active="0" :print="state.print" v-if="project" />
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

import Configurator from '@/components/generators/Configurator'
import Previewer from '@/components/generators/Previewer'

export default {
    name: 'Generator',
    components: { Configurator, Previewer },
    props: {
        project: { type: Object },
        initConfig: { type: Object }
    },
    data: () => ({
        state: {
            print: false
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
    }),
    computed: {
        currentStep () {
            return this.$data.steps[Object.keys(this.$data.steps)[this.$data.step]]
        },
        isPremium () {
            let isPremium = false 

            if (this.$props.project) {
                Object.keys(this.$props.project.values.theme).forEach(key => {
                    let config = this.$props.project.config.theme[key]
                    let value = this.$props.project.values.theme[key]

                    if (config.options) {
                        let valueFound = false

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
            return dayjs(this.$props.project.modifiedDate).fromNow()
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