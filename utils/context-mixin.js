export default {
    beforeDestroy () {
        if (process.client) this.$onUtilsDestroy()
    },
    methods: {
        $onContext (v, data) {
            if (v) {
                let position = this.$el.getBoundingClientRect()
                let body = document.body.getBoundingClientRect()

                this.$store.commit('context/set', {
                    data: data,
                    position: {
                        y: position.top - body.top,
                        x: position.left,
                        height: position.height,
                        width: position.width
                    }
                })
            } else {
                this.$store.commit('context/leave')
            }
        },
        $onUtilsDestroy() {
            if (process.client && this.$store) this.$store.commit('context/leave')
        }
    }
}