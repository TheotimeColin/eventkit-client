<template>
    <div class="Previewer" :class="{ 'is-print': print }">
        <div class="Previewer_component" ref="component" v-if="!print">
            <component
                :is="project.theme.component"
                :theme="project.theme"
                :data="activeItem"
                :style="style"
                :scale="style['--scale']"
                v-if="activeItem"
            />
        </div>
        <div class="Previewer_print" v-if="print">
            <page-generator
                class="Previewer_page"
                :style="styleConfig"
                :scale="style['--page-scale']"
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
                    :scale="style['--page-scale'] * theme.page.componentScale"
                />
            </page-generator>
        </div>
    </div>
</template>

<script>
import { throttle } from 'throttle-debounce'
import kitMixin from '@/utils/kit-mixin'
import allKits from '@/utils/all-kits-mixin'
import batchesMixin from '@/utils/batches-mixin'

import PageGenerator from '@/components/generators/PageGenerator'

export default {
    name: 'Previewer',
    mixins: [ kitMixin, allKits, batchesMixin ],
    components: { PageGenerator },
    props: {
        project: { type: Object },
        print: { type: Boolean, default: false },
        selected: { type: String, default: 'default' }
    },
    data: () => ({
        style: {
            '--scale': 1
        },
        images: []
    }),
    mounted () {
        this.fit()
        window.addEventListener('resize', throttle(1000, () => this.fit()))
    },
    computed: {
        theme () {
            return this.$props.project.theme
        },
        allIdeas () {
            let result = []

            this.$props.project.ideaCategories.forEach(category => {
                result = [ ...category.ideas, ...result ]
            })

            return result
        },
        styleConfig () {
            let style = {}

            if (this.$props.project.theme.page) {
                style['--margins'] = this.$props.project.theme.page.margins
                style['--spacing'] = this.$props.project.theme.page.spacing
            }

            return style
        },
        activeItems () {
            let activeItems = this.allIdeas.filter(idea => !idea.disabled)
            return activeItems
        },
        activeItem () {
            let selected = this.activeItems.filter(i => i._id == this.$props.selected)
            return selected[0] ? selected[0] : this.activeItems[this.activeItems.length - 1]
        },
        batches () {
            return this.$batches({ theme: this.theme })
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

                let containerWidth = Math.min(this.$el.offsetWidth * (this.$props.print ? 0.85 : 0.6), this.$props.print ? 9999 : maxSize.x)
                let componentWidth = component.offsetWidth
                let componentWidthScale = (containerWidth / componentWidth).toFixed(1)

                let containerHeight = Math.min(this.$el.offsetHeight * (this.$props.print ? 0.85 : 0.6), this.$props.print ? 9999 : maxSize.y)
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