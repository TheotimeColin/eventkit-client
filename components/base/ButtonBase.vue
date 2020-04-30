<template>
    <div
        class="ButtonBase ButtonBase--full ButtonBase--static"
        @mouseenter="onHover(true)"
        @mouseleave="onHover(false)"
    >
        <nuxt-link :to="to" v-if="to" >
            <slot></slot>
        </nuxt-link>

        <a :href="href" v-if="href">
            <slot></slot>
        </a>

        <div v-if="!href && !to">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import utils from '@/mixins/utils'

export default {
    name: 'ButtonBase',
    mixins: [ utils ],
    props: {
        href: { default: false },
        to: { default: false },
        context: { default: false }
    },
    methods: {
        onHover (v) {
            if (this.$props.context) this.onContext(v, this.$props.context)
        }
    }
}
</script>