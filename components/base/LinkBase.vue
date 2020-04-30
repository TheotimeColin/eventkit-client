<template>
    <a
        class="LinkBase"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
        :href="href"
    >
        <slot></slot>
    </a>
</template>

<script>
import utils from '@/mixins/utils'

export default {
    name: 'LinkBase',
    mixins: [ utils ],
    props: {
        href: { type: String, default: '#' },
        context: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) {
                this.onContext(v, this.$props.context)
            }
        }
    }
}
</script>