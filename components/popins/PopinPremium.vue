<template>
    <popin-generic class="PopinPremium" id="premium" :global="true">
        <div class="PopinPremium_container">
            <div class="PopinPremium_slider" :style="{ '--step': state.step }">
                <div class="PopinPremium_step">
                    <div class="p-20 offer text-center">
                        <p class="ft-xs"><b>Offre de lancement</b></p>
                        <p class="ft-l">Jusqu'à <b>40% offerts</b> sur tes premiers mois</p>
                    </div>

                    <div class="row mt-20 ft-s">
                        <div class="col-3">
                            <div class="mb-30">
                                <p><b>🍹 Soirées, mariages...</b></p>
                                <p class="mb-10 color-ft-weak">Échauffe tes invités</p>
                                Impressionne tes invités à chaque événement grâce à nos jeux & icebreakers 100% personnalisés.
                            </div>

                            <div class="mb-30">
                                <p><b>👋 Organisateurs & pros</b></p>
                                <p class="mb-10 color-ft-weak">Démarre plus rapidement</p>
                                Mets tout de suite à l'aise tes participants avec nos jeux aux couleurs de votre marque.
                            </div>

                            <div>
                                <p><b>🎁 Bloggers, influenceurs</b></p>
                                <p class="mb-10 color-ft-weak">Créer de la valeur à petit prix</p>
                                Conçois de magnifiques cartes qui te ressemblent et offre-les à ta communauté, ils vont adorer.
                            </div>
                        </div>
                        <div class="col-9">
                            <pricing-column :modifiers="['premium']" :prices="plans" @select="onSelectOffer" />
                        </div>
                    </div>
                </div>

                <div class="PopinPremium_step">
                    <div class="success text-center p-20 mb-20">
                        <p class="ft-l"><b>🎉 Génial !</b> On a hâte de te compter parmi nous.</p>
                        <p class="ft-s">Il ne reste plus qu'à procéder au paiement.</p>
                    </div>

                    <form @submit="onSubmit" class="Form row-s" v-if="plan">
                        <div class="col-6">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="premium"><b>{{ plan.label }}</b></td>
                                        <td class="text-center">{{ plan.value }}€</td>
                                    </tr>
                                    <tr>
                                        <td class="offer"><b>Offre de lancement -{{ plan.coupon * 100 }}%</b></td>
                                        <td class="text-center"><b>-{{ Math.floor((plan.value - (plan.value * (1 - plan.coupon))) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td>Total aujourd'hui</td>
                                        <td class="text-center"><b>{{ Math.floor((plan.value * (1 - plan.coupon)) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="color-ft-weak ft-xs">Puis {{ plan.value }}€ tous les {{ plan.length }} mois ensuite. Abonnement résiliable à tout moment.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-6">
                            <div class="bg-bg br-4 p-20 text-center mb-20">
                                <div class="Form_row">
                                    <input type="text" v-model="form.name" placeholder="Ton prénom" required>
                                </div>

                                <div class="Form_row">
                                    <input type="email" v-model="form.email" placeholder="Ton adresse email" required>
                                </div>

                                <div class="Form_row">
                                    <input type="password" v-model="form.password" placeholder="Ton mot de passe" required>
                                </div>

                                <hr class="mv-20">

                                <div class="Form_row">
                                    <div class="Input Input--card" ref="cardInput"></div>
                                </div>
                            </div>
                            
                            <div class="d-flex fx-justify-between fx-align-center">
                                <button-base type="button" :modifiers="['xs', 'secondary']" @click.native="state.step = 0">Retour</button-base>
                                <button-base :modifiers="['s']" type="submit">Confirmer mon paiement</button-base>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </popin-generic>
</template>

<script>
import PopinGeneric from '@/components/popins/PopinGeneric'
import PricingColumn from '@/components/generators/PricingColumn'

export default {
    name: 'PopinPremium',
    components: { PopinGeneric, PricingColumn },
    data: () => ({
        state: {
            step: 0
        },
        stripe: null,
        form: {
            name: '',
            email: '',
            password: '',
            cardInput: null
        },
        plan: { id: 'creator-1', label: 'Abonnement Créateur 1 mois', emoji: '🌱', coupon: '0.3', value: '4.99', length: '1' },
        // plans: [
        //     { id: 'creator-1', label: 'Abonnement Créateur 1 mois', emoji: '🌱', coupon: '0.3', value: '4.99', length: '1' },
        //     { id: 'creator-3', label: 'Abonnement Créateur 3 mois', emoji: '🌟', coupon: '0.4', value: '9.99', length: '3', highlight: true },
        //     { id: 'creator-12', label: 'Abonnement Créateur 12 mois', emoji: '💖', coupon: '0.3', value: '29.99', length: '12' }
        // ],
        plans: [
            { id: 'creator-1', label: 'Abonnement Créateur 1 mois', emoji: '🌱', coupon: '0.3', value: '5.99', length: '1' },
            { id: 'creator-3', label: 'Abonnement Créateur 3 mois', emoji: '🌟', coupon: '0.4', value: '12.99', length: '3', highlight: true },
            { id: 'creator-12', label: 'Abonnement Créateur 12 mois', emoji: '💖', coupon: '0.4', value: '39.99', length: '12' }
        ]
    }),
    watch: {
        ['state.step']: {
            immediate: true,
            handler (v) {
                if (v == 1) setTimeout(() => this.initStripe(), 500)
            }
        }
    },
    methods: {
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
        async onSubmit (e) {
            e.preventDefault()

            try {
                if (!this.$store.state.auth.user) {
                    let user = await this.$auth.loginWith('local', { data: {
                        ...this.$data.form,
                        register: true,
                        userAnonymous: this.$cookies.get('anonymous-id') ? this.$cookies.get('anonymous-id') : undefined
                    } })

                    console.log(user)
                }

                const payment = await this.$data.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.$data.form.cardInput,
                    billing_details: {
                        email: this.$store.state.auth.user.email
                    }
                })

                const response = await this.$store.dispatch('premium/createCustomer', {
                    data: {
                        plan: this.$data.plan.id,
                        user: this.$store.state.auth.user._id,
                        paymentMethod: payment.paymentMethod.id
                    }
                })

                if (response.subscription.latest_invoice.payment_intent.status === 'requires_action') {
                    this.$data.stripe.confirmCardPayment(response.subscription.latest_invoice.payment_intent.client_secret)
                } else {
                    console.log('CONGRATS !')
                }
            } catch (e) {
                console.error(e)
            }
        }
    }
}
</script>