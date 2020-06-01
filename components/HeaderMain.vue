<template>
    <header class="HeaderMain" :class="{'is-scroll': state.scroll, 'is-premium': user && user.plan, ...$modifiers }">
        <div class="HeaderMain_wrapper Wrapper">
            <div class="HeaderMain_container">
                <nuxt-link :to="localePath('/')" class="HeaderMain_logo">
                    {{ $t('seo.name') }} <span v-if="user && user.plan">{{ $t('premium.creator') }}</span>
                </nuxt-link>

                <nav class="HeaderMain_nav">
                    <nuxt-link class="HeaderMain_item" v-for="item in navItems" :to="localePath({ name: item.name })" :key="item.name">
                        {{ item.title }}
                    </nuxt-link>

                    <div class="d-flex fx-align-center">
                        <button-base
                            class="mr-5"
                            :modifiers="['s', 'secondary', 'pink']"
                            @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'login' } })"
                            v-if="!user"
                        >
                            {{ $t('common.login') }}
                        </button-base>

                        <button-base
                            :modifiers="['s', 'pink']"
                            @click.native="$store.commit('popins/open', { id: 'login', data: { type: 'register' } })"
                            v-if="!user"
                        >
                            {{ $t('common.register') }}
                        </button-base>

                        <button-base :to="{ name: 'account' }" :modifiers="['s', 'pink']" v-if="user">
                            {{ $t('common.account') }}
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
                { title: this.$t('pages.kits.name'), name: 'kits', enabled: true },
                { title: this.$t('pages.blog.name'), name: 'blog', enabled: true },
                { title: 'Admin', name: 'admin', enabled: this.$store.state.auth.loggedIn && this.$store.state.auth.user.admin }
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