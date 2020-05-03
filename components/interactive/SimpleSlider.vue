<template>
    <div
        class="SimpleSlider"
        :class="{ 'is-panning': state.panning, 'is-transition': state.transition }"
        :style="{ '--gutter': gutter + 'px' }"
    >
        <div class="SimpleSlider_rail" :style="{ transform: `translate3d(${state.transition ? position : panPosition}px, 0, 0)` }" ref="rail">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SimpleSlider',
    props: {
        gutter: { type: Number, default: 20 }
    },
    data: () => ({
        state: {
            started: false,
            panning: false,
            transition: false
        },
        hammer: null,
        position: 0,
        panPosition: 0,
        sliderWidth: 0,
        elementWidth: 0,
        itemsCount: 0,
        itemsFit: 0
    }),
    mounted () {
        this.$data.itemsCount = this.$el.querySelectorAll('.SimpleSlider_rail > *').length
        if (this.$data.itemsCount <= 0) return

        this.hammer = require('hammerjs')
        this.$data.hammer = new this.hammer(this.$refs.rail)

        this.$data.elementWidth = this.$el.querySelector('.SimpleSlider_rail > *').offsetWidth + this.$props.gutter
        this.$data.itemsFit = Math.floor(this.$refs.rail.offsetWidth / this.elementWidth)

        this.$data.hammer.on('panstart', (e) => this.onPanStart(e))
        this.$data.hammer.on('panend', (e) => this.onPanEnd(e))
        this.$data.hammer.on('panmove', (e) => this.onPan(e))
        this.$data.hammer.get('pan').set({
            direction: Hammer.DIRECTION_HORIZONTAL
        })
    },
    methods: {
        onPanStart (e) {
            this.$data.state.panning = true
            this.$data.state.started = true
            this.$data.state.transition = false
        },
        onPan (e) {
            this.$data.panPosition = this.$data.position + e.deltaX
            

            if (e.isFinal) this.onPanEnd()
        },
        onPanEnd () {
            this.$data.state.started = false

            let endPosition = this.$data.panPosition

            if (endPosition > 0) endPosition = 0
            
            let offset = this.$data.elementWidth * 0.5
            let passedElements = -Math.ceil((endPosition - offset) / this.$data.elementWidth)

            if (passedElements > this.$data.itemsCount - this.$data.itemsFit) passedElements = this.$data.itemsCount - this.$data.itemsFit

            endPosition = -passedElements * this.$data.elementWidth

            this.$data.state.transition = true

            this.$nextTick(() => {
                this.$data.position = endPosition
                this.$data.panPosition = endPosition

                setTimeout(() => {
                    if (!this.$data.state.started) {
                        this.$data.state.panning = false
                        this.$data.state.transition = false
                    }
                }, 500)
            })
        }
    }
}
</script>