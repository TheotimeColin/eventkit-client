<template>
    <div
        class="ContextInfo"
        :class=" { 'is-appear': state.appear }"
        :style="position"
        @mouseleave="state.overContext = false"
        @mouseenter="state.overContext = true"
        v-show="context"
    >   
        <div class="ContextInfo_content" v-if="context">
            <div
                class="ContextInfo_cover"
                :style="{ 'backgroundImage': `url(${context.data.cover})` }"
                v-if="context.data.cover"
            ></div>
            
            <div class="ContextInfo_main">
                <div class="ContextInfo_profile" :style="{ 'backgroundImage': `url(${context.data.profile})` }" v-if="context.data.profile"></div>
                <div class="ContextInfo_text">
                    <p class="ContextInfo_title" v-if="context.data.title">{{ context.data.title }}</p>
                    <p class="ContextInfo_description" v-if="context.data.description">{{ shortDescription }}</p>
                </div>
            </div>

            <div class="ContextInfo_cta" v-if="context.data.to || context.data.href">
                <button-inline
                    :to="context.data.to ? context.data.to : false"
                    :href="context.data.href ? context.data.href : false"
                >
                    À propos
                </button-inline>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonBase from '@/components/base/ButtonBase'

export default {
    name: 'ContextInfo',
    components: { ButtonBase },
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
                y: -9999,
                width: 0,
                height: 0,
            }

            if (this.context) {
                position.x = this.context.position.x
                position.y = this.context.position.y - this.$data.windowY
                position.width = this.context.position.width
                position.height = this.context.position.height
            }

            return {
                '--x': Math.round(position.x) + 'px',
                '--y': Math.round(position.y) + 'px',
                '--width': Math.round(position.width) + 'px',
                '--height': Math.round(position.height) + 'px',
            }
        },
        shortDescription () {
            if (!this.context || !this.context.data.description) return

            let description = this.context.data.description
            let excerpt = description.substr(0, description.lastIndexOf(' ', 75))

            return description.length > 75 ? excerpt + '...' : description
        }
    },
    watch: {
        context (v) {
            if (v) setTimeout(() => this.$data.state.appear = true, 100)
        },
        elementLeft (v) {
            setTimeout(() => {
                if (v && !this.$data.state.overContext) this.disappear()
            }, 25)
        },
        ['state.overContext'] (v) {
            setTimeout(() => {
                if (!v && this.elementLeft) this.disappear()
            }, 25)
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
            }, 25)
        }
    }
}
</script>