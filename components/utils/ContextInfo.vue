<template>
    <div
        class="ContextInfo"
        :class=" { 'is-appear': state.appear }"
        :style="position"
        @mouseleave="state.overContext = false"
        @mouseenter="state.overContext = true"
        v-if="context"
    >   
        <div class="ContextInfo_content">
            <div
                class="ContextInfo_cover"
                :style="{ 'backgroundImage': `url(${context.data.cover})` }"
                v-if="context.data.cover"
            ></div>

            <div class="ContextInfo_text">
                <p class="ContextInfo_title" v-if="context.data.title">{{ context.data.title }}</p>
                <p class="ContextInfo_description" v-if="context.data.description">{{ shortDescription }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ContextInfo',
    data: () => ({
        state: {
            appear: false,
            overContext: false
        },
        windowY: 0
    }),
    computed: {
        context () {
            return this.$store.state.modules.context.current
        },
        elementLeft () {
            return this.$store.state.modules.context.left
        },
        position () {
            let position = {
                x: -9999,
                y: -9999
            }

            if (this.context) {
                position.x = this.context.position.x
                position.y = this.context.position.y - this.$data.windowY
            }

            return {
                '--x': Math.round(position.x) + 'px',
                '--y': Math.round(position.y) + 'px',
                '--width': Math.round(this.context.position.width) + 'px',
                '--height': Math.round(this.context.position.height) + 'px',
            }
        },
        shortDescription () {
            if (!this.context || !this.context.data.description) return

            let description = this.context.data.description
            let excerpt = description.substr(0, description.lastIndexOf(' ', 50))

            return description.length > 50 ? excerpt + '...' : description
        }
    },
    watch: {
        context (v) {
            if (v) {
                this.$nextTick(() => this.$data.state.appear = true)
            } else {
                this.$data.state.appear = false
            }
        },
        elementLeft (v) {
            setTimeout(() => {
                if (v && !this.$data.state.overContext) this.disappear()
            }, 10)
        },
        ['state.overContext'] (v) {
            setTimeout(() => {
                if (!v && this.elementLeft) this.disappear()
            }, 10)
        }
    },
    mounted () {
        this.$data.windowY = window.scrollY
        window.addEventListener('scroll', () => this.$data.windowY = window.scrollY)
    },
    methods: {
        onLeave () {
            this.$data.state.overContext = false
        },
        disappear () {
            this.$data.state.appear = false

            setTimeout(() => {
                this.$store.commit('modules/context/set', null)
            }, 50)
        }
    }
}
</script>