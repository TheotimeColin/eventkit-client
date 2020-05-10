<template>
    <header class="HeaderMain" :class="{'is-scroll': state.scroll, ...$modifiers }">
        <div class="HeaderMain_wrapper Wrapper">
            <div class="HeaderMain_container">
                <nuxt-link to="/" class="HeaderMain_logo">
                    eventKit
                </nuxt-link>

                <p class="HeaderMain_baseline">créez, imprimez, découpez</p>

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
import base from '@/utils/base'

export default {
    name: 'HeaderMain',
    mixins: [ base ],
    computed: {
        navItems () {
            let items = [
                { title: 'Blog', name: 'blog', enabled: true },
                // { title: 'Kits animation & jeux', name: 'kits', enabled: true },
                // { title: 'À propos', name: 'about', enabled: true },
                // { title: 'Dashboard', name: 'dashboard', enabled: this.$store.state.auth.loggedIn },
                { title: 'Admin', name: 'admin', enabled: this.$store.state.auth.loggedIn && this.$store.state.auth.user.admin },
                // { title: 'Mon compte', name: 'account', enabled: !this.$store.state.auth.loggedIn },
                // { title: 'Se déconnecter', name: 'account-logout', enabled: this.$store.state.auth.loggedIn }
            ]

            return items.filter(item => item.enabled)
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