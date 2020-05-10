<template>
    <header class="HeaderMain" :class="{'is-scroll': state.scroll, ...$modifiers }">
        <div class="HeaderMain_wrapper Wrapper">
            <div class="HeaderMain_container">
                <nuxt-link to="/" class="HeaderMain_logo">
                    eventkit
                </nuxt-link>

                <nav class="HeaderMain_nav">
                    <nuxt-link class="HeaderMain_item" v-for="item in navItems" :to="{ name: item.name }" :key="item.name">
                        {{ item.title }}
                    </nuxt-link>

                    <button-base
                        class="mr-5"
                        :modifiers="['s', 'secondary']"
                        @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'login' } })"
                        v-if="!$store.state.auth.user"
                    >
                        Me connecter
                    </button-base>

                    <button-base
                        :modifiers="['s']"
                        @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'register' } })"
                        v-if="!$store.state.auth.user"
                    >
                        M'inscrire
                    </button-base>

                    <button-base to="account" :modifiers="['s']" v-if="$store.state.auth.user">
                        Mon compte
                    </button-base>
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
                { title: 'Générateurs', name: 'generators', enabled: true },
                { title: 'Blog', name: 'blog', enabled: true },
                // { title: 'À propos', name: 'about', enabled: true },
                // { title: 'Dashboard', name: 'dashboard', enabled: this.$store.state.auth.loggedIn },
                { title: 'Admin', name: 'admin', enabled: this.$store.state.auth.loggedIn && this.$store.state.auth.user.admin },
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