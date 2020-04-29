<template>
    <div class="PopinGeneric" :class="{ 'is-active': isActive }">
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
export default {
    name: 'PopinGeneric',
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