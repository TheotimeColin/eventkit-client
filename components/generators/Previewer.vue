<template>
    <div class="Previewer" :class="{ 'is-print': print, 'is-export': state.export }">
        <div class="Previewer_component" ref="component" v-if="!print">
            <component
                :is="initTheme.component.value"
                :theme="project.theme"
                :init-theme="initTheme"
                :data="activeItem"
                :style="style"
                :scale="style['--scale']"
                v-if="activeItem"
            />
        </div>
        <div class="Previewer_print" v-if="print" @click="onExport">
            <page-generator
                class="Previewer_page"
                :scale="style['--page-scale'] * (state.export ? 3 : 1)"
                v-for="(batch, i) in batches"
                :key="i"
                ref="page"
            >
                <component
                    class="p-relative"
                    v-for="(item, i) in batch"
                    :is="initTheme.component.value"
                    :theme="project.theme"
                    :init-theme="initTheme"
                    :data="item"
                    :key="i"
                    :scale="style['--scale'] * (state.export ? 3 : 1)"
                />
            </page-generator>
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

import ConversationStarter from '@/components/generators/ConversationStarter'
import PageGenerator from '@/components/generators/PageGenerator'

export default {
    name: 'Previewer',
    components: { ConversationStarter, PageGenerator },
    props: {
        initTheme: { type: Object },
        project: { type: Object },
        print: { type: Boolean, default: false },
        selected: { type: String, default: 'default' }
    },
    data: () => ({
        state: {
            export: false
        },
        style: {
            '--scale': 1
        }
    }),
    mounted () {
        this.jsPDF = require('jspdf')

        this.fit()
        window.addEventListener('resize', throttle(1000, () => this.fit()))
    },
    computed: {
        activeItems () {
            return this.$props.project.ideas.filter(idea => !idea.disabled)
        },
        activeItem () {
            let selected = this.activeItems.filter(i => i._id == this.$props.selected)
            return selected[0] ? selected[0] : this.activeItems[this.activeItems.length - 1]
        },
        batches () {
            let pageWidth = 210
            let pageHeight = 297
            let pageMargins = (15 * 2)

            let componentWidth = this.$props.project.theme.size.x
            let componentHeight = this.$props.project.theme.size.y

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
            handler () {
                this.fit()
            }
        },
        print () {
            this.fit()
        }
    },
    methods: {
        fit () {
            this.resetFit()

            this.$nextTick(() => {
                const maxSize = {
                    x: 600,
                    y: 500
                }

                let component = null
                if (this.$refs.page && this.$refs.page[0]) component = this.$refs.page[0].$el
                if (this.$refs.component) component = this.$refs.component
    
                if (!component) return

                let containerWidth = Math.min(this.$el.offsetWidth * 0.8, this.$props.print ? 9999 : maxSize.x)
                let componentWidth = component.offsetWidth
                let componentWidthScale = (containerWidth / componentWidth).toFixed(1)

                let containerHeight = Math.min(this.$el.offsetHeight * 0.8, this.$props.print ? 9999 : maxSize.y)
                let componentHeight = component.offsetHeight
                let componentHeightScale = (containerHeight / componentHeight).toFixed(1)

                this.$data.style = {
                    '--page-scale': Math.min(componentWidthScale, this.$props.print ? 9999 : componentHeightScale),
                    '--scale': Math.min(componentWidthScale, this.$props.print ? 9999 : componentHeightScale)
                }
            })
        },
        resetFit () {
            this.$data.style = {
                '--page-scale': 1,
                '--scale': 1
            }
        },
        async onExport () {
            this.$data.state.export = true
            this.$data.export = new this.jsPDF()

            let pages = await Promise.all(this.$refs.page.map(page => {
                return page.screenshot()
            }))

            let width = this.$data.export.internal.pageSize.getWidth()
            let height = this.$data.export.internal.pageSize.getHeight()

            pages.forEach((page, i) => {
                this.$data.export.addImage(page, 0, 0, width, height)
                if (i < pages.length - 1) this.$data.export.addPage()
            })

            this.$data.state.export = false
            this.$data.export.save('test.pdf')
        }
    }
}
</script>