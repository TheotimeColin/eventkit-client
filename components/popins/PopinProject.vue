<template>
    <popin-generic class="PopinProject" :is-active="isActive" @close="$emit('close')">
        <template slot="header">
            <div class="ph-20 pv-10 ft-l">
                <b>Publier mon projet</b>
            </div>
        </template>

        <div class="PopinProject_editMode StyledBlock StyledBlock--no-border StyledBlock--cyan">
            <div class="ft-xs pr-20">
                Tu peux configurer ici ce que les visiteurs verront si tu souhaites partager ton projet. <b>Seules les personnes possédant ton lien personnalisé peuvent y accéder.</b>
            </div>

            <!-- <div class="fx-no-shrink ft-0">
                <button-base class="mr-5" :modifiers="['s', 'blue']" @click="$store.dispatch('kits/project/save')">
                    Sauvegarder
                </button-base>
            </div> -->
        </div>
        
        <div class="p-20">
            <div class="row-s">
                <div class="col-5 max-width-xs">
                    <gallery :items="generated" :downloadable="true" :items-length="templates.length" />
                </div>
                <div class="col-grow fx-grow">
                    <div class="Input--unstyled Input_container">
                        <input type="text" placeholder="Nom de mon projet" class="Input_element ft-title-xl ft-bold" :value="project.title" v-if="project" @change="(e) => $store.commit('kits/project/updateProject', { title: e.target.value })">
                    </div>

                    <base-textarea
                        class="Input--unstyled ft-l mt-10"
                        placeholder="Description de mon projet"
                        :value="project.description"
                        @input="(v) => $store.commit('kits/project/updateProject', { description: v })"
                    />
                </div>
            </div>
        </div>

        <div class="PopinProject_generator">
            <share-template
                v-for="template in templates"
                :modifiers="[template]"
                :theme="project.theme"
                :items="project.ideas"
                :key="template"
                ref="template"
            />
        </div>

        <template slot="footer">
            <button-base :modifiers="['s', 'secondary', 'blue']" fa="share-alt" @click="$store.dispatch('kits/project/save')">
                Partager
            </button-base>

            <!-- <button-base :modifiers="['s', 'blue']" @click="">
                Sauvegarder et publier
            </button-base> -->
        </template>
    </popin-generic>
</template>

<script>
import { throttle } from 'throttle-debounce';

import ShareTemplate from '@/components/generators/ShareTemplate'
import PopinGeneric from '@/components/popins/PopinGeneric'
import Gallery from '@/components/interactive/Gallery'
import BaseTextarea from '@/components/form/BaseTextarea'

export default {
    name: 'PopinProject',
    components: { ShareTemplate, PopinGeneric, Gallery, BaseTextarea },
    props: {
        project: { type: Object },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            export: false,
            progress: 0
        },
        templates: ['falling-down', 'simple-stack', 'messy', 'ordered'],
        generated: []
    }),
    mounted () {
        // this.generate()
    },
    computed: {

    },
    watch: {

    },
    methods: {
        generate () {
            if (!this.$refs.template) return 

            this.$data.state.progress = 0
            this.$data.generated = []
            
            let generate = this.$refs.template.reduce(async (previousPromise, template) => {
                await previousPromise

                this.$data.state.progress++

                let screenshot = await template.screen()
                this.$data.generated.push({
                    src: screenshot
                })

                return screenshot
            }, Promise.resolve())

            // generate.then(() => this.onDone())
        }
    }
}
</script>