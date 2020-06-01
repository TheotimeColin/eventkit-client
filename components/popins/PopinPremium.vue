<template>
    <popin-generic class="PopinPremium" id="premium" :global="true" @open="onOpen">
        <div class="PopinPremium_container">
            <div class="PopinPremium_slider" :style="{ '--step': state.step, '--max-steps': 3 }">
                <div class="PopinPremium_step">
                    <div class="p-20 StyledBlock StyledBlock--no-border StyledBlock--blue text-center p-relative" v-if="sale">
                        <p class="ft-xs"><b>{{ $t('premium.offers.earlyBird.title') }}</b></p>
                        <p class="ft-s" v-html="$t('premium.offers.earlyBird.subtitle', { times: sale.times_redeemed })"></p>
                        <p class="ft-l mt-10" v-html="$t('premium.offers.earlyBird.highlight')"></p> 

                        <loading-bar :modifiers="['absolute', 'premium']" :max="100" :value="sale.times_redeemed" ref="loadingBar" />
                    </div>

                    <div class="row mt-20 ft-s">
                        <div class="col-3">
                            <div class="mb-30">
                                <p><b>{{ $t('premium.personas.organizers.title') }}</b></p>
                                <p class="mb-10 color-ft-weak">{{ $t('premium.personas.organizers.subtitle') }}</p>
                                <p v-html="$t('premium.personas.organizers.description')"></p>
                            </div>

                            <div class="mb-30">
                                <p><b>{{ $t('premium.personas.pros.title') }}</b></p>
                                <p class="mb-10 color-ft-weak">{{ $t('premium.personas.pros.subtitle') }}</p>
                                <p v-html="$t('premium.personas.pros.description')"></p>
                            </div>

                            <div>
                                <p><b>{{ $t('premium.personas.bloggers.title') }}</b></p>
                                <p class="mb-10 color-ft-weak">{{ $t('premium.personas.bloggers.subtitle') }}</p>
                                <p v-html="$t('premium.personas.bloggers.description')"></p>
                            </div>
                        </div>
                        <div class="col-9">
                            <pricing-column :modifiers="['premium']" :prices="plans" @select="onSelectOffer" />
                        </div>
                    </div>
                </div>

                <div class="PopinPremium_step">
                    <div class="StyledBlock StyledBlock--no-border StyledBlock--gold text-center p-20 mb-40">
                        <p class="ft-l" v-html="$t('pages.premium.payment.title')"></p>
                        <p class="ft-s" v-html="$t('pages.premium.payment.subtitle')"></p>
                    </div>

                    <div class="row" v-if="plan">
                        <div class="col-6">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="StyledBlock StyledBlock--no-border StyledBlock--gold p-10 ft-xs"><b>{{ plan.label }}</b></td>
                                        <td class="text-center">{{ plan.value }}€</td>
                                    </tr>
                                    <tr>
                                        <td class="StyledBlock StyledBlock--no-border StyledBlock--blue p-10 ft-xs"><b>{{ $t('premium.offers.earlyBird.shortTitle') }} -{{ plan.coupon * 100 }}%</b></td>
                                        <td class="text-center"><b>-{{ Math.floor((plan.value - (plan.value * (1 - plan.coupon))) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t('pages.premium.total') }}</td>
                                        <td class="text-center"><b>{{ Math.floor((plan.value * (1 - plan.coupon)) * 100) / 100 }}€</b></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="color-ft-weak ft-xs">
                                            {{ $t('pages.premium.subscription', {
                                                price: Math.floor((plan.value * (1 - plan.coupon)) * 100) / 100,
                                                frequency: plan.length
                                            }) }} {{ $t('pages.premium.resiliation') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <button-base :modifiers="['xs', 'secondary']" class="mt-20" @click="state.step = 0">
                                {{ $t('pages.premium.cta.back') }}
                            </button-base>
                        </div>

                        <div class="col-6">
                            <div class="mb-20" v-if="!user">
                                <p class="ft-l mb-20"><b>
                                    {{ $t('pages.premium.payment.createAccount') }}
                                </b></p>

                                <base-form :form="register" :errors="registerErrors" @submit="onRegister" />
                            </div>
                            
                            <div v-if="user">
                                <p class="ft-m mb-20" v-html="$t('pages.premium.payment.oneMore', {
                                    name: user.name
                                })"></p>

                                <base-form :errors="formErrors" @submit="onSubmit" :loading="state.loading" :submit="{ label: $t('pages.premium.payment.confirm') }">
                                    <template slot="form">
                                        <div class="Form_row">
                                            <div class="Input Input--card" ref="cardInput"></div>
                                        </div>
                                    </template>
                                </base-form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="PopinPremium_step">
                    <div class="StyledBlock StyledBlock--no-border StyledBlock--gold PopinPremium_success">
                        <div>
                            <p class="ft-2xl" v-html="$t('pages.premium.confirm.title')"></p>
                            <p class="mv-20 width-xs" v-html="$t('pages.premium.confirm.subtitle')"></p>

                            <button-base :modifiers="['gold']">
                                {{ $t('pages.premium.confirm.continue') }}
                            </button-base>
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
        plan: null,
        plans: [],
        register: {
            name: {
                id: 'name',
                required: true,
                value: ''
            },
            email: {
                id: 'email',
                type: 'email',
                required: true,
                value: '',
            },
            password: {
                id: 'password',
                component: 'input-text',
                type: 'password',
                required: true,
                value: '',
                validations: {
                    minLength: { value: 6 },
                    maxLength: { value: 16 },
                    password: {}
                }
            }
        },
        registerErrors: [],
        form: {
            cardInput: null
        },
        formErrors: []
    }),
    mounted () {
        this.$data.plans = [
            { id: 'creator-1', label: this.$t('premium.plans.creator1.full'), emoji: '🌱', coupon: '0.3', value: '7.99', length: '1' },
            { id: 'creator-3', label: this.$t('premium.plans.creator3.full'), emoji: '🌟', coupon: '0.4', value: '19.99', length: '3', highlight: true },
            { id: 'creator-12', label: this.$t('premium.plans.creator12.full'), emoji: '💖', coupon: '0.3', value: '59.99', length: '12' }
        ]

        this.$data.plan = this.$data.plans[0]
    },
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