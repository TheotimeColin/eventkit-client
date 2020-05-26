<template>
    <div class="Printer">
        <nav-bar class="Printer_nav" :modifiers="['secondary']" :items="[
            { id: 'generate', label: 'Générer', fa: 'sync', onClick: () => state.current = 'generate' },
            { id: 'download', label: 'Télécharger', fa: 'arrow-to-bottom', onClick: () => state.current = 'download' },
            { id: 'publish', label: 'Publier', fa: 'check-square', disabled: !user, onClick: () => state.current = 'publish' }
        ]" :current="state.current" />

        <div class="Printer_content p-30">
            <div v-show="state.current == 'generate'">
                <p class="ft-l">
                    <b>Configuration de la page</b>
                </p>

                <range
                    class="mv-20"
                    :options="{ label: 'Agrandissement cartes', min: 1, max: 2, step: 0.05, unit: 'x', display: true }"
                    v-model="theme.page.cardScale"
                    @input="$store.commit('kits/project/updateTheme', theme)"
                    :disabled="state.loading"
                />

                <range
                    class="mv-20"
                    :options="{ label: 'Marges de la page', min: 0, max: 20, step: 0.5, unit: 'mm', unitValue: true, display: true }"
                    v-model="theme.page.margins"
                    @input="$store.commit('kits/project/updateTheme', theme)"
                    :disabled="state.loading"
                />

                <range
                    class="mv-20"
                    :options="{ label: 'Espacement cartes', min: 0, max: 10, step: 0.1, unit: 'mm', unitValue: true, display: true }"
                    v-model="theme.page.spacing"
                    @input="$store.commit('kits/project/updateTheme', theme)"
                    :disabled="state.loading"
                />

                <div class="d-flex fx-align-center">
                    <button-base class="mt-10" :modifiers="['s', 'blue']" @click="onExport" :loading="state.loading">
                        Générer le kit <span v-show="state.loading">(page {{ state.page }} sur {{ batches.length }})</span>
                    </button-base>
                    
                    
                    <p class="ml-10" v-show="state.outdated && !state.first">⚠️ Projet mis à jour, le kit doit être généré de nouveau.</p>
                </div>
            </div>

            <div v-show="state.current == 'download'">
                <div>
                    <button-base :modifiers="['s', 'blue']" @click="downloadZip" :disabled="!mainZippedFile || state.loading">
                        Tout télécharger (.zip)
                    </button-base>
                </div>
                <div class="row-none fx-wrap mt-40">
                    <div class="col-4" v-for="i in 3" :key="i + 'n'" v-show="state.loading">
                        <div class="Printer_pageImage is-loading"></div>
                    </div>

                    <div class="col-4" v-for="(image, j) in images" :key="j" v-show="!state.loading">
                        <div class="Printer_pageImage">
                            <div class="Printer_pageDownload">
                                <button-base :modifiers="['xs']" fa="arrow-to-bottom" :download="image.name" :href="image.src">
                                    Télécharger la page
                                </button-base>
                            </div>

                            <img class="width-100" :src="image.src">
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="state.current == 'publish' && user">
                <div class="">
                    Si tu souhaites partager ton kit, tu peux créer ici un lien de partage. <b>Ton kit ne sera visible que par les personnes qui possèdent ce lien.</b>
                </div>

                <div class="StyledBlock StyledBlock--cyan d-flex fx-justify-between fx-align-center mv-20 p-20">
                    <div>
                        <p>Pour mettre à jour le kit, génére d'abord un fichier</p>
                        <p class="ft-xs color-ft-weak" v-if="lastPublication">Dernière publication : {{ lastPublication }}</p>
                    </div>

                    <button-base class="fx-no-shrink" :modifiers="['s', 'blue']" :disabled="!files.zip" :loading="state.uploading" @click="onPublish">
                        Mettre à jour
                    </button-base>
                </div>
                
                <div class="mt-20 b br-4 p-20">
                    <div class="d-flex fx-justify-between fx-align-center mb-20">
                        <p>kits/conversation-starters/-lEVUNEQ7</p>
                        <button-base :modifiers="['s', 'secondary']">
                            Prévisualiser
                        </button-base>
                    </div>

                    <div class="StyledBlock StyledBlock--gold d-flex fx-align-center">
                        <button-base
                            class="fx-no-shrink"
                            :modifiers="['s', 'gold']"
                        >
                            Devenir Créateur
                        </button-base>

                        <div class="pl-20">
                            Avec un compte gratuit, si ton lien n'est pas visité pendant <b>plus d'un mois</b>, il sera automatiquement désactivé.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="Printer_canvas">
            <page-generator
                class="Printer_page"
                :style="styleConfig"
                :scale="2"
                v-for="(batch, i) in batches"
                :key="i"
                ref="page"
            >
                <component
                    class="p-relative"
                    v-for="(item, i) in batch"
                    :is="project.theme.component"
                    :theme="project.theme"
                    :data="item"
                    :key="i"
                    :scale="(2 * project.theme.page.cardScale)"
                />
            </page-generator>
        </div>
    </div>
</template>

<script>
import JSZip from 'jszip'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import slugify from 'slugify'

import Accordion from '@/components/interactive/Accordion'
import Range from '@/components/generators/components/Range'
import PageGenerator from '@/components/generators/PageGenerator'
import ConversationStarter from '@/components/generators/ConversationStarter'
import NavBar from '@/components/generators/NavBar'

export default {
    name: 'Printer',
    components: { Accordion, Range, PageGenerator, ConversationStarter, NavBar },
    props: {
        project: { type: Object }
    },
    data: () => ({
        state: {
            current: 'generate',
            first: true,
            test: false,
            loading: false,
            outdated: false,
            uploading: false,
            page: 0
        },
        files: {
            zip: null
        },
        theme: {},
        images: []
    }),
    computed: {
        activeItems () {
            let activeItems = this.$props.project.ideas.filter(idea => !idea.disabled)
            return this.$data.state.test ? activeItems.slice(0, 1) : activeItems
        },
        styleConfig () {
            let style = {}

            if (this.$props.project.theme.page) {
                style['--margins'] = this.$props.project.theme.page.margins
                style['--spacing'] = this.$props.project.theme.page.spacing
            }

            return style
        },
        batches () {
            let pageWidth = 210
            let pageHeight = 297
            let spacing = parseInt(this.$props.project.theme.page.spacing)
            let margins = parseInt(this.$props.project.theme.page.margins)
            let pageMargins = margins * 2

            let componentWidth = (this.$props.project.theme.page.cardScale * this.$props.project.theme.size.x) + (spacing * 2)
            let componentHeight = (this.$props.project.theme.page.cardScale * this.$props.project.theme.size.y) + (spacing * 2)

            let fitWidth = Math.floor((pageWidth - pageMargins) / componentWidth)
            let fitHeight = Math.floor((pageHeight - pageMargins) / componentHeight)

            let batchSize = fitWidth * fitHeight

            let batches = []
            let batch = []
            let size = batchSize
            let batchId = 0

            this.activeItems.forEach(component => {
                batch.push(component)
                size--

                batches[batchId] = batch

                if (size == 0) {
                    batchId++
                    size = batchSize
                    batch = []
                }    
            })

            return batches
        },
        projectSlug () {
            let date = dayjs(new Date()).format('MMDDTHH:mm:ss')
            return `${slugify(this.$props.project.title, { lower: true, strict: true })}-${date}.zip`
        },
        mainZippedFile () {
            let result = this.$props.project.mainZippedFile ? this.$props.project.mainZippedFile : false
            if (this.$data.files.zip) result = this.$data.files.zip

            return result
        },
        lastPublication () {
            return this.$props.project.publishedDate ? dayjs(this.$props.project.publishedDate).fromNow() : false
        },
        user () {
            return this.$store.state.auth.user
        }
    },
    watch: {
        project: {
            immediate: true,
            deep: true,
            handler (v) {
                this.$data.theme = JSON.parse(JSON.stringify(v.theme))
                if (!this.$data.theme.page) this.$data.theme.page = { margins: '0mm', spacing: '0mm', cardScale: 1 }

                this.$data.state.outdated = true
            }
        }
    },
    methods: {
        downloadZip () {
            if (this.$data.files.zip) {
                saveAs(this.$data.files.zip, this.projectSlug)
            } else {
                window.open(this.mainZippedFile)
            }
        },
        async onPublish () {
            this.$data.state.uploading = true

            await this.$store.dispatch('kits/project/save', {
                zip: this.$data.files.zip 
            })

            this.$data.state.uploading = false
        },
        onExport () {
            this.$data.state.outdated = false
            this.$data.state.first = false
            this.$data.state.loading = true

            try {
                setTimeout(() => {
                    this.$data.images = []
                    this.$data.state.page = 0

                    let generate = this.$refs.page.reduce(async (previousPromise, page) => {
                        await previousPromise

                        this.$data.state.page++
                        let screenshot = await page.screenshot()
                        this.$data.images.push({
                            name: `page-${this.$data.state.page}-${this.projectSlug}.png`,
                            src: screenshot
                        })
                        return screenshot
                    }, Promise.resolve())

                    generate.then(() => this.onDone())
                }, 500)
            } catch (e) {
                console.warn(e)
                this.onDone()
            }
        },
        async onDone () {
            try {
                let zip = new JSZip()

                this.$data.images.forEach((image, i) => {
                    zip.file(`page-${i + 1}.png`, image.src.replace('data:image/png;base64,', ''), { base64: true })
                })

                this.$data.files.zip = await zip.generateAsync({ type: 'blob' })
            } catch (e) {
                console.warn(e)
            }

            this.$data.state.current = 'download'
            this.$data.state.loading = false
            this.$data.state.test = false
            this.$emit('generate', this.$data.files.zip)
        }
    }
}
</script>