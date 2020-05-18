<template>
    <component :is="to ? 'nuxt-link' : 'div'" class="Tag" :class="{ ...$modifiers }">
        <i class="fal fa-check mr-5" v-show="selected"></i> {{ title }}
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
        selected: { type: Boolean, default: false },
        to: {}
    }
}
</script>