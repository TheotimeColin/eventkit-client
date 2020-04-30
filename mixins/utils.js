export default {

    methods: {
        onContext (v, data) {
            if (v) {
                let position = this.$el.getBoundingClientRect()

                this.$store.commit('modules/context/set', {
                    data: data,
                    position: {
                        y: this.$el.offsetTop,
                        x: position.left,
                        height: position.height,
                        width: position.width
                    }
                })
            } else {
                this.$store.commit('modules/context/leave')
            }
        }
    }
}