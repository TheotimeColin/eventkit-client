<template>
    <div
        class="ButtonInline"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="to" v-if="to">
            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href">
            <slot></slot>
        </a>
        <slot></slot>
        
        <i class="ButtonInline_icon fa fa-arrow-right"></i>
    </div>
</template>

<script>
import context from '@/utils/context-mixin'

export default {
    name: 'ButtonInline',
    mixins: [ context ],
    props: {
        href: { default: false },
        to: { default: false },
        context: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) this.$onContext(v, this.$props.context)
        }
    }
}
</script>