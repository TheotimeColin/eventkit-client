<template>
    <div class="Rating" :class="{ 'Rating--editable': editable, ...$modifiers }">
        <div
            v-for="i in max"
            class="Rating_item"
            :class="{ 'is-active': i > (max - value) }"
            @click="$emit('input', (max - i) + 1)"
            :key="i"
        >
            {{ unit }}
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Rating',
    mixins: [ base ],
    props: {
        unit: { type: String, default: '⭐️' },
        value: { type: Number, default: 1 },
        max: { type: Number, default: 5 },
        editable: { type: Boolean, default: false }
    }
}
</script>