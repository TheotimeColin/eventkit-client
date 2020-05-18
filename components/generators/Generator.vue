<template>
    <div class="Generator">
        <div class="Generator_header">
            <div>
                <p class="ft-title-xl">
                    <input type="text" placeholder="Nom de mon projet" class="Input--unstyled" :value="project.title" v-if="project" @change="onTitleChange">
                </p>

                <p class="ft-m">
                    {{ project.kit.title }}

                    <label v-if="$store.state.auth.user && $store.state.auth.user.admin">
                        <input type="checkbox" @change="onTemplateChange" :checked="project.template"> Template
                    </label>
                </p>
            </div>

            <div class="Generator_premiumAlert" v-if="!hasPremium">
                <button-base @click="onPremium" :modifiers="['premium', 'round', 's']" class="fx-no-shrink">
                    Devenir Créateur
                </button-base>

                <p class="ml-20">
                    De <span class="ft-m"><b>30% à 40%</b></span> de réduction sur nos abonnements !
                    <b>Offre limitée aux 100 premiers inscrits</b>
                </p>
            </div>

            <div class="d-flex fx-align-center">
                <p class="ft-s text-right mr-10">
                    Dernière sauvegarde :<br>
                    <b>{{ saveWarning ? '⚠️ ' : '' }}{{ lastSaved }}</b>
                </p>

                <button-base class="ml-10" :modifiers="['save']" @click="$store.dispatch('kits/project/save')">
                    Sauvegarder
                </button-base>
            </div>
        </div>

        <div class="Generator_container">
            <nav-bar class="Generator_navBar" :modifiers="['vertical', 'l']" :current="state.step" :items="[
                { id: 'config', fa: 'clone', onClick: () => state.step = 'config' },
                { id: 'data', fa: 'list-ol', onClick: () => state.step = 'data' },
                { id: 'print', fa: 'print', onClick: () => state.step = 'print' },
                { id: 'share', fa: 'heart', onClick: () => state.step = 'share' }
            ]" />

            <div class="Generator_left">
                <div class="Generator_overflow">
                    <configurator
                        class="Generator_configurator"
                        :has-premium="hasPremium"
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

                    <printer
                        class="Generator_printer"
                        @print="onPrint"
                        :is-loading="state.printing"
                        v-if="project && state.step == 'print'"
                    />

                    <sharer
                        :project="project"
                        :init-theme="initTheme"
                        v-if="project && state.step == 'share'"
                    />
                </div>
            </div>

            <div class="Generator_previewer">
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
                    ref="previewer"
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
import Printer from '@/components/generators/Printer'
import Sharer from '@/components/generators/Sharer'
import PopinGeneric from '@/components/popins/PopinGeneric'

export default {
    name: 'Generator',
    components: { NavBar, Sharer, Configurator, Previewer, DataEditor, PopinGeneric, Printer },
    head () {
        return {
            title: this.$props.project ? `${this.$props.project.kit.title} à imprimer` : undefined
        }
    },
    props: {
        project: { type: Object },
        initTheme: { type: Object }
    },
    data: () => ({
        state: {
            step: 'config',
            setPremium: false,
            print: false,
            printing: false
        },
        steps: {
            config: {
                id: 'config',
                active: true
            },
            data: {
                id: 'data',
                active: false
            },
        },
        step: 0,
        selected: 'default'
    }),
    computed: {
        currentStep () {
            return this.$data.steps[Object.keys(this.$data.steps)[this.$data.step]]
        },
        hasPremium () {
            return this.$store.state.auth.user && this.$store.state.auth.user.plan ? true : false
        },
        lastSaved () {
            let date = this.$props.project ? this.$props.project.modifiedDate : new Date()
            return  dayjs(date).fromNow()
        },
        saveWarning () {
            let date = this.$props.project ? this.$props.project.modifiedDate : new Date()
            return dayjs(new Date()).diff(date, 'minutes') > 10
        },
        user () {
            return this.$store.state.auth.user
        }
    },
    methods: {
        onPremium () {
            this.$store.commit('popins/open', { id: 'premium' })
        },
        onTitleChange (e) {
            this.$store.commit('kits/project/updateProject', {
                title: e.target.value
            })
        },
        onTemplateChange (e) {
            if (!this.$store.state.auth.user.admin) return 

            this.$store.commit('kits/project/updateProject', {
                template: e.target.checked
            })
        },
        async onPrint (e) {
            this.$data.state.printing = true 
            await this.$refs.previewer.onExport(e)
            this.$data.state.printing = false
        }
    }
}
</script>