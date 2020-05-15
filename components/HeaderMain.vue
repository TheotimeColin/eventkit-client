<template>
    <header class="HeaderMain" :class="{'is-scroll': state.scroll, 'is-premium': user.plan, ...$modifiers }">
        <div class="HeaderMain_wrapper Wrapper">
            <div class="HeaderMain_container">
                <nuxt-link :to="localePath('/')" class="HeaderMain_logo">
                    eventkit <span v-if="user && user.plan">créateur</span>
                </nuxt-link>

                <nav class="HeaderMain_nav">
                    <nuxt-link class="HeaderMain_item" v-for="item in navItems" :to="localePath({ name: item.name })" :key="item.name">
                        {{ item.title }}
                    </nuxt-link>

                    <div class="d-flex fx-align-center">
                        <button-base
                            class="mr-5"
                            :modifiers="['s', 'secondary']"
                            @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'login' } })"
                            v-if="!user"
                        >
                            Me connecter
                        </button-base>

                        <button-base
                            :modifiers="['s']"
                            @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'register' } })"
                            v-if="!user"
                        >
                            M'inscrire
                        </button-base>

                        <button-base :to="{ name: 'account' }" :modifiers="['s']" v-if="user">
                            Mon compte
                        </button-base>
                    </div>
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
    data: () => ({
        state: {
            scroll: false
        }
    }),
    computed: {
        navItems () {
            let items = [
                { title: 'kits', name: 'kits', enabled: true },
                { title: 'Blog', name: 'blog', enabled: true },
                // { title: 'À propos', name: 'about', enabled: true },
                // { title: 'Dashboard', name: 'dashboard', enabled: this.$store.state.auth.loggedIn },
                { title: 'Admin', name: 'admin', enabled: this.$store.state.auth.loggedIn && this.$store.state.auth.user.admin },
                // { title: 'Se déconnecter', name: 'account-logout', enabled: this.$store.state.auth.loggedIn }
            ]

            return items.filter(item => item.enabled)
        },
        user () {
            return this.$store.state.auth.user
        }
    },
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