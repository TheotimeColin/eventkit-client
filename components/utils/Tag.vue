<template>
    <component :is="to ? 'nuxt-link' : 'div'" class="Tag" :class="{ ...$modifiers }">
        {{ title }}
    </component>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Tag',
    mixins: [ base ],
    props: {
        id: { type: Number },
        title: { type: String },
        to: {}
    }
}
</script>