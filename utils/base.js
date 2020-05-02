export default {
    props: {
        modifiers: { type: Array, default: () => [] }
    },
    computed: {
        $modifiers () {
            let modifiers = {}

            this.$props.modifiers.forEach(modifier => { 
                if (modifier) {
                    modifiers[this.$options.name + '--' + modifier] = true
                }
            })

            return modifiers
        }
    }
}