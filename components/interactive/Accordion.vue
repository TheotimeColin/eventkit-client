<template>
    <div
        class="Accordion"
        :class="{ 'is-loaded': state.loaded, 'is-active': state.active, ...$modifiers }"
        @click="onClick"
    >  
        <div class="Accordion_title" v-if="title">
            {{ title }}
        </div>

        <div class="Accordion_content" ref="content">
            <slot></slot>
        </div>

        <div class="Accordion_opener">
            <i class="fal fa-angle-down"></i>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Accordion',
    mixins: [ base ],
    props: {
        title: { type: String }
    },
    data: () => ({
        state: {
            active: false,
            loaded: false
        },
        contentTitle: null
    }),
    mounted () {
        this.$data.state.loaded = true
        this.$nextTick(() => this.$data.contentTitle = this.$el.querySelector('h2, h3, .Accordion_title'))
    },
    methods: {
        onClick(e) {
            if (this.$data.contentTitle && this.$data.contentTitle.contains(e.target)) {
                this.$data.state.active = !this.$data.state.active
            }
        }
    }
}
</script>