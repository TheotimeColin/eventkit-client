<template>
    <div class="Printer">
        <nav-bar class="Printer_nav" :modifiers="['secondary']" :items="[
            { id: 'generate', label: $t('comp.printer.nav.generate'), fa: 'sync', onClick: () => state.current = 'generate' },
            { id: 'download', label: $t('comp.printer.nav.download'), fa: 'arrow-to-bottom', onClick: () => state.current = 'download' },
            { id: 'publish', label: $t('comp.printer.nav.share'), fa: 'share-alt', disabled: !user, onClick: () => state.current = 'publish', hidden: true }
        ]" :current="state.current" />

        <div class="Printer_content p-30">
            <div v-show="state.current == 'generate'">
                <p class="ft-l">
                    <b>{{ $t('comp.printer.generate.title') }}</b>
                </p>

                <div class="mv-20">
                    <range
                        :label="$t(`comp.printer.generate.scale`)"
                        :min="1"
                        :max="2"
                        :step="0.05"
                        unit="x"
                        :display="true"
                        v-model="theme.page.componentScale"
                        :options="['componentScale']"
                        @input="$store.commit('kits/project/updateTheme', theme)"
                        :disabled="state.loading"
                    />
                </div>

                <div class="mv-20">
                    <range
                        :label="$t(`comp.printer.generate.spacing`)"
                        :min="0"
                        :max="10"
                        :step="0.1"
                        unit="mm"
                        :unit-value="true"
                        :unit-display="true"
                        :value-display="true"
                        v-model="theme.page.spacing"
                        :options="['spacing']"
                        @input="$store.commit('kits/project/updateTheme', theme)"
                        :disabled="state.loading"
                    />
                </div>

                <div class="mv-20">
                    <range
                        :label="$t(`comp.printer.generate.margins`)"
                        :min="0"
                        :max="20"
                        :step="0.5"
                        unit="mm"
                        :unit-value="true"
                        :unit-display="true"
                        :value-display="true"
                        v-model="theme.page.margins"
                        :options="['margins']"
                        @input="$store.commit('kits/project/updateTheme', theme)"
                        :disabled="state.loading"
                    />
                </div>

                <div class="d-flex fx-align-center">
                    <button-base class="mt-10" :modifiers="['s', 'blue']" @click="onExport" :loading="state.loading">
                        {{ $t(`comp.printer.generate.cta`) }} <span v-show="state.loading">{{ $t(`comp.printer.generate.loader`, { current: state.page, max: batches.length }) }}</span>
                    </button-base>
                    
                    <p class="ml-10" v-show="state.outdated && !state.first">
                        {{ $t(`comp.printer.generate.updated`)}}
                    </p>
                </div>
            </div>

            <div v-show="state.current == 'download'">
                <div>
                    <button-base :modifiers="['s', 'blue']" @click="downloadZip" :disabled="!mainZippedFile || state.loading">
                        {{ $t('comp.printer.download.cta.all') }}
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
                                    {{ $t('comp.printer.download.cta.page') }}
                                </button-base>
                            </div>

                            <img class="width-100" :src="image.src">
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="state.current == 'publish' && user">
                <!-- <div class="StyledBlock StyledBlock--cyan d-flex fx-justify-between fx-align-center p-20">
                    <button-base class="fx-no-shrink" :modifiers="['s', 'blue']" :disabled="!files.zip || !state.outpublished" :loading="state.uploading" @click="onPublish">
                        {{ $t('comp.printer.publish.cta.update') }}
                    </button-base>

                    <div class="pl-20 fx-grow">
                        <div v-html="$t('comp.printer.publish.sharing')"></div>
                    </div>
                </div>
                
                <div class="mt-20 b br-4 p-20">
                    <div class="d-flex fx-justify-between fx-align-center mv-20">
                        <copy-text class="fx-grow" :text="'kits/conversation-starters/-lEVUNEQ7kits/conversation-starters/-lEVUNEQ7kits/conversation-starters/-lEVUNEQ7'" />

                        <button-base class="fx-no-shrink ml-10" :modifiers="['s', 'secondary']" @click="state.preview = true">
                            {{ $t('comp.printer.publish.cta.preview') }}
                        </button-base>
                    </div>
                </div> -->

                <div class="mb-40 o-hidden" v-if="theme.templates">
                    <simple-slider :modifiers="['s']">
                        <div
                            v-for="template in templates"
                            :key="template.name"
                        >   
                            <share-template
                                :modifiers="[template.name]"
                                :scale="0.5"
                                :theme="project.theme"
                                :background-color="theme.templates.backgroundColor"
                                :items="project.ideas"
                                ref="template"
                            />
                        </div>
                    </simple-slider>

                    <color-picker
                        class="mt-20"
                        v-model="theme.templates.backgroundColor"
                        @input="$store.commit('kits/project/updateTheme', theme)"
                    />
                </div>
            </div>
        </div>

        <!-- <popin-project
            :is-active="state.preview"
            @close="state.preview = false" 
            :project="project"
        /> -->

        <div class="Printer_canvas">
            <page-generator
                class="Previewer_page"
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
                    :scale="2 * theme.page.componentScale"
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
import allKits from '@/utils/all-kits-mixin'
import batchesMixin from '@/utils/batches-mixin'

import Accordion from '@/components/interactive/Accordion'
import Range from '@/components/generators/components/Range'
import CopyText from '@/components/utils/CopyText'
import PageGenerator from '@/components/generators/PageGenerator'
import NavBar from '@/components/generators/NavBar'
import ShareTemplate from '@/components/generators/ShareTemplate'
import ColorPicker from '@/components/generators/components/ColorPicker'
import SimpleSlider from '@/components/interactive/SimpleSlider'
import PopinProject from '@/components/popins/PopinProject'

export default {
    name: 'Printer',
    mixins: [ allKits, batchesMixin ],
    components: { Accordion, Range, PageGenerator, NavBar, CopyText, ShareTemplate, ColorPicker, SimpleSlider, PopinProject },
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
            outpublished: false,
            uploading: false,
            preview: false,
            page: 0
        },
        files: {
            zip: null
        },
        theme: {},
        images: [],
        templates: []
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
            return this.$batches({ theme: this.$data.theme })
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
                
                this.$data.state.outdated = true
                this.$data.state.outpublished = true
            }
        }
    },
    mounted () {
        this.$data.templates = [
            { name: 'falling-down', backgroundColor: '#ffffff' },
            { name: 'simple-stack', backgroundColor: '#ffffff' },
            { name: 'messy', backgroundColor: '#ffffff' },
            { name: 'ordered', backgroundColor: '#ffffff' }
        ]
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
            this.$data.state.outpublished = false
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