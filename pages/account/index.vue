<template>
    <div class="AccountPage Page">
        <div class="Page_content">
            <div class="AccountPage_banner pv-40" :class="{ 'premium': user.plan, 'offer': !user.plan }">
                <div class="Wrapper">
                    <p class="ft-title-2xl">Bonjour, <b>{{ user.name }}</b>.</p>
                    <p v-if="user.plan">{{ $t(`subscriptions.${user.plan}.condensed`) }}</p>
                </div>
            </div>

            <div class="AccountPage_nav">
                <div class="Wrapper AccountPage_navContainer">
                    <nav-bar :current="state.current" :items="[
                        { id: 'home', label: 'Dashboard', onClick: () => state.current = 'home' },
                        { id: 'account', label: 'Mon compte', onClick: () => state.current = 'account' },
                        { id: 'subscription', label: 'Gérer mon abonnement', onClick: () => state.current = 'subscription' }
                    ]" />

                    <button-base :to="{ name: 'account-logout' }" :modifiers="['secondary', 's']">
                        Me déconnecter
                    </button-base>
                </div>
            </div>

            <div class="Wrapper">
                <div class="pv-60">
                    <template v-if="state.current == 'home'">
                        <form class="Form">
                            <div class="Form_row">
                                <label>Nom</label>
                                <input type="text" :value="user.name">
                            </div>
                        </form>
                    </template>

                    <template v-if="state.current == 'account'">
                        <form class="Form" autocomplete="off">
                            <div class="Form_row">
                                <label>Email</label>
                                <input type="email" :value="user.email">
                            </div>

                            <div class="Form_row">
                                <label>Nouveau mot de passe</label>
                                <input type="password" placeholder="Laisser vide si pas de changement" autocomplete="new-password">
                            </div>

                            <div class="Form_row">
                                <label>Mot de passe actuel</label>
                                <input type="password" autocomplete="new-password">
                            </div>

                            <div class="Form_row">
                                <button-base type="submit">Modifier</button-base>
                            </div>
                        </form>
                    </template>

                    <template v-if="state.current == 'subscription'">
                        <link-base @click.native="onPortal" v-if="user.stripeId">Gérer mon abonnement</link-base>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

import NavBar from '@/components/generators/NavBar'

export default {
    name: 'AccountPage',
    middleware: 'user',
    components: { NavBar },
    data: () => ({
        state: {
            current: 'subscription'
        }
    }),
    computed: {
        user () {
            return this.$store.state.auth.user
        },
        renewal () {
            if (!Number.isInteger(this.user.premiumProjects) || !this.user.planRenewal) return false

            let date = dayjs(this.user.planRenewal)
            return `${date.fromNow()} (${date.format('D MMM YYYY')})`
        }
    },
    methods: {
        async onPortal () {
            const response = await this.$store.dispatch('premium/getPortal', {
                data: { user: this.user._id }
            })

            window.open(response.portal.url, '_blank')
        }
    }
}
</script>