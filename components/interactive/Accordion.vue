<template>
    <div
        class="Accordion"
        :class="{ 'is-loaded': state.loaded, 'is-active': state.active }"
        @click="onClick"
    >  
        <div class="Accordion_content" ref="content">
        </div>

        <div class="Accordion_opener">
            <i class="fa fa-angle-down"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Accordion',
    props: {

    },
    data: () => ({
        state: {
            active: false,
            loaded: false
        },
        title: null
    }),
    mounted () {
        this.$data.state.loaded = true
        this.$nextTick(() => this.$data.title = this.$el.querySelector('h2, h3'))
    },
    methods: {
        onClick(e) {
            if (this.$data.title && this.$data.title.contains(e.target)) {
                this.$data.state.active = !this.$data.state.active
            }
        }
    }
}
</script>