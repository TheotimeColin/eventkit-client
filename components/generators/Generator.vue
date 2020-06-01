<template>
    <div class="Generator">
        <div class="Generator_header" :style="{ '--pattern': pattern }">
            <div>
                <div class="ft-title-xl">
                    <input type="text" :placeholder="$t(`comp.generator.header.project`)" class="Input--unstyled ft-bold" :value="project.title" v-if="project" @change="onTitleChange">
                </div>

                <div class="ft-m">
                    {{ project.kit.title }}
                </div>
            </div>

            <div class="Generator_premiumAlert StyledBlock StyledBlock--no-border StyledBlock--gold p-relative" v-if="!hasPremium && sale">
                <button-base @click="onPremium" :modifiers="['gold', 'round', 's']" class="fx-no-shrink">
                    {{ $t(`premium.offers.earlyBird.cta`) }}
                </button-base>

                <p class="ml-20" v-html="$t(`premium.offers.earlyBird.excerpt`)"></p>

                <loading-bar :modifiers="['absolute', 'gold']" :max="100" :value="sale.times_redeemed" />
            </div>

            <div class="d-flex fx-align-center width-2xs">
                <div class="ft-s text-right mr-10" v-if="!project.temporary && !project.premium || project.premium && user.plan">
                    {{ $t(`comp.generator.lastSave`) }} :<br>
                    <b>{{ saveWarning ? '⚠️ ' : '' }}{{ lastSaved }}</b>
                </div>

                <div class="ft-s text-right mr-10" v-if="project.temporary && user || project.premium && !user.plan">
                    {{ $t(`comp.generator.limit`) }} <link-base @click.native="onPremium">{{ $t(`comp.generator.cta.premium`) }}</link-base>
                </div>

                <div class="ft-s text-right mr-10" v-if="!user">
                    {{ $t(`comp.generator.toSave`) }} <link-base @click.native="$store.commit('popins/open', { id: 'login' })">{{ $t(`comp.generator.cta.create`) }}</link-base>{{ $t(`comp.generator.free`) }}
                </div>

                <button-base class="ml-10 fx-no-shrink" :modifiers="['blue']" @click="$store.dispatch('kits/project/save')" :disabled="project.temporary || project.premium && !user.plan">
                    {{ $t(`comp.generator.cta.save`) }}
                </button-base>
            </div>
        </div>

        <div class="Generator_container">
            <nav-bar class="Generator_navBar" :modifiers="['vertical', 'l']" :current="state.step" :items="[
                { id: 'config', fa: 'clone', onClick: () => state.step = 'config' },
                { id: 'data', fa: 'list-ol', onClick: () => state.step = 'data' },
                { id: 'print', fa: 'print', onClick: () => state.step = 'print' },
                { id: 'admin', fa: 'crown', onClick: () => state.step = 'admin', hidden: user && user.admin ? false : true }
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
                        @generate="onGenerate"
                        v-show="state.step == 'print'"
                    />

                    <template-creator
                        :project="project"
                        v-if="state.step == 'admin'"
                    />
                </div>
            </div>

            <div class="Generator_previewer" v-show="state.step != 'share'">
                <!-- <div class="Generator_previewOptions" v-if="project">
                    <button-base @click="state.print = !state.print">
                        {{ state.print ? 'Mode individuel' : 'Mode page' }}
                    </button-base>
                </div> -->
                
                <previewer
                    :project="project"
                    :selected="selected"
                    :print="state.print"
                    v-if="project"
                    ref="previewer"
                />
            </div>
        </div>

        <popin-generic :modifiers="['s']" :is-active="state.wait" v-if="project.temporary && user && !user.plan" @close="state.wait = false">
            <template slot="header">
                <div class="ph-30 pv-20">
                    <p class="ft-title-l"><b>{{ $t('comp.generator.limitedPopin.title') }}</b></p>
                </div>
            </template>
            
            <div class="p-30">
                <p v-html="$t('comp.generator.limitedPopin.content')"><p>

                <div class="StyledBlock StyledBlock--gold mt-20 d-flex fx-align-center">
                    <button-base
                        class="fx-no-shrink mr-20"
                        :modifiers="['gold', 's']"
                        @click="() => { onPremium(); state.wait = false; }"
                    >
                        {{ $t('comp.generator.limitedPopin.cta') }}
                    </button-base>
                    <p v-html="$t('comp.generator.limitedPopin.premium')"></p>
                </div>
            </div>

            <template slot="footer">
                <button-base :to="{ name: 'kits' }" :modifiers="['secondary', 's']">
                    {{ $t('comp.generator.limitedPopin.cancel') }}
                </button-base>

                <button-base :modifiers="['s']" @click="state.wait = false">
                    {{ $t('comp.generator.limitedPopin.confirm') }}
                </button-base>
            </template>
        </popin-generic>

        <popin-project
            :is-active="state.share"
            @close="state.share = false" 
            :project="project"
        />
    </div>
</template>

<script>
import dayjs from 'dayjs'
import patterns from '@/config/patterns'

import NavBar from '@/components/generators/NavBar'
import Configurator from '@/components/generators/Configurator'
import Previewer from '@/components/generators/Previewer'
import DataEditor from '@/components/generators/DataEditor'
import TemplateCreator from '@/components/generators/TemplateCreator'
import Printer from '@/components/generators/Printer'
import PopinGeneric from '@/components/popins/PopinGeneric'
import PopinProject from '@/components/popins/PopinProject'
import LoadingBar from '@/components/interactive/LoadingBar'

export default {
    name: 'Generator',
    components: { NavBar, Configurator, Previewer, DataEditor, PopinGeneric, Printer, LoadingBar, PopinProject, TemplateCreator },
    head () {
        return {
            title: this.$props.project ? `${this.$props.project.kit.title} à imprimer` : undefined
        }
    },
    async fetch () {
        await this.$auth.fetchUser()
        await this.$store.dispatch('premium/getInfo')
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
            wait: true,
            share: false
        },
        selected: 'default',
        generatedKit: null
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
        onGenerate (v) {
            this.$data.generatedKit = v
        }
    }
}
</script>