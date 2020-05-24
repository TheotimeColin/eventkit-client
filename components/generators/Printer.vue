<template>
    <div class="Printer">
        <div class="Printer_content p-40">
            <div class="row">
                <div class="col-shrink">
                    <component
                        class="p-relative"
                        :is="project.theme.component"
                        :theme="project.theme"
                        :data="activeItems[0]"
                        :scale="1"
                    />
                </div>
                <div class="col-grow fx-grow">
                    <p class="ft-l">
                        <b>Configuration de la page</b>
                    </p>

                    <div class="max-width-xs">
                        <range
                            class="mv-20"
                            :options="{ label: 'Agrandissement cartes', min: 1, max: 2, step: 0.1, unit: 'x', display: true }"
                            v-model="theme.page.cardScale"
                            @input="$store.commit('kits/project/updateTheme', theme)"
                        />

                        <range
                            class="mv-20"
                            :options="{ label: 'Marges de la page', min: 0, max: 20, step: 0.5, unit: 'mm', unitValue: true, display: true }"
                            v-model="theme.page.margins"
                            @input="$store.commit('kits/project/updateTheme', theme)"
                        />

                        <range
                            class="mv-20"
                            :options="{ label: 'Espacement cartes', min: 0, max: 10, step: 0.1, unit: 'mm', unitValue: true, display: true }"
                            v-model="theme.page.spacing"
                            @input="$store.commit('kits/project/updateTheme', theme)"
                        />
                    </div>

                    <div class="d-flex fx-align-center">
                        <button-base class="mt-10" :modifiers="['s', 'blue']" @click="onExport" :loading="state.loading">
                            Générer le kit <span v-show="state.loading">(page {{ state.page }} sur {{ batches.length }})</span>
                        </button-base>
                        
                        
                        <p class="ml-10" v-show="state.outdated && !state.first">⚠️ Projet mis à jour, le kit doit être généré de nouveau.</p>
                    </div>
                </div>
            </div>

            <hr class="mv-40">

            <div class="text-center">
                <button-base :modifiers="['s']" @click="downloadZip" :disabled="!files.zip || state.loading">
                    Tout télécharger (.zip)
                </button-base>
            </div>
            <div class="row-none fx-wrap mt-40">
                <div class="col-4" v-for="i in 3" :key="i + 'n'" v-show="state.loading">
                    <div class="Printer_pageImage is-loading"></div>
                </div>

                <div class="col-4" v-for="(image, j) in images" :key="j" v-show="!state.loading">
                    <div class="Printer_pageImage">
                        <img class="width-100" :src="image">
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

export default {
    name: 'Printer',
    components: { Accordion, Range, PageGenerator, ConversationStarter },
    props: {
        project: { type: Object }
    },
    data: () => ({
        state: {
            first: true,
            test: false,
            loading: false,
            outdated: false,
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
            let date = dayjs(new Date()).format('MMDDTHH:mm:ss')
            let name = `${slugify(this.$props.project.title)}-${date}.zip`
            saveAs(this.$data.files.zip, name)
        },
        onExport () {
            this.$data.state.outdated = false
            this.$data.state.first = false
            this.$data.state.loading = true

            setTimeout(() => {
                this.$data.images = []
                this.$data.state.page = 0

                let generate = this.$refs.page.reduce(async (previousPromise, page) => {
                    await previousPromise

                    this.$data.state.page++
                    let screenshot = await page.screenshot()
                    this.$data.images.push(screenshot)
                    return screenshot
                }, Promise.resolve())

                generate.then(() => this.onDone())
            }, 500)
        },
        async onDone () {
            let zip = new JSZip()

            this.$data.images.forEach((image, i) => {
                zip.file(`page-${i + 1}.png`, image.replace('data:image/png;base64,', ''), { base64: true })
            })

            this.$data.files.zip = await zip.generateAsync({ type: 'blob' })

            this.$data.state.loading = false
            this.$data.state.test = false
        }
    }
}
</script>