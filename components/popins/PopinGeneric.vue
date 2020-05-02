<template>
    <div class="PopinGeneric" :class="{ 'is-active': isActive, ...$modifiers }">
        <div class="PopinGeneric_header">
            <slot name="header"></slot>
        </div>
        <div class="PopinGeneric_content">
            <slot></slot>
        </div>
        <div class="PopinGeneric_footer">
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
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        state: {
            visible: false
        }
    })
}
</script>