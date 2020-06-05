<template>
    <div class="AccountPage Page">
        <div class="Page_content">
            <div class="AccountPage_banner StyledBlock pv-40" :class="{ 'StyledBlock--gold': user.plan }">
                <div class="Wrapper">
                    <p class="ft-title-2xl" v-html="$t('pages.account.title', { name: user.name })"></p>
                    <p v-if="user.plan">{{ $t(`premium.plans.${user.plan.replace('-', '')}.condensed`) }}</p>
                </div>
            </div>

            <div class="AccountPage_nav">
                <div class="Wrapper AccountPage_navContainer">
                    <nav-bar :current="state.current" :items="[
                        { id: 'home', label: $t(`pages.account.dashboard.title`), onClick: () => state.current = 'home' }
                    ]" />

                    <button-base :to="{ name: 'account-logout' }" :modifiers="['secondary', 's']">
                        {{ $t(`common.logout`) }}
                    </button-base>
                </div>
            </div>

            <div class="Wrapper">
                <div class="pv-40">
                    <template v-if="state.current == 'home'">
                        <offer
                            class="mb-40"
                            offer="earlyBird"
                            :max="100"
                            :redeemed="sale.times_redeemed"
                            v-if="!user.plan && sale"
                        />

                        <link-base class="m-40" @click.native="onPortal" v-if="user.stripeId">
                            {{ $t(`account.subscription.manage`) }}
                        </link-base>

                        <div>
                            <button-base :modifiers="['s', 'secondary']" @click.native="$store.commit('utils/confirmPrompt', {
                                onConfirm: () => onDelete(),
                                active: true,
                                confirmText: $t(`pages.account.cta.deleteAccount`)
                            })">
                                {{ $t(`pages.account.cta.deleteAccount`) }}
                            </button-base>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

import NavBar from '@/components/generators/NavBar'
import Offer from '@/components/utils/Offer'

export default {
    name: 'AccountPage',
    middleware: 'user',
    components: { NavBar, Offer },
    data: () => ({
        state: {
            current: 'home'
        }
    }),
    computed: {
        user () {
            return this.$store.state.auth.user
        },
        sale () {
            return this.$store.state.premium.information.early
        }
    },
    methods: {
        async onPortal () {
            const response = await this.$store.dispatch('premium/getPortal', {
                data: { user: this.user._id }
            })

            window.open(response.portal.url, '_blank')
        },
        async onDelete () {
            const response = await this.$store.dispatch('user/delete')
            this.$auth.logout()
        }
    }
}
</script>