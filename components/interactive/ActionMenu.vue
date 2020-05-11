<template>
    <div
        class="ActionMenu"
        :class="{ 'is-active': state.active }"
    >
        <div class="ActionMenu_trigger" @click="state.active = !state.active">
            <i class="fa fa-ellipsis-h"></i>
        </div>

        <div class="ActionMenu_list">
            <component
                v-for="(item, i) in listItems"
                class="ActionMenu_listItem"
                :is="item.to ? 'nuxt-link' : 'div'"
                :to="item.to"
                @click="() => onClick(item)"
                :key="i"
            >
                <i class="fa fa-sm" :class="{ ['fa-' + item.fa ]: true }" v-if="item.fa"></i>
                <p v-if="item.label">{{ item.label }}</p>
            </component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActionMenu',
    props: {
        items: { type: Array, default: () => [] }
    },
    data: () => ({
        state: {
            active: false
        },
        listener: null
    }),
    computed: {
        listItems () {
            return this.$props.items.filter(item => !item.disabled)
        }
    },
    watch: {
        ['state.active'] (v) {
            if (v) {
                this.$data.listener = () => {
                    this.$data.state.active = false
                }

                setTimeout(() => document.addEventListener('click', this.$data.listener), 100)
            } else {
                document.removeEventListener('click', this.$data.listener)
            }
        }
    },
    methods: {
        onClick (item) {
            if (item.onClick) item.onClick()
        }
    }
}
</script>