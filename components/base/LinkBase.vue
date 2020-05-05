<template>
    <div
        class="LinkBase"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="to" v-if="to">
            <slot></slot>
        </nuxt-link>

        <a :href="href || node && node.attrs.href" v-if="!to">
            <span ref="content"></span>
            <slot></slot>
        </a>
    </div>
</template>

<script>
import context from '@/utils/context-mixin'

export default {
    name: 'LinkBase',
    mixins: [context],
    props: {
        href: { default: false },
        to: { default: false },
        context: { default: false },
        node: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context || this.$props.node && this.$props.node.attrs.context) {
                this.$onContext(v, this.$props.context ? this.$props.context : this.$props.node.attrs.context)
            }
        }
    }
}
</script>