<template>
    <a class="Tag" :class="{ ...$modifiers }">
        {{ title }}
    </a>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Tag',
    mixins: [ base ],
    props: {
        id: { type: Number },
        title: { type: String }
    }
}
</script>