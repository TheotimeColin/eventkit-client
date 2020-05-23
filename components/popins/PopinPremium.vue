<template>
    <popin-generic class="PopinPremium" id="premium" :global="true" @open="onOpen">
        <div class="PopinPremium_container">
            <div class="PopinPremium_slider" :style="{ '--step': state.step, '--max-steps': 3 }">
                <div class="PopinPremium_step">
                    <div class="p-20 StyledBlock StyledBlock--no-border StyledBlock--blue text-center p-relative" v-if="sale">
                        <p class="ft-xs"><b>Offre de lancement limitée</b></p>
                        <p class="ft-s">Uniquement pour les 100 premiers inscrits : vous êtes déjà <b>{{ sale.times_redeemed }} à avoir profité de cette offre</b> !</p>
                        <p class="ft-l mt-10"><b>Le même prix exceptionnel pour toujours</b>, où jusqu'à la résiliation.</p> 

                        <loading-bar :modifiers="['absolute', 'premium']" :max="100" :value="sale.times_redeemed" ref="loadingBar" />
                    </div>

                    <div class="row mt-20 ft-s">
                        <div class="col-3">
                            <div class="mb-30">
                                <p><b>🍹 Soirées, mariages...</b></p>
                                <p class="mb-10 color-ft-weak">Impressionne tes invités</p>
                                Économise grâce à une bibliothèque de jeux <b>renouvellable à l'infini</b>, la seule limite est ton imagination !
                            </div>

                            <div class="mb-30">
                                <p><b>👋 Organisateurs & pros</b></p>
                                <p class="mb-10 color-ft-weak">Démarre plus rapidement</p>
                                Mets tout de suite à l'aise tes participants avec nos icebreakers <b>aux couleurs de votre marque</b>.
                            </div>

                            <div>
                                <p><b>🎁 Bloggers, influenceurs</b></p>
                                <p class="mb-10 color-ft-weak">Créer de la valeur à petit prix</p>
                                Conçois de magnifiques cartes qui te ressemblent et offre-les à ta communauté, <b>ils vont adorer.</b>
                            </div>
                        </div>
                        <div class="col-9">
                            <pricing-column :modifiers="['premium']" :prices="plans" @select="onSelectOffer" />
                        </div>
                    </div>
                </div>

                <div class="PopinPremium_step">
                    <div class="StyledBlock StyledBlock--no-border StyledBlock--cyan text-center p-20 mb-40">
                        <p class="ft-l"><b>🎉 Génial !</b> On a hâte de te compter parmi nous.</p>
                        <p class="ft-s">Il ne reste plus qu'à procéder au paiement.</p>
                    </div>

                    <div class="row" v-if="plan">
                        <div class="col-6">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="StyledBlock StyledBlock--no-border StyledBlock--gold p-10"><b>{{ plan.label }}</b></td>
                                        <td class="text-center">{{ plan.value }}€</td>
                                    </tr>
                                    <tr>
                                        <td class="StyledBlock StyledBlock--no-border StyledBlock--blue p-10"><b>Offre de lancement -{{ plan.coupon * 100 }}%</b></td>
                                        <td class="text-center"><b>-{{ Math.floor((plan.value - (plan.value * (1 - plan.coupon))) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td>Total aujourd'hui</td>
                                        <td class="text-center"><b>{{ Math.floor((plan.value * (1 - plan.coupon)) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="color-ft-weak ft-xs">Puis {{ Math.floor((plan.value * (1 - plan.coupon)) * 100) / 100 }}€ tous les {{ plan.length }} mois ensuite. Abonnement résiliable à tout moment.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <button-base :modifiers="['xs', 'secondary']" class="mt-20" @click="state.step = 0">
                                Choisir une autre option
                            </button-base>
                        </div>

                        <div class="col-6">
                            <div class="mb-20" v-if="!user">
                                <p class="ft-l mb-20"><b>Première étape, créer un compte !</b></p>
                                <base-form :form="register" :errors="registerErrors" @submit="onRegister" />
                            </div>
                            
                            <div v-if="user">
                                <p class="ft-m mb-20">
                                    <b>{{ user.name }}</b>, plus qu'une étape pour devenir Créateur !
                                </p>

                                <base-form :errors="formErrors" @submit="onSubmit" :loading="state.loading" :submit="{ label: 'Confirmer mon paiement' }">
                                    <template slot="form">
                                        <div class="Form_row">
                                            <div class="Input Input--card" ref="cardInput"></div>
                                        </div>
                                    </template>
                                </base-form>

                                <!-- <button-base type="button" :modifiers="['xs', 'secondary']" @click.native="state.step = 0">Retour</button-base> -->

                            </div>
                        </div>
                    </div>
                </div>

                <div class="PopinPremium_step">
                    <div class="StyledBlock StyledBlock--no-border StyledBlock--gold PopinPremium_success">
                        <div>
                            <p class="ft-2xl"><b>🎀 Incroyable 🎀</b></p>
                            <p class="mv-20 width-xs">Tu es maintenant Créateur. Découvre vite tout tes avantages ! Je te remercie pour ton support.</p>

                            <button-base :modifiers="['gold']">Créer un kit</button-base>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </popin-generic>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'
import PricingColumn from '@/components/generators/PricingColumn'
import BaseForm from '@/components/form/BaseForm'
import LoadingBar from '@/components/interactive/LoadingBar'

export default {
    name: 'PopinPremium',
    components: { PopinGeneric, PricingColumn, BaseForm, LoadingBar },
    async fetch () {
        await this.$store.dispatch('premium/getInfo')
    },
    data: () => ({
        state: {
            step: 0,
            loading: false
        },
        stripe: null,
        plan: { id: 'creator-1', label: 'Abonnement Créateur 1 mois', emoji: '🌱', coupon: '0.3', value: '5.99', length: '1' },
        plans: [
            { id: 'creator-1', label: 'Abonnement Créateur 1 mois', emoji: '🌱', coupon: '0.3', value: '7.99', length: '1' },
            { id: 'creator-3', label: 'Abonnement Créateur 3 mois', emoji: '🌟', coupon: '0.4', value: '19.99', length: '3', highlight: true },
            { id: 'creator-12', label: 'Abonnement Créateur 12 mois', emoji: '💖', coupon: '0.3', value: '59.99', length: '12' }
        ],
        register: {
            name: {
                id: 'name',
                label: 'Ton prénom',
                required: true,
                value: ''
            },
            email: {
                id: 'email',
                type: 'email',
                label: 'Ton adresse e-mail',
                required: true,
                value: '',
            },
            password: {
                id: 'password',
                component: 'input-text',
                label: 'Ton mot de passe',
                type: 'password',
                required: true,
                value: '',
                validations: {
                    minLength: { value: 6, error: 'Cette valeur doit faire au moins 5 caractères' },
                    maxLength: { value: 16, error: 'Cette valeur ne devrait pas dépasser 16 caractères' },
                    password: { error: 'Ton  mot de passe doit contenir au moins une majuscule et 1 chiffre ou caractère spécial' }
                }
            }
        },
        registerErrors: [],
        form: {
            cardInput: null
        },
        formErrors: []
    }),
    computed: {
        user () {
            return this.$store.state.auth.user
        },
        sale () {
            return this.$store.state.premium.information.early
        }
    },
    watch: {
        ['state.step']: {
            immediate: true,
            handler (v) {
                if (v == 1 && this.user) setTimeout(() => this.initStripe(), 500)
            }
        },
        user: {
            handler (v) {
                if (v) setTimeout(() => this.initStripe(), 1000)
            }
        }
    },
    methods: {
        onOpen () {
            if (this.$refs.loadingBar) this.$refs.loadingBar.reset()
        },
        initStripe () {
            if (this.$data.stripe || process.server) return 

            this.$data.stripe = this.$stripe.import()

            const elements = this.$data.stripe.elements()
            this.$data.form.cardInput = elements.create('card')

            this.$data.form.cardInput.mount(this.$refs.cardInput)
        },
        onSelectOffer (plan) {
            this.$data.plan = plan
            this.$data.state.step = 1
        },
        async onRegister () {
            this.$data.registerErrors = []

            let data = {}
            Object.keys(this.$data.register).forEach(k => data[k] = this.$data.register[k].value)
            const response = await this.$auth.loginWith('local', { data: {
                ...data, register: true,
                lastProject: this.$cookies.get('project-id') ? this.$cookies.get('project-id') : undefined
            } })

            if (response.data.status != 1) {
                this.$data.registerErrors = response.data.errors
            } else {
                this.$store.commit('utils/addNotification', {
                    type: 'success',
                    text: `Bienvenue, ${data.name} !`
                })
            }
        },
        async onSubmit () {
            this.$data.formErrors = []
            this.$data.state.loading = true

            try {
                const payment = await this.$data.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.$data.form.cardInput,
                    billing_details: {
                        email: this.user.email
                    }
                })

                const response = await this.$store.dispatch('premium/createCustomer', {
                    data: {
                        plan: this.$data.plan.id,
                        user: this.user._id,
                        paymentMethod: payment.paymentMethod.id
                    }
                })

                if (response.status != 1) {
                    this.$data.formErrors = response.errors.map(e => e.code.replace('_', '-'))
                    throw 'error'
                }

                let status = response.subscription.latest_invoice.payment_intent.status

                if (status === 'succeeded') {
                    this.onSuccess()
                } else {
                    if (status == 'requires_action') {
                        let confirm = await this.$data.stripe.confirmCardPayment(response.subscription.latest_invoice.payment_intent.client_secret)
                        if (confirm.error || confirm.paymentIntent.status !== 'succeeded') {
                            this.$data.formErrors = [ confirm.error.message ]
                            throw 'error'
                        }
                        
                        // update plan 

                        this.onSuccess()
                    } else {
                        this.$data.formErrors = ['error !']
                    }
                }
            } catch (e) {
                console.error(e)
            }

            this.$data.state.loading = false
        },
        async onSuccess () {
            await this.$auth.fetchUser()
            this.$data.state.step = 2
        }
    }
}
</script>