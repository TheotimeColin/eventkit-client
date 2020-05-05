<template>
    <div class="Generator">
        <div class="Generator_container">
            <div class="Generator_left">
                <div class="Generator_overflow">
                    <configurator
                        :config="config"
                        @update="onUpdate"
                        v-if="config && currentStep.id == 'config'"
                    />
                </div>

                <div class="Generator_footer">
                    <div class="Generator_premiumAlert" v-show="isPremium">
                        ⭐ Votre configuration comporte des éléments premium.
                        <link-base>En savoir plus</link-base>
                    </div>
                    <div class="Generator_actions">
                        <button-base :disabled="step == 0" @click="previousStep">
                            Étape précédente
                        </button-base>

                        <div>
                            <button-base @click="nextStep">
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
                
                <previewer :config="config" :active="0" :print="state.print" v-if="config" />
            </div>
        </div>
    </div>
</template>

<script>
import Configurator from '@/components/generators/configurator'
import Previewer from '@/components/generators/previewer'

export default {
    name: 'Generator',
    components: { Configurator, Previewer },
    props: {
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
        config: null,
    }),
    computed: {
        currentStep () {
            return this.$data.steps[Object.keys(this.$data.steps)[this.$data.step]]
        },
        isPremium () {
            let isPremium = false 

            if (this.$data.config) {
                Object.keys(this.$data.config.theme).forEach(key => {
                    let config = this.$data.config.theme[key]

                    if (config.options) {
                        let valueFound = false

                        config.options.forEach(option => {
                            if (JSON.stringify(config.value) == JSON.stringify(option.value)) {
                                valueFound = true

                                if (option.premium && JSON.stringify(config.value) !== JSON.stringify(config.defaultValue)) {
                                    isPremium = true
                                }
                            }
                        })

                        if (!valueFound) isPremium = true
                    }

                    if (config.premium && config.value !== config.defaultValue) isPremium = true
                })
            }

            return isPremium
        }
    },
    mounted () {
        this.$data.config = { ...this.$props.initConfig }
    },
    methods: {
       onUpdate (config) {
           this.$data.config = config 
       },
       nextStep () {
           this.$data.step += 1
       },
       previousStep () {
           this.$data.step -= 1
       }
    }
}
</script>