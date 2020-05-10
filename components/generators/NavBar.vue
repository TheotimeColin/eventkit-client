<template>
    <div class="NavBar" :class="{ ...$modifiers }">
        <div
            v-for="item in items"
            class="NavBar_item"
            :class="{ 'is-active': item.id == current}"
            @click="item.onClick"
            :key="item.id"
        >
            <i class="NavBar_fa fa" :class="{ ['fa-' + item.fa ]: true }" v-if="item.fa"></i>
            <div class="NavBar_count" v-if="item.count">{{ item.count }}</div>
            <p class="NavBar_label" v-if="item.label">{{ item.label }}</p>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'NavBar',
    mixins: [ base ],
    props: {
        items: { type: Array },
        current: { type: String }
    }
}
</script>