<template>
    <div class="FileGallery" :class="{ 'is-max': maxReached }">
        <div class="row-xs fx-wrap">
            <div class="col-4" v-for="item in gallery" :key="item.key">
                <div class="FileGallery_item" :class="{ 'is-select': item.isSelected }">
                    <div
                        class="FileGallery_name"
                        v-for="size in item.sizes"
                        :class="{ 'is-select': size.isSelected }"
                        :key="size.id"
                        @click="onSelect(item, size)"
                    >
                        {{ size.name }}
                    </div>

                    <img :src="item.sizes[0].src">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FileGallery',
    props: {
        prefix: { type: String, default: '' },
        max: { type: Number, default: 1 }
    },
    data: () => ({
        gallery: []
    }),
    mounted () {
        this.onFetch()
    },
    computed: {
        selectedItems () {
            let selected = []

            this.$data.gallery.forEach(item => {
                item.sizes.forEach(size => {
                    if (size.isSelected) selected.push(size)
                })
            })

            return selected
        },
        maxReached () {
            return this.selectedItems.length >= this.$props.max
        }
    },
    methods: {
        async onFetch () {
            let response = await this.$store.dispatch('files/fetch', {
                query: { prefix: this.$props.prefix }
            })

            this.$data.gallery = response.map(file => ({
                ...file,
                isSelected: false
            }))
        },
        onSelect (item, newSize) {
            this.$data.gallery = this.$data.gallery.map(item => {
                let found = false
                let sizes = item.sizes.map(size => {
                    if (!newSize.isSelected && size == newSize) found = true

                    return {
                        ...size,
                        isSelected: size == newSize ? !size.isSelected : size.isSelected
                    }
                })

                return {
                    ...item,
                    sizes: sizes,
                    isSelected: found
                }
            })

            this.$emit('select', this.selectedItems)
        }
    }
}
</script>