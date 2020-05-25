<template>
    <div class="ShareTemplate" :class="{ ...$modifiers }" :style="{ '--image-scale': scale }">
        <div class="ShareTemplate_container" @click="screen">
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
    </div>
</template>

<script>
import base from '@/utils/base'

import ConversationStarter from '@/components/generators/ConversationStarter'

export default {
    name: 'ShareTemplate',
    mixins: [ base ],
    components: { ConversationStarter },
    props: {
        theme: { type: Object },
        items: { type: Array }
    },
    data: () => ({
        state: {
            export: false
        },
        scale: 0.75,
        screenshot: null
    }),
    mounted () {
        this.html2canvas = require('html2canvas')
    },
    computed: {
        activeItems () {
            return this.$props.items.slice(0, 9)
        }
    },
    methods: {
        screen () {
            return new Promise(resolve => {
                this.$data.scale = 2
                
                setTimeout(() => {
                    this.html2canvas(this.$el).then(canvas => {
                        this.$data.screenshot = canvas.toDataURL()
                        this.$data.scale = 0.75
                        resolve (this.$data.screenshot)
                    })
                }, 1000)
            })
        }
    }
}
</script>