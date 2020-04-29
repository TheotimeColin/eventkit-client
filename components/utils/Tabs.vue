<template>
    <div class="Tabs">
        <div
            class="Tabs_item"
            v-for="tab in tabs"
            :class="{ 'is-active': tab.isActive }"
            :key="tab.id"
            @click="() => onClick(tab)"
        >
            {{ tab.title }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        items: { type: Object, default: () => ({}) }
    },
    data: () => ({
        tabs: []
    }),
    watch: {
        items: {
            immediate: true,
            deep: true,
            handler () {
                this.$data.tabs = Object.keys(this.$props.items).map(key => ({
                    ...this.$props.items[key],
                    id: key
                }))
            }
        }
    },
    methods: {
        onClick (clicked) {
            this.$data.tabs = this.$data.tabs.map(tab => {
                tab.isActive = tab == clicked
                return tab
            })
            
            this.$emit('update', clicked.id)
        }
    }
}
</script>