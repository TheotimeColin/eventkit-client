export default {
    props: {
        modifiers: { type: Array, default: () => [] }
    },
    computed: {
        $modifiers () {
            return this.$props.modifiers.map(modifier => { 
                if (modifier) {
                    return { [this.$options.name + '--' + modifier]: true }
                } else {
                    return false
                }
            })
        }
    }
}