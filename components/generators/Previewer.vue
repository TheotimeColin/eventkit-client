<template>
    <div class="Previewer" :class="{ 'is-print': print }">
        <div class="Previewer_component" ref="component" v-if="!print">
            <component :is="config.component" :config="config" :data="activeItem" :style="style" />
        </div>
        <div class="Previewer_print" v-if="print">
            <div class="Previewer_page" :style="style" v-for="(batch, i) in batches" :key="i" ref="component">
                <component
                    class="p-relative"
                    v-for="(item, i) in batch"
                    :is="config.component"
                    :config="config"
                    :data="item"
                    :key="i"
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
        config: { type: Object },
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
        // window.addEventListener('resize', throttle(300, () => this.fit()))
    },
    computed: {
        activeItems () {
            return this.$props.config.data
        },
        activeItem () {
            return this.$props.config.data.filter(i => i.id == this.$props.active)[0]
        },
        batches () {
            let pageWidth = 210
            let pageHeight = 297
            let pageMargins = (15 * 2)

            let componentWidth = this.$props.config.theme.choices.size.value.x
            let componentHeight = this.$props.config.theme.choices.size.value.y

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
        config: {
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
            if (!this.$el) return

            this.resetFit()

            this.$nextTick(() => {
                let component = this.$refs.component[0] ? this.$refs.component[0] : this.$refs.component

                let containerWidth = this.$el.offsetWidth * 0.8
                let componentWidth = component.offsetWidth
                let componentWidthScale = (containerWidth / componentWidth).toFixed(1)

                let containerHeight = this.$el.offsetHeight * 0.8
                let componentHeight = component.offsetHeight
                let componentHeightScale = (containerHeight / componentHeight).toFixed(1)

                this.$data.style = {
                    '--page-scale': Math.min(componentWidthScale, componentHeightScale),
                    '--scale': Math.min(componentWidthScale, componentHeightScale)
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