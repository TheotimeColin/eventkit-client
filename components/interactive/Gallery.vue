<template>
    <div class="Gallery" :class="{ ...$modifiers }">
        <div class="Gallery_nav">
            <div class="Gallery_navRail" @mouseleave="onMouseLeave">
                <div
                    v-for="(item, i) in localItems"
                    class="Gallery_navItem"
                    :class="{ 'is-active': i == active, 'is-loading': item.loading }"
                    @click="onClick(i)"
                    @mouseenter="onMouseEnter(i)"
                    :key="i"
                >
                    <img :src="item.src" v-if="item.src">
                </div>
            </div>
        </div>

        <div class="Gallery_main" :class="{ 'is-loading': activeItem.loading }">
            <img :src="activeItem.src" v-if="activeItem.src">

            <div class="Gallery_download">
                <button-base :modifiers="['xs']" fa="arrow-to-bottom" :download="'image.name.jpg'" :href="activeItem.src">
                    Télécharger en HD
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
import base from '@/utils/base'

export default {
    name: 'Gallery',
    mixins: [ base ],
    props: {
        items: { type: Array, default: () => ([]) },
        itemsLength: { type: Number, default: 0 },
        downloadable: { type: Boolean, default: false }
    },
    data: () => ({
        active: 0,
        current: null,
        localItems: []
    }),
    computed: {
        activeItem () {
            let result = this.$data.current !== null ? this.$data.current : this.$data.active
            return this.$data.localItems[result] ? this.$data.localItems[result] : null
        }
    },
    watch: {
        items: {
            immediate: true,
            deep: true,
            handler (v) {
                let missing = this.$props.itemsLength - v.length
                let loaders = []

                if (missing > 0) {
                    loaders = new Array(missing).fill({
                        loading: true,
                        src: null
                    })
                }

                this.$data.localItems = [
                    ...v,
                    ...loaders
                ]
            }
        }
    },
    methods: {
        onClick (i) {
            this.$data.active = i
        },
        onMouseEnter (i) {
            this.$data.active = i
        },
        onMouseLeave () {
            this.$data.current = null
        }
    }
}
</script>