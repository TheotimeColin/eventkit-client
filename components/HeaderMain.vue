<template>
    <header class="HeaderMain" :class="{'is-scroll': state.scroll }">
        <div class="Wrapper">
            <div class="HeaderMain_container">
                <nuxt-link to="/" class="HeaderMain_logo">
                    eventKit
                </nuxt-link>

                <p class="HeaderMain_baseline">le blog des créateurs de lien social</p>

                <nav class="HeaderMain_nav">
                    <nuxt-link class="HeaderMain_item" v-for="item in navItems" :to="{ name: item.name }" :key="item.name">
                        {{ item.title }}
                    </nuxt-link>
                </nav>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderMain',
    computed: {
        navItems () {
            let items = [
                { title: 'Blog', name: '' },
                { title: 'Nos kits', name: 'kits' },
                { title: 'À propos', name: 'about' },
                { title: 'Admin', name: 'admin-articles' }
            ]

            return items
        }
    },
    data: () => ({
        state: {
            scroll: false
        }
    }),
    mounted () {
        window.addEventListener('scroll', this.onScroll)
    },
    methods: {
        onScroll (e) {
            this.$data.state.scroll = window.scrollY > 10
        }
    }
}
</script>