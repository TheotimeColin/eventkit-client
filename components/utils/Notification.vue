<template>
    <div class="Notification" :class="{ ...$modifiers }" @click="$emit('done', id)">
        {{ text }}
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Notification',
    mixins: [ base ],
    props: {
        id: { type: String },
        text: { type: String }
    },
    mounted () {
        setTimeout(() => {
            this.$emit('done', this.$props.id)
        }, 4000)
    }
}
</script>

