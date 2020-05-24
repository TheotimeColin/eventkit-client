<template>
    <div class="PageGenerator" :style="{ '--page-scale': scale }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'PageGenerator',
    props: {
        scale: { type: Number, default: 0.5 }
    },
    data: () => ({
        image: null
    }),
    mounted () {
        this.html2canvas = require('html2canvas')
    },
    methods: {
        screenshot () {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.html2canvas(this.$el, { allowTaint: true, profile: true }).then(canvas => {
                        this.$data.image = canvas.toDataURL("image/png")

                        resolve(this.$data.image)
                    })
                }, 1000)
            })
        }
    }
}
</script>