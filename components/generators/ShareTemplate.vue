<template>
    <div class="ShareTemplate" :class="{ ...$modifiers }" :style="{ '--image-scale': scale, '--background-color': backgroundColor }">
        <div class="ShareTemplate_container">
            <component
                class="ShareTemplate_item"
                v-for="item in activeItems"
                :is="theme.component"
                :theme="theme"
                :data="item"
                :style="{ '--scale': scale }"
                :key="item._id"
            />
        </div>

        <img class="ShareTemplate_screenshot" :src="screenshot" v-if="screenshot">

        <button-base class="ShareTemplate_download" :modifiers="['xs']" fa="arrow-to-bottom" @click="onDownload" :loading="state.export" v-show="!screenshot">
            {{ $t('common.download') }}
        </button-base>

        <button-base class="ShareTemplate_download" :modifiers="['xs']" fa="arrow-to-bottom" :download="'test'" :href="screenshot" v-show="screenshot" ref="download">
            {{ $t('common.download') }}
        </button-base>

        <div class="ShareTemplate_printer" :style="{ '--image-scale': 2, '--background-color': backgroundColor }" ref="container">
            <component
                class="ShareTemplate_item"
                v-for="item in activeItems"
                :is="theme.component"
                :theme="theme"
                :data="item"
                :style="{ '--scale': 2 }"
                :key="item._id"
            />
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'
import allKits from '@/utils/all-kits-mixin'

export default {
    name: 'ShareTemplate',
    mixins: [ base, allKits ],
    components: { },
    props: {
        theme: { type: Object },
        items: { type: Array },
        scale: { type: Number, default: 0.75 },
        backgroundColor: { type: String, default: '#ff00ff' }
    },
    data: () => ({
        state: {
            export: false
        },
        screenshot: null
    }),
    computed: {
        activeItems () {
            return this.$props.items.slice(0, 9)
        }
    },
    watch: {
        theme: {
            deep: true,
            handler () {
                this.$data.screenshot = null
            }
        },
        backgroundColor: {
            deep: true,
            handler () {
                this.$data.screenshot = null
            }
        }
    },
    mounted () {
        this.html2canvas = require('html2canvas')
    },
    methods: {
        async onDownload () {
            if (this.$data.state.export) return

            let a = document.createElement("a")
            a.href = await this.screen()
            a.download = 'testlol'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)

        },
        screen () {
            if (this.$data.state.export) return 

            return new Promise(resolve => {
                this.$data.state.export = true 
                
                setTimeout(() => {
                    this.html2canvas(this.$refs.container).then(canvas => {
                        this.$data.screenshot = canvas.toDataURL()
                        this.$data.state.export = false

                        resolve (this.$data.screenshot)
                    })
                }, 1000)
            })
        }
    }
}
</script>