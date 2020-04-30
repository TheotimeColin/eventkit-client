<template>
    <component
        :is="!href && !to ? 'button' : 'div'"
        :type="type"
        class="ButtonBase"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="to" v-if="to" >
            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href">
            <slot></slot>
        </a>

        <slot v-if="!href && !to"></slot>
    </component>
</template>

<script>
import utils from '@/mixins/utils'

export default {
    name: 'ButtonBase',
    mixins: [ utils ],
    props: {
        href: { default: false },
        to: { default: false },
        context: { default: false },
        type: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) this.onContext(v, this.$props.context)
        }
    }
}
</script>