<template>
    <div class="Previewer" :class="{ 'is-print': print }">
        <div class="Previewer_component" ref="component" v-if="!print">
            <component
                :is="project.config.component"
                :theme="project.values.theme"
                :config="project.config.theme"
                :data="activeItem"
                :style="style"
                :scale="style['--scale']"
            />
        </div>
        <div class="Previewer_print" v-if="print">
            <div class="Previewer_page" :style="style" v-for="(batch, i) in batches" :key="i" ref="component">
                <component
                    class="p-relative"
                    v-for="(item, i) in batch"
                    :is="project.config.component"
                    :theme="project.values.theme"
                    :data="item"
                    :key="i"
                    :scale="style['--scale']"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

import ConversationStarter from '@/components/generators/ConversationStarter'

export default {
    name: 'Previewer',
    components: { ConversationStarter },
    props: {
        project: { type: Object },
        print: { type: Boolean, default: false },
        active: { type: Number, default: 0 }
    },
    data: () => ({
        style: {
            '--scale': 1
        }
    }),
    mounted () {
        this.fit()
        window.addEventListener('resize', throttle(1000, () => this.fit()))
    },
    computed: {
        activeItems () {
            return this.$props.project.values.data
        },
        activeItem () {
            return this.activeItems.filter(i => i.id == this.$props.active)[0]
        },
        batches () {
            let pageWidth = 210
            let pageHeight = 297
            let pageMargins = (15 * 2)

            let componentWidth = this.$props.project.values.theme.size.x
            let componentHeight = this.$props.project.values.theme.size.y

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
            if (!this.$el || !this.$refs.component) return

            this.resetFit()

            this.$nextTick(() => {
                const maxSize = {
                    x: 600,
                    y: 500
                }

                let component = this.$refs.component[0] ? this.$refs.component[0] : this.$refs.component

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
        }
    }
}
</script>