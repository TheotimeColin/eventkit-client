<template>
    <component
        :is="!href && !to ? 'button' : 'div'"
        :type="type"
        class="ButtonBase"
        :class="{ 'ButtonBase--link': to || href , ...$modifiers }"
        @click="$emit('click')"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="localePath(to)" v-if="to" >
            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href">
            <slot></slot>
        </a>

        <slot v-if="!href && !to"></slot>
    </component>
</template>

<script>
import context from '@/utils/context-mixin'
import base from '@/utils/base'

export default {
    name: 'ButtonBase',
    mixins: [ context, base ],
    props: {
        href: { default: false },
        to: { default: false },
        context: { default: false },
        type: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) this.$onContext(v, this.$props.context)
        }
    }
}
</script>