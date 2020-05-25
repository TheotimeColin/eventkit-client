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
            <i class="ButtonBase_icon fal" :class="{ ['fa-' + fa]: true }" v-show="fa"></i>
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-if="loading"></i>

            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href" :download="download">
            <i class="ButtonBase_icon fal" :class="{ ['fa-' + fa]: true }" v-show="fa"></i>
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-if="loading"></i>

            <slot></slot>
        </a>

        <i class="ButtonBase_icon fal" :class="{ ['fa-' + fa]: true }" v-show="fa" v-if="!href && !to"></i>

        <span v-if="!href && !to && $slots.default">
            <i class="ButtonBase_icon fal fa-spinner-third spin" v-if="loading"></i>

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
        fa: { default: '' },
        download: { default: '' },
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