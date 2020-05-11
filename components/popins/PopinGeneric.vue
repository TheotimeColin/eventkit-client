<template>
    <div class="PopinGeneric" :class="{ 'is-active': state.visible, ...$modifiers }">
        <div class="PopinGeneric_header" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="PopinGeneric_content">
            <slot></slot>
        </div>
        <div class="PopinGeneric_footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'PopinGeneric',
    mixins: [ base ],
    props: {
        id: { type: String, default: 'default' },
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            visible: false
        }
    }),
    computed: {
        activePopins () {
            return this.$store.state.popins.active
        }
    },
    watch: {
        isActive: {
            immediate: true,
            handler (v) {
                if (v) {
                    this.$store.commit('popins/open', { id: this.$props.id })
                } else {
                    this.$store.commit('popins/close', this.$props.id)
                }
            }
        },
        activePopins: {
            immediate: true,
            handler (v) {
                let found = v.find(v => v.id == this.$props.id)
                if (found && !this.$data.state.visible) {
                    this.$emit('open', found.data)
                    this.$data.state.visible = true
                    this.open()
                } else if (!found && this.$data.state.visible) {
                    this.$emit('close')
                    this.$data.state.visible = false
                    this.destroy()
                }
            }
        }
    },
    beforeDestroy ()  {
        this.destroy()
    },
    methods: {
        onEscape (e) {
            if (e.key === 'Escape') this.close()
        },
        onClick (e) {
            if (!this.$el.contains(e.target)) this.close()
        },
        open () {
            setTimeout(() => {
                document.addEventListener('keyup', this.onEscape)
                document.addEventListener('mousedown', this.onClick)
            }, 500)
        },
        close () {
            this.$store.commit('popins/close', this.$props.id)
        },
        destroy () {
            document.removeEventListener('keyup', this.onEscape)
            document.removeEventListener('mousedown', this.onClick)
        }
    }
}
</script>