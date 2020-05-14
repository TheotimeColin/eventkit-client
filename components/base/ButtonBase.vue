<template>
    <component
        :is="!href && !to ? 'button' : 'div'"
        :type="type"
        class="ButtonBase"
        :class="{ 'ButtonBase--link': to || href , 'is-loading': loading, ...$modifiers }"
        @click="$emit('click')"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="localePath(to)" v-if="to" >
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-show="loading"></i>

            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href">
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-show="loading"></i>

            <slot></slot>
        </a>

        <span v-if="!href && !to">
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-show="loading"></i>
            <slot></slot>
        </span>
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
        loading: { default: false },
        type: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) this.$onContext(v, this.$props.context)
        }
    }
}
</script>