<template>
    <div class="Generator">
        <div class="Generator_header" :style="{ '--pattern': pattern }">
            <div>
                <p class="ft-title-xl">
                    <input type="text" placeholder="Nom de mon projet" class="Input--unstyled ft-bold" :value="project.title" v-if="project" @change="onTitleChange">
                </p>

                <p class="ft-m">
                    {{ project.kit.title }}

                    <label v-if="$store.state.auth.user && $store.state.auth.user.admin">
                        <input type="checkbox" @change="onTemplateChange" :checked="project.template"> Template
                    </label>
                </p>
            </div>

            <div class="Generator_premiumAlert StyledBlock StyledBlock--no-border StyledBlock--gold p-relative" v-if="!hasPremium && sale">
                <button-base @click="onPremium" :modifiers="['gold', 'round', 's']" class="fx-no-shrink">
                    Devenir Créateur
                </button-base>

                <p class="ml-20">
                    Jusqu'à <span class="ft-m"><b>-40%</b></span> sur ton abonnement, <span class="ft-m"><b>pour toujours</b></span> !
                    <b>Offre limitée aux 100 premiers inscrits.</b>
                </p>

                <loading-bar :modifiers="['absolute', 'gold']" :max="100" :value="sale.times_redeemed" />
            </div>

            <div class="d-flex fx-align-center">
                <div class="ft-s text-right mr-10" v-if="!project.temporary && !project.premium || project.premium && user.plan">
                    Dernière sauvegarde :<br>
                    <b>{{ saveWarning ? '⚠️ ' : '' }}{{ lastSaved }}</b>
                </div>

                <div class="ft-s text-right mr-10" v-if="project.temporary && user || project.premium && !user.plan">
                    Limite de projets atteinte.<br>Supprime un ancien ou
                    <link-base @click.native="onPremium">deviens Créateur</link-base> !
                </div>

                <div class="ft-s text-right mr-10" v-if="!user">
                    Pour sauvegarder ton projet, <link-base @click.native="$store.commit('popins/open', { id: 'login' })">crée un compte</link-base>, <br>c'est gratuit.
                </div>

                <button-base class="ml-10" :modifiers="['blue']" @click="$store.dispatch('kits/project/save')" :disabled="project.temporary || project.premium && !user.plan">
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
                        :theme="project.theme"
                        :init-theme="initTheme"
                        @update="(v) => $store.commit('kits/project/updateTheme', v)"
                        v-show="state.step == 'config'"
                    />

                    <data-editor
                        class="Generator_dataEditor"
                        :project="project"
                        @select="(v) => selected = v"
                        v-show="state.step == 'data'"
                    />

                    <printer
                        class="Generator_printer"
                        :project="project"
                        :theme="project.theme"
                        v-show="state.step == 'print'"
                    />

                    <sharer
                        :project="project"
                        :init-theme="initTheme"
                        v-show="state.step == 'share'"
                    />
                </div>
            </div>

            <div class="Generator_previewer" v-show="state.step != 'print'">
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

        <popin-generic :modifiers="['s']" :is-active="state.wait" v-if="project.temporary && user && !user.plan">
            <template slot="header">
                <div class="ph-40 pv-20">
                    <p class="ft-title-l"><b>Limite de projets atteinte</b></p>
                </div>
            </template>
            
            <div class="p-40">
                <p>Tu as atteint la limite de projets pour un compte gratuit. Tu ne pourras pas sauvegarder ou imprimer ce projet.<p>
                <p>Supprime un ancien projet ou Deviens Créateur pour débloquer toutes les options et créer des projets en illimité !</p>
                
                <div class="mt-40 d-flex">
                    <button-base :modifiers="['secondary']" @click="state.wait = false">Ok, je veux juste tester</button-base>
                    <button-base :modifiers="['premium']">Devenir Créateur</button-base>
                </div>
            </div>
        </popin-generic>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import patterns from '@/config/patterns'

import NavBar from '@/components/generators/NavBar'
import Configurator from '@/components/generators/Configurator'
import Previewer from '@/components/generators/Previewer'
import DataEditor from '@/components/generators/DataEditor'
import Printer from '@/components/generators/Printer'
import Sharer from '@/components/generators/Sharer'
import PopinGeneric from '@/components/popins/PopinGeneric'
import LoadingBar from '@/components/interactive/LoadingBar'

export default {
    name: 'Generator',
    components: { NavBar, Sharer, Configurator, Previewer, DataEditor, PopinGeneric, Printer, LoadingBar },
    head () {
        return {
            title: this.$props.project ? `${this.$props.project.kit.title} à imprimer` : undefined
        }
    },
    async fetch () {
        await this.$auth.fetchUser()
        this.$cookies.set('project-id', this.$props.project._id)
    },
    props: {
        project: { type: Object },
        initTheme: { type: Object }
    },
    data: () => ({
        state: {
            step: 'print',
            setPremium: false,
            print: false,
            printing: false,
            wait: true
        },
        selected: 'default'
    }),
    computed: {
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
        },
        loggedIn () {
            return this.$store.state.auth.loggedIn
        },
        pattern () {
            if (!this.$props.project.theme) return

            let patternUrl = ''
            let pattern = patterns[this.$props.project.theme.pattern.patternUrl]
            if (pattern) patternUrl = pattern('EFFCFF', 0.75, 1)

            return `url("${patternUrl}")`
        },
        sale () {
            return this.$store.state.premium.information.early
        }
    },
    watch: {
        ['state.step'] (v) {
            this.$data.state.print = v == 'print'
        },
        loggedIn (v) {
            if (v) this.$store.dispatch('kits/project/save')
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