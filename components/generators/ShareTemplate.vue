<template>
    <div class="ShareTemplate" :class="{ ...$modifiers }" :style="{ '--image-scale': scale }">
        <div class="ShareTemplate_container">
            <component
                class="ShareTemplate_item"
                v-for="item in activeItems"
                :is="initTheme.component.value"
                :theme="theme"
                :init-theme="initTheme"
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
        initTheme: { type: Object },
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
        console.log('mounted')
        
    },
    computed: {
        activeItems () {
            return this.$props.items.slice(0, 9)
        }
    },
    watch: {

    },
    methods: {
        screen () {
            this.$data.scale = 2
            
            setTimeout(() => {
                this.html2canvas(this.$el).then(canvas => {
                    this.$data.screenshot = canvas.toDataURL()

                    this.$data.scale = 0.75
                })
            }, 1000)
        }
    }
}
</script>