<template>
    <div class="Previewer">
        <div class="Previewer_component" ref="component">
            <component :is="config.component" :config="config" :style="style"/>
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
        config: { type: Object }
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
    watch: {
        config: {
            immediate: true,
            deep: true,
            handler () {
                this.fit()
            }
        }
    },
    methods: {
        fit () {
            if (!this.$el) return

            this.resetFit()

            this.$nextTick(() => {
                let containerWidth = this.$el.offsetWidth * 0.8
                let componentWidth = this.$refs.component.offsetWidth
                let componentScale = (containerWidth / componentWidth).toFixed(1)

                this.$data.style = {
                    '--scale': componentScale
                }
            })
        },
        resetFit () {
            this.$data.style = {
                '--scale': 1
            }
        }
    }
}
</script>