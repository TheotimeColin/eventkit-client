<template>
    <div class="AccountPage Page">
        <div class="Page_content">
            <div class="AccountPage_banner StyledBlock pv-40" :class="{ 'StyledBlock--gold': user.plan }">
                <div class="Wrapper">
                    <p class="ft-title-2xl">Bonjour, <b>{{ user.name }}</b>.</p>
                    <p v-if="user.plan">{{ $t(`subscriptions.${user.plan}.condensed`) }}</p>
                </div>
            </div>

            <div class="AccountPage_nav">
                <div class="Wrapper AccountPage_navContainer">
                    <nav-bar :current="state.current" :items="[
                        { id: 'home', label: 'Dashboard', onClick: () => state.current = 'home' }
                    ]" />

                    <button-base :to="{ name: 'account-logout' }" :modifiers="['secondary', 's']">
                        Me déconnecter
                    </button-base>
                </div>
            </div>

            <div class="Wrapper">
                <div class="pv-40">
                    <template v-if="state.current == 'home'">
                        <div class="p-20 offer text-center p-relative mb-40" v-if="!user.plan && sale">
                            <p class="ft-xs"><b>Offre de lancement limitée</b></p>
                            <p class="ft-xs">Uniquement pour les 100 premiers inscrits : vous êtes déjà {{ sale.times_redeemed }} à avoir profité de cette offre !</p>
                            <p class="ft-l mt-10"><b>Le même prix exceptionnel pour toujours</b>, où jusqu'à la résiliation.</p>
                            
                            <button-base class="mt-20" :modifiers="['offer', 'round']" @click="$store.commit('popins/open', { id: 'premium' })">
                                J'en profite
                            </button-base>

                            <loading-bar :modifiers="['absolute']" :max="100" :value="sale.times_redeemed" ref="loadingBar" />
                        </div>

                        <link-base class="mb-40" @click.native="onPortal" v-if="user.stripeId">
                            Gérer mon abonnement
                        </link-base>


                        <div>
                            <button-base :modifiers="['s', 'secondary']" @click.native="$store.commit('utils/confirmPrompt', {
                                onConfirm: () => onDelete(),
                                active: true,
                                confirmText: 'Supprimer mon compte'
                            })">
                                Supprimer mon compte
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
import LoadingBar from '@/components/interactive/LoadingBar'

export default {
    name: 'AccountPage',
    middleware: 'user',
    components: { NavBar, LoadingBar },
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