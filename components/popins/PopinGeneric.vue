<template>
    <div class="PopinGeneric" :class="{ 'is-active': state.visible, ...$modifiers }">
        <div class="PopinGeneric_container">
            <div class="PopinGeneric_close" @click="close">
                <i class="fal fa-times"></i>
            </div>
            
            <div class="PopinGeneric_body">
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
        global: { type: Boolean, default: false },
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
                if (this.$props.global) {
                    if (v) {
                        this.$store.commit('popins/open', { id: this.$props.id })
                    } else {
                        this.$store.commit('popins/close', this.$props.id)
                    }
                } else {
                    this.$data.state.visible = v
                    
                    if (v) {
                        this.open()
                    } else {
                        this.close()
                    }
                }
            }
        },
        activePopins: {
            immediate: true,
            handler (v) {
                if (!this.$props.global) return

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
            if (process.server) return

            setTimeout(() => {
                document.addEventListener('keyup', this.onEscape)
                document.addEventListener('mousedown', this.onClick)
            }, 500)
        },
        close () {
            if (this.$props.global) {
                this.$store.commit('popins/close', this.$props.id)
            } else {
                this.$emit('close')
            }
        },
        destroy () {
            if (process.server) return

            document.removeEventListener('keyup', this.onEscape)
            document.removeEventListener('mousedown', this.onClick)
        }
    }
}
</script>