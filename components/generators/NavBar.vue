<template>
    <div class="NavBar" :class="{ ...$modifiers }">
        <div
            v-for="item in availableItems"
            class="NavBar_item"
            :class="{ 'is-active': item.id == current, 'is-disabled': item.disabled }"
            @click="item.onClick"
            :key="item.id"
        >
            <i class="NavBar_fa fal" :class="{ ['fa-' + item.fa ]: true }" v-if="item.fa"></i>
            <span class="NavBar_color" :style="{ backgroundColor: item.color }" v-if="item.color"></span>
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
    },
    computed: {
        availableItems () {
            return this.$props.items.filter(item => !item.hidden)
        }
    }
}
</script>